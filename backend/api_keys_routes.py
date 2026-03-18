from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timezone
import os
import uuid
import jwt
from motor.motor_asyncio import AsyncIOMotorClient
from cryptography.fernet import Fernet
import ccxt
import asyncio
import base64
import hashlib

# Get db connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'crypto_arbitrage_db')]

# Security
security = HTTPBearer()
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key')
JWT_ALGORITHM = os.environ.get('JWT_ALGORITHM', 'HS256')

# Encryption key - derive from JWT_SECRET for consistency
def get_encryption_key():
    key = hashlib.sha256(JWT_SECRET.encode()).digest()
    return base64.urlsafe_b64encode(key)

fernet = Fernet(get_encryption_key())

# Router
api_keys_router = APIRouter(prefix="/api-keys", tags=["api-keys"])

# Supported exchanges
SUPPORTED_EXCHANGES = [
    {"id": "binance", "name": "Binance", "logo": "https://cryptologos.cc/logos/binance-coin-bnb-logo.png"},
    {"id": "kraken", "name": "Kraken", "logo": "https://cryptologos.cc/logos/kraken-krak-logo.png"},
    {"id": "coinbase", "name": "Coinbase", "logo": "https://cryptologos.cc/logos/coinbase-coin-logo.png"},
    {"id": "kucoin", "name": "KuCoin", "logo": "https://cryptologos.cc/logos/kucoin-token-kcs-logo.png"},
    {"id": "bitfinex", "name": "Bitfinex", "logo": "https://cryptologos.cc/logos/bitfinex-logo.png"},
    {"id": "bybit", "name": "Bybit", "logo": "https://cryptologos.cc/logos/bybit-bit-logo.png"},
    {"id": "okx", "name": "OKX", "logo": "https://cryptologos.cc/logos/okx-okb-logo.png"},
    {"id": "gateio", "name": "Gate.io", "logo": "https://cryptologos.cc/logos/gate-logo.png"},
    {"id": "huobi", "name": "Huobi", "logo": "https://cryptologos.cc/logos/huobi-token-ht-logo.png"},
    {"id": "gemini", "name": "Gemini", "logo": "https://cryptologos.cc/logos/gemini-dollar-gusd-logo.png"},
    {"id": "crypto_com", "name": "Crypto.com", "logo": "https://cryptologos.cc/logos/crypto-com-coin-cro-logo.png"},
]

# Models
class APIKeyCreate(BaseModel):
    exchange_id: str
    api_key: str
    api_secret: str
    passphrase: Optional[str] = None  # Some exchanges require this

class APIKeyResponse(BaseModel):
    id: str
    exchange_id: str
    exchange_name: str
    created_at: str
    is_valid: Optional[bool] = None
    last_tested: Optional[str] = None

class TestConnectionResponse(BaseModel):
    success: bool
    message: str
    balance_available: Optional[bool] = None

# Auth helper
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user_doc = await db.users.find_one({"id": user_id}, {"_id": 0})
        if user_doc is None:
            raise HTTPException(status_code=401, detail="User not found")
        
        return user_doc
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Encryption helpers
def encrypt_key(key: str) -> str:
    return fernet.encrypt(key.encode()).decode()

def decrypt_key(encrypted_key: str) -> str:
    return fernet.decrypt(encrypted_key.encode()).decode()

# Get exchange name by id
def get_exchange_name(exchange_id: str) -> str:
    for ex in SUPPORTED_EXCHANGES:
        if ex["id"] == exchange_id:
            return ex["name"]
    return exchange_id

# Routes
@api_keys_router.get("/exchanges")
async def get_supported_exchanges():
    """Get list of supported exchanges"""
    return {"exchanges": SUPPORTED_EXCHANGES}

@api_keys_router.get("/", response_model=List[APIKeyResponse])
async def get_user_api_keys(current_user: dict = Depends(get_current_user)):
    """Get all API keys for current user (without revealing actual keys)"""
    
    keys = await db.api_keys.find(
        {"user_id": current_user["id"]},
        {"_id": 0, "api_key_encrypted": 0, "api_secret_encrypted": 0, "passphrase_encrypted": 0}
    ).to_list(100)
    
    result = []
    for key in keys:
        result.append(APIKeyResponse(
            id=key["id"],
            exchange_id=key["exchange_id"],
            exchange_name=get_exchange_name(key["exchange_id"]),
            created_at=key["created_at"],
            is_valid=key.get("is_valid"),
            last_tested=key.get("last_tested")
        ))
    
    return result

