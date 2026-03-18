import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaCrown, FaRocket } from 'react-icons/fa';

/**
 * UpgradePrompt - Component shown when a feature is locked
 */
const UpgradePrompt = ({ 
  feature = "this feature",
  requiredPlan = "paid",
  currentPlan = "free",
  theme = "dark"
}) => {
  const navigate = useNavigate();

  const planColors = {
    test: 'from-blue-500 to-cyan-500',
    pro: 'from-purple-500 to-pink-500',
    premium: 'from-yellow-500 to-orange-500'
  };

  const planBenefits = {
    test: ['2 Exchange connections', 'Manual trading', 'Real-time data', '24h access'],
    pro: ['5 Exchange connections', 'Email alerts', 'Priority support', 'Advanced analytics'],
    premium: ['Unlimited exchanges', 'Auto-trading bot', 'WhatsApp alerts', '24/7 VIP support']
  };

  return (
    <div className={`min-h-[60vh] flex items-center justify-center p-6`}>
      <div className={`max-w-lg w-full text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-8 shadow-2xl`}>
        {/* Lock Icon */}
        <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <FaLock className="text-4xl text-yellow-500" />
        </div>

        {/* Title */}
        <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Upgrade Required
        </h2>
        
        {/* Description */}
        <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          <span className="capitalize">{feature}</span> is available for <strong className="text-yellow-500">{requiredPlan}</strong> plan subscribers.
          <br />
          Your current plan: <span className={`font-semibold ${
            currentPlan === 'free' ? 'text-gray-400' : 'text-blue-400'
          }`}>{currentPlan.toUpperCase()}</span>
        </p>

        {/* Plan Options */}
        <div className="space-y-3 mb-6">
          {['test', 'pro', 'premium'].map((plan) => (
            <div 
              key={plan}
              className={`p-4 rounded-xl border ${
                theme === 'dark' 
                  ? 'border-gray-700 hover:border-gray-600' 
                  : 'border-gray-200 hover:border-gray-300'
              } transition-all cursor-pointer`}
              onClick={() => navigate('/pricing')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${planColors[plan]} flex items-center justify-center`}>
                    {plan === 'premium' ? <FaCrown className="text-white text-sm" /> : <FaRocket className="text-white text-sm" />}
                  </div>
                  <div className="text-left">
                    <p className={`font-semibold capitalize ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {plan} Plan
                    </p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                      {plan === 'test' ? '$1/day' : plan === 'pro' ? '$29/month' : '$99/month'}
                    </p>
                  </div>
                </div>
                <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {planBenefits[plan][0]}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={() => navigate('/pricing')}
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
        >
          View Pricing Plans
        </button>

        {/* Back Link */}
        <button
          onClick={() => navigate('/dashboard')}
          className={`mt-4 text-sm ${theme === 'dark' ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default UpgradePrompt;
