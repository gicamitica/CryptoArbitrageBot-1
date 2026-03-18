import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';
import { FaArrowLeft, FaPlus, FaTrash, FaSync, FaCheck, FaTimes, FaLock, FaExclamationTriangle } from 'react-icons/fa';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const SettingsPage = () => {
  const { user, token } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const [exchanges, setExchanges] = useState([]);
  const [userKeys, setUserKeys] = useState([]);
  const [limits, setLimits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [testingKey, setTestingKey] = useState(null);
  const [deletingKey, setDeletingKey] = useState(null);
  
  // Form state
  const [newKey, setNewKey] = useState({
    exchange_id: '',
    api_key: '',
    api_secret: '',
    passphrase: ''
  });
  const [addingKey, setAddingKey] = useState(false);

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [exchangesRes, keysRes, limitsRes] = await Promise.all([
        axios.get(`${API_URL}/api-keys/exchanges`, { headers }),
        axios.get(`${API_URL}/api-keys/`, { headers }),
        axios.get(`${API_URL}/api-keys/limits`, { headers })
      ]);
      
      setExchanges(exchangesRes.data.exchanges);
      setUserKeys(keysRes.data);
      setLimits(limitsRes.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddKey = async (e) => {
    e.preventDefault();
    setAddingKey(true);
    setError('');
    
    try {
      await axios.post(`${API_URL}/api-keys/`, newKey, { headers });
      setSuccess('API key added successfully!');
      setShowAddModal(false);
      setNewKey({ exchange_id: '', api_key: '', api_secret: '', passphrase: '' });
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add API key');
    } finally {
      setAddingKey(false);
    }
  };

  const handleTestKey = async (keyId) => {
    setTestingKey(keyId);
    setError('');
    
    try {
      const response = await axios.post(`${API_URL}/api-keys/${keyId}/test`, {}, { headers });
      if (response.data.success) {
        setSuccess(response.data.message);
      } else {
        setError(response.data.message);
      }
      fetchData();
      setTimeout(() => { setSuccess(''); setError(''); }, 5000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Test failed');
    } finally {
      setTestingKey(null);
    }
  };

  const handleDeleteKey = async (keyId) => {
    setDeletingKey(keyId);
    
    try {
      await axios.delete(`${API_URL}/api-keys/${keyId}`, { headers });
      setSuccess('API key deleted');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete');
    } finally {
      setDeletingKey(null);
    }
  };

  // Get available exchanges (not already connected)
  const availableExchanges = exchanges.filter(
    ex => !userKeys.some(key => key.exchange_id === ex.id)
  );

  const needsPassphrase = ['kucoin', 'okx', 'coinbase'].includes(newKey.exchange_id);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
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
            <img src="/arbitrajz-logo.jpg" alt="ArbitrajZ" className="h-10 w-10 rounded-full" />
            <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              API Keys Settings
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg text-green-400 flex items-center gap-2">
            <FaCheck /> {success}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-400 flex items-center gap-2">
            <FaTimes /> {error}
          </div>
        )}

        {/* Subscription Info */}
        <div className={`p-6 rounded-xl mb-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex justify-between items-center">
            <div>
              <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Your Plan: <span className={`${
                  limits?.subscription_tier === 'premium' ? 'text-pink-400' :
                  limits?.subscription_tier === 'pro' ? 'text-purple-400' :
                  limits?.subscription_tier === 'test' ? 'text-blue-400' :
                  'text-gray-400'
                }`}>{(limits?.subscription_tier || 'free').toUpperCase()}</span>
              </h2>
              <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {limits?.current_count || 0} / {limits?.max_exchanges || 0} exchanges connected
              </p>
            </div>
            
            {limits?.subscription_tier === 'free' && (
              <button
                onClick={() => navigate('/pricing')}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Upgrade Plan
              </button>
            )}
          </div>
          
          {/* Progress bar */}
          {limits?.max_exchanges > 0 && (
            <div className="mt-4">
              <div className={`h-2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                  style={{ width: `${Math.min((limits.current_count / limits.max_exchanges) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className={`p-4 rounded-xl mb-6 ${theme === 'dark' ? 'bg-blue-900 bg-opacity-30 border-blue-700' : 'bg-blue-50 border-blue-200'} border`}>
          <div className="flex items-start gap-3">
            <FaLock className="text-blue-400 mt-1" />
            <div>
              <h3 className={`font-semibold ${theme === 'dark' ? 'text-blue-300' : 'text-blue-800'}`}>Your API Keys are Secure</h3>
              <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>
                All API keys are encrypted using military-grade AES-256 encryption before storage. 
                We recommend creating API keys with <strong>read-only</strong> and <strong>no withdrawal</strong> permissions.
              </p>
            </div>
          </div>
        </div>

        {/* Connected Exchanges */}
        <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Connected Exchanges
            </h2>
            
            {limits?.can_add_more && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaPlus /> Add Exchange
              </button>
            )}
          </div>

          {userKeys.length === 0 ? (
            <div className="text-center py-12">
              <FaExclamationTriangle className={`text-5xl mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                No exchanges connected yet
              </p>
              {limits?.subscription_tier === 'free' ? (
                <button
                  onClick={() => navigate('/pricing')}
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg"
                >
                  Upgrade to Connect Exchanges
                </button>
              ) : (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Add Your First Exchange
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {userKeys.map((key) => (
                <div 
                  key={key.id}
                  className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} flex items-center justify-between`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-600' : 'bg-white'}`}>
                      <span className="text-2xl font-bold text-blue-400">
                        {key.exchange_name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {key.exchange_name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {key.is_valid === true && (
                          <span className="flex items-center gap-1 text-xs text-green-400">
                            <FaCheck /> Connected
                          </span>
                        )}
                        {key.is_valid === false && (
                          <span className="flex items-center gap-1 text-xs text-red-400">
                            <FaTimes /> Invalid
                          </span>
                        )}
                        {key.is_valid === null && (
                          <span className="text-xs text-gray-400">Not tested</span>
                        )}
                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                          Added {new Date(key.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTestKey(key.id)}
                      disabled={testingKey === key.id}
                      className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} text-blue-400 transition-colors disabled:opacity-50`}
                      title="Test Connection"
                    >
                      <FaSync className={testingKey === key.id ? 'animate-spin' : ''} />
                    </button>
                    <button
                      onClick={() => handleDeleteKey(key.id)}
                      disabled={deletingKey === key.id}
                      className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} text-red-400 transition-colors disabled:opacity-50`}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add Exchange Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`max-w-lg w-full p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-2xl`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Add Exchange API Key
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <FaTimes className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
              </button>
            </div>

            <form onSubmit={handleAddKey} className="space-y-4">
              <div>
                <label className={`block text-sm mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Select Exchange
                </label>
                <select
                  required
                  value={newKey.exchange_id}
                  onChange={(e) => setNewKey({...newKey, exchange_id: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border`}
                >
                  <option value="">Choose an exchange...</option>
                  {availableExchanges.map((ex) => (
                    <option key={ex.id} value={ex.id}>{ex.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  API Key
                </label>
                <input
                  type="text"
                  required
                  value={newKey.api_key}
                  onChange={(e) => setNewKey({...newKey, api_key: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border font-mono text-sm`}
                  placeholder="Paste your API key here"
                />
              </div>

              <div>
                <label className={`block text-sm mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  API Secret
                </label>
                <input
                  type="password"
                  required
                  value={newKey.api_secret}
                  onChange={(e) => setNewKey({...newKey, api_secret: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border font-mono text-sm`}
                  placeholder="Paste your API secret here"
                />
              </div>

              {needsPassphrase && (
                <div>
                  <label className={`block text-sm mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Passphrase <span className="text-gray-500">(required for {newKey.exchange_id})</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={newKey.passphrase}
                    onChange={(e) => setNewKey({...newKey, passphrase: e.target.value})}
                    className={`w-full px-4 py-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border font-mono text-sm`}
                    placeholder="Enter your passphrase"
                  />
                </div>
              )}

              {/* Security Warning */}
              <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-yellow-900 bg-opacity-30' : 'bg-yellow-50'} border border-yellow-500 border-opacity-50`}>
                <p className={`text-xs ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-800'}`}>
                  <strong>Security Tip:</strong> Create API keys with <strong>read-only</strong> permissions and <strong>disable withdrawals</strong> for maximum security.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`flex-1 py-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingKey}
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {addingKey ? 'Adding...' : 'Add Exchange'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
