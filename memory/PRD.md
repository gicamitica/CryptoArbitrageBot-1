# ArbitrajZ - Crypto Arbitrage Trading Platform

## Project Overview
**Name:** ArbitrajZ  
**Type:** Full-stack Crypto Arbitrage Trading Application  
**Stack:** React + FastAPI + MongoDB  
**Status:** MVP Complete with Stripe Integration

---

## Core Requirements

### User Features
1. **Authentication** - JWT-based login/register
2. **Dashboard** - Live crypto prices (24 coins), arbitrage opportunities
3. **Trading Page** - Execute trades (mock)
4. **Pricing Page** - 3 subscription tiers with Stripe checkout

### Subscription Plans (Stripe)
| Plan | Price | Duration | Exchanges |
|------|-------|----------|-----------|
| Test | $1 | /day | 2 |
| Pro | $29 | /month | 5 |
| Premium | $99 | /month | Unlimited |

### Admin Features
- **Super Admin Panel** - Password protected (/super-admin)
- View all users, paid users, revenue
- Password: `ArbitrajZ_SuperAdmin_2025_Secure!`

---

## What's Implemented

### Backend (FastAPI)
- [x] JWT Authentication (register, login, /auth/me)
- [x] Mock data for 24 cryptocurrencies, 11 exchanges
- [x] Arbitrage detection algorithm
- [x] Stripe integration (checkout, status, webhooks)
- [x] Super Admin routes (login, dashboard, user management)
- [x] Payment transaction tracking in MongoDB

### Frontend (React)
- [x] Landing Page with animated tutorials
- [x] Login/Register pages
- [x] Dashboard with live prices
- [x] Trading Page
- [x] Pricing Page with 3 plans
- [x] PaymentSuccess page with status polling
- [x] Super Admin Panel
- [x] Dark/Light theme toggle
- [x] Custom logo integration

### Testing
- [x] Backend: 16/16 pytest tests passing
- [x] Frontend: All flows verified
- [x] Stripe checkout flow working end-to-end

---

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Crypto
- `GET /api/crypto/prices` - Get all prices
- `GET /api/crypto/arbitrage` - Get opportunities
- `GET /api/crypto/symbols` - Get supported coins

### Payments (Stripe)
- `POST /api/payments/checkout` - Create checkout session
- `GET /api/payments/status/{session_id}` - Get payment status
- `POST /api/payments/webhook/stripe` - Handle webhooks

### Super Admin
- `POST /api/super-admin/login` - Admin login
- `GET /api/super-admin/dashboard` - Get stats & users

---

## Backlog (Prioritized)

### P0 - Critical
- [ ] **API Key Management Page** - Users add exchange keys securely

### P1 - High Priority  
- [ ] Real exchange integration (ccxt library)
- [ ] Feature gating by subscription tier

### P2 - Medium Priority
- [ ] Auto-trading bot for Premium users
- [ ] Email/WhatsApp alerts

### P3 - Low Priority
- [ ] YouTube video placeholder on landing page
- [ ] PDF guide download

---

## Technical Notes

### Important Files
- `backend/server.py` - Main FastAPI app
- `backend/stripe_routes.py` - Stripe integration
- `backend/super_admin_routes.py` - Admin panel
- `frontend/src/pages/PricingPage.js` - Subscription UI
- `frontend/src/pages/PaymentSuccess.js` - Post-payment

### Mock Data
All crypto prices and arbitrage opportunities are **SIMULATED**. No real exchange connections yet.

### Credentials
- **Admin User:** admin@cryptoarbitrage.com / admin123
- **Super Admin:** Password in backend/.env

---

## Last Updated
**Date:** March 18, 2026  
**Session:** Stripe integration testing completed
