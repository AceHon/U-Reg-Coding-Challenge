// C:\Users\honjm\U-Reg Coding Challenge\ureg-forex-app\frontend\src\components\RateForm.jsx
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { rateService, currencyService } from '../services/api';

const RateForm = ({ rateId, onSubmit, onCancel }) => {
  const [currencies, setCurrencies] = useState([]);
  const [formData, setFormData] = useState({
    baseCurrencyCode: '',
    targetCurrencyCode: '',
    rate: '',
    effectiveDate: format(new Date(), 'yyyy-MM-dd')
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load currencies from backend
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await currencyService.getAllCurrencies();
        setCurrencies(res.data.data || res.data); // adjust depending on your API response
      } catch (err) {
        console.error("Failed to load currencies:", err);
      }
    };
    fetchCurrencies();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (rateId) {
        alert('Update rate functionality requires backend endpoint for fetching rate by ID.');
      } else {
        await rateService.createRate(formData);
      }
      
      onSubmit(); // Notify parent to refresh
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      console.error('Error saving rate:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mb-4">
      <h3 className="text-lg font-semibold mb-2">
        {rateId ? 'Update Rate' : 'Create New Rate'}
      </h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Base Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Base Currency
            </label>
            <select
              name="baseCurrencyCode"
              value={formData.baseCurrencyCode}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Base Currency</option>
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Target Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Currency
            </label>
            <select
              name="targetCurrencyCode"
              value={formData.targetCurrencyCode}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Target Currency</option>
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rate
            </label>
            <input
              type="number"
              name="rate"
              value={formData.rate}
              onChange={handleChange}
              step="any"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Effective Date
            </label>
            <input
              type="date"
              name="effectiveDate"
              value={formData.effectiveDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-gray-800 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Saving...' : (rateId ? 'Update' : 'Create')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default RateForm;
