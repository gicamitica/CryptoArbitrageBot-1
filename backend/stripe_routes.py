from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel, Field
from typing import Optional, Dict
from datetime import datetime, timezone, timedelta
import uuid
import jwt
import os
import stripe

# Import db from server
from motor.motor_asyncio import AsyncIOMotorClient

# Get db connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'crypto_arbitrage_db')]

# Initialize Stripe
stripe.api_key = os.environ.get('STRIPE_API_KEY')

# Subscription Plans
SUBSCRIPTION_PLANS = {
    "test": {
        "name": "Test Plan",
        "price": 1.00,  # $1 per day
        "currency": "usd",
        "duration": "1 day",
        "max_exchanges": 2,
        "features": ["2 Exchanges", "Real-time Monitoring", "Manual Trading"]
    },
    "pro": {
        "name": "Pro Plan",
        "price": 29.00,  # $29 per month
        "currency": "usd",
        "duration": "1 month",
        "max_exchanges": 5,
        "features": ["5 Exchanges", "Real-time Monitoring", "Manual Trading", "Email Alerts"]
    },
    "premium": {
        "name": "Premium Plan",
        "price": 99.00,  # $99 per month
        "currency": "usd",
        "duration": "1 month",
        "max_exchanges": 999,  # Unlimited
        "features": ["Unlimited Exchanges", "Auto-Trading Bot", "Priority Support", "Advanced Analytics", "WhatsApp Alerts"]
    }
}

# Models
class CheckoutRequest(BaseModel):
    plan_id: str  # test, pro, premium
    origin_url: str

class CheckoutSessionResponse(BaseModel):
    session_id: str
    checkout_url: str

class CheckoutStatusResponse(BaseModel):
    session_id: str
    payment_status: str
    customer_email: Optional[str] = None

class PaymentTransaction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: Optional[str] = None
    email: Optional[str] = None
    plan_id: str
    amount: float
    currency: str
    session_id: str
    payment_status: str  # pending, paid, failed, expired
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    expires_at: Optional[datetime] = None
    metadata: Optional[Dict] = None

# Router
stripe_router = APIRouter(prefix="/payments", tags=["payments"])

@stripe_router.post("/checkout", response_model=CheckoutSessionResponse)
async def create_checkout_session(
    checkout_req: CheckoutRequest,
    request: Request
):
    """Create Stripe checkout session for subscription"""
    
    # Get current user if authenticated (optional)
    current_user = None
    try:
        auth_header = request.headers.get("Authorization")
        if auth_header:
            token = auth_header.replace("Bearer ", "")
            payload = jwt.decode(token, os.environ.get('JWT_SECRET'), algorithms=[os.environ.get('JWT_ALGORITHM')])
            user_doc = await db.users.find_one({"id": payload.get("sub")}, {"_id": 0})
            if user_doc:
                current_user = user_doc
    except:
        pass
    
    # Validate plan
    if checkout_req.plan_id not in SUBSCRIPTION_PLANS:
        raise HTTPException(status_code=400, detail="Invalid plan selected")
    
    plan = SUBSCRIPTION_PLANS[checkout_req.plan_id]
    
    # Check Stripe API key
    if not stripe.api_key:
        raise HTTPException(status_code=500, detail="Stripe not configured")
    
    # Build URLs
    success_url = f"{checkout_req.origin_url}/payment-success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{checkout_req.origin_url}/pricing"
    
    # Metadata
    metadata = {
        "plan_id": checkout_req.plan_id,
        "plan_name": plan["name"],
        "user_id": current_user.get("id") if current_user else "guest",
        "email": current_user.get("email") if current_user else "guest"
    }
    
    try:
        # Create Stripe checkout session
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': plan["currency"],
                    'product_data': {
                        'name': plan["name"],
                        'description': f"ArbitrajZ {plan['name']} - {plan['duration']}"
                    },
                    'unit_amount': int(plan["price"] * 100),  # Stripe uses cents
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=success_url,
            cancel_url=cancel_url,
            metadata=metadata,
            customer_email=current_user.get("email") if current_user else None
        )
        
        # Create payment transaction record
        transaction = PaymentTransaction(
            user_id=current_user.get("id") if current_user else None,
            email=current_user.get("email") if current_user else None,
            plan_id=checkout_req.plan_id,
            amount=plan["price"],
            currency=plan["currency"],
            session_id=session.id,
            payment_status="pending",
            expires_at=datetime.now(timezone.utc) + timedelta(hours=24),
            metadata=metadata
        )
        
        # Save to database
        await db.payment_transactions.insert_one(transaction.model_dump(mode='json'))
        
        return CheckoutSessionResponse(
            session_id=session.id,
            checkout_url=session.url
        )
        
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

