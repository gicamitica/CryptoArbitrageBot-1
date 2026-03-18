"""
Email Service using Resend
Handles verification emails and notifications
"""
import resend
import os
from typing import Optional
import logging

logger = logging.getLogger(__name__)

# Initialize Resend
resend.api_key = os.environ.get('RESEND_API_KEY')
# Use Resend's test domain if custom domain isn't verified yet
# Once arbitrajz.com is verified in Resend, update RESEND_FROM_EMAIL in .env
FROM_EMAIL = os.environ.get('RESEND_FROM_EMAIL', 'onboarding@resend.dev')
APP_NAME = "ArbitrajZ"

# Check if we're using production domain
IS_PRODUCTION_DOMAIN = 'arbitrajz.com' in FROM_EMAIL


def send_verification_email(to_email: str, username: str, verification_token: str, base_url: str) -> bool:
    """
    Send email verification link to new user
    """
    verification_link = f"{base_url}/verify-email?token={verification_token}"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; background-color: #1a1a2e; color: #ffffff; padding: 40px; }}
            .container {{ max-width: 600px; margin: 0 auto; background-color: #16213e; border-radius: 16px; padding: 40px; }}
            .logo {{ text-align: center; margin-bottom: 30px; }}
            .logo h1 {{ color: #8b5cf6; font-size: 32px; margin: 0; }}
            h2 {{ color: #ffffff; margin-bottom: 20px; }}
            p {{ color: #a0aec0; line-height: 1.6; }}
            .button {{ display: inline-block; background: linear-gradient(to right, #8b5cf6, #ec4899); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }}
            .footer {{ margin-top: 40px; text-align: center; color: #64748b; font-size: 12px; }}
            .link {{ color: #60a5fa; word-break: break-all; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">
                <h1>🚀 {APP_NAME}</h1>
            </div>
            <h2>Welcome, {username}!</h2>
            <p>Thank you for signing up for ArbitrajZ. Please verify your email address to start trading.</p>
            <p style="text-align: center;">
                <a href="{verification_link}" class="button">Verify Email Address</a>
            </p>
            <p>Or copy and paste this link in your browser:</p>
            <p class="link">{verification_link}</p>
            <p><strong>This link expires in 24 hours.</strong></p>
            <div class="footer">
                <p>If you didn't create an account on ArbitrajZ, you can safely ignore this email.</p>
                <p>&copy; 2026 ArbitrajZ. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    text_content = f"""
    Welcome to {APP_NAME}, {username}!
    
    Please verify your email address by clicking the link below:
    {verification_link}
    
    This link expires in 24 hours.
    
    If you didn't create an account, you can safely ignore this email.
    """
    
    try:
        params = {
            "from": f"{APP_NAME} <{FROM_EMAIL}>",
            "to": [to_email],
            "subject": f"Verify your {APP_NAME} account",
            "html": html_content,
            "text": text_content
        }
        
        response = resend.Emails.send(params)
        logger.info(f"Verification email sent to {to_email}: {response}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send verification email to {to_email}: {e}")
        return False


def send_welcome_email(to_email: str, username: str) -> bool:
    """
    Send welcome email after verification
    """
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; background-color: #1a1a2e; color: #ffffff; padding: 40px; }}
            .container {{ max-width: 600px; margin: 0 auto; background-color: #16213e; border-radius: 16px; padding: 40px; }}
            .logo {{ text-align: center; margin-bottom: 30px; }}
            .logo h1 {{ color: #8b5cf6; font-size: 32px; margin: 0; }}
            h2 {{ color: #ffffff; margin-bottom: 20px; }}
            p {{ color: #a0aec0; line-height: 1.6; }}
            .button {{ display: inline-block; background: linear-gradient(to right, #8b5cf6, #ec4899); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }}
            .steps {{ background-color: #1a1a2e; border-radius: 8px; padding: 20px; margin: 20px 0; }}
            .step {{ display: flex; align-items: center; margin: 10px 0; }}
            .step-num {{ background: #8b5cf6; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; }}
            .footer {{ margin-top: 40px; text-align: center; color: #64748b; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">
                <h1>🚀 {APP_NAME}</h1>
            </div>
            <h2>You're all set, {username}! 🎉</h2>
            <p>Your email has been verified. You're ready to start profiting from crypto arbitrage!</p>
            
            <div class="steps">
                <h3 style="color: #fff; margin-top: 0;">Quick Start:</h3>
                <div class="step">
                    <span class="step-num">1</span>
                    <span>Choose a subscription plan</span>
                </div>
                <div class="step">
                    <span class="step-num">2</span>
                    <span>Connect your exchange API keys</span>
                </div>
                <div class="step">
                    <span class="step-num">3</span>
                    <span>Start trading!</span>
                </div>
            </div>
            
            <p style="text-align: center;">
                <a href="https://arbitrajz.com/dashboard" class="button">Go to Dashboard</a>
            </p>
            
            <div class="footer">
                <p>&copy; 2026 ArbitrajZ. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    try:
        params = {
            "from": f"{APP_NAME} <{FROM_EMAIL}>",
            "to": [to_email],
            "subject": f"Welcome to {APP_NAME}! 🚀",
            "html": html_content
        }
        
        response = resend.Emails.send(params)
        logger.info(f"Welcome email sent to {to_email}: {response}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send welcome email to {to_email}: {e}")
        return False
