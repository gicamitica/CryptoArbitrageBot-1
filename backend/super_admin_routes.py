from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
from datetime import datetime

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

@super_admin_router.get("/dashboard")
async def get_super_admin_dashboard(password: str, db=None):
    """Get super admin dashboard data"""
    await get_super_admin(password)
    
    if not db:
        raise HTTPException(status_code=500, detail="Database not available")
    
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
    password: str,
    db=None
):
    """Update any user (super admin only)"""
    await get_super_admin(password)
    
    if not db:
        raise HTTPException(status_code=500, detail="Database not available")
    
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
    password: str,
    db=None
):
    """Delete any user (super admin only)"""
    await get_super_admin(password)
    
    if not db:
        raise HTTPException(status_code=500, detail="Database not available")
    
    result = await db.users.delete_one({"id": user_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"success": True, "message": f"User {user_id} deleted"}

@super_admin_router.get("/payments")
async def get_all_payments(password: str, db=None):
    """Get all payment transactions"""
    await get_super_admin(password)
    
    if not db:
        raise HTTPException(status_code=500, detail="Database not available")
    
    transactions = await db.payment_transactions.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    return {"transactions": transactions}

@super_admin_router.put("/settings")
async def update_platform_settings(
    password: str,
    settings: Dict[str, Any],
    db=None
):
    """Update platform-wide settings"""
    await get_super_admin(password)
    
    # Store settings in database
    if db:
        await db.platform_settings.update_one(
            {"_id": "main"},
            {"$set": {**settings, "updated_at": datetime.now().isoformat()}},
            upsert=True
        )
    
    return {"success": True, "message": "Platform settings updated"}