@api_keys_router.post("/", response_model=APIKeyResponse)
async def add_api_key(key_data: APIKeyCreate, current_user: dict = Depends(get_current_user)):
    """Add a new API key for an exchange"""
    
    # Check subscription limits
    max_exchanges = current_user.get("max_exchanges", 0)
    subscription_tier = current_user.get("subscription_tier", "free")
    
    if subscription_tier == "free":
        raise HTTPException(
            status_code=403, 
            detail="Free plan does not include exchange connections. Please upgrade to Test, Pro, or Premium plan."
        )
    
    # Count existing keys
    existing_count = await db.api_keys.count_documents({"user_id": current_user["id"]})
    
    if existing_count >= max_exchanges:
        raise HTTPException(
            status_code=403, 
            detail=f"Your {subscription_tier} plan allows maximum {max_exchanges} exchanges. Please upgrade to add more."
        )
    
    # Check if exchange already connected
    existing = await db.api_keys.find_one({
        "user_id": current_user["id"],
        "exchange_id": key_data.exchange_id
    })
    
    if existing:
        raise HTTPException(
            status_code=400, 
            detail=f"You already have an API key for {get_exchange_name(key_data.exchange_id)}. Delete it first to add a new one."
        )
    
    # Validate exchange id
    valid_exchanges = [ex["id"] for ex in SUPPORTED_EXCHANGES]
    if key_data.exchange_id not in valid_exchanges:
        raise HTTPException(status_code=400, detail="Invalid exchange")
    
    # Create encrypted key document
    key_doc = {
        "id": str(uuid.uuid4()),
        "user_id": current_user["id"],
        "exchange_id": key_data.exchange_id,
        "api_key_encrypted": encrypt_key(key_data.api_key),
        "api_secret_encrypted": encrypt_key(key_data.api_secret),
        "passphrase_encrypted": encrypt_key(key_data.passphrase) if key_data.passphrase else None,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "is_valid": None,
        "last_tested": None
    }
    
    await db.api_keys.insert_one(key_doc)
    
    return APIKeyResponse(
        id=key_doc["id"],
        exchange_id=key_doc["exchange_id"],
        exchange_name=get_exchange_name(key_doc["exchange_id"]),
        created_at=key_doc["created_at"],
        is_valid=None,
        last_tested=None
    )

@api_keys_router.delete("/{key_id}")
async def delete_api_key(key_id: str, current_user: dict = Depends(get_current_user)):
    """Delete an API key"""
    
    result = await db.api_keys.delete_one({
        "id": key_id,
        "user_id": current_user["id"]
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="API key not found")
    
    return {"success": True, "message": "API key deleted successfully"}

@api_keys_router.post("/{key_id}/test", response_model=TestConnectionResponse)
async def test_api_key(key_id: str, current_user: dict = Depends(get_current_user)):
    """Test if an API key is valid by connecting to the exchange"""
    
    # Get the key
    key_doc = await db.api_keys.find_one({
        "id": key_id,
        "user_id": current_user["id"]
    })
    
    if not key_doc:
        raise HTTPException(status_code=404, detail="API key not found")
    
    # Decrypt keys
    try:
        api_key = decrypt_key(key_doc["api_key_encrypted"])
        api_secret = decrypt_key(key_doc["api_secret_encrypted"])
        passphrase = decrypt_key(key_doc["passphrase_encrypted"]) if key_doc.get("passphrase_encrypted") else None
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to decrypt API keys")
    
    exchange_id = key_doc["exchange_id"]
    
    # Map our exchange ids to ccxt exchange ids
    ccxt_exchange_map = {
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
    
    ccxt_id = ccxt_exchange_map.get(exchange_id)
    if not ccxt_id:
        return TestConnectionResponse(
            success=False,
            message=f"Exchange {exchange_id} is not supported for testing yet"
        )
    
    # Try to connect
    try:
        exchange_class = getattr(ccxt, ccxt_id)
        
        config = {
            'apiKey': api_key,
            'secret': api_secret,
            'enableRateLimit': True,
            'timeout': 10000,
        }
        
        if passphrase:
            config['password'] = passphrase
        
        exchange = exchange_class(config)
        
        # Try to fetch balance (this validates the API key)
        loop = asyncio.get_event_loop()
        balance = await loop.run_in_executor(None, exchange.fetch_balance)
        
        # Update key status in database
        await db.api_keys.update_one(
            {"id": key_id},
            {
                "$set": {
                    "is_valid": True,
                    "last_tested": datetime.now(timezone.utc).isoformat()
                }
            }
        )
        
        return TestConnectionResponse(
            success=True,
            message=f"Successfully connected to {get_exchange_name(exchange_id)}!",
            balance_available=True
        )
        
    except ccxt.AuthenticationError:
        await db.api_keys.update_one(
            {"id": key_id},
            {
                "$set": {
                    "is_valid": False,
                    "last_tested": datetime.now(timezone.utc).isoformat()
                }
            }
        )
        return TestConnectionResponse(
            success=False,
            message="Authentication failed. Please check your API key and secret."
        )
    except ccxt.NetworkError as e:
        return TestConnectionResponse(
            success=False,
            message=f"Network error: Could not connect to {get_exchange_name(exchange_id)}. Please try again."
        )
    except Exception as e:
        return TestConnectionResponse(
            success=False,
            message=f"Connection test failed: {str(e)[:100]}"
        )

@api_keys_router.get("/limits")
async def get_user_limits(current_user: dict = Depends(get_current_user)):
    """Get user's API key limits based on subscription"""
    
    subscription_tier = current_user.get("subscription_tier", "free")
    max_exchanges = current_user.get("max_exchanges", 0)
    current_count = await db.api_keys.count_documents({"user_id": current_user["id"]})
    
    return {
        "subscription_tier": subscription_tier,
        "max_exchanges": max_exchanges,
        "current_count": current_count,
        "can_add_more": current_count < max_exchanges and subscription_tier != "free"
    }
