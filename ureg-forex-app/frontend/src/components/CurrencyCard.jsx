import React from 'react';

const CurrencyCard = ({ rate }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-lg font-semibold">{rate.base_currency_code}</span>
          <span className="mx-2 text-gray-400">→</span>
          <span className="text-lg font-semibold">{rate.target_currency_code}</span>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-blue-600">{rate.rate}</div>
          <div className="text-sm text-gray-500">{rate.effective_date}</div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyCard;