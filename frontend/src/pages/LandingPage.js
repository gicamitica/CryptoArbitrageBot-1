import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBitcoin, FaChartLine, FaRobot, FaShieldAlt } from 'react-icons/fa';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img src="/arbitrajz-logo.jpg" alt="ArbitrajZ Logo" className="h-12 w-12 rounded-full" />
          <span className="text-2xl font-bold text-white">ArbitrajZ</span>
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
            <p className="text-gray-400">Track prices across 11+ major exchanges instantly</p>
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
            <h3 className="text-xl font-bold text-white mb-2">24 Cryptocurrencies</h3>
            <p className="text-gray-400">Support for BTC, ETH, and 22 more coins</p>
          </div>
        </div>
      </section>

      {/* Supported Cryptocurrencies */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Supported <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Cryptocurrencies</span>
          </h2>
          <p className="text-xl text-gray-400">Monitor and trade 24 top cryptocurrencies across multiple exchanges</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { symbol: 'BTC', name: 'Bitcoin', emoji: '₿' },
            { symbol: 'ETH', name: 'Ethereum', emoji: 'Ξ' },
            { symbol: 'BNB', name: 'Binance', emoji: '🔶' },
            { symbol: 'SOL', name: 'Solana', emoji: '◎' },
            { symbol: 'ADA', name: 'Cardano', emoji: '₳' },
            { symbol: 'XRP', name: 'Ripple', emoji: '✕' },
            { symbol: 'DOT', name: 'Polkadot', emoji: '●' },
            { symbol: 'AVAX', name: 'Avalanche', emoji: '🔺' },
            { symbol: 'MATIC', name: 'Polygon', emoji: '⬡' },
            { symbol: 'UNI', name: 'Uniswap', emoji: '🦄' },
            { symbol: 'LINK', name: 'Chainlink', emoji: '🔗' },
            { symbol: 'LTC', name: 'Litecoin', emoji: 'Ł' },
            { symbol: 'ATOM', name: 'Cosmos', emoji: '⚛' },
            { symbol: 'ALGO', name: 'Algorand', emoji: '◬' },
            { symbol: 'FTM', name: 'Fantom', emoji: '👻' },
            { symbol: 'SAND', name: 'Sandbox', emoji: '🏖' },
            { symbol: 'MANA', name: 'Decentraland', emoji: '🌐' },
            { symbol: 'AAVE', name: 'Aave', emoji: '👻' },
            { symbol: 'DOGE', name: 'Dogecoin', emoji: '🐕' },
            { symbol: 'SHIB', name: 'Shiba Inu', emoji: '🐶' },
            { symbol: 'APT', name: 'Aptos', emoji: '🔷' },
            { symbol: 'OP', name: 'Optimism', emoji: '🔴' },
            { symbol: 'ARB', name: 'Arbitrum', emoji: '🔵' },
            { symbol: 'SUI', name: 'Sui', emoji: '💧' },
          ].map((coin, idx) => (
            <div
              key={coin.symbol}
              className="bg-gray-800 bg-opacity-30 backdrop-blur-sm p-4 rounded-xl text-center hover:transform hover:scale-110 hover:bg-opacity-50 transition-all cursor-pointer border border-gray-700 border-opacity-30 hover:border-blue-400 hover:border-opacity-100 hover:shadow-lg hover:shadow-blue-500/20"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="text-3xl mb-2">{coin.emoji}</div>
              <div className="text-lg font-bold text-white">{coin.symbol}</div>
              <div className="text-xs text-gray-400">{coin.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Supported Exchanges */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Powered by <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">11 Major Exchanges</span>
          </h2>
          <p className="text-xl text-gray-400">Access the best prices across the world's leading crypto exchanges</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[
            { name: 'Binance', icon: '🟡', tagline: 'World\'s Largest' },
            { name: 'Coinbase', icon: '🔵', tagline: 'Most Trusted' },
            { name: 'Kraken', icon: '🟣', tagline: 'Secure Trading' },
            { name: 'Bybit', icon: '🟠', tagline: 'Advanced Trading' },
            { name: 'OKX', icon: '⚫', tagline: 'Global Platform' },
            { name: 'KuCoin', icon: '🟢', tagline: 'People\'s Exchange' },
            { name: 'Gate.io', icon: '🔷', tagline: 'Altcoin Heaven' },
            { name: 'Huobi', icon: '🔶', tagline: 'Professional Grade' },
            { name: 'Gemini', icon: '💎', tagline: 'NY Regulated' },
            { name: 'Bitfinex', icon: '🟩', tagline: 'Liquidity Leader' },
            { name: 'Crypto.com', icon: '⚪', tagline: 'Fortune Favors' },
          ].map((exchange, idx) => (
            <div
              key={exchange.name}
              className="bg-gray-800 bg-opacity-70 backdrop-blur-lg p-6 rounded-xl hover:transform hover:scale-105 transition-all cursor-pointer border-2 border-transparent hover:border-purple-500"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-4xl">{exchange.icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-white">{exchange.name}</h3>
                  <p className="text-xs text-gray-400">{exchange.tagline}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Exchange Stats */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 rounded-xl text-center">
            <div className="text-4xl font-bold text-white mb-2">264</div>
            <div className="text-gray-200">Price Points Monitored</div>
            <div className="text-xs text-gray-300 mt-1">24 coins × 11 exchanges</div>
          </div>
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 rounded-xl text-center">
            <div className="text-4xl font-bold text-white mb-2">5s</div>
            <div className="text-gray-200">Real-Time Updates</div>
            <div className="text-xs text-gray-300 mt-1">Instant price synchronization</div>
          </div>
          <div className="bg-gradient-to-r from-pink-600 to-pink-800 p-6 rounded-xl text-center">
            <div className="text-4xl font-bold text-white mb-2">20+</div>
            <div className="text-gray-200">Daily Opportunities</div>
            <div className="text-xs text-gray-300 mt-1">Arbitrage chances detected</div>
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

      {/* How Crypto Arbitrage Works - Visual Tutorial */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Crypto Arbitrage</span> Works
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover profit opportunities by exploiting price differences across multiple exchanges
          </p>
        </div>

        {/* Visual Flow Diagram */}
        <div className="relative max-w-6xl mx-auto">
          {/* Connection Lines */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-30 transform -translate-y-1/2"></div>
          
          <div className="grid md:grid-cols-4 gap-8 relative z-10">
            {/* Step 1: Scan */}
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 w-32 h-32 rounded-2xl mx-auto mb-6 flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/20"></div>
                <div className="relative">
                  <div className="text-5xl mb-2">🔍</div>
                  <div className="text-2xl font-bold text-white">01</div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Scan Prices</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Our system monitors <span className="text-blue-400 font-semibold">264 price points</span> across 11 exchanges in real-time
              </p>
              <div className="mt-4 flex justify-center space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>

            {/* Step 2: Detect */}
            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 w-32 h-32 rounded-2xl mx-auto mb-6 flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/20"></div>
                <div className="relative">
                  <div className="text-5xl mb-2">⚡</div>
                  <div className="text-2xl font-bold text-white">02</div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Detect Opportunity</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                AI algorithm finds <span className="text-purple-400 font-semibold">price differences</span> between exchanges instantly
              </p>
              <div className="mt-4 space-y-1">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-xs text-gray-500">Binance</span>
                  <span className="text-green-400 font-bold">$45,200</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-xs text-gray-500">Kraken</span>
                  <span className="text-red-400 font-bold">$44,800</span>
                </div>
              </div>
            </div>

            {/* Step 3: Execute */}
            <div className="text-center group">
              <div className="bg-gradient-to-br from-pink-600 to-pink-800 w-32 h-32 rounded-2xl mx-auto mb-6 flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/20"></div>
                <div className="relative">
                  <div className="text-5xl mb-2">🔄</div>
                  <div className="text-2xl font-bold text-white">03</div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Execute Trade</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                <span className="text-pink-400 font-semibold">Buy low</span> on one exchange, <span className="text-pink-400 font-semibold">sell high</span> on another simultaneously
              </p>
              <div className="mt-4 flex justify-center items-center space-x-2">
                <div className="px-3 py-1 bg-green-500 bg-opacity-20 rounded-full text-green-400 text-xs font-bold">BUY</div>
                <div>↔️</div>
                <div className="px-3 py-1 bg-red-500 bg-opacity-20 rounded-full text-red-400 text-xs font-bold">SELL</div>
              </div>
            </div>

            {/* Step 4: Profit */}
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-600 to-green-800 w-32 h-32 rounded-2xl mx-auto mb-6 flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/20"></div>
                <div className="relative">
                  <div className="text-5xl mb-2">💰</div>
                  <div className="text-2xl font-bold text-white">04</div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Earn Profit</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Keep the <span className="text-green-400 font-semibold">profit difference</span> with zero market risk
              </p>
              <div className="mt-4">
                <div className="text-3xl font-bold text-green-400">+0.88%</div>
                <div className="text-xs text-gray-500 mt-1">Instant Profit</div>
              </div>
            </div>
          </div>
        </div>

        {/* Example Calculation Box */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border-2 border-blue-500/30 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              💡 Real Example
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-700 bg-opacity-50 rounded-xl">
                <div className="text-sm text-gray-400 mb-2">Buy on Kraken</div>
                <div className="text-3xl font-bold text-white mb-1">$44,800</div>
                <div className="text-xs text-gray-500">1 BTC</div>
              </div>

              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">→</div>
                  <div className="text-sm text-purple-400 font-semibold">Arbitrage</div>
                </div>
              </div>

              <div className="text-center p-4 bg-gray-700 bg-opacity-50 rounded-xl">
                <div className="text-sm text-gray-400 mb-2">Sell on Binance</div>
                <div className="text-3xl font-bold text-white mb-1">$45,200</div>
                <div className="text-xs text-gray-500">1 BTC</div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Your Profit:</span>
                <span className="text-3xl font-bold text-green-400">+$400</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-400 text-sm">Return:</span>
                <span className="text-xl font-bold text-green-400">+0.88%</span>
              </div>
              <div className="mt-4 text-center text-xs text-gray-500">
                * Example calculation. Actual profits vary based on market conditions and fees.
              </div>
            </div>
          </div>
        </div>

        {/* Why It Works */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gray-800 bg-opacity-50 rounded-xl backdrop-blur-sm">
            <div className="text-4xl mb-4">🌐</div>
            <h4 className="text-lg font-bold text-white mb-2">Market Inefficiency</h4>
            <p className="text-sm text-gray-400">Prices differ across exchanges due to liquidity, demand, and timing</p>
          </div>

          <div className="text-center p-6 bg-gray-800 bg-opacity-50 rounded-xl backdrop-blur-sm">
            <div className="text-4xl mb-4">⚡</div>
            <h4 className="text-lg font-bold text-white mb-2">Speed Advantage</h4>
            <p className="text-sm text-gray-400">Our system detects and acts on opportunities in milliseconds</p>
          </div>

          <div className="text-center p-6 bg-gray-800 bg-opacity-50 rounded-xl backdrop-blur-sm">
            <div className="text-4xl mb-4">🛡️</div>
            <h4 className="text-lg font-bold text-white mb-2">Zero Market Risk</h4>
            <p className="text-sm text-gray-400">Simultaneous buy/sell eliminates exposure to price movements</p>
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
        <p>&copy; 2025 ArbitrajZ. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
