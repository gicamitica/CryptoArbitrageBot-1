import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';
import { FaArrowLeft, FaUsers, FaDollarSign, FaChartLine } from 'react-icons/fa';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const SuperAdminPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/super-admin/login`, { password });
      if (response.data.access) {
        setAuthenticated(true);
        localStorage.setItem('super_admin_password', password);
        fetchDashboard();
      }
    } catch (err) {
      setError('Invalid password');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboard = async () => {
    try {
      const storedPassword = localStorage.getItem('super_admin_password') || password;
      const response = await axios.get(`${API_URL}/super-admin/dashboard`, {
        params: { password: storedPassword }
      });
      setDashboardData(response.data);
    } catch (err) {
      setError('Failed to load dashboard');
      setAuthenticated(false);
      localStorage.removeItem('super_admin_password');
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setPassword('');
    setDashboardData(null);
    localStorage.removeItem('super_admin_password');
  };

  useEffect(() => {
    const storedPassword = localStorage.getItem('super_admin_password');
    if (storedPassword) {
      setPassword(storedPassword);
      setAuthenticated(true);
      fetchDashboard();
    }
  }, []);

  if (!authenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className={`max-w-md w-full p-8 rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-2xl`}>
          <div className="text-center mb-8">
            <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>🔐 Super Admin</h1>
            <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Enter master password</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg mb-4 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} border focus:outline-none focus:border-blue-500`}
              placeholder="Master Password"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold rounded-lg hover:from-red-700 hover:to-pink-700 transition-all disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Access Super Admin'}
            </button>
          </form>

          <button
            onClick={() => navigate('/dashboard')}
            className={`w-full mt-4 py-2 text-sm ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <header className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate('/dashboard')} className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
              <FaArrowLeft className={theme === 'dark' ? 'text-white' : 'text-gray-900'} />
            </button>
            <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>🔐 Super Admin</span>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Logout
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {dashboardData && (
          <>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <FaUsers className="text-4xl text-blue-400 mb-3" />
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Users</p>
                <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{dashboardData.stats.total_users}</p>
              </div>

              <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <FaChartLine className="text-4xl text-green-400 mb-3" />
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Paid Users</p>
                <p className={`text-3xl font-bold text-green-400`}>{dashboardData.stats.paid_users}</p>
              </div>

              <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <FaDollarSign className="text-4xl text-yellow-400 mb-3" />
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Revenue</p>
                <p className={`text-3xl font-bold text-yellow-400`}>${dashboardData.stats.total_revenue}</p>
              </div>

              <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <FaUsers className="text-4xl text-purple-400 mb-3" />
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Free Users</p>
                <p className={`text-3xl font-bold text-purple-400`}>{dashboardData.stats.free_users}</p>
              </div>
            </div>

            <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg mb-8`}>
              <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>All Users</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                      <th className={`text-left py-3 px-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Email</th>
                      <th className={`text-left py-3 px-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Plan</th>
                      <th className={`text-right py-3 px-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Balance</th>
                      <th className={`text-center py-3 px-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.all_users.map((user) => (
                      <tr key={user.id} className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                        <td className={`py-3 px-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{user.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.subscription_tier === 'premium' ? 'bg-pink-500 bg-opacity-20 text-pink-400' :
                            user.subscription_tier === 'pro' ? 'bg-purple-500 bg-opacity-20 text-purple-400' :
                            user.subscription_tier === 'test' ? 'bg-blue-500 bg-opacity-20 text-blue-400' :
                            'bg-gray-500 bg-opacity-20 text-gray-400'
                          }`}>
                            {user.subscription_tier.toUpperCase()}
                          </span>
                        </td>
                        <td className={`py-3 px-4 text-right ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>${user.balance.toFixed(2)}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.is_active ? 'bg-green-500 bg-opacity-20 text-green-400' : 'bg-red-500 bg-opacity-20 text-red-400'
                          }`}>
                            {user.is_active ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default SuperAdminPage;