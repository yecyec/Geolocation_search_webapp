const { Op } = require('sequelize');
const redisClient = require('../cacheConnection');
const Geolocation = require('../models/geolocationModel');

// Function to convert degrees to radians
function toRadians(degrees) {
    return degrees * Math.PI / 180;
}

function computeDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
}


// Function to compute the search score for a location
function computeScore(location, lat, long, limit) {
    // Compute distance score
    const distance = computeDistance(lat, long, Number(location.latitude), Number(location.longitude));

    if (distance >= limit) {
        return 0.0;
    }

    let score = 1 - (distance / limit);
    return Math.round(score * 10) / 10
}


module.exports.searchByKeyword = async (req, res) => {
    try {
        const keyword = req.query.q;
        const latitude = req.query.latitude;
        const longitude = req.query.longitude;

        console.log(keyword, latitude, longitude)
        
        let locations;
        const keyExists = await redisClient.exists(keyword)
        if (keyExists) {
            let locationsData = await redisClient.get(keyword);
            locations = JSON.parse(locationsData);
            console.log('locaiton', locations)
        } else {
            locations = await Geolocation.findAll({
                where: {
                  street: {
                    [Op.substring]: keyword
                    // [Op.iLike]: `%${keyword}%`
                  }
                }
            });
            await redisClient.set(keyword, JSON.stringify(locations));
        }

        
        if (locations.length === 0) {
            res.send({"suggestions": []});
            return;
        }

        let suggestions;
        if (!latitude && !longitude) {
            suggestions = locations.map(location => ({
                name: [location.street, location.city, location.county, location.country].join(", "),
                latitude: location.latitude,
                longitude: location.longitude,
                score: Math.round((keyword.length / location.street.length) * 10) / 10
            }))
        } else {
            let limit = 1000;
            suggestions = locations.map(location => ({
                name: [location.street, location.city, location.county, location.country].join(", "),
                latitude: location.latitude,
                longitude: location.longitude,
                score: computeScore(location, latitude, longitude, limit)
            })).filter(location => location.score > 0);
        }
    
        suggestions.sort((a, b) => b.score - a.score);
          
        res.send({"suggestions": suggestions})

    } catch (err) {
        console.log(err)
        res.status(500).send('Internal Server Error: ' + err.message);
    }
}
