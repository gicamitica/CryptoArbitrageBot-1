import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';
import { FaArrowLeft, FaRobot, FaPlay, FaStop, FaCog, FaHistory, FaChartLine } from 'react-icons/fa';
import UpgradePrompt from '../components/UpgradePrompt';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AutoTradingPage = () => {
  const { user, token } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const [botStatus, setBotStatus] = useState(null);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  
  // Settings form
  const [settings, setSettings] = useState({
    min_profit_percentage: 2.0,
    max_trade_amount: 100,
    daily_trade_limit: 10
  });

  const headers = { Authorization: `Bearer ${token}` };
  
  // Check if premium user
  const isPremium = user?.subscription_tier === 'premium';

  useEffect(() => {
    if (isPremium) {
      fetchData();
      const interval = setInterval(fetchData, 10000);
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [isPremium]);

  const fetchData = async () => {
    try {
      const [statusRes, tradesRes] = await Promise.all([
        axios.get(`${API_URL}/bot/status`, { headers }),
        axios.get(`${API_URL}/bot/trades`, { headers })
      ]);
      
      setBotStatus(statusRes.data);
      setTrades(tradesRes.data);
      setSettings({
        min_profit_percentage: statusRes.data.settings?.min_profit_percentage || 2.0,
        max_trade_amount: statusRes.data.settings?.max_trade_amount || 100,
        daily_trade_limit: statusRes.data.settings?.daily_trade_limit || 10
      });
    } catch (err) {
      console.error('Error fetching bot data:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleBot = async () => {
    setActionLoading(true);
    setError('');
    
    try {
      const endpoint = botStatus?.is_enabled ? '/bot/disable' : '/bot/enable';
      await axios.post(`${API_URL}${endpoint}`, {}, { headers });
      setSuccess(botStatus?.is_enabled ? 'Bot disabled' : 'Bot enabled');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to toggle bot');
    } finally {
      setActionLoading(false);
    }
  };

  const saveSettings = async () => {
    setActionLoading(true);
    setError('');
    
    try {
      await axios.put(`${API_URL}/bot/settings`, settings, { headers });
      setSuccess('Settings saved!');
      setShowSettings(false);
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save settings');
    } finally {
      setActionLoading(false);
    }
  };

  const testTrade = async () => {
    setActionLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_URL}/bot/test-trade`, {}, { headers });
      if (response.data.success) {
        setSuccess(`Test trade executed! Profit: $${response.data.trade?.profit_usd}`);
        fetchData();
      } else {
        setError(response.data.message);
      }
      setTimeout(() => { setSuccess(''); setError(''); }, 5000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Test trade failed');
    } finally {
      setActionLoading(false);
    }
  };

  // Show upgrade prompt for non-premium users
  if (!isPremium) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <header className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
          <div className="container mx-auto px-6 py-4 flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            >
              <FaArrowLeft className={theme === 'dark' ? 'text-white' : 'text-gray-900'} />
            </button>
            <FaRobot className="text-2xl text-purple-400" />
            <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Auto-Trading Bot
            </span>
          </div>
        </header>
        
        <UpgradePrompt 
          feature="Auto-Trading Bot"
          requiredPlan="Premium"
          currentPlan={user?.subscription_tier || 'free'}
          theme={theme}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Header */}
      <header className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            >
              <FaArrowLeft className={theme === 'dark' ? 'text-white' : 'text-gray-900'} />
            </button>
            <FaRobot className="text-2xl text-purple-400" />
            <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Auto-Trading Bot
            </span>
          </div>
          
          {/* Bot Status Indicator */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
            botStatus?.is_enabled 
              ? 'bg-green-500 bg-opacity-20 text-green-400' 
              : 'bg-gray-500 bg-opacity-20 text-gray-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${botStatus?.is_enabled ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></span>
            {botStatus?.is_enabled ? 'ACTIVE' : 'INACTIVE'}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg text-green-400">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Today's Profit</p>
            <p className="text-2xl font-bold text-green-400">${botStatus?.today_profit_usd || 0}</p>
          </div>
          <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Trades Today</p>
            <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {botStatus?.today_trades || 0}
            </p>
          </div>
          <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Remaining</p>
            <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {botStatus?.remaining_trades || 0}
            </p>
          </div>
          <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Min Profit</p>
            <p className={`text-2xl font-bold text-purple-400`}>
              {settings.min_profit_percentage}%
            </p>
          </div>
        </div>

        {/* Control Panel */}
        <div className={`p-6 rounded-xl mb-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h2 className={`text-xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Bot Controls
          </h2>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={toggleBot}
              disabled={actionLoading}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                botStatus?.is_enabled
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              } disabled:opacity-50`}
            >
              {botStatus?.is_enabled ? <FaStop /> : <FaPlay />}
              {botStatus?.is_enabled ? 'Stop Bot' : 'Start Bot'}
            </button>
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold ${
                theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
            >
              <FaCog />
              Settings
            </button>
            
            <button
              onClick={testTrade}
              disabled={actionLoading || !botStatus?.is_enabled}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold disabled:opacity-50"
            >
              <FaChartLine />
              Test Trade
            </button>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className={`mt-6 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <h3 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Bot Settings
              </h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Min Profit (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={settings.min_profit_percentage}
                    onChange={(e) => setSettings({...settings, min_profit_percentage: parseFloat(e.target.value)})}
                    className={`w-full px-3 py-2 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'
                    } border border-gray-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Max Trade Amount ($)
                  </label>
                  <input
                    type="number"
                    min="10"
                    value={settings.max_trade_amount}
                    onChange={(e) => setSettings({...settings, max_trade_amount: parseFloat(e.target.value)})}
                    className={`w-full px-3 py-2 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'
                    } border border-gray-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Daily Trade Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={settings.daily_trade_limit}
                    onChange={(e) => setSettings({...settings, daily_trade_limit: parseInt(e.target.value)})}
                    className={`w-full px-3 py-2 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'
                    } border border-gray-500`}
                  />
                </div>
              </div>
              
              <button
                onClick={saveSettings}
                disabled={actionLoading}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
              >
                Save Settings
              </button>
            </div>
          )}
        </div>

        {/* Trade History */}
        <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center gap-2 mb-6">
            <FaHistory className="text-purple-400" />
            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Auto-Trade History
            </h2>
          </div>
          
          {trades.length === 0 ? (
            <p className={`text-center py-8 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              No auto-trades yet. Enable the bot and it will execute trades automatically!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <th className={`text-left py-2 px-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Time</th>
                    <th className={`text-left py-2 px-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Symbol</th>
                    <th className={`text-left py-2 px-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Route</th>
                    <th className={`text-right py-2 px-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Amount</th>
                    <th className={`text-right py-2 px-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((trade) => (
                    <tr key={trade.id} className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className={`py-2 px-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {new Date(trade.executed_at).toLocaleTimeString()}
                      </td>
                      <td className={`py-2 px-2 font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {trade.symbol}
                      </td>
                      <td className={`py-2 px-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {trade.buy_exchange} → {trade.sell_exchange}
                      </td>
                      <td className={`py-2 px-2 text-right ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        ${trade.amount_usd}
                      </td>
                      <td className="py-2 px-2 text-right text-green-400 font-semibold">
                        +${trade.profit_usd}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AutoTradingPage;
