from fastapi import FastAPI, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
import os
import jwt
import requests
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from dotenv import load_dotenv
from supabase import create_client, Client
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI(title="Auth Server with Supabase")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
JWT_SECRET = os.getenv("JWT_SECRET_KEY", "test_secret_key_for_development")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:8080")

# Supabase Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Initialize Supabase client
supabase: Client = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        logger.info("✅ Supabase client initialized successfully")
    except Exception as e:
        logger.error(f"❌ Failed to initialize Supabase client: {str(e)}")
else:
    logger.warning("⚠️ Supabase credentials not found - user data will not be persisted")

def create_jwt_token(user_data: Dict[str, Any]) -> str:
    """Create a JWT token for the user"""
    payload = {
        "user_id": user_data.get("id"),
        "email": user_data.get("email"),
        "name": user_data.get("name"),
        "provider": user_data.get("provider"),
        "exp": datetime.utcnow() + timedelta(hours=24),
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def verify_jwt_token(token: str) -> Dict[str, Any]:
    """Verify and decode a JWT token"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

def save_user_to_supabase(user_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Save or update user data in Supabase"""
    if not supabase:
        logger.warning("Supabase not configured - skipping user save")
        return None
    
    try:
        # Check if user already exists
        existing_user = supabase.table("users").select("*").eq("provider_id", user_data["id"]).eq("provider", user_data["provider"]).execute()
        
        user_record = {
            "provider_id": user_data["id"],
            "email": user_data["email"],
            "name": user_data["name"],
            "picture": user_data.get("picture"),
            "provider": user_data["provider"],
            "last_login": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        if existing_user.data:
            # Update existing user
            result = supabase.table("users").update(user_record).eq("id", existing_user.data[0]["id"]).execute()
            logger.info(f"✅ Updated existing user: {user_data['email']}")
            return result.data[0] if result.data else None
        else:
            # Create new user
            user_record["created_at"] = datetime.utcnow().isoformat()
            result = supabase.table("users").insert(user_record).execute()
            logger.info(f"✅ Created new user: {user_data['email']}")
            return result.data[0] if result.data else None
            
    except Exception as e:
        logger.error(f"❌ Failed to save user to Supabase: {str(e)}")
        return None

def save_login_event(user_id: str, provider: str, success: bool = True) -> None:
    """Save login event to Supabase for analytics"""
    if not supabase:
        return
    
    try:
        login_event = {
            "user_id": user_id,
            "provider": provider,
            "success": success,
            "timestamp": datetime.utcnow().isoformat(),
            "ip_address": "localhost",  # In production, get real IP
            "user_agent": "RoastMyStartup App"  # In production, get real user agent
        }
        
        supabase.table("login_events").insert(login_event).execute()
        logger.info(f"✅ Logged login event for user: {user_id}")
        
    except Exception as e:
        logger.error(f"❌ Failed to save login event: {str(e)}")

@app.get("/")
async def root():
    return {
        "message": "Auth Server with Supabase Running",
        "supabase_connected": supabase is not None
    }

@app.get("/test-db")
async def test_database():
    """Test database connection and table access"""
    if not supabase:
        return {"error": "Supabase not configured"}
    
    try:
        # Test users table
        users_result = supabase.table("users").select("count").execute()
        login_events_result = supabase.table("login_events").select("count").execute()
        
        return {
            "database_connected": True,
            "users_table": "accessible",
            "login_events_table": "accessible",
            "users_count": len(users_result.data) if users_result.data else 0,
            "login_events_count": len(login_events_result.data) if login_events_result.data else 0
        }
    except Exception as e:
        return {
            "database_connected": False,
            "error": str(e)
        }

@app.get("/auth/google")
async def google_login():
    """Initiate Google OAuth login"""
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=500, detail="Google OAuth not configured")
    
    google_auth_url = "https://accounts.google.com/o/oauth2/auth"
    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": "http://localhost:8002/auth/google/callback",
        "scope": "openid email profile",
        "response_type": "code",
        "access_type": "offline",
        "prompt": "consent"
    }
    
    query_string = "&".join([f"{key}={value}" for key, value in params.items()])
    auth_url = f"{google_auth_url}?{query_string}"
    return {"auth_url": auth_url}

@app.get("/auth/github")
async def github_login():
    """Initiate GitHub OAuth login"""
    if not GITHUB_CLIENT_ID:
        raise HTTPException(status_code=500, detail="GitHub OAuth not configured")
    
    github_auth_url = "https://github.com/login/oauth/authorize"
    params = {
        "client_id": GITHUB_CLIENT_ID,
        "redirect_uri": "http://localhost:8002/auth/github/callback",
        "scope": "user:email",
        "response_type": "code"
    }
    
    query_string = "&".join([f"{key}={value}" for key, value in params.items()])
    auth_url = f"{github_auth_url}?{query_string}"
    return {"auth_url": auth_url}

