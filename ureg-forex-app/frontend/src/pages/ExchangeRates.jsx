// C:\Users\honjm\U-Reg Coding Challenge\ureg-forex-app\frontend\src\pages\ExchangeRates.jsx
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import DateSelector from '../components/DateSelector';
import BaseCurrencySelector from '../components/BaseCurrencySelector';
import LoadingSpinner from '../components/LoadingSpinner';
import { rateService } from '../services/api';
import 'react-datepicker/dist/react-datepicker.css';

// Import Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components (include BarElement)
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ExchangeRates = () => {
  const [rates, setRates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedBaseCurrency, setSelectedBaseCurrency] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState(null);

  const fetchRates = async (date = null, baseCurrency = '', reset = false) => {
    if (reset) {
      setOffset(0);
      setRates([]);
    }
    
    setLoading(reset);
    setLoadingMore(!reset);
    
    try {
      const response = await rateService.getPaginatedRates(date, baseCurrency, offset, 15);
      
      if (response.data.success) {
        if (reset) {
          setRates(response.data.data);
        } else {
          setRates(prev => [...prev, ...response.data.data]);
        }
        setHasMore(response.data.pagination.hasMore);
      } else {
        setError(response.data.message || 'Error fetching rates');
      }
    } catch (err) {
      setError('Failed to fetch exchange rates');
      console.error('Error:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const dateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
    fetchRates(dateStr, selectedBaseCurrency, true);
  }, [selectedDate, selectedBaseCurrency]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleBaseCurrencyChange = (baseCurrency) => {
    setSelectedBaseCurrency(baseCurrency);
  };

  const loadMore = () => {
    setOffset(prev => prev + 15);
  };

  useEffect(() => {
    if (offset > 0) {
      const dateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
      fetchRates(dateStr, selectedBaseCurrency, false);
    }
  }, [offset]);

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loadingMore) {
      return;
    }
    
    if (hasMore) {
      loadMore();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore]);

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4 min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const chartData = {
    labels: rates.map(rate => `${rate.base_currency_code}→${rate.target_currency_code}`),
    datasets: [
      {
        label: 'Exchange Rate',
        data: rates.map(rate => rate.rate),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Exchange Rates Chart',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Rate'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Currency Pair'
        }
      }
    },
    maintainAspectRatio: false, // This is important for making the chart fill the container
  };

  // Get display date - use actual effective_date from data when available
  const getDisplayDate = () => {
    if (selectedDate) {
      return new Date(selectedDate).toLocaleDateString('en-GB', { timeZone: 'Asia/Kuala_Lumpur' });
    }
    if (rates.length > 0 && rates[0].effective_date) {
      return new Date(rates[0].effective_date).toLocaleDateString('en-GB', { timeZone: 'Asia/Kuala_Lumpur' });
    }
    return new Date().toLocaleDateString('en-GB', { timeZone: 'Asia/Kuala_Lumpur' });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen">
      {/* Header section matching wireframe */}
      <div className="bg-gray-800 text-white p-4 mb-4 rounded-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Yet Another Forex</h2>
          
          {/* Date selector positioned in top right corner */}
          <div className="flex items-center space-x-2">
            <DateSelector 
              selectedDate={selectedDate} 
              onDateChange={handleDateChange} 
            />
            <BaseCurrencySelector 
              selectedBaseCurrency={selectedBaseCurrency} 
              onBaseCurrencyChange={handleBaseCurrencyChange} 
            />
          </div>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">
          Rates as of {getDisplayDate()}
        </h3>
      </div>
      
      {loading && <LoadingSpinner />}
      
      {/* Grid layout matching wireframe - 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
        {rates.map((rate, index) => (
          <div 
            key={`${rate.base_currency_code}-${rate.target_currency_code}-${index}`} 
            className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col items-center"
          >
            <div className="text-lg font-semibold mb-1">
              {rate.base_currency_code}→{rate.target_currency_code}
            </div>
            <div className="text-xl font-bold text-black mb-1">{rate.rate}</div>
            {/* <div className="text-xs text-gray-500 mt-auto">
              {new Date(rate.effective_date).toLocaleDateString('en-GB', {
                timeZone: 'Asia/Kuala_Lumpur',
              })}
            </div> */}
          </div>
        ))}
      </div>

      {/* Chart Section */}
      {rates.length > 0 && (
        <div className="mb-8 p-4 bg-white rounded-lg shadow-sm">
          {/* Make the chart container full width */}
          <div className="w-full h-80">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      )}
      
      {loadingMore && hasMore && <LoadingSpinner />}
      
      {!loading && !loadingMore && rates.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No exchange rates available
        </div>
      )}
      
    </div>
  );
};

export default ExchangeRates;