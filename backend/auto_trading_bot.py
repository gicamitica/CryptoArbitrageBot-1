"""
Auto-Trading Bot Service
Automatically executes trades when profitable opportunities are detected
Only available for PREMIUM users
"""
import asyncio
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any
import logging
import uuid
from motor.motor_asyncio import AsyncIOMotorDatabase

logger = logging.getLogger(__name__)

class AutoTradingBot:
    """
    Automated trading bot that monitors and executes arbitrage opportunities
    """
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self._running_bots: Dict[str, bool] = {}  # user_id -> is_running
        self._bot_settings: Dict[str, Dict] = {}  # user_id -> settings
    
    async def get_bot_settings(self, user_id: str) -> Dict:
        """Get user's bot settings from database"""
        settings = await self.db.bot_settings.find_one(
            {"user_id": user_id},
            {"_id": 0}
        )
        
        if not settings:
            # Default settings
            settings = {
                "user_id": user_id,
                "is_enabled": False,
                "min_profit_percentage": 2.0,  # Minimum 2% profit
                "max_trade_amount": 100.0,     # Max $100 per trade
                "daily_trade_limit": 10,        # Max 10 trades per day
                "allowed_symbols": [],          # Empty = all symbols
                "allowed_exchanges": [],        # Empty = all exchanges
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
            await self.db.bot_settings.insert_one(settings)
        
        return settings
    
    async def update_bot_settings(self, user_id: str, settings: Dict) -> Dict:
        """Update user's bot settings"""
        settings["updated_at"] = datetime.now(timezone.utc).isoformat()
        
        await self.db.bot_settings.update_one(
            {"user_id": user_id},
            {"$set": settings},
            upsert=True
        )
        
        # Update in-memory cache
        self._bot_settings[user_id] = settings
        
        return await self.get_bot_settings(user_id)
    
    async def enable_bot(self, user_id: str) -> Dict:
        """Enable auto-trading for user"""
        await self.db.bot_settings.update_one(
            {"user_id": user_id},
            {
                "$set": {
                    "is_enabled": True,
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }
            },
            upsert=True
        )
        self._running_bots[user_id] = True
        
        logger.info(f"Auto-trading enabled for user {user_id}")
        return {"success": True, "message": "Auto-trading bot enabled"}
    
    async def disable_bot(self, user_id: str) -> Dict:
        """Disable auto-trading for user"""
        await self.db.bot_settings.update_one(
            {"user_id": user_id},
            {
                "$set": {
                    "is_enabled": False,
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }
            }
        )
        self._running_bots[user_id] = False
        
        logger.info(f"Auto-trading disabled for user {user_id}")
        return {"success": True, "message": "Auto-trading bot disabled"}
    
    async def get_bot_status(self, user_id: str) -> Dict:
        """Get current bot status"""
        settings = await self.get_bot_settings(user_id)
        
        # Get today's trade count
        today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        today_trades = await self.db.bot_trades.count_documents({
            "user_id": user_id,
            "executed_at": {"$gte": today_start.isoformat()}
        })
        
        # Get total profit today
        today_profit_cursor = self.db.bot_trades.aggregate([
            {
                "$match": {
                    "user_id": user_id,
                    "executed_at": {"$gte": today_start.isoformat()}
                }
            },
            {
                "$group": {
                    "_id": None,
                    "total_profit": {"$sum": "$profit_usd"}
                }
            }
        ])
        
        today_profit = 0
        async for doc in today_profit_cursor:
            today_profit = doc.get("total_profit", 0)
        
        return {
            "is_enabled": settings.get("is_enabled", False),
            "settings": settings,
            "today_trades": today_trades,
            "daily_limit": settings.get("daily_trade_limit", 10),
            "remaining_trades": max(0, settings.get("daily_trade_limit", 10) - today_trades),
            "today_profit_usd": round(today_profit, 2)
        }
    
    async def should_execute_trade(self, user_id: str, opportunity: Dict) -> tuple[bool, str]:
        """
        Check if a trade should be executed based on settings
        
        Returns:
            (should_trade, reason)
        """
        settings = await self.get_bot_settings(user_id)
        
        # Check if bot is enabled
        if not settings.get("is_enabled", False):
            return False, "Bot is disabled"
        
        # Check profit threshold
        min_profit = settings.get("min_profit_percentage", 2.0)
        if opportunity.get("profit_percentage", 0) < min_profit:
            return False, f"Profit {opportunity.get('profit_percentage')}% below minimum {min_profit}%"
        
        # Check daily limit
        today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        today_trades = await self.db.bot_trades.count_documents({
            "user_id": user_id,
            "executed_at": {"$gte": today_start.isoformat()}
        })
        
        daily_limit = settings.get("daily_trade_limit", 10)
        if today_trades >= daily_limit:
            return False, f"Daily trade limit ({daily_limit}) reached"
        
        # Check allowed symbols
        allowed_symbols = settings.get("allowed_symbols", [])
        if allowed_symbols and opportunity.get("symbol") not in allowed_symbols:
            return False, f"Symbol {opportunity.get('symbol')} not in allowed list"
        
        # Check allowed exchanges
        allowed_exchanges = settings.get("allowed_exchanges", [])
        if allowed_exchanges:
            if opportunity.get("buy_exchange") not in allowed_exchanges:
                return False, f"Buy exchange {opportunity.get('buy_exchange')} not allowed"
            if opportunity.get("sell_exchange") not in allowed_exchanges:
                return False, f"Sell exchange {opportunity.get('sell_exchange')} not allowed"
        
        return True, "Trade approved"
    
    async def execute_auto_trade(self, user_id: str, opportunity: Dict) -> Dict:
        """
        Execute an automated trade (mock for now)
        
        In production, this would:
        1. Use ccxt to place buy order on buy_exchange
        2. Wait for fill
        3. Transfer crypto (or use existing balance)
        4. Place sell order on sell_exchange
        5. Record results
        """
        settings = await self.get_bot_settings(user_id)
        max_amount = settings.get("max_trade_amount", 100.0)
        
        # Calculate trade details
        trade_amount = min(max_amount, opportunity.get("profit_usd", 0) * 20)  # Use max or 20x expected profit
        
        # For now, simulate the trade
        profit_usd = trade_amount * (opportunity.get("profit_percentage", 0) / 100)
        
        # Record the trade
        trade_record = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "opportunity_id": opportunity.get("id"),
            "symbol": opportunity.get("symbol"),
            "buy_exchange": opportunity.get("buy_exchange"),
            "buy_price": opportunity.get("buy_price"),
            "sell_exchange": opportunity.get("sell_exchange"),
            "sell_price": opportunity.get("sell_price"),
            "amount_usd": trade_amount,
            "profit_percentage": opportunity.get("profit_percentage"),
            "profit_usd": round(profit_usd, 2),
            "status": "completed",  # In production: pending -> executing -> completed/failed
            "executed_at": datetime.now(timezone.utc).isoformat(),
            "is_simulated": True  # Mark as simulated for now
        }
        
        await self.db.bot_trades.insert_one(trade_record)
        
        # Update user balance (mock)
        await self.db.users.update_one(
            {"id": user_id},
            {"$inc": {"balance": profit_usd}}
        )
        
        logger.info(f"Auto-trade executed for user {user_id}: {opportunity.get('symbol')} +${profit_usd:.2f}")
        
        return {
            "success": True,
            "trade": trade_record,
            "message": f"Auto-trade executed! Profit: ${profit_usd:.2f}"
        }
    
    async def get_bot_trade_history(self, user_id: str, limit: int = 50) -> List[Dict]:
        """Get user's auto-trade history"""
        trades = await self.db.bot_trades.find(
            {"user_id": user_id},
            {"_id": 0}
        ).sort("executed_at", -1).limit(limit).to_list(limit)
        
        return trades


# Global bot instance (will be initialized with db)
auto_trading_bot = None

def init_auto_trading_bot(db: AsyncIOMotorDatabase):
    """Initialize the global auto trading bot"""
    global auto_trading_bot
    auto_trading_bot = AutoTradingBot(db)
    return auto_trading_bot
