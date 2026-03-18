import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { FaArrowLeft, FaArrowRight, FaCheckCircle, FaLock, FaRobot, FaChartLine, FaCog, FaPlay } from 'react-icons/fa';

const GuidePage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "Bine ai venit la ArbitrajZ!",
      subtitle: "Ghid complet pentru a începe să faci profit din arbitraj crypto",
      content: (
        <div className="text-center">
          <div className="text-8xl mb-6">🚀</div>
          <p className={`text-lg mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            ArbitrajZ te ajută să profiți de diferențele de preț între exchange-uri.
            <br />Urmează acest ghid pentru a configura totul în <strong>5 minute</strong>.
          </p>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${theme === 'dark' ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'}`}>
            <FaCheckCircle /> Nu ai nevoie de experiență anterioară
          </div>
        </div>
      )
    },
    {
      title: "Pasul 1: Creează-ți contul",
      subtitle: "Înregistrare rapidă în 30 secunde",
      content: (
        <div>
          <div className={`p-6 rounded-xl mb-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="flex items-start gap-4">
              <div className="text-4xl">1️⃣</div>
              <div>
                <h4 className={`font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Click pe "Get Started" sau "Register"
                </h4>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  Găsești butonul pe pagina principală, în colțul dreapta sus.
                </p>
              </div>
            </div>
          </div>
          
          <div className={`p-6 rounded-xl mb-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="flex items-start gap-4">
              <div className="text-4xl">2️⃣</div>
              <div>
                <h4 className={`font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Completează datele
                </h4>
                <ul className={`list-disc list-inside ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li><strong>Email</strong> - pentru notificări</li>
                  <li><strong>Username</strong> - numele tău în platformă</li>
                  <li><strong>Parolă</strong> - minim 6 caractere</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="flex items-start gap-4">
              <div className="text-4xl">3️⃣</div>
              <div>
                <h4 className={`font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Gata! Ești logat automat
                </h4>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  După înregistrare vei fi redirecționat la Dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Pasul 2: Alege un plan",
      subtitle: "3 opțiuni pentru orice buget",
      content: (
        <div>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {/* Test Plan */}
            <div className={`p-4 rounded-xl border-2 ${theme === 'dark' ? 'bg-gray-700 border-blue-500' : 'bg-white border-blue-500'}`}>
              <div className="text-center">
                <span className="text-3xl">🧪</span>
                <h4 className={`font-bold mt-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Test</h4>
                <p className="text-2xl font-bold text-blue-400">$1<span className="text-sm">/zi</span></p>
                <ul className={`text-sm mt-3 space-y-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li>✓ 2 exchange-uri</li>
                  <li>✓ Trading manual</li>
                  <li>✓ Date live</li>
                </ul>
              </div>
            </div>
            
            {/* Pro Plan */}
            <div className={`p-4 rounded-xl border-2 ${theme === 'dark' ? 'bg-gray-700 border-purple-500' : 'bg-white border-purple-500'} relative`}>
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">POPULAR</span>
              </div>
              <div className="text-center">
                <span className="text-3xl">⭐</span>
                <h4 className={`font-bold mt-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Pro</h4>
                <p className="text-2xl font-bold text-purple-400">$29<span className="text-sm">/lună</span></p>
                <ul className={`text-sm mt-3 space-y-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li>✓ 5 exchange-uri</li>
                  <li>✓ Email alerts</li>
                  <li>✓ Priority support</li>
                </ul>
              </div>
            </div>
            
            {/* Premium Plan */}
            <div className={`p-4 rounded-xl border-2 ${theme === 'dark' ? 'bg-gray-700 border-yellow-500' : 'bg-white border-yellow-500'}`}>
              <div className="text-center">
                <span className="text-3xl">👑</span>
                <h4 className={`font-bold mt-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Premium</h4>
                <p className="text-2xl font-bold text-yellow-400">$99<span className="text-sm">/lună</span></p>
                <ul className={`text-sm mt-3 space-y-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li>✓ Unlimited exchanges</li>
                  <li>✓ Auto-Trading Bot 🤖</li>
                  <li>✓ WhatsApp alerts</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className={`p-4 rounded-xl flex items-center gap-3 ${theme === 'dark' ? 'bg-blue-900 bg-opacity-30' : 'bg-blue-50'}`}>
            <span className="text-2xl">💡</span>
            <p className={theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}>
              <strong>Recomandare:</strong> Începe cu planul <strong>Test ($1)</strong> pentru a testa platforma.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Pasul 3: Conectează Exchange-urile",
      subtitle: "Aceasta este partea cea mai importantă!",
      content: (
        <div>
          <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 ${theme === 'dark' ? 'bg-red-900 bg-opacity-30 border border-red-500' : 'bg-red-50 border border-red-300'}`}>
            <FaLock className="text-red-400 text-xl mt-1" />
            <div>
              <h4 className={`font-bold ${theme === 'dark' ? 'text-red-300' : 'text-red-700'}`}>🔒 SECURITATE MAXIMĂ</h4>
              <p className={theme === 'dark' ? 'text-red-200' : 'text-red-600'}>
                Creează chei API cu permisiuni <strong>READ-ONLY</strong> și <strong>FĂRĂ WITHDRAWALS</strong>!
                Astfel, chiar dacă cineva obține cheile, NU poate retrage fonduri.
              </p>
            </div>
          </div>
          
          <h4 className={`font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Cum obții chei API (exemplu Binance):
          </h4>
          
          <div className="space-y-3">
            {[
              "Loghează-te în contul Binance",
              "Mergi la Account → API Management",
              "Click 'Create API' și numește-o 'ArbitrajZ'",
              "Activează DOAR 'Read' și 'Spot Trading'",
              "DEZACTIVEAZĂ 'Enable Withdrawals' ❌",
              "Copiază API Key și Secret",
              "Lipeste-le în Settings → API Keys pe ArbitrajZ"
            ].map((step, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  i === 4 ? 'bg-red-500 text-white' : 'bg-purple-500 text-white'
                }`}>
                  {i + 1}
                </span>
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Pasul 4: Dashboard - Centrul de Comandă",
      subtitle: "Aici vezi totul în timp real",
      content: (
        <div>
          <div className={`p-6 rounded-xl mb-6 ${theme === 'dark' ? 'bg-gradient-to-r from-gray-700 to-gray-800' : 'bg-gradient-to-r from-gray-100 to-gray-200'}`}>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Active Opportunities</p>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>23</p>
              </div>
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Best Profit</p>
                <p className="text-2xl font-bold text-green-400">12.50%</p>
              </div>
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Balance</p>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>$1000</p>
              </div>
            </div>
            <p className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              ↑ Așa arată Dashboard-ul tău
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <h4 className={`font-bold mb-2 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                <span className="text-yellow-400">🟡</span> DEMO DATA
              </h4>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Banner galben = date simulate. Conectează exchange-uri pentru date reale.
              </p>
            </div>
            <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <h4 className={`font-bold mb-2 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                <span className="text-green-400">🟢</span> LIVE DATA
              </h4>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Banner verde = prețuri reale din exchange-urile tale conectate!
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Pasul 5: Execută Trade-uri",
      subtitle: "Fă bani din diferențele de preț",
      content: (
        <div>
          <div className={`p-6 rounded-xl mb-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <h4 className={`font-bold mb-4 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Exemplu de oportunitate:
            </h4>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Cumpără pe</p>
                <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Binance</p>
                <p className="text-xl text-red-400">$67,000</p>
              </div>
              <FaArrowRight className="text-2xl text-purple-400" />
              <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Vinde pe</p>
                <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Kraken</p>
                <p className="text-xl text-green-400">$67,500</p>
              </div>
              <span className="text-3xl">=</span>
              <div className={`p-4 rounded-lg text-center bg-green-500 bg-opacity-20`}>
                <p className="text-sm text-green-300">Profit</p>
                <p className="text-2xl font-bold text-green-400">+$500</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className={`flex items-center gap-3 p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <span className="text-2xl">👆</span>
              <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                Click pe oportunitate din Dashboard
              </span>
            </div>
            <div className={`flex items-center gap-3 p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <span className="text-2xl">💰</span>
              <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                Introdu suma pe care vrei să o tranzacționezi
              </span>
            </div>
            <div className={`flex items-center gap-3 p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <span className="text-2xl">✅</span>
              <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                Apasă "Execute Trade" și gata!
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Pasul 6: Auto-Trading Bot (Premium)",
      subtitle: "Lasă bot-ul să facă bani pentru tine 24/7",
      content: (
        <div>
          <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${theme === 'dark' ? 'bg-purple-900 bg-opacity-30' : 'bg-purple-50'}`}>
            <FaRobot className="text-purple-400 text-3xl" />
            <div>
              <h4 className={`font-bold ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>
                Doar pentru Premium ($99/lună)
              </h4>
              <p className={theme === 'dark' ? 'text-purple-200' : 'text-purple-600'}>
                Bot-ul execută automat trade-uri când găsește oportunități profitabile.
              </p>
            </div>
          </div>
          
          <h4 className={`font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Setări configurabile:</h4>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <FaCog className="text-2xl text-blue-400 mx-auto mb-2" />
              <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Min Profit %</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Ex: 2% - bot-ul ignoră oportunități sub acest prag
              </p>
            </div>
            <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <span className="text-2xl">💵</span>
              <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Max per Trade</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Ex: $100 - limita maximă per tranzacție
              </p>
            </div>
            <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <span className="text-2xl">📊</span>
              <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Daily Limit</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Ex: 10 - maximum trade-uri pe zi
              </p>
            </div>
          </div>
          
          <div className={`p-4 rounded-xl flex items-center justify-center gap-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <button className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold">
              <FaPlay /> Start Bot
            </button>
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>← Un singur click și bot-ul lucrează!</span>
          </div>
        </div>
      )
    },
    {
      title: "Gata! Ești pregătit! 🎉",
      subtitle: "Acum știi tot ce trebuie",
      content: (
        <div className="text-center">
          <div className="text-8xl mb-6">🏆</div>
          <h3 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Felicitări!
          </h3>
          <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Ai învățat cum să folosești ArbitrajZ. Acum e timpul să faci profit!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Creează Cont Gratuit →
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className={`px-8 py-4 rounded-xl font-bold ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}
            >
              Vezi Planurile
            </button>
          </div>
          
          <div className={`mt-8 p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Ai întrebări? Scrie-ne la <strong>support@arbitrajz.com</strong>
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Header */}
      <header className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-10`}>
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            >
              <FaArrowLeft className={theme === 'dark' ? 'text-white' : 'text-gray-900'} />
            </button>
            <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              📚 Ghid ArbitrajZ
            </span>
          </div>
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Pas {activeStep + 1} din {steps.length}
          </span>
        </div>
      </header>

      {/* Progress Bar */}
      <div className={`h-1 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}>
        <div 
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
          style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Content */}
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {steps[activeStep].title}
          </h1>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            {steps[activeStep].subtitle}
          </p>
        </div>

        <div className={`p-6 rounded-2xl mb-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          {steps[activeStep].content}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
            disabled={activeStep === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold disabled:opacity-30 ${
              theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
          >
            <FaArrowLeft /> Înapoi
          </button>
          
          {/* Step indicators */}
          <div className="hidden md:flex gap-2">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === activeStep 
                    ? 'bg-purple-500 w-8' 
                    : i < activeStep 
                      ? 'bg-green-500' 
                      : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
            disabled={activeStep === steps.length - 1}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 disabled:opacity-30"
          >
            Următorul <FaArrowRight />
          </button>
        </div>
      </main>
    </div>
  );
};

export default GuidePage;
