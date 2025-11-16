// C:\Users\honjm\U-Reg Coding Challenge\ureg-forex-app\backend\src\routes\rates.js
const express = require('express');
const rateController = require('../controllers/rateController');

const router = express.Router();

// Existing routes
router.get('/latest', rateController.getLatestRates);
router.get('/historical', rateController.getHistoricalRates);
router.get('/paginated', rateController.getPaginatedRates);

// New route for creating rates
router.post('/', rateController.createRate);

// New route for updating rates
router.put('/:id', rateController.updateRate);

router.get('/', rateController.getAllRates);

router.delete('/:id', rateController.deleteRate);

module.exports = router;