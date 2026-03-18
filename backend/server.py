from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext
import random
import asyncio

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key')
JWT_ALGORITHM = os.environ.get('JWT_ALGORITHM', 'HS256')
JWT_EXPIRATION_HOURS = int(os.environ.get('JWT_EXPIRATION_HOURS', 24))

# Create the main app
app = FastAPI(title="Crypto Arbitrage API")
api_router = APIRouter(prefix="/api")

# ==================== MODELS ====================

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    is_active: bool = True
    is_admin: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    balance: float = 1000.0  # Mock trading balance
    subscription_tier: str = "free"  # free, test, pro, premium
    subscription_expires_at: Optional[str] = None
    max_exchanges: int = 0  # Number of exchanges user can connect

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class CryptoPrice(BaseModel):
    symbol: str
    name: str
    price_usd: float
    change_24h: float
    volume_24h: float
    exchange: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ArbitrageOpportunity(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    symbol: str
    buy_exchange: str
    buy_price: float
    sell_exchange: str
    sell_price: float
    profit_percentage: float
    profit_usd: float
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Trade(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    symbol: str
    trade_type: str  # buy or sell
    amount: float
    price: float
    exchange: str
    status: str  # pending, completed, failed
    profit: Optional[float] = 0.0
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TradeCreate(BaseModel):
    symbol: str
    trade_type: str
    amount: float
    price: float
    exchange: str

# ==================== AUTH HELPERS ====================

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        
        user_doc = await db.users.find_one({"id": user_id}, {"_id": 0})
        if user_doc is None:
            raise HTTPException(status_code=401, detail="User not found")
        
        if isinstance(user_doc.get('created_at'), str):
            user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at'])
        
        return User(**user_doc)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

async def get_admin_user(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

# ==================== MOCK DATA GENERATORS ====================

CRYPTO_SYMBOLS = [
    {"symbol": "BTC", "name": "Bitcoin", "base_price": 45000},
    {"symbol": "ETH", "name": "Ethereum", "base_price": 2500},
    {"symbol": "BNB", "name": "Binance Coin", "base_price": 320},
    {"symbol": "SOL", "name": "Solana", "base_price": 110},
    {"symbol": "ADA", "name": "Cardano", "base_price": 0.45},
    {"symbol": "XRP", "name": "Ripple", "base_price": 0.55},
    {"symbol": "DOT", "name": "Polkadot", "base_price": 7.2},
    {"symbol": "AVAX", "name": "Avalanche", "base_price": 38},
    {"symbol": "MATIC", "name": "Polygon", "base_price": 0.85},
    {"symbol": "UNI", "name": "Uniswap", "base_price": 12.5},
    {"symbol": "LINK", "name": "Chainlink", "base_price": 15.8},
    {"symbol": "LTC", "name": "Litecoin", "base_price": 85},
    {"symbol": "ATOM", "name": "Cosmos", "base_price": 9.3},
    {"symbol": "ALGO", "name": "Algorand", "base_price": 0.28},
    {"symbol": "FTM", "name": "Fantom", "base_price": 0.42},
    {"symbol": "SAND", "name": "The Sandbox", "base_price": 0.55},
    {"symbol": "MANA", "name": "Decentraland", "base_price": 0.48},
    {"symbol": "AAVE", "name": "Aave", "base_price": 95},
    {"symbol": "DOGE", "name": "Dogecoin", "base_price": 0.085},
    {"symbol": "SHIB", "name": "Shiba Inu", "base_price": 0.000012},
    {"symbol": "APT", "name": "Aptos", "base_price": 8.5},
    {"symbol": "OP", "name": "Optimism", "base_price": 2.1},
    {"symbol": "ARB", "name": "Arbitrum", "base_price": 1.8},
    {"symbol": "SUI", "name": "Sui", "base_price": 1.2},
]

EXCHANGES = ["Binance", "Kraken", "Coinbase", "KuCoin", "Bitfinex", "Bybit", "OKX", "Gate.io", "Huobi", "Gemini", "Crypto.com"]

def generate_mock_price(base_price: float, exchange: str) -> float:
    """Generate realistic price variations between exchanges"""
    variation = random.uniform(-0.02, 0.02)  # ±2% variation
    return round(base_price * (1 + variation), 2)

def generate_mock_prices() -> List[CryptoPrice]:
    """Generate mock prices for all symbols across exchanges"""
    prices = []
    for crypto in CRYPTO_SYMBOLS:
        for exchange in EXCHANGES:
            price = generate_mock_price(crypto["base_price"], exchange)
            change_24h = random.uniform(-10, 10)
            volume_24h = random.uniform(1000000, 50000000)
            
            prices.append(CryptoPrice(
                symbol=crypto["symbol"],
                name=crypto["name"],
                price_usd=price,
                change_24h=round(change_24h, 2),
                volume_24h=round(volume_24h, 2),
                exchange=exchange
            ))
    return prices

def detect_arbitrage_opportunities(prices: List[CryptoPrice]) -> List[ArbitrageOpportunity]:
    """Detect arbitrage opportunities from price data"""
    opportunities = []
    
    # Group prices by symbol
    symbol_prices = {}
    for price in prices:
        if price.symbol not in symbol_prices:
            symbol_prices[price.symbol] = []
        symbol_prices[price.symbol].append(price)
    
    # Find arbitrage opportunities
    for symbol, prices_list in symbol_prices.items():
        if len(prices_list) < 2:  # Need at least 2 exchanges
            continue
            
        prices_list.sort(key=lambda x: x.price_usd)
        min_price = prices_list[0]
        max_price = prices_list[-1]
        
        # Skip if min price is 0 or too small (prevents division by zero)
        if min_price.price_usd <= 0 or min_price.price_usd < 0.0000001:
            continue
        
        profit_percentage = ((max_price.price_usd - min_price.price_usd) / min_price.price_usd) * 100
        
        if profit_percentage > 0.5:  # Only show opportunities with >0.5% profit
            trade_amount = 1000  # Mock $1000 trade
            profit_usd = (trade_amount / min_price.price_usd) * (max_price.price_usd - min_price.price_usd)
            
            opportunities.append(ArbitrageOpportunity(
                symbol=symbol,
                buy_exchange=min_price.exchange,
                buy_price=min_price.price_usd,
                sell_exchange=max_price.exchange,
                sell_price=max_price.price_usd,
                profit_percentage=round(profit_percentage, 2),
                profit_usd=round(profit_usd, 2)
            ))
    
    return sorted(opportunities, key=lambda x: x.profit_percentage, reverse=True)

# ==================== AUTH ROUTES ====================

from email_service import send_verification_email, send_welcome_email
import secrets

@api_router.post("/auth/register")
async def register(user_data: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    existing_username = await db.users.find_one({"username": user_data.username}, {"_id": 0})
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Generate verification token
    verification_token = secrets.token_urlsafe(32)
    
    # Create new user (unverified)
    user = User(
        email=user_data.email,
        username=user_data.username,
        full_name=user_data.full_name
    )
    
    user_doc = user.model_dump()
    user_doc['created_at'] = user_doc['created_at'].isoformat()
    user_doc['password'] = hash_password(user_data.password)
    user_doc['is_verified'] = False
    user_doc['verification_token'] = verification_token
    user_doc['verification_token_expires'] = (datetime.now(timezone.utc) + timedelta(hours=24)).isoformat()
    
    await db.users.insert_one(user_doc)
    
    # Send verification email
    base_url = os.environ.get('FRONTEND_URL', 'https://exchange-verify-demo.preview.emergentagent.com')
    email_sent = send_verification_email(user.email, user.username, verification_token, base_url)
    
    return {
        "success": True,
        "message": "Registration successful! Please check your email to verify your account.",
        "email_sent": email_sent,
        "user_id": user.id
    }

@api_router.post("/auth/verify-email")
async def verify_email(token: str):
    """Verify email with token"""
    user_doc = await db.users.find_one({"verification_token": token}, {"_id": 0})
    
    if not user_doc:
        raise HTTPException(status_code=400, detail="Invalid or expired verification link")
    
    # Check if token expired
    expires_str = user_doc.get('verification_token_expires', '2000-01-01')
    expires_at = datetime.fromisoformat(expires_str)
    # Ensure timezone aware comparison
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    
    if datetime.now(timezone.utc) > expires_at:
        raise HTTPException(status_code=400, detail="Verification link has expired. Please request a new one.")
    
    # Update user as verified
    await db.users.update_one(
        {"id": user_doc["id"]},
        {
            "$set": {"is_verified": True},
            "$unset": {"verification_token": "", "verification_token_expires": ""}
        }
    )
    
    # Send welcome email
    send_welcome_email(user_doc["email"], user_doc["username"])
    
    # Create access token for auto-login
    access_token = create_access_token(data={"sub": user_doc["id"]})
    
    return {
        "success": True,
        "message": "Email verified successfully! Welcome to ArbitrajZ!",
        "access_token": access_token,
        "token_type": "bearer"
    }

@api_router.post("/auth/resend-verification")
async def resend_verification(email: str):
    """Resend verification email"""
    user_doc = await db.users.find_one({"email": email}, {"_id": 0})
    
    if not user_doc:
        # Don't reveal if email exists
        return {"success": True, "message": "If this email is registered, a verification link has been sent."}
    
    if user_doc.get('is_verified', False):
        return {"success": True, "message": "This email is already verified. You can login."}
    
    # Generate new token
    verification_token = secrets.token_urlsafe(32)
    
    await db.users.update_one(
        {"email": email},
        {
            "$set": {
                "verification_token": verification_token,
                "verification_token_expires": (datetime.now(timezone.utc) + timedelta(hours=24)).isoformat()
            }
        }
    )
    
    # Send verification email
    base_url = os.environ.get('FRONTEND_URL', 'https://exchange-verify-demo.preview.emergentagent.com')
    send_verification_email(email, user_doc["username"], verification_token, base_url)
    
    return {"success": True, "message": "Verification email sent! Please check your inbox."}

@api_router.post("/auth/login", response_model=Token)
async def login(credentials: UserLogin):
    user_doc = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not verify_password(credentials.password, user_doc['password']):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Check if email is verified
    if not user_doc.get('is_verified', True):  # Default True for old users
        raise HTTPException(
            status_code=403, 
            detail="Please verify your email before logging in. Check your inbox or request a new verification link."
        )
    
    if isinstance(user_doc.get('created_at'), str):
        user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at'])
    
    user = User(**user_doc)
    access_token = create_access_token(data={"sub": user.id})
    
    return Token(access_token=access_token, token_type="bearer", user=user)

@api_router.get("/auth/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

# ==================== CRYPTO ROUTES ====================

from exchange_service import ExchangeService, PublicExchangeService, SYMBOL_NAMES
from cache_service import price_cache, arbitrage_cache, CachedExchangeService

@api_router.get("/crypto/prices")
async def get_crypto_prices(
    symbol: Optional[str] = None,
    live: bool = False,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(lambda: None)
):
    """Get current crypto prices - live data if user has connected exchanges, otherwise mock"""
    
    # Try to get user if authenticated
    user_id = None
    auth_header = None
    
    # Check for optional auth
    try:
        from fastapi import Request
        # This is a simplified check - we'll handle auth in the request
        pass
    except:
        pass
    
    # For now, return mock data (live data requires auth)
    # The /crypto/prices/live endpoint handles authenticated live data
    prices = generate_mock_prices()
    
    if symbol:
        prices = [p for p in prices if p.symbol == symbol.upper()]
    
    # Add is_live flag
    return [
        {
            "symbol": p.symbol,
            "name": p.name,
            "price_usd": p.price_usd,
            "change_24h": p.change_24h,
            "volume_24h": p.volume_24h,
            "exchange": p.exchange,
            "timestamp": p.timestamp.isoformat() if hasattr(p.timestamp, 'isoformat') else str(p.timestamp),
            "is_live": False
        }
        for p in prices
    ]

@api_router.get("/crypto/prices/live")
async def get_live_crypto_prices(
    symbol: Optional[str] = None,
    refresh: bool = False,
    current_user: User = Depends(get_current_user)
):
    """Get LIVE crypto prices from user's connected exchanges (with caching)"""
    
    exchange_service = ExchangeService(db)
    cached_service = CachedExchangeService(exchange_service, price_cache, arbitrage_cache)
    
    # Check if user has any connected exchanges
    connected_count = await exchange_service.get_user_connected_exchange_count(current_user.id)
    
    if connected_count == 0:
        return {
            "prices": [],
            "is_live": False,
            "from_cache": False,
            "message": "No exchanges connected. Add API keys in Settings to get live data.",
            "connected_exchanges": 0
        }
    
    # Fetch live prices (with caching)
    result = await cached_service.get_live_prices(current_user.id, force_refresh=refresh)
    
    prices = result["prices"]
    if symbol:
        prices = [p for p in prices if p.get("symbol") == symbol.upper()]
    
    return {
        "prices": prices,
        "is_live": result["is_live"],
        "from_cache": result.get("from_cache", False),
        "message": result["message"],
        "connected_exchanges": connected_count
    }

@api_router.get("/crypto/arbitrage")
async def get_arbitrage_opportunities(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(lambda: None)
):
    """Get current arbitrage opportunities (mock data)"""
    prices = generate_mock_prices()
    opportunities = detect_arbitrage_opportunities(prices)
    return opportunities

@api_router.get("/crypto/arbitrage/live")
async def get_live_arbitrage_opportunities(
    current_user: User = Depends(get_current_user)
):
    """Get LIVE arbitrage opportunities from user's connected exchanges"""
    
    exchange_service = ExchangeService(db)
    connected_count = await exchange_service.get_user_connected_exchange_count(current_user.id)
    
    if connected_count < 2:
        return {
            "opportunities": [],
            "is_live": False,
            "message": "Need at least 2 connected exchanges to detect arbitrage opportunities.",
            "connected_exchanges": connected_count
        }
    
    try:
        # Fetch live prices
        live_prices = await exchange_service.fetch_all_live_prices(current_user.id)
        
        if not live_prices:
            return {
                "opportunities": [],
                "is_live": False,
                "message": "No price data available from connected exchanges.",
                "connected_exchanges": connected_count
            }
        
        # Convert to CryptoPrice objects for the detector
        price_objects = []
        for p in live_prices:
            price_objects.append(CryptoPrice(
                symbol=p["symbol"],
                name=p["name"],
                price_usd=p["price_usd"],
                change_24h=p["change_24h"],
                volume_24h=p["volume_24h"],
                exchange=p["exchange"]
            ))
        
        # Detect opportunities
        opportunities = detect_arbitrage_opportunities(price_objects)
        
        return {
            "opportunities": [
                {
                    "id": opp.id,
                    "symbol": opp.symbol,
                    "buy_exchange": opp.buy_exchange,
                    "buy_price": opp.buy_price,
                    "sell_exchange": opp.sell_exchange,
                    "sell_price": opp.sell_price,
                    "profit_percentage": opp.profit_percentage,
                    "profit_usd": opp.profit_usd,
                    "timestamp": opp.timestamp.isoformat() if hasattr(opp.timestamp, 'isoformat') else str(opp.timestamp),
                    "is_live": True
                }
                for opp in opportunities
            ],
            "is_live": True,
            "message": f"Live opportunities from {connected_count} exchanges",
            "connected_exchanges": connected_count
        }
    except Exception as e:
        logger.error(f"Error detecting live arbitrage: {e}")
        return {
            "opportunities": [],
            "is_live": False,
            "message": f"Error: {str(e)[:100]}",
            "connected_exchanges": connected_count
        }

@api_router.get("/crypto/symbols")
async def get_symbols():
    """Get list of supported crypto symbols"""
    return CRYPTO_SYMBOLS

@api_router.get("/crypto/cache/stats")
async def get_cache_stats():
    """Get cache statistics (admin only in production)"""
    return {
        "price_cache": price_cache.get_stats(),
        "arbitrage_cache": arbitrage_cache.get_stats()
    }

@api_router.post("/crypto/cache/refresh")
async def refresh_user_cache(current_user: User = Depends(get_current_user)):
    """Force refresh cache for current user"""
    await price_cache.invalidate(current_user.id)
    await arbitrage_cache.invalidate(current_user.id)
    return {"success": True, "message": "Cache invalidated. Next request will fetch fresh data."}

@api_router.get("/user/features")
async def get_user_features(current_user: User = Depends(get_current_user)):
    """Get user's feature access based on subscription"""
    
    subscription_tier = current_user.subscription_tier or "free"
    max_exchanges = current_user.max_exchanges or 0
    
    # Define feature access by plan
    features = {
        "free": {
            "dashboard": True,
            "live_data": False,
            "trading": False,
            "api_keys": False,
            "max_exchanges": 0,
            "email_alerts": False,
            "whatsapp_alerts": False,
            "auto_trading": False,
            "priority_support": False
        },
        "test": {
            "dashboard": True,
            "live_data": True,
            "trading": True,
            "api_keys": True,
            "max_exchanges": 2,
            "email_alerts": False,
            "whatsapp_alerts": False,
            "auto_trading": False,
            "priority_support": False
        },
        "pro": {
            "dashboard": True,
            "live_data": True,
            "trading": True,
            "api_keys": True,
            "max_exchanges": 5,
            "email_alerts": True,
            "whatsapp_alerts": False,
            "auto_trading": False,
            "priority_support": True
        },
        "premium": {
            "dashboard": True,
            "live_data": True,
            "trading": True,
            "api_keys": True,
            "max_exchanges": 999,
            "email_alerts": True,
            "whatsapp_alerts": True,
            "auto_trading": True,
            "priority_support": True
        }
    }
    
    user_features = features.get(subscription_tier, features["free"])
    
    return {
        "subscription_tier": subscription_tier,
        "features": user_features,
        "subscription_expires_at": current_user.subscription_expires_at
    }

# ==================== AUTO-TRADING BOT ROUTES ====================

from auto_trading_bot import AutoTradingBot

@api_router.get("/bot/status")
async def get_bot_status(current_user: User = Depends(get_current_user)):
    """Get auto-trading bot status (Premium only)"""
    
    if current_user.subscription_tier != "premium":
        raise HTTPException(
            status_code=403,
            detail="Auto-trading bot is only available for Premium subscribers."
        )
    
    bot = AutoTradingBot(db)
    return await bot.get_bot_status(current_user.id)

@api_router.get("/bot/settings")
async def get_bot_settings(current_user: User = Depends(get_current_user)):
    """Get bot settings (Premium only)"""
    
    if current_user.subscription_tier != "premium":
        raise HTTPException(
            status_code=403,
            detail="Auto-trading bot is only available for Premium subscribers."
        )
    
    bot = AutoTradingBot(db)
    return await bot.get_bot_settings(current_user.id)

class BotSettingsUpdate(BaseModel):
    min_profit_percentage: Optional[float] = None
    max_trade_amount: Optional[float] = None
    daily_trade_limit: Optional[int] = None
    allowed_symbols: Optional[List[str]] = None
    allowed_exchanges: Optional[List[str]] = None

@api_router.put("/bot/settings")
async def update_bot_settings(
    settings: BotSettingsUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update bot settings (Premium only)"""
    
    if current_user.subscription_tier != "premium":
        raise HTTPException(
            status_code=403,
            detail="Auto-trading bot is only available for Premium subscribers."
        )
    
    bot = AutoTradingBot(db)
    update_data = {k: v for k, v in settings.model_dump().items() if v is not None}
    return await bot.update_bot_settings(current_user.id, update_data)

@api_router.post("/bot/enable")
async def enable_bot(current_user: User = Depends(get_current_user)):
    """Enable auto-trading bot (Premium only)"""
    
    if current_user.subscription_tier != "premium":
        raise HTTPException(
            status_code=403,
            detail="Auto-trading bot is only available for Premium subscribers."
        )
    
    bot = AutoTradingBot(db)
    return await bot.enable_bot(current_user.id)

@api_router.post("/bot/disable")
async def disable_bot(current_user: User = Depends(get_current_user)):
    """Disable auto-trading bot"""
    
    if current_user.subscription_tier != "premium":
        raise HTTPException(
            status_code=403,
            detail="Auto-trading bot is only available for Premium subscribers."
        )
    
    bot = AutoTradingBot(db)
    return await bot.disable_bot(current_user.id)

@api_router.get("/bot/trades")
async def get_bot_trades(
    limit: int = 50,
    current_user: User = Depends(get_current_user)
):
    """Get auto-trading history (Premium only)"""
    
    if current_user.subscription_tier != "premium":
        raise HTTPException(
            status_code=403,
            detail="Auto-trading bot is only available for Premium subscribers."
        )
    
    bot = AutoTradingBot(db)
    return await bot.get_bot_trade_history(current_user.id, limit)

@api_router.post("/bot/test-trade")
async def test_bot_trade(current_user: User = Depends(get_current_user)):
    """Execute a test auto-trade with a simulated opportunity (Premium only)"""
    
    if current_user.subscription_tier != "premium":
        raise HTTPException(
            status_code=403,
            detail="Auto-trading bot is only available for Premium subscribers."
        )
    
    bot = AutoTradingBot(db)
    
    # Create a test opportunity
    test_opportunity = {
        "id": str(uuid.uuid4()),
        "symbol": "BTC",
        "buy_exchange": "Binance",
        "buy_price": 67000.0,
        "sell_exchange": "Kraken",
        "sell_price": 67500.0,
        "profit_percentage": 0.75,
        "profit_usd": 50.0
    }
    
    # Check if trade should execute
    should_trade, reason = await bot.should_execute_trade(current_user.id, test_opportunity)
    
    if not should_trade:
        return {
            "success": False,
            "message": f"Trade not executed: {reason}",
            "opportunity": test_opportunity
        }
    
    # Execute the trade
    return await bot.execute_auto_trade(current_user.id, test_opportunity)

# ==================== TRADING ROUTES ====================

@api_router.post("/trades", response_model=Trade)
async def create_trade(trade_data: TradeCreate, current_user: User = Depends(get_current_user)):
    """Execute a trade (mock) - requires paid subscription"""
    
    # Check subscription
    subscription_tier = current_user.subscription_tier or "free"
    if subscription_tier == "free":
        raise HTTPException(
            status_code=403, 
            detail="Trading requires a paid subscription. Please upgrade to Test, Pro, or Premium plan."
        )
    
    trade = Trade(
        user_id=current_user.id,
        symbol=trade_data.symbol,
        trade_type=trade_data.trade_type,
        amount=trade_data.amount,
        price=trade_data.price,
        exchange=trade_data.exchange,
        status="completed"
    )
    
    # Calculate profit (mock)
    if trade_data.trade_type == "sell":
        trade.profit = round(trade_data.amount * 0.02, 2)  # Mock 2% profit
    
    trade_doc = trade.model_dump()
    trade_doc['timestamp'] = trade_doc['timestamp'].isoformat()
    
    await db.trades.insert_one(trade_doc)
    
    # Update user balance (mock)
    if trade.profit:
        await db.users.update_one(
            {"id": current_user.id},
            {"$inc": {"balance": trade.profit}}
        )
    
    return trade

@api_router.get("/trades", response_model=List[Trade])
async def get_user_trades(current_user: User = Depends(get_current_user)):
    """Get user's trading history"""
    trades = await db.trades.find({"user_id": current_user.id}, {"_id": 0}).sort("timestamp", -1).limit(50).to_list(50)
    
    for trade in trades:
        if isinstance(trade.get('timestamp'), str):
            trade['timestamp'] = datetime.fromisoformat(trade['timestamp'])
    
    return trades

# ==================== ADMIN ROUTES ====================

@api_router.get("/admin/users", response_model=List[User])
async def get_all_users(
    skip: int = 0, 
    limit: int = 100,
    admin_user: User = Depends(get_admin_user)
):
    """Get all users with pagination (admin only)"""
    users = await db.users.find(
        {}, 
        {"_id": 0, "password": 0}
    ).skip(skip).limit(min(limit, 100)).to_list(limit)
    
    for user in users:
        if isinstance(user.get('created_at'), str):
            user['created_at'] = datetime.fromisoformat(user['created_at'])
    
    return users

@api_router.get("/admin/stats")
async def get_admin_stats(admin_user: User = Depends(get_admin_user)):
    """Get platform statistics (admin only)"""
    total_users = await db.users.count_documents({})
    total_trades = await db.trades.count_documents({})
    active_users = await db.users.count_documents({"is_active": True})
    
    # Calculate total volume using aggregation pipeline (optimized)
    pipeline = [
        {
            "$group": {
                "_id": None,
                "total_volume": {
                    "$sum": {"$multiply": ["$amount", "$price"]}
                }
            }
        }
    ]
    
    volume_result = await db.trades.aggregate(pipeline).to_list(1)
    total_volume = volume_result[0]["total_volume"] if volume_result else 0
    
    return {
        "total_users": total_users,
        "active_users": active_users,
        "total_trades": total_trades,
        "total_volume": round(total_volume, 2)
    }

# ==================== ROOT & HEALTH CHECK ====================

@api_router.get("/")
async def root():
    return {
        "message": "Crypto Arbitrage API",
        "version": "1.0.0",
        "status": "active"
    }

@api_router.get("/health")
async def health_check():
    return {"status": "healthy"}

# Import Stripe and Super Admin routers BEFORE including api_router
from stripe_routes import stripe_router
from super_admin_routes import super_admin_router
from api_keys_routes import api_keys_router

# Include Stripe payment routes in api_router
api_router.include_router(stripe_router)

# Include Super Admin routes in api_router
api_router.include_router(super_admin_router)

# Include API Keys routes in api_router
api_router.include_router(api_keys_router)

# Include api_router in main app
app.include_router(api_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    logger.info("🚀 Crypto Arbitrage API started successfully")
    
    # Create admin user if not exists
    admin = await db.users.find_one({"email": "admin@cryptoarbitrage.com"}, {"_id": 0})
    if not admin:
        admin_user = User(
            email="admin@cryptoarbitrage.com",
            username="admin",
            full_name="Admin User",
            is_admin=True,
            subscription_tier="premium"
        )
        admin_doc = admin_user.model_dump()
        admin_doc['created_at'] = admin_doc['created_at'].isoformat()
        admin_doc['password'] = hash_password("admin123")
        admin_doc['is_verified'] = True  # Admin is pre-verified
        await db.users.insert_one(admin_doc)
        logger.info("✅ Admin user created: admin@cryptoarbitrage.com / admin123")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
    logger.info("Database connection closed")
