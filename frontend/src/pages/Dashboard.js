import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';
import { FaBitcoin, FaSignOutAlt, FaMoon, FaSun, FaChartLine, FaRobot, FaUserShield, FaCog } from 'react-icons/fa';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Dashboard = () => {
  const { user, logout, token } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [prices, setPrices] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSymbol, setSelectedSymbol] = useState('BTC');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [pricesRes, oppsRes] = await Promise.all([
        axios.get(`${API_URL}/crypto/prices`),
        axios.get(`${API_URL}/crypto/arbitrage`),
      ]);
      setPrices(pricesRes.data);
      setOpportunities(oppsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get unique symbols
  const symbols = [...new Set(prices.map(p => p.symbol))];
  
  // Filter prices by selected symbol
  const symbolPrices = prices.filter(p => p.symbol === selectedSymbol);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Header */}
      <header className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <img src="/arbitrajz-logo.jpg" alt="ArbitrajZ Logo" className="h-10 w-10 rounded-full" />
              <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>ArbitrajZ</span>
            </div>
            <nav className="hidden md:flex space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-blue-400 font-semibold"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/trading')}
                className={`px-4 py-2 ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Trading
              </button>
              <button
                onClick={() => navigate('/settings')}
                className={`px-4 py-2 ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} flex items-center space-x-1`}
              >
                <FaCog />
                <span>API Keys</span>
              </button>
              {user?.is_admin && (
                <button
                  onClick={() => navigate('/admin')}
                  className={`px-4 py-2 ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} flex items-center space-x-1`}
                >
                  <FaUserShield />
                  <span>Admin</span>
                </button>
              )}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-700'}`}
            >
              {theme === 'dark' ? <FaSun /> : <FaMoon />}
            </button>
            <div className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Balance: </span>
              <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>${user?.balance?.toFixed(2)}</span>
            </div>
            <button
              onClick={handleLogout}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'}`}
            >
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Welcome back, {user?.username}!
          </h1>
          <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Monitor real-time crypto prices and arbitrage opportunities
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Active Opportunities</p>
                <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{opportunities.length}</p>
              </div>
              <FaChartLine className="text-4xl text-blue-400" />
            </div>
          </div>

          <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Best Profit</p>
                <p className={`text-3xl font-bold text-green-400`}>
                  {opportunities.length > 0 ? `${opportunities[0].profit_percentage.toFixed(2)}%` : '0%'}
                </p>
              </div>
              <FaRobot className="text-4xl text-green-400" />
            </div>
          </div>

          <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Your Balance</p>
                <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>${user?.balance?.toFixed(2)}</p>
              </div>
              <FaBitcoin className="text-4xl text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Price Monitor */}
        <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg mb-8`}>
          <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Live Prices</h2>
          
          {/* Symbol Selector */}
          <div className="flex space-x-2 mb-6 overflow-x-auto">
            {symbols.map((symbol) => (
              <button
                key={symbol}
                onClick={() => setSelectedSymbol(symbol)}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                  selectedSymbol === symbol
                    ? 'bg-blue-600 text-white'
                    : theme === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {symbol}
              </button>
            ))}
          </div>

          {/* Prices Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className={`text-left py-3 px-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Exchange</th>
                  <th className={`text-right py-3 px-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Price</th>
                  <th className={`text-right py-3 px-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>24h Change</th>
                  <th className={`text-right py-3 px-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Volume</th>
                </tr>
              </thead>
              <tbody>
                {symbolPrices.map((price, idx) => (
                  <tr key={idx} className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <td className={`py-3 px-4 font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{price.exchange}</td>
                    <td className={`py-3 px-4 text-right font-mono ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      ${price.price_usd.toLocaleString()}
                    </td>
                    <td className={`py-3 px-4 text-right font-semibold ${
                      price.change_24h >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {price.change_24h >= 0 ? '+' : ''}{price.change_24h.toFixed(2)}%
                    </td>
                    <td className={`py-3 px-4 text-right ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      ${(price.volume_24h / 1000000).toFixed(2)}M
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Arbitrage Opportunities */}
        <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Arbitrage Opportunities
          </h2>

          {opportunities.length === 0 ? (
            <p className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              No opportunities available at the moment
            </p>
          ) : (
            <div className="space-y-4">
              {opportunities.slice(0, 10).map((opp) => (
                <div
                  key={opp.id}
                  className={`p-4 rounded-lg border ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} transition-colors cursor-pointer`}
                  onClick={() => navigate('/trading', { state: { opportunity: opp } })}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{opp.symbol}</div>
                      <div>
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Buy on {opp.buy_exchange} at ${opp.buy_price.toLocaleString()}
                        </div>
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Sell on {opp.sell_exchange} at ${opp.sell_price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400">
                        +{opp.profit_percentage.toFixed(2)}%
                      </div>
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        ${opp.profit_usd.toFixed(2)} profit
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;