@app.get("/auth/google/callback")
async def google_callback(code: str = Query(...)):
    """Handle Google OAuth callback"""
    logger.info(f"🔄 Google OAuth callback received with code: {code[:20]}...")
    
    try:
        # Exchange code for access token
        token_url = "https://oauth2.googleapis.com/token"
        token_data = {
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": "http://localhost:8002/auth/google/callback"
        }
        
        logger.info("🔄 Exchanging code for access token...")
        token_response = requests.post(token_url, data=token_data)
        token_response.raise_for_status()
        token_json = token_response.json()
        
        access_token = token_json.get("access_token")
        if not access_token:
            raise HTTPException(status_code=400, detail="Failed to get access token")
        
        logger.info("✅ Access token received, fetching user info...")
        
        # Get user info from Google
        user_info_url = f"https://www.googleapis.com/oauth2/v2/userinfo?access_token={access_token}"
        user_response = requests.get(user_info_url)
        user_response.raise_for_status()
        user_data = user_response.json()
        
        # Format user data
        formatted_user_data = {
            "id": user_data.get("id"),
            "email": user_data.get("email"),
            "name": user_data.get("name"),
            "picture": user_data.get("picture"),
            "provider": "google"
        }
        
        logger.info(f"✅ User info received: {formatted_user_data['name']} ({formatted_user_data['email']})")
        
        # Save user to Supabase
        logger.info("💾 Saving user to Supabase...")
        saved_user = save_user_to_supabase(formatted_user_data)
        
        # Log login event
        save_login_event(formatted_user_data["id"], "google", True)
        
        # Create JWT token
        token = create_jwt_token(formatted_user_data)
        logger.info("🎫 JWT token created, redirecting to frontend...")
        
        # Redirect to frontend with token
        frontend_url = f"{FRONTEND_URL}/auth/success?token={token}"
        return RedirectResponse(url=frontend_url)
        
    except Exception as e:
        logger.error(f"❌ Google callback error: {str(e)}")
        # Log failed login event
        save_login_event("unknown", "google", False)
        error_url = f"{FRONTEND_URL}/auth/error?message=Google authentication failed"
        return RedirectResponse(url=error_url)

@app.get("/auth/github/callback")
async def github_callback(code: str = Query(...)):
    """Handle GitHub OAuth callback"""
    logger.info(f"🔄 GitHub OAuth callback received with code: {code[:20]}...")
    
    try:
        # Exchange code for access token
        token_url = "https://github.com/login/oauth/access_token"
        token_data = {
            "client_id": GITHUB_CLIENT_ID,
            "client_secret": GITHUB_CLIENT_SECRET,
            "code": code
        }
        
        logger.info("🔄 Exchanging code for access token...")
        headers = {"Accept": "application/json"}
        token_response = requests.post(token_url, data=token_data, headers=headers)
        token_response.raise_for_status()
        token_json = token_response.json()
        
        access_token = token_json.get("access_token")
        if not access_token:
            raise HTTPException(status_code=400, detail="Failed to get access token")
        
        logger.info("✅ Access token received, fetching user info...")
        
        # Get user info from GitHub
        headers = {
            "Authorization": f"token {access_token}",
            "Accept": "application/json"
        }
        
        user_response = requests.get("https://api.github.com/user", headers=headers)
        user_response.raise_for_status()
        user_data = user_response.json()
        
        # Get user email (might be private)
        email_response = requests.get("https://api.github.com/user/emails", headers=headers)
        email_response.raise_for_status()
        emails = email_response.json()
        
        primary_email = None
        for email in emails:
            if email.get("primary", False):
                primary_email = email.get("email")
                break
        
        # Format user data
        formatted_user_data = {
            "id": str(user_data.get("id")),
            "email": primary_email or user_data.get("email"),
            "name": user_data.get("name") or user_data.get("login"),
            "picture": user_data.get("avatar_url"),
            "provider": "github"
        }
        
        logger.info(f"✅ User info received: {formatted_user_data['name']} ({formatted_user_data['email']})")
        
        # Save user to Supabase
        logger.info("💾 Saving user to Supabase...")
        saved_user = save_user_to_supabase(formatted_user_data)
        
        # Log login event
        save_login_event(formatted_user_data["id"], "github", True)
        
        # Create JWT token
        token = create_jwt_token(formatted_user_data)
        logger.info("🎫 JWT token created, redirecting to frontend...")
        
        # Redirect to frontend with token
        frontend_url = f"{FRONTEND_URL}/auth/success?token={token}"
        return RedirectResponse(url=frontend_url)
        
    except Exception as e:
        logger.error(f"❌ GitHub callback error: {str(e)}")
        # Log failed login event
        save_login_event("unknown", "github", False)
        error_url = f"{FRONTEND_URL}/auth/error?message=GitHub authentication failed"
        return RedirectResponse(url=error_url)

@app.post("/auth/verify")
async def verify_token(request: dict):
    """Verify JWT token and return user data"""
    try:
        token = request.get("token")
        if not token:
            return {"valid": False, "error": "No token provided"}
        
        user_data = verify_jwt_token(token)
        return {"valid": True, "user": user_data}
    except HTTPException:
        return {"valid": False, "error": "Invalid or expired token"}

@app.post("/test-user-creation")
async def test_user_creation():
    """Test user creation with dummy data"""
    if not supabase:
        return {"error": "Supabase not configured"}
    
    # Test user data
    test_user_data = {
        "id": "test_123",
        "email": "test@example.com",
        "name": "Test User",
        "picture": "https://example.com/avatar.jpg",
        "provider": "google"
    }
    
    try:
        saved_user = save_user_to_supabase(test_user_data)
        save_login_event(test_user_data["id"], "google", True)
        
        return {
            "success": True,
            "saved_user": saved_user,
            "message": "Test user created successfully"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@app.get("/users/{user_id}")
async def get_user_profile(user_id: str):
    """Get user profile from Supabase"""
    if not supabase:
        raise HTTPException(status_code=503, detail="Database not available")
    
    try:
        result = supabase.table("users").select("*").eq("provider_id", user_id).execute()
        if result.data:
            return result.data[0]
        else:
            raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        logger.error(f"Failed to get user profile: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve user profile")

@app.get("/users/{user_id}/login-history")
async def get_user_login_history(user_id: str):
    """Get user login history from Supabase"""
    if not supabase:
        raise HTTPException(status_code=503, detail="Database not available")
    
    try:
        result = supabase.table("login_events").select("*").eq("user_id", user_id).order("timestamp", desc=True).limit(50).execute()
        return {"login_history": result.data}
    except Exception as e:
        logger.error(f"Failed to get login history: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve login history")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)