@stripe_router.get("/status/{session_id}", response_model=CheckoutStatusResponse)
async def get_payment_status(session_id: str):
    """Get payment status for a session"""
    
    try:
        # Get session from Stripe
        session = stripe.checkout.Session.retrieve(session_id)
        
        payment_status = "pending"
        if session.payment_status == "paid":
            payment_status = "paid"
        elif session.status == "expired":
            payment_status = "expired"
        
        # Update database if paid
        if payment_status == "paid":
            transaction = await db.payment_transactions.find_one({"session_id": session_id})
            
            if transaction and transaction.get("payment_status") != "paid":
                # Update transaction
                await db.payment_transactions.update_one(
                    {"session_id": session_id},
                    {"$set": {"payment_status": "paid"}}
                )
                
                # Update user subscription if user exists
                user_id = transaction.get("user_id")
                plan_id = transaction.get("plan_id")
                
                if user_id and user_id != "guest":
                    plan = SUBSCRIPTION_PLANS.get(plan_id, {})
                    
                    # Calculate expiry
                    if plan_id == "test":
                        expires_at = datetime.now(timezone.utc) + timedelta(days=1)
                    else:  # pro or premium
                        expires_at = datetime.now(timezone.utc) + timedelta(days=30)
                    
                    # Update user
                    await db.users.update_one(
                        {"id": user_id},
                        {
                            "$set": {
                                "subscription_tier": plan_id,
                                "subscription_expires_at": expires_at.isoformat(),
                                "max_exchanges": plan.get("max_exchanges", 2)
                            }
                        }
                    )
        
        return CheckoutStatusResponse(
            session_id=session_id,
            payment_status=payment_status,
            customer_email=session.customer_email
        )
        
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

@stripe_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhooks"""
    
    # Get webhook body and signature
    body = await request.body()
    signature = request.headers.get("Stripe-Signature")
    webhook_secret = os.environ.get('STRIPE_WEBHOOK_SECRET')
    
    try:
        if webhook_secret:
            event = stripe.Webhook.construct_event(body, signature, webhook_secret)
        else:
            # Without webhook secret, just parse the event
            import json
            event = stripe.Event.construct_from(json.loads(body), stripe.api_key)
        
        # Handle checkout.session.completed event
        if event.type == 'checkout.session.completed':
            session = event.data.object
            
            if session.payment_status == "paid":
                await db.payment_transactions.update_one(
                    {"session_id": session.id},
                    {"$set": {"payment_status": "paid"}}
                )
                
                # Get transaction and update user
                transaction = await db.payment_transactions.find_one({"session_id": session.id})
                if transaction:
                    user_id = transaction.get("user_id")
                    plan_id = transaction.get("plan_id")
                    
                    if user_id and user_id != "guest":
                        plan = SUBSCRIPTION_PLANS.get(plan_id, {})
                        
                        if plan_id == "test":
                            expires_at = datetime.now(timezone.utc) + timedelta(days=1)
                        else:
                            expires_at = datetime.now(timezone.utc) + timedelta(days=30)
                        
                        await db.users.update_one(
                            {"id": user_id},
                            {
                                "$set": {
                                    "subscription_tier": plan_id,
                                    "subscription_expires_at": expires_at.isoformat(),
                                    "max_exchanges": plan.get("max_exchanges", 2)
                                }
                            }
                        )
        
        return {"status": "success"}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
