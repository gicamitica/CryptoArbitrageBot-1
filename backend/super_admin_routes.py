from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
import os
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
import uuid

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Get db connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'crypto_arbitrage_db')]

# Router
super_admin_router = APIRouter(prefix="/super-admin", tags=["super-admin"])

# Models
class SuperAdminLogin(BaseModel):
    password: str

class SuperAdminToken(BaseModel):
    access: bool
    message: str

class PlanUpdate(BaseModel):
    plan_id: str
    price: Optional[float] = None
    max_exchanges: Optional[int] = None
    features: Optional[List[str]] = None

class UserUpdate(BaseModel):
    user_id: str
    subscription_tier: Optional[str] = None
    is_active: Optional[bool] = None
    is_admin: Optional[bool] = None
    balance: Optional[float] = None

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    subscription_tier: Optional[str] = "free"

# Super Admin Authentication
def verify_super_admin_password(password: str) -> bool:
    correct_password = os.environ.get('SUPER_ADMIN_PASSWORD', 'ArbitrajZ_SuperAdmin_2025_Secure!')
    return password == correct_password

async def get_super_admin(password: str):
    if not verify_super_admin_password(password):
        raise HTTPException(status_code=403, detail="Invalid super admin password")
    return True

# Routes
@super_admin_router.post("/login", response_model=SuperAdminToken)
async def super_admin_login(credentials: SuperAdminLogin):
    """Login to super admin panel"""
    if verify_super_admin_password(credentials.password):
        return SuperAdminToken(access=True, message="Super admin access granted")
    raise HTTPException(status_code=403, detail="Invalid password")

@super_admin_router.post("/users")
async def create_user_by_super_admin(user_data: UserCreate, password: str):
    """Create a new user (super admin only)"""
    await get_super_admin(password)
    
    # Check if email already exists
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check if username already exists
    existing_username = await db.users.find_one({"username": user_data.username})
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Determine max_exchanges based on plan
    max_exchanges_map = {
        "free": 0,
        "test": 2,
        "pro": 5,
        "premium": 999
    }
    
    # Create user document
    user_doc = {
        "id": str(uuid.uuid4()),
        "email": user_data.email,
        "username": user_data.username,
        "password": pwd_context.hash(user_data.password),
        "full_name": None,
        "is_active": True,
        "is_admin": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "balance": 1000.0,
        "subscription_tier": user_data.subscription_tier,
        "subscription_expires_at": None,
        "max_exchanges": max_exchanges_map.get(user_data.subscription_tier, 0)
    }
    
    await db.users.insert_one(user_doc)
    
    return {"success": True, "message": f"User {user_data.email} created successfully", "user_id": user_doc["id"]}

@super_admin_router.get("/dashboard")
async def get_super_admin_dashboard(password: str):
    """Get super admin dashboard data"""
    await get_super_admin(password)
    
    # Get all stats
    total_users = await db.users.count_documents({})
    paid_users = await db.users.count_documents({"subscription_tier": {"$ne": "free"}})
    total_revenue = await db.payment_transactions.aggregate([
        {"$match": {"payment_status": "paid"}},
        {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
    ]).to_list(1)
    
    revenue = total_revenue[0]["total"] if total_revenue else 0
    
    # Get recent transactions
    recent_transactions = await db.payment_transactions.find(
        {},
        {"_id": 0}
    ).sort("created_at", -1).limit(10).to_list(10)
    
    # Get all users
    all_users = await db.users.find({}, {"_id": 0, "password": 0}).to_list(1000)
    
    return {
        "stats": {
            "total_users": total_users,
            "paid_users": paid_users,
            "free_users": total_users - paid_users,
            "total_revenue": round(revenue, 2)
        },
        "recent_transactions": recent_transactions,
        "all_users": all_users
    }

@super_admin_router.put("/plans/{plan_id}")
async def update_plan(
    plan_id: str,
    plan_update: PlanUpdate,
    password: str,
    db=None
):
    """Update subscription plan details"""
    await get_super_admin(password)
    
    # This would update plan in database/config
    # For now, just return success
    return {
        "success": True,
        "message": f"Plan {plan_id} updated",
        "updates": plan_update.model_dump(exclude_none=True)
    }

@super_admin_router.put("/users/{user_id}")
async def update_user_by_super_admin(
    user_id: str,
    user_update: UserUpdate,
    password: str
):
    """Update any user (super admin only)"""
    await get_super_admin(password)
    
    # Update user
    update_data = user_update.model_dump(exclude_none=True, exclude={"user_id"})
    
    if update_data:
        result = await db.users.update_one(
            {"id": user_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
    
    return {"success": True, "message": f"User {user_id} updated"}

@super_admin_router.delete("/users/{user_id}")
async def delete_user_by_super_admin(
    user_id: str,
    password: str
):
    """Delete any user (super admin only)"""
    await get_super_admin(password)
    
    result = await db.users.delete_one({"id": user_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"success": True, "message": f"User {user_id} deleted"}

@super_admin_router.get("/payments")
async def get_all_payments(password: str):
    """Get all payment transactions"""
    await get_super_admin(password)
    
    transactions = await db.payment_transactions.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    return {"transactions": transactions}

@super_admin_router.put("/settings")
async def update_platform_settings(
    password: str,
    settings: Dict[str, Any]
):
    """Update platform-wide settings"""
    await get_super_admin(password)
    
    # Store settings in database
    await db.platform_settings.update_one(
        {"_id": "main"},
        {"$set": {**settings, "updated_at": datetime.now().isoformat()}},
        upsert=True
    )
    
    return {"success": True, "message": "Platform settings updated"}
