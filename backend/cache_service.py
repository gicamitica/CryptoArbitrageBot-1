"""
Caching Service for Exchange Data
Reduces API calls to exchanges by caching price data
"""
import asyncio
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Optional, Any
import logging
import json

logger = logging.getLogger(__name__)

class PriceCache:
    """In-memory cache for exchange price data"""
    
    def __init__(self, ttl_seconds: int = 30):
        """
        Initialize cache with TTL (time to live)
        
        Args:
            ttl_seconds: How long cached data is valid (default 30 seconds)
        """
        self.ttl_seconds = ttl_seconds
        self._cache: Dict[str, Dict[str, Any]] = {}
        self._lock = asyncio.Lock()
    
    def _get_cache_key(self, user_id: str, data_type: str = "prices") -> str:
        """Generate cache key for user data"""
        return f"{user_id}:{data_type}"
    
    async def get(self, user_id: str, data_type: str = "prices") -> Optional[List[Dict]]:
        """
        Get cached data if not expired
        
        Returns:
            Cached data or None if expired/not found
        """
        async with self._lock:
            key = self._get_cache_key(user_id, data_type)
            
            if key not in self._cache:
                return None
            
            cached = self._cache[key]
            cached_at = cached.get("cached_at")
            
            if not cached_at:
                return None
            
            # Check if expired
            age = (datetime.now(timezone.utc) - cached_at).total_seconds()
            if age > self.ttl_seconds:
                # Expired, remove from cache
                del self._cache[key]
                logger.debug(f"Cache expired for {key} (age: {age:.1f}s)")
                return None
            
            logger.debug(f"Cache hit for {key} (age: {age:.1f}s)")
            return cached.get("data")
    
    async def set(self, user_id: str, data: List[Dict], data_type: str = "prices"):
        """Store data in cache"""
        async with self._lock:
            key = self._get_cache_key(user_id, data_type)
            
            self._cache[key] = {
                "data": data,
                "cached_at": datetime.now(timezone.utc),
                "count": len(data) if data else 0
            }
            logger.debug(f"Cache set for {key} ({len(data) if data else 0} items)")
    
    async def invalidate(self, user_id: str, data_type: str = None):
        """Invalidate cache for a user"""
        async with self._lock:
            if data_type:
                key = self._get_cache_key(user_id, data_type)
                if key in self._cache:
                    del self._cache[key]
            else:
                # Invalidate all data types for user
                keys_to_remove = [k for k in self._cache if k.startswith(f"{user_id}:")]
                for key in keys_to_remove:
                    del self._cache[key]
    
    async def clear_all(self):
        """Clear entire cache"""
        async with self._lock:
            self._cache.clear()
            logger.info("Cache cleared")
    
    def get_stats(self) -> Dict:
        """Get cache statistics"""
        total_items = len(self._cache)
        total_data_points = sum(
            cached.get("count", 0) 
            for cached in self._cache.values()
        )
        
        return {
            "total_cached_users": total_items,
            "total_data_points": total_data_points,
            "ttl_seconds": self.ttl_seconds
        }


# Global cache instances
price_cache = PriceCache(ttl_seconds=30)  # 30 second TTL for prices
arbitrage_cache = PriceCache(ttl_seconds=15)  # 15 second TTL for opportunities


class CachedExchangeService:
    """Exchange service with caching layer"""
    
    def __init__(self, exchange_service, price_cache: PriceCache, arbitrage_cache: PriceCache):
        self.exchange_service = exchange_service
        self.price_cache = price_cache
        self.arbitrage_cache = arbitrage_cache
    
    async def get_live_prices(self, user_id: str, force_refresh: bool = False) -> Dict:
        """
        Get live prices with caching
        
        Args:
            user_id: User ID
            force_refresh: Skip cache and fetch fresh data
        
        Returns:
            Dict with prices, is_live flag, and cache info
        """
        # Check cache first (unless force refresh)
        if not force_refresh:
            cached_prices = await self.price_cache.get(user_id, "prices")
            if cached_prices is not None:
                return {
                    "prices": cached_prices,
                    "is_live": True,
                    "from_cache": True,
                    "message": "Live data (cached)"
                }
        
        # Fetch fresh data
        try:
            live_prices = await self.exchange_service.fetch_all_live_prices(user_id)
            
            if live_prices:
                # Cache the results
                await self.price_cache.set(user_id, live_prices, "prices")
                
                return {
                    "prices": live_prices,
                    "is_live": True,
                    "from_cache": False,
                    "message": "Live data (fresh)"
                }
            
            return {
                "prices": [],
                "is_live": False,
                "from_cache": False,
                "message": "No data available"
            }
            
        except Exception as e:
            logger.error(f"Error fetching live prices: {e}")
            
            # Try to return stale cache data as fallback
            stale_data = await self.price_cache.get(user_id, "prices")
            if stale_data:
                return {
                    "prices": stale_data,
                    "is_live": True,
                    "from_cache": True,
                    "message": "Live data (stale cache - fetch error)"
                }
            
            return {
                "prices": [],
                "is_live": False,
                "from_cache": False,
                "message": f"Error: {str(e)[:100]}"
            }
    
    async def get_live_arbitrage(self, user_id: str, force_refresh: bool = False) -> Dict:
        """
        Get arbitrage opportunities with caching
        """
        # Check cache first
        if not force_refresh:
            cached_opps = await self.arbitrage_cache.get(user_id, "arbitrage")
            if cached_opps is not None:
                return {
                    "opportunities": cached_opps,
                    "is_live": True,
                    "from_cache": True,
                    "message": "Live opportunities (cached)"
                }
        
        # Get prices first (will use cache if available)
        prices_result = await self.get_live_prices(user_id, force_refresh)
        
        if not prices_result["prices"]:
            return {
                "opportunities": [],
                "is_live": False,
                "from_cache": False,
                "message": prices_result["message"]
            }
        
        # Calculate arbitrage from prices
        # This would use the existing detect_arbitrage_opportunities function
        # For now, return the prices for the caller to process
        return {
            "prices": prices_result["prices"],
            "is_live": prices_result["is_live"],
            "from_cache": prices_result["from_cache"],
            "message": prices_result["message"]
        }
