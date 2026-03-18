"""
Real Exchange Data Service
Fetches live price data from exchanges using stored API keys
"""
import ccxt
import asyncio
from typing import List, Dict, Optional
from datetime import datetime, timezone
import logging
from motor.motor_asyncio import AsyncIOMotorClient
from cryptography.fernet import Fernet
import os
import hashlib
import base64

logger = logging.getLogger(__name__)

# Encryption setup
def get_encryption_key():
    JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key')
    key = hashlib.sha256(JWT_SECRET.encode()).digest()
    return base64.urlsafe_b64encode(key)

fernet = Fernet(get_encryption_key())

def decrypt_key(encrypted_key: str) -> str:
    return fernet.decrypt(encrypted_key.encode()).decode()

# CCXT exchange mapping
CCXT_EXCHANGE_MAP = {
    "binance": "binance",
    "kraken": "kraken",
    "coinbase": "coinbase",
    "kucoin": "kucoin",
    "bitfinex": "bitfinex",
    "bybit": "bybit",
    "okx": "okx",
    "gateio": "gateio",
    "huobi": "huobi",
    "gemini": "gemini",
    "crypto_com": "cryptocom",
}

# Exchange display names
EXCHANGE_NAMES = {
    "binance": "Binance",
    "kraken": "Kraken",
    "coinbase": "Coinbase",
    "kucoin": "KuCoin",
    "bitfinex": "Bitfinex",
    "bybit": "Bybit",
    "okx": "OKX",
    "gateio": "Gate.io",
    "huobi": "Huobi",
    "gemini": "Gemini",
    "crypto_com": "Crypto.com",
}

# Popular trading pairs to fetch
TRADING_PAIRS = [
    "BTC/USDT", "ETH/USDT", "BNB/USDT", "SOL/USDT", "ADA/USDT",
    "XRP/USDT", "DOT/USDT", "AVAX/USDT", "MATIC/USDT", "UNI/USDT",
    "LINK/USDT", "LTC/USDT", "ATOM/USDT", "ALGO/USDT", "FTM/USDT",
    "SAND/USDT", "MANA/USDT", "AAVE/USDT", "DOGE/USDT", "SHIB/USDT",
    "APT/USDT", "OP/USDT", "ARB/USDT", "SUI/USDT"
]

# Symbol name mapping
SYMBOL_NAMES = {
    "BTC": "Bitcoin", "ETH": "Ethereum", "BNB": "Binance Coin", "SOL": "Solana",
    "ADA": "Cardano", "XRP": "Ripple", "DOT": "Polkadot", "AVAX": "Avalanche",
    "MATIC": "Polygon", "UNI": "Uniswap", "LINK": "Chainlink", "LTC": "Litecoin",
    "ATOM": "Cosmos", "ALGO": "Algorand", "FTM": "Fantom", "SAND": "The Sandbox",
    "MANA": "Decentraland", "AAVE": "Aave", "DOGE": "Dogecoin", "SHIB": "Shiba Inu",
    "APT": "Aptos", "OP": "Optimism", "ARB": "Arbitrum", "SUI": "Sui"
}


