const express = require('express');
const { addPoints, spendPoints, getBalances } = require('../controllers/pointsController');

const router = express.Router();

// Define routes
router.post('/add', addPoints);
router.post('/spend', spendPoints);
router.get('/balance', getBalances);

module.exports = router;
