# Quick Reference - Frontend URL Configuration

## 🎯 What Changed

**One environment variable added**: `FRONTEND_BASE_URL`

## 📋 For Production Deployment

### Add to Render Environment Variables:
```
FRONTEND_BASE_URL=https://roastmystartup.lovable.app
```

That's it! 🎉

## 🔄 OAuth Flow

```
User → /auth/google → Google Login → /auth/google/callback → {FRONTEND_BASE_URL}/auth/callback?token=<JWT>
```

## 🌍 Environment Values

| Environment | FRONTEND_BASE_URL | Behavior |
|-------------|-------------------|----------|
| Local Dev | Not set (default) | Redirects to `http://localhost:8080/auth/callback` |
| Production | `https://roastmystartup.lovable.app` | Redirects to `https://roastmystartup.lovable.app/auth/callback` |

## ✅ Validation

### Test Local (No Config Needed)
```bash
cd backend
uvicorn app.main:app --reload
# Visit: http://localhost:8000/auth/google
# Should redirect to: http://localhost:8080/auth/callback?token=...
```

### Test Production (After Setting Env Var)
```bash
# Visit: https://your-backend.onrender.com/auth/google
# Should redirect to: https://roastmystartup.lovable.app/auth/callback?token=...
```

## 📝 Complete Environment Variables (Production)

```bash
# Existing
GEMINI_API_KEY=xxx
SUPABASE_URL=xxx
SUPABASE_KEY=xxx

# OAuth
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_REDIRECT_URI=https://your-backend.onrender.com/auth/google/callback
JWT_SECRET_KEY=xxx

# NEW
FRONTEND_BASE_URL=https://roastmystartup.lovable.app
```

## 🚨 Important

**Two different URLs**:
- `GOOGLE_REDIRECT_URI` = Where Google sends user (backend callback)
- `FRONTEND_BASE_URL` = Where backend sends user (frontend app)

## 📚 Full Documentation

- **Quick Start**: `backend/QUICK_START.md`
- **Deployment**: `backend/DEPLOYMENT_CHECKLIST.md`
- **This Change**: `FRONTEND_URL_CONFIGURATION.md`
- **Complete Summary**: `IMPLEMENTATION_SUMMARY.md`
