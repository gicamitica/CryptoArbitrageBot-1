import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { FaBitcoin, FaCheck, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const PricingPage = () => {
  const { user, token } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);

  const plans = [
    {
      id: 'test',
      name: 'Test Plan',
      price: '$1',
      duration: '/day',
      exchanges: '2',
      features: ['2 Exchanges', 'Real-time Monitoring', 'Manual Trading', '24h Access'],
      color: 'blue',
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: '$29',
      duration: '/month',
      exchanges: '5',
      features: ['5 Exchanges', 'Real-time Monitoring', 'Manual Trading', 'Email Alerts', 'Priority Support'],
      color: 'purple',
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: '$99',
      duration: '/month',
      exchanges: 'Unlimited',
      features: ['Unlimited Exchanges', 'Auto-Trading Bot', 'Advanced Analytics', 'WhatsApp Alerts', '24/7 VIP Support', 'Custom Strategies'],
      color: 'pink',
      popular: false
    }
  ];

  const handleCheckout = async (planId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(planId);
    
    try {
      const origin = window.location.origin;
      
      const response = await axios.post(
        `${API_URL}/payments/checkout`,
        { plan_id: planId, origin_url: origin },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Redirect to Stripe
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to initiate checkout. Please try again.');
      setLoading(null);
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Header */}
      <header className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(user ? '/dashboard' : '/')}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            >
              <FaArrowLeft className={theme === 'dark' ? 'text-white' : 'text-gray-900'} />
            </button>
            <img src="/arbitrajz-logo.jpg" alt="ArbitrajZ" className="h-10 w-10 rounded-full" />
            <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Pricing</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Choose Your <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Plan</span>
          </h1>
          <p className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Start with a test, scale to unlimited exchanges
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? 'border-2 border-purple-500 shadow-2xl transform scale-105'
                  : theme === 'dark'
                  ? 'bg-gray-800 border border-gray-700'
                  : 'bg-white border border-gray-200'
              } transition-all hover:scale-105`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-end justify-center">
                  <span className={`text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-xl ml-2 mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {plan.duration}
                  </span>
                </div>
                <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {plan.exchanges} Exchanges
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    <FaCheck className={`mr-3 text-${plan.color}-400`} />
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(plan.id)}
                disabled={loading === plan.id || (user && user.subscription_tier === plan.id)}
                className={`w-full py-3 rounded-lg font-bold transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                    : `bg-${plan.color}-600 text-white hover:bg-${plan.color}-700`
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === plan.id ? 'Processing...' : user && user.subscription_tier === plan.id ? 'Current Plan' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>

        {!user && (
          <div className="text-center mt-12">
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Need to create an account?{' '}
              <button onClick={() => navigate('/register')} className="text-blue-400 hover:text-blue-300 font-semibold">
                Sign up here
              </button>
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default PricingPage;
