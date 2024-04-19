const { Op } = require('sequelize');
const redisClient = require('../repository/cacheConnection');
const Geolocation = require('../models/geolocationModel');
const { computeScoreByDistance, computeScoreByMatchedProportion } = require('../utils/computeScore');

const searchLocation = async (req, res) => {
  try {
    const keyword = req.query.q;
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;

    let locations;
    // Check if the keys are searched before and stored in the Redis cache
    const keyExists = await redisClient.exists(keyword);
    if (keyExists) {
      // retrieve location data from the Redis cache
      let locationsData = await redisClient.get(keyword);
      locations = JSON.parse(locationsData);
    } else {
      // retrieve location data from the Database
      locations = await Geolocation.findAll({
        where: {
          street: {
            [Op.substring]: keyword,
          }
        }
      });

      // Set location data to the Redis cache with the specified key.
      if (locations.length !== 0) {
        await redisClient.set(keyword, JSON.stringify(locations));
      }
    }

    // if no result is found, return an empty suggestion array
    if (locations.length === 0) {
      res.send({ "suggestions": [] });
      return;
    }
    let suggestions;
    // calculate the score and form the final output result
    if (!latitude || !longitude) {
      // If only a search keyword is provided, calculate the score based on the
      // proportion of matched substrings in street names
      suggestions = locations.map(location => ({
        name: [location.street, location.city, location.county, location.country].join(", "),
        latitude: location.latitude,
        longitude: location.longitude,
        score: computeScoreByMatchedProportion(keyword.length, location.street.length),
      }));
    } else {
      // If all parameters are provided, calculate the score based on the distance, and only 
      // report the results within 1000km.
      let limit = 1000;
      suggestions = locations.map(location => ({
        name: [location.street, location.city, location.county, location.country].join(", "),
        latitude: location.latitude,
        longitude: location.longitude,
        score: computeScoreByDistance(location, latitude, longitude, limit),
      })).filter(location => location.score > 0);
    }

    // report the results in descending order in score.
    suggestions.sort((a, b) => b.score - a.score);

    // send response
    res.send({ "suggestions": suggestions });

  } catch (err) {
    // handle error
    res.status(500).send('Internal Server Error: ' + err.message);
  }
}

module.exports = {
  searchLocation,
};
