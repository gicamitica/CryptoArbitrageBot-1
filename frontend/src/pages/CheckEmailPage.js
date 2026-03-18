import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';
import { FaEnvelope, FaRedo } from 'react-icons/fa';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const CheckEmailPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState(localStorage.getItem('pendingVerificationEmail') || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResend = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const response = await axios.post(`${API_URL}/auth/resend-verification?email=${encodeURIComponent(email)}`);
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to resend email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="max-w-md w-full mx-4">
        <div className={`p-8 rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-2xl text-center`}>
          {/* Email Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center">
            <FaEnvelope className="text-4xl text-blue-400" />
          </div>

          <h1 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Check Your Email
          </h1>
          
          <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            We've sent a verification link to:
            <br />
            <strong className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{email}</strong>
          </p>

          <div className={`p-4 rounded-lg mb-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Click the link in the email to verify your account. 
              The link expires in <strong>24 hours</strong>.
            </p>
          </div>

          {message && (
            <div className="mb-4 p-3 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg text-green-400 text-sm">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Resend Section */}
          <div className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} pt-6 mt-6`}>
            <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              Didn't receive the email? Check your spam folder or
            </p>
            
            <div className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`w-full px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border text-sm`}
              />
              
              <button
                onClick={handleResend}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <FaRedo className={loading ? 'animate-spin' : ''} />
                {loading ? 'Sending...' : 'Resend Verification Email'}
              </button>
            </div>
          </div>

          {/* Back to Login */}
          <div className="mt-6">
            <Link 
              to="/login" 
              className={`text-sm ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckEmailPage;
