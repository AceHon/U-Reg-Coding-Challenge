// C:\Users\honjm\U-Reg Coding Challenge\ureg-forex-app\backend\src\controllers\rateController.js
const Rate = require('../models/Rate');
const Currency = require('../models/Currency'); // Import the Currency model

const rateController = {
  getLatestRates: async (req, res) => {
    try {
      const rates = await Rate.getLatestRates();
      res.json({ success: true, data: rates });
    } catch (error) {
      console.error('Error fetching latest rates:', error);
      res.status(500).json({ success: false, message: 'Error fetching latest rates' });
    }
  },

  getHistoricalRates: async (req, res) => {
    try {
      const { date } = req.query;
      
      // Validate date format
      if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({ success: false, message: 'Invalid date format. Use YYYY-MM-DD' });
      }
      
      const rates = await Rate.getHistoricalRates(date);
      
      if (rates.length === 0) {
        return res.status(404).json({ success: false, message: 'No rates found for the specified date' });
      }
      
      res.json({ success: true, data: rates });
    } catch (error) {
      console.error('Error fetching historical rates:', error);
      res.status(500).json({ success: false, message: 'Error fetching historical rates' });
    }
  },

  getPaginatedRates: async (req, res) => {
    try {
      const { date, baseCurrency, offset, limit } = req.query;
      const offsetInt = parseInt(offset) || 0;
      const limitInt = parseInt(limit) || 15;
      
      // Validate parameters
      if (offsetInt < 0 || limitInt < 1 || limitInt > 50) {
        return res.status(400).json({ success: false, message: 'Invalid pagination parameters' });
      }
      
      const rates = await Rate.getPaginatedRates(date, baseCurrency, offsetInt, limitInt);
      
      res.json({ 
        success: true, 
        data: rates,
        pagination: {
          offset: offsetInt,
          limit: limitInt,
          hasMore: rates.length === limitInt
        }
      });
    } catch (error) {
      console.error('Error fetching paginated rates:', error);
      res.status(500).json({ success: false, message: 'Error fetching rates' });
    }
  },
  
  getAllRates: async (req, res) => {
    try {
      const result = await Rate.getAllRates();
      res.json({ success: true, data: result.rows });   // <-- FIX
    } catch (error) {
      console.error('Error fetching all rates:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  updateRate: async (req, res) => {
    try {
      const { id } = req.params;
      const { baseCurrencyCode, targetCurrencyCode, rate, effectiveDate } = req.body;

      // Validate input
      if (!baseCurrencyCode || !targetCurrencyCode || rate === undefined || !effectiveDate) {
        return res.status(400).json({ success: false, message: 'Base currency code, target currency code, rate, and effective date are required' });
      }

      // Validate date format
      if (!/^\d{4}-\d{2}-\d{2}$/.test(effectiveDate)) {
        return res.status(400).json({ success: false, message: 'Invalid date format. Use YYYY-MM-DD' });
      }

      // Validate rate is a number
      if (isNaN(rate) || rate < 0) {
        return res.status(400).json({ success: false, message: 'Rate must be a non-negative number' });
      }

      const updatedRate = await Rate.updateRate(id, baseCurrencyCode, targetCurrencyCode, parseFloat(rate), effectiveDate);
      res.json({ success: true, data: updatedRate });
    } catch (error) {
      console.error('Error updating rate:', error);
      res.status(500).json({ success: false, message: error.message || 'Error updating rate' });
    }
  },

  // New handler to create a new rate
  createRate: async (req, res) => {
    try {
      const { baseCurrencyCode, targetCurrencyCode, rate, effectiveDate } = req.body;

      // Validate input
      if (!baseCurrencyCode || !targetCurrencyCode || rate === undefined || !effectiveDate) {
        return res.status(400).json({ success: false, message: 'Base currency code, target currency code, rate, and effective date are required' });
      }

      // Validate date format
      if (!/^\d{4}-\d{2}-\d{2}$/.test(effectiveDate)) {
        return res.status(400).json({ success: false, message: 'Invalid date format. Use YYYY-MM-DD' });
      }

      // Validate rate is a number
      if (isNaN(rate) || rate < 0) {
        return res.status(400).json({ success: false, message: 'Rate must be a non-negative number' });
      }

      const newRate = await Rate.createRate(baseCurrencyCode, targetCurrencyCode, parseFloat(rate), effectiveDate);
      res.status(201).json({ success: true, data: newRate });
    } catch (error) {
      console.error('Error creating rate:', error);
      res.status(500).json({ success: false, message: error.message || 'Error creating rate' });
    }
  },

  deleteRate: async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Rate ID is required' });
    }

    const deleted = await Rate.deleteRate(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Rate not found' });
    }

    res.json({ success: true, data: deleted });
  } catch (error) {
    console.error('Error deleting rate:', error);
    res.status(500).json({ success: false, message: 'Error deleting rate' });
  }
}

};

module.exports = rateController;