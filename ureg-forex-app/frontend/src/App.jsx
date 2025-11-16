import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ExchangeRates from './pages/ExchangeRates';
import Management from './pages/Management';
import './App.css';

function App() {
  return (
    <Router>
      <div className="bg-gray-50 w-full">
        <header className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">U-Reg Forex Rates</h1>
              <nav>
                <Link to="/" className="mr-4 text-gray-800 hover:underline">Exchange Rates</Link>
                <Link to="/management" className="text-gray-800  hover:underline">Management</Link>
              </nav>
            </div>
           </div>
        </header>
        
        <main>
          {/* <ExchangeRates /> */}
            <Routes>
              <Route path="/" element={<ExchangeRates />} />
              <Route path="/management" element={<Management />} />
            </Routes>
        </main>
        
        <footer className="bg-gray-300 mt-8">
          <div className="max-w-6xl mx-auto px-4 py-4 text-center text-gray-500 text-sm flex justify-start">
            © {new Date().getFullYear()} U-Reg Forex Rates
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;