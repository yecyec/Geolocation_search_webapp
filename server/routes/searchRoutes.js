
const express = require('express');
const searchController = require('../controllers/searchController');
const validateInputs = require('../middleware/inputsValidation');

const router = express.Router();

router.get("/", validateInputs, searchController.searchByKeyword);

module.exports = router;