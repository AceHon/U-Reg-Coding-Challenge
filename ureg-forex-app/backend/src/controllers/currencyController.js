// C:\Users\honjm\U-Reg Coding Challenge\ureg-forex-app\backend\src\controllers\currencyController.js
const Currency = require('../models/Currency');

const currencyController = {
  getAllCurrencies: async (req, res) => {
    try {
      const currencies = await Currency.getAllCurrencies();
      res.json({ success: true, data: currencies });
    } catch (error) {
      console.error('Error fetching currencies:', error);
      res.status(500).json({ success: false, message: 'Error fetching currencies' });
    }
  },

  getCurrencyById: async (req, res) => {
    try {
      const { id } = req.params;
      const currency = await Currency.getCurrencyById(id);

      if (!currency) {
        return res.status(404).json({ success: false, message: 'Currency not found' });
      }

      res.json({ success: true, data: currency });
    } catch (error) {
      console.error('Error fetching currency:', error);
      res.status(500).json({ success: false, message: 'Error fetching currency' });
    }
  },

  createCurrency: async (req, res) => {
    try {
      const { code, name } = req.body;

      // Validate input
      if (!code || !name) {
        return res.status(400).json({ success: false, message: 'Code and name are required' });
      }

      // Check if currency code already exists
      const existingCurrency = await Currency.getCurrencyByCode(code);
      if (existingCurrency) {
        return res.status(409).json({ success: false, message: 'Currency code already exists' });
      }

      const newCurrency = await Currency.createCurrency(code, name);
      res.status(201).json({ success: true, data: newCurrency });
    } catch (error) {
      console.error('Error creating currency:', error);
      res.status(500).json({ success: false, message: 'Error creating currency' });
    }
  },

  updateCurrency: async (req, res) => {
    try {
      const { id } = req.params;
      const { code, name } = req.body;

      // Validate input
      if (!code || !name) {
        return res.status(400).json({ success: false, message: 'Code and name are required' });
      }

      // Check if currency exists
      const existingCurrency = await Currency.getCurrencyById(id);
      if (!existingCurrency) {
        return res.status(404).json({ success: false, message: 'Currency not found' });
      }

      // Check if new code already exists (but not for the same currency)
      const existingCode = await Currency.getCurrencyByCode(code);
      if (existingCode && existingCode.id !== parseInt(id)) {
        return res.status(409).json({ success: false, message: 'Currency code already exists' });
      }

      const updatedCurrency = await Currency.updateCurrency(id, code, name);
      res.json({ success: true, data: updatedCurrency });
    } catch (error) {
      console.error('Error updating currency:', error);
      res.status(500).json({ success: false, message: 'Error updating currency' });
    }
  },

  deleteCurrency: async (req, res) => {
    try {
      const { id } = req.params;

      // Check if currency exists
      const existingCurrency = await Currency.getCurrencyById(id);
      if (!existingCurrency) {
        return res.status(404).json({ success: false, message: 'Currency not found' });
      }

      const deletedCurrency = await Currency.deleteCurrency(id);
      res.json({ success: true, data: deletedCurrency });
    } catch (error) {
      console.error('Error deleting currency:', error);
      res.status(500).json({ success: false, message: error.message || 'Error deleting currency' });
    }
  },
};

module.exports = currencyController;