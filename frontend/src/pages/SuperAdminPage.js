import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';
import { FaArrowLeft, FaUsers, FaDollarSign, FaChartLine, FaTrash, FaPlus, FaEdit, FaTimes } from 'react-icons/fa';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const SuperAdminPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Form states
  const [newUser, setNewUser] = useState({ email: '', username: '', password: '', subscription_tier: 'free' });
  const [editUser, setEditUser] = useState({ subscription_tier: 'free', is_active: true, balance: 0 });

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

  // Add new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const storedPassword = localStorage.getItem('super_admin_password');
      await axios.post(`${API_URL}/super-admin/users`, newUser, {
        params: { password: storedPassword }
      });
      setSuccess('User created successfully!');
      setShowAddModal(false);
      setNewUser({ email: '', username: '', password: '', subscription_tier: 'free' });
      fetchDashboard();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  // Edit user
  const handleEditUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const storedPassword = localStorage.getItem('super_admin_password');
      await axios.put(`${API_URL}/super-admin/users/${selectedUser.id}`, {
        user_id: selectedUser.id,
        ...editUser
      }, {
        params: { password: storedPassword }
      });
      setSuccess('User updated successfully!');
      setShowEditModal(false);
      setSelectedUser(null);
      fetchDashboard();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDeleteUser = async () => {
    setLoading(true);
    setError('');
    
    try {
      const storedPassword = localStorage.getItem('super_admin_password');
      await axios.delete(`${API_URL}/super-admin/users/${selectedUser.id}`, {
        params: { password: storedPassword }
      });
      setSuccess('User deleted successfully!');
      setShowDeleteModal(false);
      setSelectedUser(null);
      fetchDashboard();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditUser({
      subscription_tier: user.subscription_tier || 'free',
      is_active: user.is_active !== false,
      balance: user.balance || 0
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  useEffect(() => {
    const storedPassword = localStorage.getItem('super_admin_password');
    if (storedPassword) {
      setPassword(storedPassword);
      setAuthenticated(true);
      fetchDashboard();
    }
  }, []);

  // Login Screen
  if (!authenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className={`max-w-md w-full p-8 rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-2xl`}>
          <div className="text-center mb-8">
            <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Super Admin</h1>
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
            onClick={() => navigate('/')}
            className={`w-full mt-4 py-2 text-sm ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Header */}
      <header className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate('/')} className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
              <FaArrowLeft className={theme === 'dark' ? 'text-white' : 'text-gray-900'} />
            </button>
            <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Super Admin Panel</span>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Logout
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Success/Error Messages */}
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

        {dashboardData && (
          <>
            {/* Stats Cards */}
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

            {/* Users Table */}
            <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg mb-8`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>All Users</h2>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FaPlus /> Add User
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                      <th className={`text-left py-3 px-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Email</th>
                      <th className={`text-left py-3 px-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Username</th>
                      <th className={`text-left py-3 px-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Plan</th>
                      <th className={`text-right py-3 px-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Balance</th>
                      <th className={`text-center py-3 px-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Status</th>
                      <th className={`text-center py-3 px-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.all_users.map((user) => (
                      <tr key={user.id} className={`border-b ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}>
                        <td className={`py-3 px-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{user.email}</td>
                        <td className={`py-3 px-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{user.username}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.subscription_tier === 'premium' ? 'bg-pink-500 bg-opacity-20 text-pink-400' :
                            user.subscription_tier === 'pro' ? 'bg-purple-500 bg-opacity-20 text-purple-400' :
                            user.subscription_tier === 'test' ? 'bg-blue-500 bg-opacity-20 text-blue-400' :
                            'bg-gray-500 bg-opacity-20 text-gray-400'
                          }`}>
                            {(user.subscription_tier || 'free').toUpperCase()}
                          </span>
                        </td>
                        <td className={`py-3 px-4 text-right ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>${(user.balance || 0).toFixed(2)}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.is_active !== false ? 'bg-green-500 bg-opacity-20 text-green-400' : 'bg-red-500 bg-opacity-20 text-red-400'
                          }`}>
                            {user.is_active !== false ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => openEditModal(user)}
                              className="p-2 text-blue-400 hover:bg-blue-500 hover:bg-opacity-20 rounded-lg transition-colors"
                              title="Edit User"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => openDeleteModal(user)}
                              className="p-2 text-red-400 hover:bg-red-500 hover:bg-opacity-20 rounded-lg transition-colors"
                              title="Delete User"
                            >
                              <FaTrash />
                            </button>
                          </div>
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

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`max-w-md w-full p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-2xl`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Add New User</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white">
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className={`block text-sm mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className={`w-full px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border`}
                />
              </div>
              <div>
                <label className={`block text-sm mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Username</label>
                <input
                  type="text"
                  required
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  className={`w-full px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border`}
                />
              </div>
              <div>
                <label className={`block text-sm mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
                <input
                  type="password"
                  required
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className={`w-full px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border`}
                />
              </div>
              <div>
                <label className={`block text-sm mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Subscription Plan</label>
                <select
                  value={newUser.subscription_tier}
                  onChange={(e) => setNewUser({...newUser, subscription_tier: e.target.value})}
                  className={`w-full px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border`}
                >
                  <option value="free">Free</option>
                  <option value="test">Test ($1/day)</option>
                  <option value="pro">Pro ($29/month)</option>
                  <option value="premium">Premium ($99/month)</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`flex-1 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`max-w-md w-full p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-2xl`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Edit User</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white">
                <FaTimes />
              </button>
            </div>
            
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{selectedUser.email}</p>
            
            <form onSubmit={handleEditUser} className="space-y-4">
              <div>
                <label className={`block text-sm mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Subscription Plan</label>
                <select
                  value={editUser.subscription_tier}
                  onChange={(e) => setEditUser({...editUser, subscription_tier: e.target.value})}
                  className={`w-full px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border`}
                >
                  <option value="free">Free</option>
                  <option value="test">Test ($1/day)</option>
                  <option value="pro">Pro ($29/month)</option>
                  <option value="premium">Premium ($99/month)</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Balance ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editUser.balance}
                  onChange={(e) => setEditUser({...editUser, balance: parseFloat(e.target.value) || 0})}
                  className={`w-full px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border`}
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={editUser.is_active}
                  onChange={(e) => setEditUser({...editUser, is_active: e.target.checked})}
                  className="w-4 h-4"
                />
                <label htmlFor="is_active" className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Account Active</label>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className={`flex-1 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`max-w-md w-full p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-2xl`}>
            <div className="text-center">
              <div className="text-5xl mb-4">&#9888;</div>
              <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Delete User?</h3>
              <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Are you sure you want to delete <strong>{selectedUser.email}</strong>? This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className={`flex-1 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  disabled={loading}
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? 'Deleting...' : 'Delete User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminPage;
