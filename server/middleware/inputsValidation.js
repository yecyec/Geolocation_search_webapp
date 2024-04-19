// Middleware to validate parameters from requests
function validateInputs(req, res, next) {

    const keyword = req.query.q;
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;

    if (keyword === '' || (Boolean(latitude) !== Boolean(longitude))) {
        return res.status(400).json({ error: 'Either search name, latitude, and longitude or only the search name be provided.' });
    }

    if ((latitude && isNaN(Number(latitude))) || (longitude && isNaN(Number(longitude)))) {
        return res.status(400).json({ error: 'Latitude and longitude must be numbers.' });
    }
    
    if (latitude && (Number(latitude) < -90 || Number(latitude) > 90)) {
        return res.status(400).json({ error: 'Latitude must be between -90 and 90.' });
    }

    if (longitude && (Number(longitude) < -180 || Number(longitude) > 180)) {
        return res.status(400).json({ error: 'Longitude must be between -180 and 180.' });
    }
    

    // Pass control to the next middleware if input validation succeeds
    next();
}

module.exports = validateInputs;