import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateSelector = ({ selectedDate, onDateChange }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-white mb-2 pl-1 w-[200px]">
        Select Date for Historical Rates
      </label>
      <DatePicker
        selected={selectedDate}
        onChange={onDateChange}
        className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 p-[0px] text-white"
        dateFormat="yyyy-MM-dd"
        placeholderText="Select a date"
      />
    </div>
  );
};

export default DateSelector;