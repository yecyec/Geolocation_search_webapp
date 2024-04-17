
const express = require('express');
const searchController = require('../controllers/searchController');

const router = express.Router();

router.get("/", searchController.searchByKeyword);

module.exports = router;