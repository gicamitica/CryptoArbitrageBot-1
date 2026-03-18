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

      {/* Interactive Tutorial Section */}
      <section className="container mx-auto px-6 py-20 bg-gray-900 bg-opacity-50">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            🎓 <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Step-by-Step</span> Setup Guide
          </h2>
          <p className="text-xl text-gray-400">Get started in 5 minutes - Connect your exchange and start profiting!</p>
        </div>

        {/* Video-Style Player */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl border-2 border-blue-500/30">
            
            {/* Video Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">▶️</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">How to Connect Your Exchange API</h3>
                  <p className="text-blue-100 text-sm">Watch this quick tutorial to get started</p>
                </div>
              </div>
              <div className="text-white text-sm font-mono">3:24</div>
            </div>

            {/* Tutorial Content */}
            <div className="p-8">
              
              {/* Tab Navigation */}
              <div className="flex space-x-4 mb-8 border-b border-gray-700">
                <button className="px-6 py-3 text-white font-semibold border-b-2 border-blue-500 bg-blue-500 bg-opacity-10">
                  1️⃣ Create API Key
                </button>
                <button className="px-6 py-3 text-gray-400 font-semibold hover:text-white transition-colors">
                  2️⃣ Connect to ArbitrajZ
                </button>
                <button className="px-6 py-3 text-gray-400 font-semibold hover:text-white transition-colors">
                  3️⃣ Start Trading
                </button>
              </div>

              {/* Step-by-Step Content */}
              <div className="space-y-6">
                
                {/* Step 1 */}
                <div className="flex items-start space-x-4 p-4 bg-gray-700 bg-opacity-30 rounded-xl hover:bg-opacity-50 transition-all cursor-pointer group">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                      1
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-2 flex items-center">
                      Login to Binance.com
                      <span className="ml-3 text-sm bg-blue-500 bg-opacity-20 text-blue-400 px-3 py-1 rounded-full">00:00 - 00:15</span>
                    </h4>
                    <p className="text-gray-400 mb-3">Go to <span className="text-blue-400 font-mono">binance.com</span> and log into your account</p>
                    <div className="flex items-center space-x-2">
                      <div className="px-3 py-1 bg-yellow-500 bg-opacity-20 rounded text-yellow-400 text-sm">🔗 binance.com</div>
                      <div className="text-gray-500 text-sm">→ Click "Login" → Enter credentials</div>
                    </div>
                  </div>
                  <div className="text-3xl opacity-0 group-hover:opacity-100 transition-opacity">🌐</div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start space-x-4 p-4 bg-gray-700 bg-opacity-30 rounded-xl hover:bg-opacity-50 transition-all cursor-pointer group">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                      2
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-2 flex items-center">
                      Navigate to API Management
                      <span className="ml-3 text-sm bg-purple-500 bg-opacity-20 text-purple-400 px-3 py-1 rounded-full">00:16 - 00:35</span>
                    </h4>
                    <p className="text-gray-400 mb-3">Go to Profile → API Management → Create API</p>
                    <div className="flex items-center space-x-2">
                      <div className="text-gray-500 text-sm">Profile Icon → API Management → "Create API"</div>
                    </div>
                  </div>
                  <div className="text-3xl opacity-0 group-hover:opacity-100 transition-opacity">⚙️</div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start space-x-4 p-4 bg-gray-700 bg-opacity-30 rounded-xl hover:bg-opacity-50 transition-all cursor-pointer group">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                      3
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-2 flex items-center">
                      Name Your API Key
                      <span className="ml-3 text-sm bg-pink-500 bg-opacity-20 text-pink-400 px-3 py-1 rounded-full">00:36 - 00:50</span>
                    </h4>
                    <p className="text-gray-400 mb-3">Enter a name like "ArbitrajZ Trading Bot"</p>
                    <div className="p-3 bg-gray-800 rounded-lg border border-gray-600 font-mono text-sm text-gray-300">
                      Label: <span className="text-blue-400">ArbitrajZ Trading Bot</span>
                    </div>
                  </div>
                  <div className="text-3xl opacity-0 group-hover:opacity-100 transition-opacity">✏️</div>
                </div>

                {/* Step 4 - CRITICAL */}
                <div className="flex items-start space-x-4 p-4 bg-red-900 bg-opacity-20 rounded-xl border-2 border-red-500/30 hover:border-red-500/50 transition-all cursor-pointer group">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform animate-pulse">
                      4
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-2 flex items-center">
                      🚨 Set Permissions Correctly (CRITICAL!)
                      <span className="ml-3 text-sm bg-red-500 bg-opacity-30 text-red-400 px-3 py-1 rounded-full font-bold">00:51 - 01:30</span>
                    </h4>
                    <p className="text-gray-300 mb-4 font-semibold">This is the MOST IMPORTANT step for your security!</p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-green-500 bg-opacity-10 rounded-lg border border-green-500">
                        <h5 className="text-green-400 font-bold mb-2 flex items-center">
                          ✅ ENABLE These:
                        </h5>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center text-gray-300">
                            <span className="text-green-400 mr-2">✓</span> Read Information
                          </li>
                          <li className="flex items-center text-gray-300">
                            <span className="text-green-400 mr-2">✓</span> Enable Spot & Margin Trading
                          </li>
                        </ul>
                      </div>
                      
                      <div className="p-4 bg-red-500 bg-opacity-10 rounded-lg border border-red-500">
                        <h5 className="text-red-400 font-bold mb-2 flex items-center">
                          ❌ DISABLE These:
                        </h5>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center text-gray-300">
                            <span className="text-red-400 mr-2">✗</span> Enable Withdrawals (NEVER!)
                          </li>
                          <li className="flex items-center text-gray-300">
                            <span className="text-red-400 mr-2">✗</span> Enable Internal Transfer
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-3 p-3 bg-yellow-500 bg-opacity-10 rounded-lg border border-yellow-500/30">
                      <p className="text-yellow-400 text-sm font-semibold">
                        ⚠️ With these settings, the API can ONLY read prices and execute trades. 
                        It CANNOT withdraw your crypto!
                      </p>
                    </div>
                  </div>
                  <div className="text-3xl opacity-0 group-hover:opacity-100 transition-opacity">🛡️</div>
                </div>

                {/* Step 5 */}
                <div className="flex items-start space-x-4 p-4 bg-gray-700 bg-opacity-30 rounded-xl hover:bg-opacity-50 transition-all cursor-pointer group">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                      5
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-2 flex items-center">
                      Copy Your API Key & Secret
                      <span className="ml-3 text-sm bg-green-500 bg-opacity-20 text-green-400 px-3 py-1 rounded-full">01:31 - 02:00</span>
                    </h4>
                    <p className="text-gray-400 mb-3">Click "Create" and copy both your API Key and Secret Key</p>
                    <div className="space-y-2">
                      <div className="p-3 bg-gray-800 rounded-lg border border-gray-600">
                        <div className="text-xs text-gray-500 mb-1">API Key:</div>
                        <div className="font-mono text-sm text-gray-300 flex items-center justify-between">
                          <span>xyz123abc456def789...</span>
                          <span className="text-blue-400 cursor-pointer">📋 Copy</span>
                        </div>
                      </div>
                      <div className="p-3 bg-gray-800 rounded-lg border border-gray-600">
                        <div className="text-xs text-gray-500 mb-1">API Secret:</div>
                        <div className="font-mono text-sm text-gray-300 flex items-center justify-between">
                          <span>•••••••••••••••••••</span>
                          <span className="text-blue-400 cursor-pointer">📋 Copy</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-yellow-400 text-sm mt-3">
                      ⚠️ Keep your Secret Key safe! You can only see it once.
                    </p>
                  </div>
                  <div className="text-3xl opacity-0 group-hover:opacity-100 transition-opacity">📋</div>
                </div>

                {/* Step 6 */}
                <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-900 to-purple-900 bg-opacity-30 rounded-xl border-2 border-blue-500/50 hover:border-blue-500 transition-all cursor-pointer group">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                      6
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-2 flex items-center">
                      Connect to ArbitrajZ 🚀
                      <span className="ml-3 text-sm bg-blue-500 bg-opacity-30 text-blue-400 px-3 py-1 rounded-full">02:01 - 02:45</span>
                    </h4>
                    <p className="text-gray-400 mb-3">Go to ArbitrajZ → Settings → API Keys → Add Exchange</p>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">1.</span>
                        <span className="text-gray-300">Select "Binance" from dropdown</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">2.</span>
                        <span className="text-gray-300">Paste your API Key</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">3.</span>
                        <span className="text-gray-300">Paste your API Secret</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">4.</span>
                        <span className="text-gray-300">Click "Test Connection"</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">5.</span>
                        <span className="text-green-400 font-semibold">✓ Connected successfully!</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-3xl opacity-0 group-hover:opacity-100 transition-opacity">🔗</div>
                </div>

                {/* Step 7 - Final */}
                <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-green-900 to-emerald-900 bg-opacity-30 rounded-xl border-2 border-green-500/50">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg animate-pulse">
                      ✓
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-white mb-2 flex items-center">
                      🎉 You're Ready to Trade!
                      <span className="ml-3 text-sm bg-green-500 bg-opacity-30 text-green-400 px-3 py-1 rounded-full">02:46 - 03:24</span>
                    </h4>
                    <p className="text-gray-300 mb-4">ArbitrajZ is now monitoring prices and will alert you of profitable opportunities!</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-green-500 bg-opacity-10 rounded-lg">
                        <div className="text-2xl mb-1">✅</div>
                        <div className="text-sm text-green-400 font-semibold">Connected</div>
                      </div>
                      <div className="text-center p-3 bg-blue-500 bg-opacity-10 rounded-lg">
                        <div className="text-2xl mb-1">📊</div>
                        <div className="text-sm text-blue-400 font-semibold">Monitoring</div>
                      </div>
                      <div className="text-center p-3 bg-purple-500 bg-opacity-10 rounded-lg">
                        <div className="text-2xl mb-1">💰</div>
                        <div className="text-sm text-purple-400 font-semibold">Ready!</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Video Footer / Progress Bar */}
            <div className="bg-gray-800 p-4 border-t border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Tutorial Progress</span>
                <span className="text-gray-400 text-sm">7 / 7 Steps</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 h-2 rounded-full" style={{width: '100%'}}></div>
              </div>
            </div>

          </div>

          {/* CTA Below Tutorial */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-2xl"
            >
              🚀 Start Your Free Account Now
            </button>
            <p className="text-gray-400 text-sm mt-3">No credit card required • Setup in 5 minutes</p>
          </div>

          {/* Additional Resources */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-800 bg-opacity-50 rounded-xl">
              <div className="text-4xl mb-3">📹</div>
              <h4 className="text-white font-bold mb-2">Video Tutorial</h4>
              <p className="text-gray-400 text-sm mb-3">Watch the full video on YouTube</p>
              <a href="#" className="text-blue-400 hover:text-blue-300 text-sm font-semibold">Coming Soon →</a>
            </div>
            
            <div className="text-center p-6 bg-gray-800 bg-opacity-50 rounded-xl">
              <div className="text-4xl mb-3">📚</div>
              <h4 className="text-white font-bold mb-2">PDF Guide</h4>
              <p className="text-gray-400 text-sm mb-3">Download step-by-step PDF</p>
              <a 
                href="/ArbitrajZ_User_Guide.pdf" 
                download="ArbitrajZ_User_Guide.pdf"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold transition-colors"
              >
                Download PDF →
              </a>
            </div>
            
            <div className="text-center p-6 bg-gray-800 bg-opacity-50 rounded-xl">
              <div className="text-4xl mb-3">💬</div>
              <h4 className="text-white font-bold mb-2">Need Help?</h4>
              <p className="text-gray-400 text-sm mb-3">Chat with our support team</p>
              <a href="#" className="text-blue-400 hover:text-blue-300 text-sm font-semibold">Get Support →</a>
            </div>
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