class ExchangeService:
    """Service to fetch real data from exchanges"""
    
    def __init__(self, db):
        self.db = db
        self._exchange_instances = {}
    
    async def get_user_exchanges(self, user_id: str) -> List[Dict]:
        """Get user's connected exchanges with decrypted keys"""
        keys = await self.db.api_keys.find(
            {"user_id": user_id, "is_valid": True}
        ).to_list(100)
        
        exchanges = []
        for key in keys:
            try:
                exchanges.append({
                    "exchange_id": key["exchange_id"],
                    "api_key": decrypt_key(key["api_key_encrypted"]),
                    "api_secret": decrypt_key(key["api_secret_encrypted"]),
                    "passphrase": decrypt_key(key["passphrase_encrypted"]) if key.get("passphrase_encrypted") else None
                })
            except Exception as e:
                logger.error(f"Failed to decrypt key for {key['exchange_id']}: {e}")
        
        return exchanges
    
    def create_exchange_instance(self, exchange_id: str, api_key: str, api_secret: str, passphrase: str = None):
        """Create a ccxt exchange instance"""
        ccxt_id = CCXT_EXCHANGE_MAP.get(exchange_id)
        if not ccxt_id:
            return None
        
        try:
            exchange_class = getattr(ccxt, ccxt_id)
            config = {
                'apiKey': api_key,
                'secret': api_secret,
                'enableRateLimit': True,
                'timeout': 15000,
            }
            if passphrase:
                config['password'] = passphrase
            
            return exchange_class(config)
        except Exception as e:
            logger.error(f"Failed to create exchange instance for {exchange_id}: {e}")
            return None
    
    async def fetch_ticker(self, exchange, symbol: str) -> Optional[Dict]:
        """Fetch ticker data for a symbol from an exchange"""
        try:
            loop = asyncio.get_event_loop()
            ticker = await loop.run_in_executor(None, exchange.fetch_ticker, symbol)
            return ticker
        except Exception as e:
            logger.debug(f"Failed to fetch {symbol} from {exchange.id}: {e}")
            return None
    
    async def fetch_prices_from_exchange(self, exchange_config: Dict) -> List[Dict]:
        """Fetch all prices from a single exchange"""
        exchange = self.create_exchange_instance(
            exchange_config["exchange_id"],
            exchange_config["api_key"],
            exchange_config["api_secret"],
            exchange_config.get("passphrase")
        )
        
        if not exchange:
            return []
        
        prices = []
        exchange_name = EXCHANGE_NAMES.get(exchange_config["exchange_id"], exchange_config["exchange_id"])
        
        # Fetch tickers in parallel with rate limiting
        tasks = []
        for pair in TRADING_PAIRS:
            tasks.append(self.fetch_ticker(exchange, pair))
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        for i, result in enumerate(results):
            if isinstance(result, dict) and result:
                pair = TRADING_PAIRS[i]
                symbol = pair.split('/')[0]
                
                prices.append({
                    "symbol": symbol,
                    "name": SYMBOL_NAMES.get(symbol, symbol),
                    "price_usd": result.get('last', 0) or result.get('close', 0) or 0,
                    "change_24h": result.get('percentage', 0) or 0,
                    "volume_24h": result.get('quoteVolume', 0) or 0,
                    "exchange": exchange_name,
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "is_live": True
                })
        
        return prices
    
    async def fetch_all_live_prices(self, user_id: str) -> List[Dict]:
        """Fetch prices from all user's connected exchanges"""
        exchanges = await self.get_user_exchanges(user_id)
        
        if not exchanges:
            return []
        
        all_prices = []
        
        # Fetch from each exchange
        for exchange_config in exchanges:
            try:
                prices = await self.fetch_prices_from_exchange(exchange_config)
                all_prices.extend(prices)
            except Exception as e:
                logger.error(f"Error fetching from {exchange_config['exchange_id']}: {e}")
        
        return all_prices
    
    async def get_user_connected_exchange_count(self, user_id: str) -> int:
        """Get count of user's valid connected exchanges"""
        count = await self.db.api_keys.count_documents({
            "user_id": user_id,
            "is_valid": True
        })
        return count

    async def fetch_balance_from_exchange(self, exchange_config: Dict) -> Dict:
        """Fetch balance from a single exchange"""
        exchange = self.create_exchange_instance(
            exchange_config["exchange_id"],
            exchange_config["api_key"],
            exchange_config["api_secret"],
            exchange_config.get("passphrase")
        )
        
        if not exchange:
            return {"exchange": exchange_config["exchange_id"], "balances": [], "total_usd": 0, "error": "Failed to create exchange instance"}
        
        exchange_name = EXCHANGE_NAMES.get(exchange_config["exchange_id"], exchange_config["exchange_id"])
        
        try:
            loop = asyncio.get_event_loop()
            balance = await loop.run_in_executor(None, exchange.fetch_balance)
            
            # Get non-zero balances
            non_zero_balances = []
            total_usd = 0
            
            if balance and 'total' in balance:
                for currency, amount in balance['total'].items():
                    if amount and amount > 0:
                        non_zero_balances.append({
                            "currency": currency,
                            "amount": amount,
                            "free": balance.get('free', {}).get(currency, 0),
                            "used": balance.get('used', {}).get(currency, 0)
                        })
            
            # Try to get USD value for major coins
            try:
                tickers = await loop.run_in_executor(None, exchange.fetch_tickers, ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT', 'XRP/USDT'])
                
                price_map = {}
                for symbol, ticker in tickers.items():
                    base = symbol.split('/')[0]
                    price_map[base] = ticker.get('last', 0) or 0
                
                # Calculate total USD value
                for bal in non_zero_balances:
                    currency = bal['currency']
                    amount = bal['amount']
                    
                    if currency in ['USDT', 'USD', 'USDC', 'BUSD', 'DAI']:
                        bal['usd_value'] = amount
                        total_usd += amount
                    elif currency in price_map:
                        usd_val = amount * price_map[currency]
                        bal['usd_value'] = usd_val
                        total_usd += usd_val
                    else:
                        # Try to fetch individual ticker
                        try:
                            ticker = await loop.run_in_executor(None, exchange.fetch_ticker, f"{currency}/USDT")
                            if ticker and ticker.get('last'):
                                usd_val = amount * ticker['last']
                                bal['usd_value'] = usd_val
                                total_usd += usd_val
                        except:
                            bal['usd_value'] = 0  # Unknown USD value
                            
            except Exception as e:
                logger.debug(f"Failed to fetch tickers for USD conversion: {e}")
            
            return {
                "exchange": exchange_name,
                "exchange_id": exchange_config["exchange_id"],
                "balances": non_zero_balances,
                "total_usd": total_usd,
                "error": None
            }
            
        except Exception as e:
            logger.error(f"Failed to fetch balance from {exchange_name}: {e}")
            return {
                "exchange": exchange_name,
                "exchange_id": exchange_config["exchange_id"],
                "balances": [],
                "total_usd": 0,
                "error": str(e)[:100]
            }

    async def fetch_total_balance(self, user_id: str) -> Dict:
        """Fetch total balance from all user's connected exchanges"""
        exchanges = await self.get_user_exchanges(user_id)
        
        if not exchanges:
            return {
                "is_live": False,
                "total_usd": 0,
                "exchanges": [],
                "message": "No exchanges connected"
            }
        
        exchange_balances = []
        grand_total_usd = 0
        
        for exchange_config in exchanges:
            try:
                balance_data = await self.fetch_balance_from_exchange(exchange_config)
                exchange_balances.append(balance_data)
                grand_total_usd += balance_data.get("total_usd", 0)
            except Exception as e:
                logger.error(f"Error fetching balance from {exchange_config['exchange_id']}: {e}")
                exchange_balances.append({
                    "exchange": EXCHANGE_NAMES.get(exchange_config["exchange_id"], exchange_config["exchange_id"]),
                    "exchange_id": exchange_config["exchange_id"],
                    "balances": [],
                    "total_usd": 0,
                    "error": str(e)[:100]
                })
        
        return {
            "is_live": True,
            "total_usd": grand_total_usd,
            "exchanges": exchange_balances,
            "connected_count": len(exchanges),
            "message": f"Live balance from {len(exchanges)} exchange(s)"
        }


# Public data fetcher (no API key needed - for demo/preview)
class PublicExchangeService:
    """Fetch public data without API keys (limited but works for demo)"""
    
    @staticmethod
    async def fetch_public_prices(exchanges_to_fetch: List[str] = None) -> List[Dict]:
        """Fetch public ticker data from exchanges (no auth needed)"""
        if not exchanges_to_fetch:
            exchanges_to_fetch = ["binance", "kraken", "coinbase"]
        
        all_prices = []
        
        for exchange_id in exchanges_to_fetch[:3]:  # Limit to 3 exchanges for speed
            ccxt_id = CCXT_EXCHANGE_MAP.get(exchange_id, exchange_id)
            
            try:
                exchange_class = getattr(ccxt, ccxt_id, None)
                if not exchange_class:
                    continue
                
                exchange = exchange_class({
                    'enableRateLimit': True,
                    'timeout': 10000,
                })
                
                exchange_name = EXCHANGE_NAMES.get(exchange_id, exchange_id)
                
                # Fetch a few key pairs
                key_pairs = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "BNB/USDT", "XRP/USDT"]
                
                for pair in key_pairs:
                    try:
                        loop = asyncio.get_event_loop()
                        ticker = await loop.run_in_executor(None, exchange.fetch_ticker, pair)
                        
                        if ticker:
                            symbol = pair.split('/')[0]
                            all_prices.append({
                                "symbol": symbol,
                                "name": SYMBOL_NAMES.get(symbol, symbol),
                                "price_usd": ticker.get('last', 0) or 0,
                                "change_24h": ticker.get('percentage', 0) or 0,
                                "volume_24h": ticker.get('quoteVolume', 0) or 0,
                                "exchange": exchange_name,
                                "timestamp": datetime.now(timezone.utc).isoformat(),
                                "is_live": True
                            })
                    except Exception as e:
                        logger.debug(f"Failed to fetch {pair} from {exchange_id}: {e}")
                        
            except Exception as e:
                logger.error(f"Failed to initialize {exchange_id}: {e}")
        
        return all_prices
