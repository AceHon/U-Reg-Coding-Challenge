// C:\Users\honjm\U-Reg Coding Challenge\ureg-forex-app\frontend\src\services\api.js
import axios from 'axios';

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
});

export const rateService = {
  getLatestRates: () => api.get('/rates/latest'),
  getHistoricalRates: (date) => api.get(`/rates/historical?date=${date}`),
  getPaginatedRates: (date, baseCurrency, offset, limit) => 
    api.get(`/rates/paginated?date=${date}&baseCurrency=${baseCurrency}&offset=${offset}&limit=${limit}`),

  getAllRates: () => api.get('/rates'),

  // New API calls for managing rates
  createRate: (rateData) => api.post('/rates', rateData),
  updateRate: (id, rateData) => api.put(`/rates/${id}`, rateData),
   deleteRate: (id) => api.delete(`/rates/${id}`),
};

export const currencyService = {
  getAllCurrencies: () => api.get('/currencies'),
  getCurrencyById: (id) => api.get(`/currencies/${id}`),
  // New API calls for managing currencies
  createCurrency: (currencyData) => api.post('/currencies', currencyData),
  updateCurrency: (id, currencyData) => api.put(`/currencies/${id}`, currencyData),
  deleteCurrency: (id) => api.delete(`/currencies/${id}`),
};