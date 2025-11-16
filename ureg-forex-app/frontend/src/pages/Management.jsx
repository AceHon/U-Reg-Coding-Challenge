// src/pages/Management.jsx
import React, { useState, useEffect } from 'react';
import { currencyService, rateService } from '../services/api';
import Modal from '../components/Modal';

const Management = () => {
  const [activeTab, setActiveTab] = useState('currencies'); // 'currencies' or 'rates'
  const [currenciesList, setCurrenciesList] = useState([]);
  const [ratesList, setRatesList] = useState([]);
  const [loadingCurrencies, setLoadingCurrencies] = useState(false);
  const [loadingRates, setLoadingRates] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Modal states
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState(null);
  const [newCurrency, setNewCurrency] = useState({ code: "", name: "" });

  const [showRateModal, setShowRateModal] = useState(false);
  const [editingRate, setEditingRate] = useState(null);
  const [newRate, setNewRate] = useState({
    base_currency_id: "",
    target_currency_id: "",
    rate: "",
    effective_date: ""
  });

  // Fetch data on tab change
  useEffect(() => {
    if (activeTab === 'currencies') fetchCurrencies();
    if (activeTab === 'rates') fetchRates();
  }, [activeTab]);

  const fetchCurrencies = async () => {
    setLoadingCurrencies(true);
    try {
      const res = await currencyService.getAllCurrencies();
      setCurrenciesList(res.data.data || res.data);
    } catch (err) {
      console.error('Failed to fetch currencies:', err);
    } finally {
      setLoadingCurrencies(false);
    }
  };

  const fetchRates = async () => {
    setLoadingRates(true);
    try {
      const res = await rateService.getAllRates();
      setRatesList(res.data.data || res.data);
    } catch (err) {
      console.error('Failed to fetch rates:', err);
    } finally {
      setLoadingRates(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // --- Handlers for editing ---
  const handleEditCurrency = (currency) => {
    setEditingCurrency(currency);
    setNewCurrency({ code: currency.code, name: currency.name });
    setShowCurrencyModal(true);
  };

  const handleEditRate = (rate) => {
    setEditingRate(rate);
    const baseCurrency = currenciesList.find(c => c.code === rate.base_currency_code);
    const targetCurrency = currenciesList.find(c => c.code === rate.target_currency_code);
    setNewRate({
      base_currency_id: baseCurrency?.id || "",
      target_currency_id: targetCurrency?.id || "",
      rate: rate.rate,
      effective_date: rate.effective_date.slice(0, 10) // <-- only the date part
    });
    setShowRateModal(true);
  };

  // --- Currency submit ---
  const handleCurrencySubmit = async () => {
    try {
      if (!newCurrency.code || !newCurrency.name) {
        alert("Please fill in both Code and Name.");
        return;
      }

      const codeExists = currenciesList.some(
        c => c.code.toUpperCase() === newCurrency.code.trim().toUpperCase()
      );

      if (!editingCurrency && codeExists) {
        alert("The Code already existed.");
        return;
      }

      if (editingCurrency) {
        await currencyService.updateCurrency(editingCurrency.id, {
          code: newCurrency.code.trim().toUpperCase(),
          name: newCurrency.name.trim()
        });
        showSuccess("Currency updated successfully!");
      } else {
        await currencyService.createCurrency({
          code: newCurrency.code.trim().toUpperCase(),
          name: newCurrency.name.trim()
        });
        showSuccess("Currency created successfully!");
      }

      setShowCurrencyModal(false);
      setEditingCurrency(null);
      setNewCurrency({ code: "", name: "" });
      fetchCurrencies();
    } catch (err) {
      console.error("Currency save failed:", err.response || err);
      alert("Failed to save currency. Check console.");
    }
  };

  // --- Rate submit ---
  const handleRateSubmit = async () => {
    try {
      if (!newRate.base_currency_id || !newRate.target_currency_id || !newRate.rate || !newRate.effective_date) {
        alert("Please fill in all fields.");
        return;
      }
      if (newRate.base_currency_id === newRate.target_currency_id) {
        alert("Base and Target currencies cannot be the same.");
        return;
      }

      const baseCurrencyObj = currenciesList.find(c => c.id === Number(newRate.base_currency_id));
      const targetCurrencyObj = currenciesList.find(c => c.id === Number(newRate.target_currency_id));

      if (!baseCurrencyObj || !targetCurrencyObj) {
        alert("Selected currencies are invalid. Please reload and try again.");
        return;
      }

      const payload = {
        baseCurrencyCode: baseCurrencyObj.code,
        targetCurrencyCode: targetCurrencyObj.code,
        rate: parseFloat(newRate.rate),
        effectiveDate: newRate.effective_date
      };

      if (editingRate) {
        await rateService.updateRate(editingRate.id, payload);
        showSuccess("Rate updated successfully!");
      } else {
        await rateService.createRate(payload);
        showSuccess("Rate created successfully!");
      }

      setShowRateModal(false);
      setEditingRate(null);
      setNewRate({
        base_currency_id: "",
        target_currency_id: "",
        rate: "",
        effective_date: ""
      });
      fetchRates();
    } catch (err) {
      console.error("Rate save failed:", err.response || err);
      alert("Failed to save rate. Check console.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen">

      <div className="bg-gray-800 text-white p-4 mb-4 rounded-lg">
         <h4 className="text-3xl font-bold mt-3">Management Dashboard</h4>
      </div>
     
      {/* Success message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {/* Tabs */}
{/* Tabs with border only (no background) */}
<div className="mb-6">
  <div className="border-b border-gray-300 rounded-t-lg overflow-hidden bg-transparent">
    <div className="flex">
      <button
        className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
          activeTab === 'currencies'
            ? 'bg-white text-gray-800 shadow-sm border-l border-r border-t border-gray-300 rounded-t-lg z-20 -mr-2'
            : 'text-gray-700 hover:bg-gray-100 border-l border-r border-t border-gray-300 rounded-t-lg z-10'
        }`}
        onClick={() => setActiveTab('currencies')}
      >
        Currencies
      </button>

      <button
        className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
          activeTab === 'rates'
            ? 'bg-white text-gray-800 shadow-sm border-l border-r border-t border-gray-300 rounded-t-lg z-20 -ml-2'
            : 'text-gray-700 hover:bg-gray-100 border-l border-r border-t border-gray-300 rounded-t-lg z-10 mr-2'
        }`}
        onClick={() => setActiveTab('rates')}
      >
        Rates
      </button>
    </div>
  </div>
</div>

      {/* Currency Tab */}
      {activeTab === 'currencies' && (
        <div>
          <div className="flex justify-start mb-4">
            <button
              onClick={() => { setShowCurrencyModal(true); setEditingCurrency(null); setNewCurrency({ code: "", name: "" }) }}
              className="px-4 py-2 text-gray-800 rounded-md bg-gray-200 hover:bg-gray-300 border border-gray-300 focus:outline-none"
            >Add New Currency</button>
          </div>

          {loadingCurrencies ? (
              <div>Loading currencies...</div>
            ) : (
              <div className="overflow-x-auto max-h-[550px]">
                <table className="min-w-full border border-black rounded-lg overflow-hidden border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="px-4 py-2 border">ID</th>
                      <th className="px-4 py-2 border">Code</th>
                      <th className="px-4 py-2 border">Name</th>
                      <th className="px-4 py-2 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currenciesList.map(currency => (
                      <tr key={currency.id} className="hover:bg-gray-100">
                        <td className="px-4 py-2 border">{currency.id}</td>
                        <td className="px-4 py-2 border">{currency.code}</td>
                        <td className="px-4 py-2 border">{currency.name}</td>
                        <td className="px-4 py-2 border">
                          <button
                            onClick={() => handleEditCurrency(currency)}
                            className="px-2 py-1 bg-yellow-400 rounded text-gray-800"
                          >Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

        </div>
      )}

      {/* Rate Tab */}
      {activeTab === 'rates' && (
        <div>
          <div className="flex justify-start mb-4">
            <button
              onClick={() => { setShowRateModal(true); setEditingRate(null); setNewRate({ base_currency_id: "", target_currency_id: "", rate: "", effective_date: "" }) }}
              className="px-4 py-2 text-gray-800 rounded-md bg-gray-200 hover:bg-gray-300 border border-gray-300 focus:outline-none"
            >Add New Rate</button>
          </div>

          {loadingRates ? (
            <div>Loading rates...</div>
          ) : (
            <div className="overflow-x-auto max-h-[550px]">
              <table className="min-w-full border border-black rounded-lg overflow-hidden border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 border">ID</th>
                    <th className="px-4 py-2 border">Base Currency</th>
                    <th className="px-4 py-2 border">Target Currency</th>
                    <th className="px-4 py-2 border">Rate</th>
                    <th className="px-4 py-2 border">Effective Date</th>
                    <th className="px-4 py-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ratesList.map(rate => (
                    <tr key={rate.id} className="hover:bg-gray-100">
                      <td className="px-4 py-2 border">{rate.id}</td>
                      <td className="px-4 py-2 border">{rate.base_currency_code}</td>
                      <td className="px-4 py-2 border">{rate.target_currency_code}</td>
                      <td className="px-4 py-2 border">{rate.rate}</td>
                      <td className="px-4 py-2 border">{new Date(rate.effective_date).toLocaleDateString('en-GB')}</td>
                      <td className="px-4 py-2 border">
                        <button
                          onClick={() => handleEditRate(rate)}
                          className="px-2 py-1 bg-yellow-400 rounded text-gray-800"
                        >Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      )}

      {/* Currency Modal */}
      {showCurrencyModal && (
        <Modal title={editingCurrency ? "Edit Currency" : "Add New Currency"} onClose={() => setShowCurrencyModal(false)}>
          <form
            onSubmit={(e) => { e.preventDefault(); handleCurrencySubmit(); }}
          >
            <label className="block mb-2 text-sm">Code (e.g., USD)</label>
            <input
              className="w-full border px-3 py-2 rounded mb-3"
              value={newCurrency.code}
              onChange={(e) => setNewCurrency({ ...newCurrency, code: e.target.value })}
            />

            <label className="block mb-2 text-sm">Name</label>
            <input
              className="w-full border px-3 py-2 rounded mb-4"
              value={newCurrency.name}
              onChange={(e) => setNewCurrency({ ...newCurrency, name: e.target.value })}
            />

            <div className="flex justify-between">
              <button
                type="submit"
                className="w-1/2 py-2 bg-green-600 text-gray-800 rounded-md mr-2 border border-gray-300"
              >
                {editingCurrency ? "Update Currency" : "Create Currency"}
              </button>

              {editingCurrency && (
                <button
                  type="button"
                  onClick={async () => {
                    if (window.confirm("Are you sure you want to delete this currency?")) {
                      try {
                        await currencyService.deleteCurrency(editingCurrency.id);
                        setShowCurrencyModal(false);
                        setEditingCurrency(null);
                        setNewCurrency({ code: "", name: "" });
                        fetchCurrencies();
                        showSuccess("Currency deleted successfully!");
                      } catch (err) {
                        console.error("Failed to delete currency:", err.response || err);
                        alert(err?.response?.data?.message || "Failed to delete currency. Check console.");
                      }
                    }
                  }}
                  className="w-1/2 py-2 bg-red-600 text-gray-800 rounded-md ml-2 border border-gray-300"
                >
                  Delete
                </button>
              )}
            </div>
          </form>
        </Modal>
      )}


      {/* Rate Modal */}
        {showRateModal && (
          <Modal title={editingRate ? "Edit Rate" : "Add New Rate"} onClose={() => setShowRateModal(false)}>
            <form
              onSubmit={(e) => { e.preventDefault(); handleRateSubmit(); }}
            >
              <label className="block mb-1 text-sm">Base Currency</label>
              <select
                className="w-full border px-3 py-2 rounded mb-3"
                value={newRate.base_currency_id}
                onChange={(e) => setNewRate({ ...newRate, base_currency_id: e.target.value })}
              >
                <option value="">Select</option>
                {currenciesList.map(c => <option key={c.id} value={c.id}>{c.code}</option>)}
              </select>

              <label className="block mb-1 text-sm">Target Currency</label>
              <select
                className="w-full border px-3 py-2 rounded mb-3"
                value={newRate.target_currency_id}
                onChange={(e) => setNewRate({ ...newRate, target_currency_id: e.target.value })}
              >
                <option value="">Select</option>
                {currenciesList.map(c => <option key={c.id} value={c.id}>{c.code}</option>)}
              </select>

              <label className="block mb-2 text-sm">Rate</label>
              <input
                type="number"
                step="0.0001"
                className="w-full border px-3 py-2 rounded mb-3"
                value={newRate.rate}
                onChange={(e) => setNewRate({ ...newRate, rate: e.target.value })}
              />

              <label className="block mb-2 text-sm">Effective Date</label>
              <input
                type="date"
                className="w-full border px-3 py-2 rounded mb-4"
                value={newRate.effective_date}
                onChange={(e) => setNewRate({ ...newRate, effective_date: e.target.value })}
              />

              <div className="flex justify-between">
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-green-600 text-gray-800 rounded-md mr-2 border border-gray-300"
                >
                  {editingRate ? "Update Rate" : "Create Rate"}
                </button>

                {editingRate && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (window.confirm("Are you sure you want to delete this rate?")) {
                        try {
                          await rateService.deleteRate(editingRate.id);
                          setShowRateModal(false);
                          setEditingRate(null);
                          setNewRate({
                            base_currency_id: "",
                            target_currency_id: "",
                            rate: "",
                            effective_date: ""
                          });
                          fetchRates();
                          showSuccess("Rate deleted successfully!");
                        } catch (err) {
                          console.error("Failed to delete rate:", err.response || err);
                          alert("Failed to delete rate. Check console.");
                        }
                      }
                    }}
                    className="w-1/2 py-2 bg-red-600 text-gray-800 rounded-md ml-2 border border-gray-300"
                  >
                    Delete
                  </button>
                )}
              </div>
            </form>
          </Modal>
        )}
      
    </div>
  );
};

export default Management;
