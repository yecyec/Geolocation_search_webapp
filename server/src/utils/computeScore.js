// Function to convert degrees to radians
function degreestoRadians(degrees) {
  return degrees * Math.PI / 180;
}


// Function to compute the distance between two points given their latitude and longitude
function computeDistance(lat1, lon1, lat2, lon2) {
  // Radius of the Earth in kilometers
  const R = 6371;

  // Compute differences in latitude and longitude
  const dLat = degreestoRadians(lat2 - lat1);
  const dLon = degreestoRadians(lon2 - lon1);

  // Haversine formula to compute distance
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreestoRadians(lat1)) * Math.cos(degreestoRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Compute distance in kilometers
  const distance = R * c;
  return distance;
}

// Function to compute the search score for a location
function computeScoreByDistance(location, lat, long, limit) {
  // Compute distance 
  const distance = computeDistance(lat, long, Number(location.latitude), Number(location.longitude));

  // filter out the results where the distance is larger than the limit
  if (distance >= limit) {
    return 0.0;
  }

  // scale the score to the range between 0 and 1
  let score = 1 - (distance / limit);
  return Math.round(score * 10) / 10;
}

// calculate the score based on the proportion of matched substrings in street names
const computeScoreByMatchedProportion = (matchedLen, stringLen) => {
  if (stringLen === 0) {
    return 0;
  }
  if (matchedLen > stringLen) {
    return 1;
  }
  return Math.round((matchedLen / stringLen) * 10) / 10;
}

module.exports = {
  degreestoRadians,
  computeDistance,
  computeScoreByDistance,
  computeScoreByMatchedProportion,
};
