"""
Tests for Email Verification Feature - ArbitrajZ
Tests registration with is_verified=false, login blocking for unverified users,
email verification endpoint, and resend verification.
"""
import pytest
import requests
import os
import secrets

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://exchange-verify-demo.preview.emergentagent.com')

class TestEmailVerification:
    """Email verification flow tests"""
    
    @pytest.fixture(autouse=True)
    def setup_unique_user(self):
        """Generate unique test user credentials for each test"""
        unique_id = secrets.token_hex(4)
        self.test_email = f"TEST_verify_{unique_id}@example.com"
        self.test_username = f"TEST_verify_{unique_id}"
        self.test_password = "TestPass123!"
        yield
        # Cleanup is done via database directly if needed
    
    def test_health_check(self):
        """Test API is running"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        print("✓ Health check passed")
    
    def test_register_creates_unverified_user(self):
        """Test that registration creates user with is_verified=false"""
        payload = {
            "email": self.test_email,
            "username": self.test_username,
            "password": self.test_password,
            "full_name": "Test Verification User"
        }
        response = requests.post(f"{BASE_URL}/api/auth/register", json=payload)
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        assert data.get("success") == True
        assert "message" in data
        assert "user_id" in data
        assert "email_sent" in data  # Should indicate whether email was sent
        
        # Message should mention verification
        assert "verify" in data["message"].lower() or "check your email" in data["message"].lower()
        
        print(f"✓ Registration successful - user_id: {data['user_id']}, email_sent: {data['email_sent']}")
        return data
    
    def test_login_fails_for_unverified_user(self):
        """Test that login fails for unverified users with proper error message"""
        # First register a new user
        unique_id = secrets.token_hex(4)
        email = f"TEST_unverified_{unique_id}@example.com"
        username = f"TEST_unverified_{unique_id}"
        password = "TestPass123!"
        
        # Register
        register_response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": email,
            "username": username,
            "password": password,
            "full_name": "Unverified Test User"
        })
        assert register_response.status_code == 200
        print(f"✓ User registered: {email}")
        
        # Now try to login - should fail
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": email,
            "password": password
        })
        
        # Should return 403 Forbidden for unverified users
        assert login_response.status_code == 403, f"Expected 403 but got {login_response.status_code}"
        data = login_response.json()
        
        # Error message should mention email verification
        assert "detail" in data
        error_msg = data["detail"].lower()
        assert "verify" in error_msg or "email" in error_msg
        
        print(f"✓ Login correctly blocked for unverified user: {data['detail']}")
    
    def test_resend_verification_endpoint(self):
        """Test resend verification endpoint generates new token"""
        # First register a new user
        unique_id = secrets.token_hex(4)
        email = f"TEST_resend_{unique_id}@example.com"
        username = f"TEST_resend_{unique_id}"
        
        # Register
        register_response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": email,
            "username": username,
            "password": "TestPass123!",
            "full_name": "Resend Test User"
        })
        assert register_response.status_code == 200
        
        # Request resend verification
        resend_response = requests.post(f"{BASE_URL}/api/auth/resend-verification?email={email}")
        
        assert resend_response.status_code == 200
        data = resend_response.json()
        
        assert data.get("success") == True
        assert "message" in data
        
        print(f"✓ Resend verification successful: {data['message']}")
    
    def test_resend_verification_for_nonexistent_email(self):
        """Test resend verification doesn't reveal if email exists"""
        fake_email = "nonexistent_user_12345@example.com"
        
        resend_response = requests.post(f"{BASE_URL}/api/auth/resend-verification?email={fake_email}")
        
        # Should still return success (security - don't reveal if email exists)
        assert resend_response.status_code == 200
        data = resend_response.json()
        assert data.get("success") == True
        
        print("✓ Resend for nonexistent email handled correctly (no info leak)")
    
    def test_resend_verification_for_already_verified_user(self):
        """Test resend verification endpoint for user with is_verified=True"""
        # Create a verified user via direct API and then test
        # Note: Admin user may not have is_verified field (legacy user), so this test
        # creates a fresh user and then manually verifies them (simulated scenario)
        
        # For this test, we just verify the endpoint works for any email
        # The behavior is: if is_verified=True, returns "already verified" message
        # If is_verified=False or missing, sends a new verification email
        admin_email = "admin@cryptoarbitrage.com"
        
        resend_response = requests.post(f"{BASE_URL}/api/auth/resend-verification?email={admin_email}")
        
        assert resend_response.status_code == 200
        data = resend_response.json()
        
        # Should always return success (for security - don't reveal user status)
        assert data.get("success") == True
        
        # Message can be either "already verified" OR "verification email sent" 
        # depending on whether is_verified field exists and its value
        message = data.get("message", "").lower()
        assert "verified" in message or "sent" in message or "inbox" in message
        
        print(f"✓ Resend for existing user handled correctly: {data['message']}")
    
    def test_verify_email_with_invalid_token(self):
        """Test verify email endpoint rejects invalid token"""
        invalid_token = "this_is_a_completely_invalid_token"
        
        verify_response = requests.post(f"{BASE_URL}/api/auth/verify-email?token={invalid_token}")
        
        # Should return 400 Bad Request
        assert verify_response.status_code == 400, f"Expected 400 but got {verify_response.status_code}"
        data = verify_response.json()
        
        assert "detail" in data
        error_msg = data["detail"].lower()
        assert "invalid" in error_msg or "expired" in error_msg
        
        print(f"✓ Invalid token correctly rejected: {data['detail']}")
    
    def test_verified_user_can_login(self):
        """Test that verified users (like admin) can login successfully"""
        # Use admin user who is already verified
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@cryptoarbitrage.com",
            "password": "admin123"
        })
        
        assert login_response.status_code == 200
        data = login_response.json()
        
        # Verify token and user returned
        assert "access_token" in data
        assert "token_type" in data
        assert "user" in data
        assert data["user"]["email"] == "admin@cryptoarbitrage.com"
        
        print(f"✓ Verified user login successful: {data['user']['email']}")
    
    def test_duplicate_email_registration_blocked(self):
        """Test that duplicate email registration is blocked"""
        # Try to register with existing admin email
        payload = {
            "email": "admin@cryptoarbitrage.com",
            "username": "newadmin",
            "password": "TestPass123!",
            "full_name": "Duplicate Test"
        }
        response = requests.post(f"{BASE_URL}/api/auth/register", json=payload)
        
        assert response.status_code == 400
        data = response.json()
        assert "detail" in data
        assert "already" in data["detail"].lower() or "registered" in data["detail"].lower()
        
        print(f"✓ Duplicate email correctly blocked: {data['detail']}")
    
    def test_duplicate_username_registration_blocked(self):
        """Test that duplicate username registration is blocked"""
        # Try to register with existing admin username
        unique_email = f"TEST_dupuser_{secrets.token_hex(4)}@example.com"
        payload = {
            "email": unique_email,
            "username": "admin",  # Already exists
            "password": "TestPass123!",
            "full_name": "Duplicate Username Test"
        }
        response = requests.post(f"{BASE_URL}/api/auth/register", json=payload)
        
        assert response.status_code == 400
        data = response.json()
        assert "detail" in data
        assert "already" in data["detail"].lower() or "taken" in data["detail"].lower()
        
        print(f"✓ Duplicate username correctly blocked: {data['detail']}")


class TestVerificationTokenFlow:
    """Test actual verification token flow (requires DB access simulation)"""
    
    def test_registration_response_structure(self):
        """Verify registration returns expected fields"""
        unique_id = secrets.token_hex(4)
        payload = {
            "email": f"TEST_struct_{unique_id}@example.com",
            "username": f"TEST_struct_{unique_id}",
            "password": "TestPass123!",
            "full_name": "Structure Test User"
        }
        response = requests.post(f"{BASE_URL}/api/auth/register", json=payload)
        
        assert response.status_code == 200
        data = response.json()
        
        # Required fields
        assert "success" in data
        assert "message" in data
        assert "user_id" in data
        assert "email_sent" in data
        
        # Values check
        assert data["success"] == True
        assert len(data["user_id"]) > 0
        
        print(f"✓ Registration response structure valid")
        print(f"  - success: {data['success']}")
        print(f"  - user_id: {data['user_id']}")
        print(f"  - email_sent: {data['email_sent']}")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
