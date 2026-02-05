# Google OAuth - Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Google Cloud Console (2 minutes)
1. Go to https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID (Web application)
3. Add redirect URI: `https://your-backend.onrender.com/auth/google/callback`
4. Copy Client ID and Client Secret

### Step 2: Render Environment Variables (2 minutes)
Go to Render → Your Service → Environment → Add these:

```
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=https://your-backend.onrender.com/auth/google/callback
JWT_SECRET_KEY=generate_with_openssl_rand_hex_32
FRONTEND_BASE_URL=https://roastmystartup.lovable.app
```

**Note**: `FRONTEND_BASE_URL` defaults to `http://localhost:8080` if not set.

### Step 3: Deploy (1 minute)
```bash
git add backend/
git commit -m "Add Google OAuth"
git push origin main
```

Render will auto-deploy.

### Step 4: Test
Visit: `https://your-backend.onrender.com/auth/google`

✅ Should redirect to Google login
✅ After login, should redirect to frontend with token

## 🔑 Generate JWT Secret Key

### Option 1: OpenSSL (Recommended)
```bash
openssl rand -hex 32
```

### Option 2: Python
```python
import secrets
print(secrets.token_hex(32))
```

### Option 3: Online
Use: https://generate-secret.vercel.app/32

## 📝 Environment Variables Template

Copy this to Render:

```bash
# OAuth (NEW)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=https://your-backend.onrender.com/auth/google/callback
JWT_SECRET_KEY=
FRONTEND_BASE_URL=https://roastmystartup.lovable.app

# Existing (DON'T CHANGE)
GEMINI_API_KEY=
SUPABASE_URL=
SUPABASE_KEY=
```

## ✅ Verification

### Test Health Endpoint
```bash
curl https://your-backend.onrender.com/health
```

Should return:
```json
{"status": "alive", "model": "gemini-2.5-flash", "database": "healthy"}
```

### Test OAuth Flow
1. Visit: `https://your-backend.onrender.com/auth/google`
2. Login with Google
3. Check URL: `https://roastmystartup.lovable.app/auth/callback?token=...` (or `http://localhost:8080/auth/callback?token=...` if FRONTEND_BASE_URL not set)
4. Token should be present

### Decode Token
Go to https://jwt.io/ and paste your token. Should see:
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "exp": 1234567890
}
```

## 🐛 Common Issues

### "redirect_uri_mismatch"
**Fix**: Ensure `GOOGLE_REDIRECT_URI` in Render exactly matches Google Console

### "invalid_client"
**Fix**: Double-check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

### "OAuth configuration error"
**Fix**: Ensure all 4 OAuth variables are set in Render

### Existing /roast endpoint broken
**Fix**: This shouldn't happen. Check Render logs. Rollback if needed.

## 📚 Full Documentation

- **Technical Details**: See `OAUTH_IMPLEMENTATION.md`
- **Deployment Guide**: See `DEPLOYMENT_CHECKLIST.md`
- **Summary**: See `../OAUTH_BACKEND_SUMMARY.md`

## 🎯 What This Does

1. User clicks "Login with Google" on frontend
2. Frontend redirects to: `GET /auth/google`
3. Backend redirects to Google login
4. User logs in with Google
5. Google redirects to: `GET /auth/google/callback?code=...`
6. Backend exchanges code for user info
7. Backend generates JWT token
8. Backend redirects to: `https://roastmystartup.lovable.app/auth/callback?token=<JWT>`
9. Frontend receives token and authenticates user

## ✨ That's It!

Your backend now supports Google OAuth authentication.

**No breaking changes** - existing `/roast` endpoint works exactly as before.
