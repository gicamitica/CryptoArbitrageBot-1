import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const VerifyEmailPage = () => {
  const { theme } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setStatus('error');
      setMessage('Invalid verification link. No token provided.');
    }
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/verify-email?token=${token}`);
      
      setStatus('success');
      setMessage(response.data.message);
      
      // Auto-login with the returned token
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate('/dashboard');
          window.location.reload(); // Refresh to update auth state
        }, 3000);
      }
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.detail || 'Verification failed. Please try again.');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="max-w-md w-full mx-4">
        <div className={`p-8 rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-2xl text-center`}>
          
          {/* Verifying State */}
          {status === 'verifying' && (
            <>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center">
                <FaSpinner className="text-4xl text-blue-400 animate-spin" />
              </div>
              <h1 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Verifying Your Email...
              </h1>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Please wait a moment.
              </p>
            </>
          )}

          {/* Success State */}
          {status === 'success' && (
            <>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center">
                <FaCheckCircle className="text-4xl text-green-400" />
              </div>
              <h1 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Email Verified! 🎉
              </h1>
              <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {message}
              </p>
              <div className={`p-4 rounded-lg mb-6 ${theme === 'dark' ? 'bg-green-900 bg-opacity-30' : 'bg-green-50'}`}>
                <p className={`text-sm ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>
                  Redirecting you to the dashboard in 3 seconds...
                </p>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Go to Dashboard Now →
              </button>
            </>
          )}

          {/* Error State */}
          {status === 'error' && (
            <>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500 bg-opacity-20 flex items-center justify-center">
                <FaTimesCircle className="text-4xl text-red-400" />
              </div>
              <h1 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Verification Failed
              </h1>
              <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {message}
              </p>
              <div className="space-y-3">
                <Link
                  to="/check-email"
                  className="block w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Request New Verification Link
                </Link>
                <Link
                  to="/login"
                  className={`block text-sm ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  ← Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
