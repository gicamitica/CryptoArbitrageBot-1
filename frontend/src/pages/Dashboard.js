import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';
import { FaBitcoin, FaSignOutAlt, FaMoon, FaSun, FaChartLine, FaRobot, FaUserShield, FaCog, FaWifi, FaDatabase, FaUser, FaChevronDown, FaCrown, FaEnvelope } from 'react-icons/fa';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Dashboard = () => {
  const { user, logout, token } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [prices, setPrices] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSymbol, setSelectedSymbol] = useState('BTC');
  const [isLive, setIsLive] = useState(false);
  const [connectedExchanges, setConnectedExchanges] = useState(0);
  const [dataMessage, setDataMessage] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const headers = { Authorization: `Bearer ${token}` };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, [token]);

  const fetchData = async () => {
    try {
      // Try to get live data first
      let pricesData = [];
      let oppsData = [];
      let live = false;
      let exchanges = 0;
      let message = '';

      try {
        // Try live endpoints first
        const [livePricesRes, liveOppsRes] = await Promise.all([
          axios.get(`${API_URL}/crypto/prices/live`, { headers }),
          axios.get(`${API_URL}/crypto/arbitrage/live`, { headers })
        ]);

        if (livePricesRes.data.is_live && livePricesRes.data.prices.length > 0) {
          pricesData = livePricesRes.data.prices;
          live = true;
          exchanges = livePricesRes.data.connected_exchanges;
          message = livePricesRes.data.message;
        }

        if (liveOppsRes.data.is_live && liveOppsRes.data.opportunities) {
          oppsData = liveOppsRes.data.opportunities;
        }
      } catch (liveError) {
        // Live data failed, will fall back to mock
        console.log('Live data not available, using mock data');
      }

      // Fall back to mock data if no live data
      if (pricesData.length === 0) {
        const [pricesRes, oppsRes] = await Promise.all([
          axios.get(`${API_URL}/crypto/prices`),
          axios.get(`${API_URL}/crypto/arbitrage`),
        ]);
        pricesData = pricesRes.data;
        oppsData = oppsRes.data;
        message = 'Demo data - Connect exchanges for live prices';
      }

      setPrices(pricesData);
      setOpportunities(oppsData);
      setIsLive(live);
      setConnectedExchanges(exchanges);
      setDataMessage(message);
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
              {user?.subscription_tier === 'premium' && (
                <button
                  onClick={() => navigate('/auto-trading')}
                  className="px-4 py-2 text-purple-400 hover:text-purple-300 flex items-center space-x-1"
                >
                  <FaRobot />
                  <span>Auto-Bot</span>
                </button>
              )}
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
            
            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}
                data-testid="profile-dropdown-btn"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  user?.subscription_tier === 'premium' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                  user?.subscription_tier === 'pro' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                  user?.subscription_tier === 'test' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                  'bg-gray-500'
                }`}>
                  <FaUser className="text-white text-sm" />
                </div>
                <FaChevronDown className={`text-xs transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {profileOpen && (
                <div className={`absolute right-0 mt-2 w-72 rounded-xl shadow-2xl border z-50 overflow-hidden ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}>
                  {/* User Info Header */}
                  <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        user?.subscription_tier === 'premium' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                        user?.subscription_tier === 'pro' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                        user?.subscription_tier === 'test' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                        'bg-gray-500'
                      }`}>
                        <FaUser className="text-white text-lg" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {user?.full_name || user?.username}
                        </p>
                        <p className={`text-sm truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    {/* Subscription Badge */}
                    <div className="mt-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        user?.subscription_tier === 'premium' ? 'bg-purple-500 bg-opacity-20 text-purple-400' :
                        user?.subscription_tier === 'pro' ? 'bg-blue-500 bg-opacity-20 text-blue-400' :
                        user?.subscription_tier === 'test' ? 'bg-green-500 bg-opacity-20 text-green-400' :
                        'bg-gray-500 bg-opacity-20 text-gray-400'
                      }`}>
                        <FaCrown className="mr-1" />
                        {user?.subscription_tier?.charAt(0).toUpperCase() + user?.subscription_tier?.slice(1) || 'Free'} Plan
                      </span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                      className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
                        theme === 'dark' 
                          ? 'hover:bg-gray-700 text-gray-300' 
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <FaCog className="mr-3" />
                      <span>API Keys & Settings</span>
                    </button>
                    <button
                      onClick={() => { setProfileOpen(false); navigate('/pricing'); }}
                      className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
                        theme === 'dark' 
                          ? 'hover:bg-gray-700 text-gray-300' 
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <FaCrown className="mr-3" />
                      <span>Upgrade Plan</span>
                    </button>
                    <button
                      onClick={() => { setProfileOpen(false); navigate('/guide'); }}
                      className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
                        theme === 'dark' 
                          ? 'hover:bg-gray-700 text-gray-300' 
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <FaChartLine className="mr-3" />
                      <span>User Guide</span>
                    </button>
                  </div>

                  {/* Logout */}
                  <div className={`border-t py-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button
                      onClick={handleLogout}
                      className={`w-full flex items-center px-4 py-3 text-left transition-colors text-red-400 ${
                        theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                      }`}
                      data-testid="logout-btn"
                    >
                      <FaSignOutAlt className="mr-3" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Data Status Banner */}
        <div className={`mb-6 p-3 rounded-lg flex items-center justify-between ${
          isLive 
            ? 'bg-green-500 bg-opacity-20 border border-green-500' 
            : 'bg-yellow-500 bg-opacity-20 border border-yellow-500'
        }`}>
          <div className="flex items-center gap-3">
            {isLive ? (
              <>
                <FaWifi className="text-green-400 animate-pulse" />
                <span className="text-green-400 font-semibold">LIVE DATA</span>
                <span className={`text-sm ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>
                  {dataMessage} ({connectedExchanges} exchanges)
                </span>
              </>
            ) : (
              <>
                <FaDatabase className="text-yellow-400" />
                <span className="text-yellow-400 font-semibold">DEMO DATA</span>
                <span className={`text-sm ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'}`}>
                  {dataMessage || 'Connect exchanges for live prices'}
                </span>
              </>
            )}
          </div>
          {!isLive && (
            <button
              onClick={() => navigate('/settings')}
              className="px-3 py-1 bg-yellow-500 text-black text-sm font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Connect Exchanges
            </button>
          )}
        </div>

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