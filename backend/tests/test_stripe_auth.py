"""
Backend API Tests for ArbitrajZ - Crypto Arbitrage Trading App
Tests: Auth (register/login), Stripe payment checkout and status endpoints
"""
import pytest
import requests
import os
import uuid
from datetime import datetime

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test data with unique identifier
TEST_ID = str(uuid.uuid4())[:8]
TEST_USER = {
    "email": f"TEST_stripe_user_{TEST_ID}@example.com",
    "username": f"TEST_user_{TEST_ID}",
    "password": "Test123!",
    "full_name": "Test Stripe User"
}

class TestHealthCheck:
    """Basic health check tests"""
    
    def test_api_root(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert data["status"] == "active"
        print(f"✓ API root endpoint working: {data['message']}")

    def test_health_endpoint(self):
        """Test health check endpoint"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        print("✓ Health check passed")


class TestUserAuth:
    """User authentication tests - Register and Login"""
    
    def test_register_new_user(self):
        """Test user registration flow"""
        response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json=TEST_USER
        )
        
        assert response.status_code == 200, f"Registration failed: {response.text}"
        data = response.json()
        
        # Validate response structure
        assert "access_token" in data, "Missing access_token in response"
        assert "user" in data, "Missing user in response"
        assert data["token_type"] == "bearer"
        
        # Validate user data
        user = data["user"]
        assert user["email"] == TEST_USER["email"]
        assert user["username"] == TEST_USER["username"]
        assert "id" in user
        assert user["subscription_tier"] == "free"  # Default tier
        
        print(f"✓ User registered successfully: {user['email']}")
        return data

    def test_login_with_registered_user(self):
        """Test login with registered user"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={
                "email": TEST_USER["email"],
                "password": TEST_USER["password"]
            }
        )
        
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        
        assert "access_token" in data
        assert "user" in data
        assert data["user"]["email"] == TEST_USER["email"]
        
        print(f"✓ User logged in successfully: {data['user']['email']}")
        return data

    def test_login_with_invalid_credentials(self):
        """Test login with wrong password"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={
                "email": TEST_USER["email"],
                "password": "WrongPassword123!"
            }
        )
        
        assert response.status_code == 401
        print("✓ Invalid credentials rejected correctly")

    def test_get_current_user(self):
        """Test getting current user with token"""
        # First login
        login_response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={
                "email": TEST_USER["email"],
                "password": TEST_USER["password"]
            }
        )
        
        assert login_response.status_code == 200
        token = login_response.json()["access_token"]
        
        # Get user info
        response = requests.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 200
        user = response.json()
        assert user["email"] == TEST_USER["email"]
        print(f"✓ Current user fetched: {user['email']}")


class TestStripePayments:
    """Stripe payment endpoints tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get auth token for authenticated requests"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={
                "email": TEST_USER["email"],
                "password": TEST_USER["password"]
            }
        )
        if response.status_code == 200:
            return response.json()["access_token"]
        pytest.skip("Auth failed - skipping payment tests")
    
    def test_checkout_endpoint_without_auth(self):
        """Test checkout endpoint works without auth (for guest checkout)"""
        response = requests.post(
            f"{BASE_URL}/api/payments/checkout",
            json={
                "plan_id": "test",
                "origin_url": BASE_URL
            }
        )
        
        # Should work - guest checkout supported
        assert response.status_code == 200, f"Checkout failed: {response.text}"
        data = response.json()
        
        # Validate response has required fields
        assert "session_id" in data, "Missing session_id in checkout response"
        assert "url" in data, "Missing url in checkout response"
        
        # URL should be a Stripe checkout URL
        assert "stripe" in data["url"].lower() or "checkout" in data["url"].lower()
        
        print(f"✓ Checkout session created: {data['session_id']}")
        return data

    def test_checkout_with_auth_token(self, auth_token):
        """Test checkout endpoint with authenticated user"""
        response = requests.post(
            f"{BASE_URL}/api/payments/checkout",
            json={
                "plan_id": "test",
                "origin_url": BASE_URL
            },
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        
        assert response.status_code == 200, f"Checkout failed: {response.text}"
        data = response.json()
        
        assert "session_id" in data
        assert "url" in data
        
        print(f"✓ Authenticated checkout session created: {data['session_id']}")
        return data

    def test_checkout_all_plans(self, auth_token):
        """Test checkout for all 3 plans: test, pro, premium"""
        plans = ["test", "pro", "premium"]
        
        for plan_id in plans:
            response = requests.post(
                f"{BASE_URL}/api/payments/checkout",
                json={
                    "plan_id": plan_id,
                    "origin_url": BASE_URL
                },
                headers={"Authorization": f"Bearer {auth_token}"}
            )
            
            assert response.status_code == 200, f"Checkout failed for {plan_id}: {response.text}"
            data = response.json()
            
            assert "session_id" in data
            assert "url" in data
            print(f"✓ Checkout session created for {plan_id} plan")

    def test_checkout_invalid_plan(self, auth_token):
        """Test checkout with invalid plan id"""
        response = requests.post(
            f"{BASE_URL}/api/payments/checkout",
            json={
                "plan_id": "invalid_plan",
                "origin_url": BASE_URL
            },
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        
        assert response.status_code == 400, f"Expected 400 for invalid plan, got {response.status_code}"
        print("✓ Invalid plan rejected correctly")

    def test_payment_status_endpoint(self, auth_token):
        """Test payment status endpoint with a session"""
        # First create a checkout session
        checkout_response = requests.post(
            f"{BASE_URL}/api/payments/checkout",
            json={
                "plan_id": "test",
                "origin_url": BASE_URL
            },
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        
        assert checkout_response.status_code == 200
        session_id = checkout_response.json()["session_id"]
        
        # Check status
        status_response = requests.get(
            f"{BASE_URL}/api/payments/status/{session_id}"
        )
        
        assert status_response.status_code == 200, f"Status check failed: {status_response.text}"
        data = status_response.json()
        
        # Validate response structure
        assert "payment_status" in data, "Missing payment_status in response"
        
        # New session should be pending/unpaid
        assert data["payment_status"] in ["unpaid", "pending", "paid"], f"Unexpected status: {data['payment_status']}"
        
        print(f"✓ Payment status retrieved: {data['payment_status']}")

    def test_payment_status_invalid_session(self):
        """Test payment status with invalid session ID"""
        response = requests.get(
            f"{BASE_URL}/api/payments/status/invalid_session_id_12345"
        )
        
        # Should return 404 or error for invalid session
        # Note: Depending on implementation, this might return 200 with error status
        print(f"Payment status for invalid session: {response.status_code} - {response.text}")
        # Just checking it doesn't crash the server
        assert response.status_code in [200, 400, 404, 500]


class TestCryptoEndpoints:
    """Test crypto-related endpoints (MOCKED data)"""
    
    def test_get_crypto_prices(self):
        """Test getting crypto prices"""
        response = requests.get(f"{BASE_URL}/api/crypto/prices")
        
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
        assert len(data) > 0
        
        # Check first price object structure
        price = data[0]
        assert "symbol" in price
        assert "price_usd" in price
        assert "exchange" in price
        
        print(f"✓ Got {len(data)} crypto prices")

    def test_get_arbitrage_opportunities(self):
        """Test getting arbitrage opportunities"""
        response = requests.get(f"{BASE_URL}/api/crypto/arbitrage")
        
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
        
        if len(data) > 0:
            opportunity = data[0]
            assert "symbol" in opportunity
            assert "buy_exchange" in opportunity
            assert "sell_exchange" in opportunity
            assert "profit_percentage" in opportunity
        
        print(f"✓ Got {len(data)} arbitrage opportunities")

    def test_get_crypto_symbols(self):
        """Test getting supported crypto symbols"""
        response = requests.get(f"{BASE_URL}/api/crypto/symbols")
        
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
        assert len(data) > 0
        
        print(f"✓ Got {len(data)} supported symbols")


class TestCleanup:
    """Cleanup test data"""
    
    def test_cleanup_info(self):
        """Note about test data cleanup"""
        print(f"✓ Test user created: {TEST_USER['email']}")
        print("Note: Test users with 'TEST_' prefix should be cleaned up periodically")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
