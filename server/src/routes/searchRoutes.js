const express = require('express');
const searchController = require('../controllers/searchController');
const validateInputs = require('../middleware/inputsValidation');

const router = express.Router();

// Search Route
router.get("/", validateInputs, searchController.searchLocation);

module.exports = router;
