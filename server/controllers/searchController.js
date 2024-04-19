const { Op } = require('sequelize');
const redisClient = require('../cacheConnection');
const Geolocation = require('../models/geolocationModel');

// Function to convert degrees to radians
function toRadians(degrees) {
    return degrees * Math.PI / 180;
}


// Function to compute the distance between two points given their latitude and longitude
function computeDistance(lat1, lon1, lat2, lon2) {
    // Radius of the Earth in kilometers
    const R = 6371; 

    // Compute differences in latitude and longitude
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    // Haversine formula to compute distance
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Compute distance in kilometers
    const distance = R * c; 
    return distance;
}


// Function to compute the search score for a location
function computeScore(location, lat, long, limit) {
    // Compute distance 
    const distance = computeDistance(lat, long, Number(location.latitude), Number(location.longitude));

    // filter out the results where the distance is larger than the limit
    if (distance >= limit) {
        return 0.0;
    }

    // scale the score to the range between 0 and 1
    let score = 1 - (distance / limit);
    return Math.round(score * 10) / 10
}


const searchByKeyword = async (req, res) => {
    try {
        const keyword = req.query.q;
        const latitude = req.query.latitude;
        const longitude = req.query.longitude;

        
        let locations;
        // Check if the keys are searched before and stored in the Redis cache
        const keyExists = await redisClient.exists(keyword)
        if (keyExists) {
            // retrieve location data from the Redis cache
            let locationsData = await redisClient.get(keyword);
            locations = JSON.parse(locationsData);
        } else {
            // retrieve location data from the Database 
            locations = await Geolocation.findAll({
                where: {
                  street: {
                    [Op.substring]: keyword
                    // [Op.iLike]: `%${keyword}%`
                  }
                }
            });
            
            // Set location data to the Redis cache with the specified key.
            await redisClient.set(keyword, JSON.stringify(locations));
        }

        // if no result is found, return an empty suggestion array
        if (locations.length === 0) {
            res.send({"suggestions": []});
            return;
        }

        let suggestions;
        // calculate the score and form the final output result
        if (!latitude && !longitude) {
            // If only a search keyword is provided, calculate the score based on the length of matches and 
            // the length of words in the database entry
            suggestions = locations.map(location => ({
                name: [location.street, location.city, location.county, location.country].join(", "),
                latitude: location.latitude,
                longitude: location.longitude,
                score: Math.round((keyword.length / location.street.length) * 10) / 10
            }))
        } else {
            // If all parameters are provided, calculate the score based on the distance, and only 
            // report the results within 1000km.
            let limit = 1000;
            suggestions = locations.map(location => ({
                name: [location.street, location.city, location.county, location.country].join(", "),
                latitude: location.latitude,
                longitude: location.longitude,
                score: computeScore(location, latitude, longitude, limit)
            })).filter(location => location.score > 0);
        }
        
        // report the results in descending order in score.
        suggestions.sort((a, b) => b.score - a.score);
        
        // send response
        res.send({"suggestions": suggestions})

    } catch (err) {
        // handle error
        console.log(err)
        res.status(500).send('Internal Server Error: ' + err.message);
    }
}

module.exports = {
    toRadians,
    computeDistance,
    computeScore,
    searchByKeyword
};