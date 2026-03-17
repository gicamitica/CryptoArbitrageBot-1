import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBitcoin, FaChartLine, FaRobot, FaShieldAlt } from 'react-icons/fa';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FaBitcoin className="text-4xl text-yellow-400" />
          <span className="text-2xl font-bold text-white">CryptoArb</span>
        </div>
        <div className="space-x-4">
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 text-white hover:text-blue-400 transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Maximize Your Crypto Profits
          <br />
          <span className="text-blue-400">with AI-Powered Arbitrage</span>
        </h1>
        <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
          Discover profitable arbitrage opportunities across multiple exchanges in real-time.
          Automated trading with zero risk.
        </p>
        <button
          onClick={() => navigate('/register')}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
        >
          Start Trading Now →
        </button>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg p-8 rounded-xl text-center hover:transform hover:scale-105 transition-all">
            <FaChartLine className="text-5xl text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Real-Time Monitoring</h3>
            <p className="text-gray-400">Track prices across 5+ major exchanges instantly</p>
          </div>
          
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg p-8 rounded-xl text-center hover:transform hover:scale-105 transition-all">
            <FaRobot className="text-5xl text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Auto Trading</h3>
            <p className="text-gray-400">Execute trades automatically when opportunities arise</p>
          </div>
          
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg p-8 rounded-xl text-center hover:transform hover:scale-105 transition-all">
            <FaShieldAlt className="text-5xl text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Secure & Safe</h3>
            <p className="text-gray-400">Bank-level security with encrypted transactions</p>
          </div>
          
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg p-8 rounded-xl text-center hover:transform hover:scale-105 transition-all">
            <FaBitcoin className="text-5xl text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Multiple Coins</h3>
            <p className="text-gray-400">Support for BTC, ETH, BNB, SOL and more</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-5xl font-bold text-blue-400 mb-2">$2.5M+</div>
            <div className="text-gray-400">Total Trading Volume</div>
          </div>
          <div>
            <div className="text-5xl font-bold text-purple-400 mb-2">10K+</div>
            <div className="text-gray-400">Active Traders</div>
          </div>
          <div>
            <div className="text-5xl font-bold text-green-400 mb-2">99.9%</div>
            <div className="text-gray-400">Uptime</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">Ready to Start?</h2>
        <p className="text-xl text-gray-300 mb-8">Join thousands of traders maximizing their profits</p>
        <button
          onClick={() => navigate('/register')}
          className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Free Account
        </button>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 text-center text-gray-400 border-t border-gray-800">
        <p>&copy; 2025 CryptoArb. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
