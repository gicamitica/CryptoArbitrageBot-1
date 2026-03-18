"""
ArbitrajZ PDF Guide Generator - Simple Version
"""
from fpdf import FPDF

def generate_guide():
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    
    # Cover Page
    pdf.add_page()
    pdf.set_font('Helvetica', 'B', 32)
    pdf.set_text_color(128, 0, 255)
    pdf.ln(50)
    pdf.cell(0, 20, 'ArbitrajZ', align='C')
    pdf.ln(15)
    pdf.set_font('Helvetica', '', 18)
    pdf.set_text_color(80, 80, 80)
    pdf.cell(0, 10, 'Complete User Guide', align='C')
    pdf.ln(10)
    pdf.set_font('Helvetica', '', 14)
    pdf.cell(0, 10, 'Crypto Arbitrage Trading Platform', align='C')
    pdf.ln(50)
    pdf.set_font('Helvetica', 'I', 10)
    pdf.set_text_color(128, 128, 128)
    pdf.cell(0, 10, 'Version 1.0 - 2026', align='C')
    
    # Chapter 1
    pdf.add_page()
    pdf.set_font('Helvetica', 'B', 16)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 10, '1. What is ArbitrajZ?')
    pdf.ln(10)
    
    pdf.set_font('Helvetica', '', 11)
    pdf.set_text_color(50, 50, 50)
    pdf.multi_cell(0, 6, 
        'ArbitrajZ is a professional crypto arbitrage trading platform that helps you profit from '
        'price differences across multiple cryptocurrency exchanges. Our platform monitors prices '
        'in real-time and identifies profitable arbitrage opportunities automatically.\n\n'
        'Key Features:\n'
        '- Real-time price monitoring across 11+ exchanges\n'
        '- Automatic arbitrage opportunity detection\n'
        '- Secure API key management with encryption\n'
        '- Auto-trading bot for Premium users\n'
        '- Support for 24+ cryptocurrencies'
    )
    
    # Chapter 2
    pdf.ln(10)
    pdf.set_font('Helvetica', 'B', 16)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 10, '2. What is Crypto Arbitrage?')
    pdf.ln(10)
    
    pdf.set_font('Helvetica', '', 11)
    pdf.set_text_color(50, 50, 50)
    pdf.multi_cell(0, 6,
        'Crypto arbitrage is a trading strategy that takes advantage of price differences '
        'for the same cryptocurrency on different exchanges.\n\n'
        'Example: Bitcoin is trading at $67,000 on Binance but $67,500 on Kraken.\n'
        '1. You buy 1 BTC on Binance for $67,000\n'
        '2. You sell 1 BTC on Kraken for $67,500\n'
        '3. Your profit: $500 (minus fees)\n\n'
        'ArbitrajZ automates this process by finding these opportunities for you.'
    )
    
    # Chapter 3
    pdf.add_page()
    pdf.set_font('Helvetica', 'B', 16)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 10, '3. Getting Started')
    pdf.ln(10)
    
    pdf.set_font('Helvetica', '', 11)
    pdf.set_text_color(50, 50, 50)
    pdf.multi_cell(0, 6,
        'Step 1: Create Your Account\n'
        'Visit ArbitrajZ and click "Get Started". Fill in your email, username, and password.\n\n'
        'Step 2: Choose Your Plan\n'
        '- TEST Plan ($1/day) - 2 exchange connections, manual trading\n'
        '- PRO Plan ($29/month) - 5 exchange connections, email alerts\n'
        '- PREMIUM Plan ($99/month) - Unlimited exchanges, auto-trading bot\n\n'
        'Step 3: Connect Your Exchanges\n'
        'Go to Settings > API Keys and add your exchange API credentials.'
    )
    
    # Chapter 4
    pdf.ln(10)
    pdf.set_font('Helvetica', 'B', 16)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 10, '4. Connecting Exchange API Keys')
    pdf.ln(10)
    
    pdf.set_font('Helvetica', 'B', 12)
    pdf.set_text_color(255, 0, 0)
    pdf.cell(0, 8, 'SECURITY FIRST!')
    pdf.ln(8)
    
    pdf.set_font('Helvetica', '', 11)
    pdf.set_text_color(50, 50, 50)
    pdf.multi_cell(0, 6,
        'Your API keys are encrypted using AES-256 encryption before storage. '
        'We strongly recommend:\n'
        '- Create API keys with READ-ONLY permissions\n'
        '- DISABLE withdrawals on your API keys\n'
        '- Use IP whitelist if supported\n'
        '- Create separate API keys just for ArbitrajZ\n\n'
        'How to Get API Keys (Example: Binance):\n'
        '1. Log in to your Binance account\n'
        '2. Go to Account > API Management\n'
        '3. Click "Create API" and label it "ArbitrajZ"\n'
        '4. Enable only "Read" and "Spot Trading"\n'
        '5. DISABLE "Enable Withdrawals"\n'
        '6. Copy API Key and Secret to ArbitrajZ Settings'
    )
    
    # Chapter 5
    pdf.add_page()
    pdf.set_font('Helvetica', 'B', 16)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 10, '5. Using the Dashboard')
    pdf.ln(10)
    
    pdf.set_font('Helvetica', '', 11)
    pdf.set_text_color(50, 50, 50)
    pdf.multi_cell(0, 6,
        'The Dashboard is your command center:\n\n'
        '- Live/Demo Indicator: Shows if data is real or demo\n'
        '- Price Table: Current prices across all exchanges\n'
        '- Opportunities Panel: Best arbitrage opportunities\n'
        '- Quick Stats: Active opportunities, best profit %, balance\n\n'
        'Click on any opportunity to execute the trade.'
    )
    
    # Chapter 6
    pdf.ln(10)
    pdf.set_font('Helvetica', 'B', 16)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 10, '6. Manual Trading')
    pdf.ln(10)
    
    pdf.set_font('Helvetica', '', 11)
    pdf.set_text_color(50, 50, 50)
    pdf.multi_cell(0, 6,
        'How to Execute a Trade:\n'
        '1. Find a profitable opportunity on Dashboard\n'
        '2. Click on it to open Trading page\n'
        '3. Review buy/sell prices and profit\n'
        '4. Enter your trade amount\n'
        '5. Click "Execute Trade"\n\n'
        'Tips:\n'
        '- Start with small amounts to test\n'
        '- Consider exchange fees\n'
        '- Act quickly - opportunities disappear fast'
    )
    
    # Chapter 7
    pdf.add_page()
    pdf.set_font('Helvetica', 'B', 16)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 10, '7. Auto-Trading Bot (Premium Only)')
    pdf.ln(10)
    
    pdf.set_font('Helvetica', '', 11)
    pdf.set_text_color(50, 50, 50)
    pdf.multi_cell(0, 6,
        'The Auto-Trading Bot automatically executes trades when profitable '
        'opportunities are detected.\n\n'
        'Bot Settings:\n'
        '- Minimum Profit %: Only trade if profit exceeds threshold\n'
        '- Max Trade Amount: Maximum USD per trade\n'
        '- Daily Trade Limit: Maximum trades per day\n\n'
        'How to Use:\n'
        '1. Go to Auto-Trading page\n'
        '2. Configure your settings\n'
        '3. Click "Start Bot"\n'
        '4. Monitor trades in History\n'
        '5. Click "Stop Bot" to pause'
    )
    
    # Chapter 8 - FAQ
    pdf.ln(10)
    pdf.set_font('Helvetica', 'B', 16)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 10, '8. FAQ')
    pdf.ln(10)
    
    pdf.set_font('Helvetica', 'B', 11)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 6, 'Q: Is my money safe?')
    pdf.ln(6)
    pdf.set_font('Helvetica', '', 11)
    pdf.set_text_color(50, 50, 50)
    pdf.multi_cell(0, 6,
        'Your funds stay on your exchange accounts. We recommend disabling '
        'withdrawal permissions on API keys.'
    )
    
    pdf.ln(5)
    pdf.set_font('Helvetica', 'B', 11)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 6, 'Q: How much can I earn?')
    pdf.ln(6)
    pdf.set_font('Helvetica', '', 11)
    pdf.set_text_color(50, 50, 50)
    pdf.multi_cell(0, 6,
        'Typical opportunities range from 0.5% to 5%. Results depend on market '
        'conditions and your capital.'
    )
    
    pdf.ln(5)
    pdf.set_font('Helvetica', 'B', 11)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 6, 'Q: Why do I need multiple exchanges?')
    pdf.ln(6)
    pdf.set_font('Helvetica', '', 11)
    pdf.set_text_color(50, 50, 50)
    pdf.multi_cell(0, 6,
        'Arbitrage requires buying on one exchange and selling on another. '
        'You need at least 2 connected exchanges.'
    )
    
    # Final page
    pdf.add_page()
    pdf.ln(40)
    pdf.set_font('Helvetica', 'B', 20)
    pdf.set_text_color(128, 0, 255)
    pdf.cell(0, 15, 'Thank you for choosing ArbitrajZ!', align='C')
    pdf.ln(20)
    pdf.set_font('Helvetica', '', 14)
    pdf.set_text_color(80, 80, 80)
    pdf.cell(0, 10, 'Happy Trading!', align='C')
    pdf.ln(30)
    pdf.set_font('Helvetica', '', 11)
    pdf.cell(0, 8, 'Support: support@arbitrajz.com', align='C')
    
    # Save
    output_path = '/app/frontend/public/ArbitrajZ_User_Guide.pdf'
    pdf.output(output_path)
    print(f'PDF generated: {output_path}')
    return output_path

if __name__ == '__main__':
    generate_guide()
