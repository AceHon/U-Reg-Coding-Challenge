import React, { useState, useEffect } from 'react';
import { currencyService } from '../services/api';

const BaseCurrencySelector = ({ selectedBaseCurrency, onBaseCurrencyChange }) => {
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await currencyService.getAllCurrencies();
        setCurrencies(res.data.data || res.data);
      } catch (err) {
        console.error('Failed to load currencies:', err);
      }
    };
    fetchCurrencies();
  }, []);

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-white mb-2 pl-[0px] pe-[10px] w-[150px]">
        Select Base Currency
      </label>
      <select 
        value={selectedBaseCurrency} 
        onChange={(e) => onBaseCurrencyChange(e.target.value)}
        className="w-full md:w-64 px-3 py-2 bg-gray-800 border border-gray-300 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">All Base Currencies</option>
        {currencies.map(currency => (
          <option key={currency.code} value={currency.code}>
            {currency.code} - {currency.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BaseCurrencySelector;
