import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { theme } = useTheme();
  const { fetchUser } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState('checking');
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    if (sessionId) {
      checkPaymentStatus();
    } else {
      setStatus('error');
      setMessage('No payment session found');
    }
  }, [sessionId]);

  const checkPaymentStatus = async () => {
    let attempts = 0;
    const maxAttempts = 10;

    const pollStatus = async () => {
      try {
        const response = await axios.get(`${API_URL}/payments/status/${sessionId}`);
        
        if (response.data.payment_status === 'paid') {
          setStatus('success');
          setMessage('Payment successful! Your subscription is now active.');
          await fetchUser();
          setTimeout(() => navigate('/dashboard'), 3000);
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(pollStatus, 2000);
        } else {
          setStatus('pending');
          setMessage('Payment is being processed. Please check back in a few minutes.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Failed to verify payment. Please contact support.');
      }
    };

    pollStatus();
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`max-w-md w-full p-8 rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-2xl text-center`}>
        {status === 'checking' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-6"></div>
            <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Processing Payment</h2>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-6xl mb-6" data-testid="payment-success-icon">✅</div>
            <h2 className="text-2xl font-bold text-green-400 mb-4" data-testid="payment-success-title">Payment Successful!</h2>
            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{message}</p>
            <p className={`mt-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Redirecting to dashboard...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-6xl mb-6" data-testid="payment-error-icon">❌</div>
            <h2 className="text-2xl font-bold text-red-400 mb-4" data-testid="payment-error-title">Payment Error</h2>
            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{message}</p>
            <button
              onClick={() => navigate('/pricing')}
              className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </>
        )}

        {status === 'pending' && (
          <>
            <div className="text-6xl mb-6">⏳</div>
            <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Payment Pending</h2>
            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{message}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;