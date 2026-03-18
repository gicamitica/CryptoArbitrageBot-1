import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';
import { FaBitcoin, FaArrowLeft, FaRobot } from 'react-icons/fa';
import UpgradePrompt from '../components/UpgradePrompt';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const TradingPage = () => {
  const { user, token, fetchUser } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [opportunities, setOpportunities] = useState([]);
  const [trades, setTrades] = useState([]);
  const [selectedOpp, setSelectedOpp] = useState(location.state?.opportunity || null);
  const [tradeAmount, setTradeAmount] = useState(100);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Check if user has access to trading
  const userPlan = user?.subscription_tier || 'free';
  const hasAccess = userPlan !== 'free';

  useEffect(() => {
    if (hasAccess) {
      fetchData();
      const interval = setInterval(fetchData, 5000);
      return () => clearInterval(interval);
    }
  }, [hasAccess]);

  const fetchData = async () => {
    try {
      const [oppsRes, tradesRes] = await Promise.all([
        axios.get(`${API_URL}/crypto/arbitrage`),
        axios.get(`${API_URL}/trades`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setOpportunities(oppsRes.data);
      setTrades(tradesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const executeTrade = async () => {
    if (!selectedOpp) return;
    
    setLoading(true);
    setMessage(null);

    try {
      // Execute buy trade
      await axios.post(
        `${API_URL}/trades`,
        {
          symbol: selectedOpp.symbol,
          trade_type: 'buy',
          amount: tradeAmount,
          price: selectedOpp.buy_price,
          exchange: selectedOpp.buy_exchange,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Execute sell trade
      await axios.post(
        `${API_URL}/trades`,
        {
          symbol: selectedOpp.symbol,
          trade_type: 'sell',
          amount: tradeAmount,
          price: selectedOpp.sell_price,
          exchange: selectedOpp.sell_exchange,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage({ type: 'success', text: 'Trade executed successfully!' });
      await fetchUser();
      await fetchData();
      setSelectedOpp(null);
      setTradeAmount(100);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.detail || 'Trade execution failed' 
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateProfit = () => {
    if (!selectedOpp) return 0;
    const units = tradeAmount / selectedOpp.buy_price;
    return units * (selectedOpp.sell_price - selectedOpp.buy_price);
  };

  // Show upgrade prompt for free users
  if (!hasAccess) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
        {/* Header */}
        <header className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
          <div className="container mx-auto px-6 py-4 flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            >
              <FaArrowLeft className={theme === 'dark' ? 'text-white' : 'text-gray-900'} />
            </button>
            <img src="/arbitrajz-logo.jpg" alt="ArbitrajZ Logo" className="h-10 w-10 rounded-full" />
            <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Trading</span>
          </div>
        </header>
        
        <UpgradePrompt 
          feature="Trading"
          requiredPlan="Test, Pro, or Premium"
          currentPlan={userPlan}
          theme={theme}
        />
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
            <img src="/arbitrajz-logo.jpg" alt="ArbitrajZ Logo" className="h-10 w-10 rounded-full" />
            <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Trading</span>
          </div>
          <div className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Balance: </span>
            <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>${user?.balance?.toFixed(2)}</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Trade Execution */}
          <div>
            <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Execute Trade
            </h2>

            {message && (
              <div className={`mb-4 p-4 rounded-lg border ${
                message.type === 'success'
                  ? 'bg-green-500 bg-opacity-20 border-green-500 text-green-300'
                  : 'bg-red-500 bg-opacity-20 border-red-500 text-red-300'
              }`}>
                {message.text}
              </div>
            )}

            {selectedOpp ? (
              <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg space-y-6`}>
                {/* Selected Opportunity */}
                <div>
                  <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {selectedOpp.symbol}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Buy from:</span>
                      <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {selectedOpp.buy_exchange} @ ${selectedOpp.buy_price.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Sell to:</span>
                      <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {selectedOpp.sell_exchange} @ ${selectedOpp.sell_price.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Profit:</span>
                      <span className="font-bold text-green-400">
                        +{selectedOpp.profit_percentage.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Trade Amount */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Trade Amount (USD)
                  </label>
                  <input
                    type="number"
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(Number(e.target.value))}
                    min="10"
                    max={user?.balance}
                    className={`w-full px-4 py-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:border-blue-500`}
                  />
                </div>

                {/* Estimated Profit */}
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="flex justify-between items-center">
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Estimated Profit:</span>
                    <span className="text-2xl font-bold text-green-400">
                      ${calculateProfit().toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={executeTrade}
                    disabled={loading || tradeAmount > user?.balance}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                  >
                    <FaRobot />
                    <span>{loading ? 'Executing...' : 'Execute Trade'}</span>
                  </button>
                  <button
                    onClick={() => setSelectedOpp(null)}
                    className={`px-6 py-3 rounded-lg font-semibold ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className={`relative p-12 rounded-xl ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 via-blue-900 to-purple-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'} shadow-2xl overflow-hidden`}>
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className={`absolute -top-10 -left-10 w-40 h-40 rounded-full ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-300'} opacity-20 animate-pulse`}></div>
                  <div className={`absolute -bottom-10 -right-10 w-60 h-60 rounded-full ${theme === 'dark' ? 'bg-purple-500' : 'bg-purple-300'} opacity-20 animate-pulse`} style={{animationDelay: '1s'}}></div>
                  <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full ${theme === 'dark' ? 'bg-pink-500' : 'bg-pink-300'} opacity-10 animate-pulse`} style={{animationDelay: '0.5s'}}></div>
                </div>

                {/* Content */}
                <div className="relative z-10 text-center">
                  {/* Crypto Icons Animation */}
                  <div className="flex justify-center items-center space-x-4 mb-6">
                    <div className="animate-bounce" style={{animationDelay: '0s'}}>
                      <FaBitcoin className="text-5xl text-yellow-400 drop-shadow-lg" />
                    </div>
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                      ⚡
                    </div>
                    <div className="animate-bounce" style={{animationDelay: '0.2s'}}>
                      <div className="text-5xl">💎</div>
                    </div>
                  </div>

                  {/* Title with gradient */}
                  <h3 className={`text-3xl font-bold mb-4 bg-gradient-to-r ${theme === 'dark' ? 'from-blue-400 via-purple-400 to-pink-400' : 'from-blue-600 via-purple-600 to-pink-600'} bg-clip-text text-transparent`}>
                    Ready to Trade?
                  </h3>
                  
                  <p className={`text-lg mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Select an arbitrage opportunity from the right panel
                  </p>

                  {/* Animated instruction cards */}
                  <div className="grid grid-cols-3 gap-4 mt-8">
                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-white bg-opacity-5' : 'bg-white bg-opacity-60'} backdrop-blur-sm transform transition-all hover:scale-105`}>
                      <div className="text-3xl mb-2">👉</div>
                      <div className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Pick Opportunity
                      </div>
                    </div>
                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-white bg-opacity-5' : 'bg-white bg-opacity-60'} backdrop-blur-sm transform transition-all hover:scale-105`}>
                      <div className="text-3xl mb-2">💰</div>
                      <div className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Set Amount
                      </div>
                    </div>
                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-white bg-opacity-5' : 'bg-white bg-opacity-60'} backdrop-blur-sm transform transition-all hover:scale-105`}>
                      <div className="text-3xl mb-2">🚀</div>
                      <div className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Execute Trade
                      </div>
                    </div>
                  </div>

                  {/* Profit indicator */}
                  <div className={`mt-8 p-4 rounded-full inline-block ${theme === 'dark' ? 'bg-green-500 bg-opacity-20' : 'bg-green-100'}`}>
                    <span className="text-green-400 font-bold text-lg">
                      📈 Up to 4.5% Profit Available
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Trades */}
            <div className="mt-8">
              <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Recent Trades
              </h3>
              <div className={`rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg overflow-hidden`}>
                {trades.length === 0 ? (
                  <p className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    No trades yet
                  </p>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    <table className="w-full">
                      <thead className={`sticky top-0 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <tr>
                          <th className={`text-left py-3 px-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Symbol</th>
                          <th className={`text-left py-3 px-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Type</th>
                          <th className={`text-right py-3 px-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Amount</th>
                          <th className={`text-right py-3 px-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Profit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trades.slice(0, 20).map((trade) => (
                          <tr key={trade.id} className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                            <td className={`py-3 px-4 font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {trade.symbol}
                            </td>
                            <td className={`py-3 px-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                trade.trade_type === 'buy' 
                                  ? 'bg-blue-500 bg-opacity-20 text-blue-400'
                                  : 'bg-green-500 bg-opacity-20 text-green-400'
                              }`}>
                                {trade.trade_type.toUpperCase()}
                              </span>
                            </td>
                            <td className={`py-3 px-4 text-right ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              ${trade.amount.toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-right font-semibold text-green-400">
                              {trade.profit > 0 && '+'}{trade.profit.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Available Opportunities */}
          <div>
            <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Available Opportunities
            </h2>
            <div className="space-y-4">
              {opportunities.map((opp) => (
                <div
                  key={opp.id}
                  onClick={() => setSelectedOpp(opp)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedOpp?.id === opp.id
                      ? 'border-blue-500'
                      : theme === 'dark'
                      ? 'border-gray-700 hover:border-gray-600 bg-gray-800'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  } shadow-lg`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {opp.symbol}
                      </div>
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                        {opp.buy_exchange} → {opp.sell_exchange}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400">
                        +{opp.profit_percentage.toFixed(2)}%
                      </div>
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        ${opp.profit_usd.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TradingPage;