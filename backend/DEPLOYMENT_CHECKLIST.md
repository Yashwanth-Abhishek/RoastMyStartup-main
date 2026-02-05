# Google OAuth Deployment Checklist

## Pre-Deployment Setup

### 1. Google Cloud Console Configuration
- [ ] Go to [Google Cloud Console](https://console.cloud.google.com/)
- [ ] Create a new project or select existing project
- [ ] Enable Google+ API (for userinfo endpoint)
- [ ] Navigate to "APIs & Services" > "Credentials"
- [ ] Click "Create Credentials" > "OAuth 2.0 Client ID"
- [ ] Select "Web application" as application type
- [ ] Configure OAuth consent screen if not already done

### 2. Set Authorized Origins
Add these to "Authorized JavaScript origins":
- [ ] `https://roastmystartup.lovable.app` (production frontend)
- [ ] `http://localhost:3000` (local testing - optional)

### 3. Set Authorized Redirect URIs
Add these to "Authorized redirect URIs":
- [ ] `https://your-backend-url.onrender.com/auth/google/callback` (production)
- [ ] `http://localhost:8000/auth/google/callback` (local testing - optional)

**Important**: Replace `your-backend-url` with your actual Render backend URL

### 4. Copy OAuth Credentials
- [ ] Copy the "Client ID" (ends with `.apps.googleusercontent.com`)
- [ ] Copy the "Client secret"
- [ ] Keep these secure - you'll need them for Render

## Render Environment Variables Setup

### 1. Access Render Dashboard
- [ ] Log in to [Render](https://render.com/)
- [ ] Navigate to your backend service
- [ ] Click on "Environment" tab

### 2. Add OAuth Environment Variables
Add these new variables (click "Add Environment Variable" for each):

#### Google OAuth
- [ ] `GOOGLE_CLIENT_ID` = `your_client_id_here.apps.googleusercontent.com`
- [ ] `GOOGLE_CLIENT_SECRET` = `your_client_secret_here`
- [ ] `GOOGLE_REDIRECT_URI` = `https://your-backend-url.onrender.com/auth/google/callback`

#### JWT Configuration
- [ ] `JWT_SECRET_KEY` = Generate using: `openssl rand -hex 32` or any secure random string
- [ ] `JWT_ALGORITHM` = `HS256` (optional, defaults to HS256)
- [ ] `JWT_EXPIRATION_HOURS` = `24` (optional, defaults to 24)

#### Frontend Configuration
- [ ] `FRONTEND_BASE_URL` = `https://roastmystartup.lovable.app` (optional, defaults to http://localhost:8080)

### 3. Verify Existing Variables
Ensure these are still set (don't modify):
- [ ] `GEMINI_API_KEY`
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_KEY`

### 4. Save Changes
- [ ] Click "Save Changes" button
- [ ] Render will automatically redeploy your service

## Code Deployment

### 1. Verify Local Changes
- [ ] All files committed to git
- [ ] No syntax errors: `python -m py_compile backend/app/routes/auth.py`
- [ ] No syntax errors: `python -m py_compile backend/app/main.py`
- [ ] No syntax errors: `python -m py_compile backend/app/config/settings.py`

### 2. Push to Repository
```bash
git add backend/
git commit -m "Add Google OAuth authentication"
git push origin main
```

### 3. Monitor Render Deployment
- [ ] Go to Render dashboard
- [ ] Watch the deployment logs
- [ ] Wait for "Build successful" message
- [ ] Wait for "Deploy live" message

## Post-Deployment Testing

### 1. Test Health Endpoint
```bash
curl https://your-backend-url.onrender.com/health
```
Expected response:
```json
{
  "status": "alive",
  "model": "gemini-2.5-flash",
  "database": "healthy"
}
```

### 2. Test Existing Roast Endpoint
- [ ] Verify `/roast` endpoint still works
- [ ] No breaking changes to existing functionality

### 3. Test OAuth Flow (Manual)
- [ ] Visit: `https://your-backend-url.onrender.com/auth/google`
- [ ] Should redirect to Google login page
- [ ] Log in with Google account
- [ ] Should redirect back to callback endpoint
- [ ] Should redirect to frontend with token parameter
- [ ] Check URL: `{FRONTEND_BASE_URL}/auth/callback?token=...`
  - Default: `http://localhost:8080/auth/callback?token=...`
  - Production: `https://roastmystartup.lovable.app/auth/callback?token=...`

### 4. Verify JWT Token
Copy the token from the URL and decode it at [jwt.io](https://jwt.io/):
- [ ] Token contains `email` field
- [ ] Token contains `name` field
- [ ] Token contains `exp` (expiration) field
- [ ] Token signature is valid (paste your JWT_SECRET_KEY)

### 5. Check Logs
In Render dashboard, check logs for:
- [ ] No error messages during startup
- [ ] OAuth endpoints registered successfully
- [ ] No configuration errors

## Troubleshooting

### Issue: "OAuth configuration error"
**Check**:
- [ ] All OAuth environment variables are set in Render
- [ ] No typos in variable names
- [ ] Values are not empty

**Fix**: Add missing variables and redeploy

### Issue: "redirect_uri_mismatch" error from Google
**Check**:
- [ ] `GOOGLE_REDIRECT_URI` in Render matches exactly what's in Google Console
- [ ] No trailing slashes
- [ ] HTTPS (not HTTP) for production

**Fix**: Update Google Console or Render to match exactly

### Issue: "invalid_client" error from Google
**Check**:
- [ ] `GOOGLE_CLIENT_ID` is correct
- [ ] `GOOGLE_CLIENT_SECRET` is correct
- [ ] No extra spaces in the values

**Fix**: Copy credentials again from Google Console

### Issue: Frontend doesn't receive token
**Check**:
- [ ] Backend logs show successful token generation
- [ ] Frontend callback URL is correct: `https://roastmystartup.lovable.app/auth/callback`
- [ ] No CORS errors in browser console

**Fix**: Verify CORS settings allow frontend origin

### Issue: Token validation fails
**Check**:
- [ ] `JWT_SECRET_KEY` is set
- [ ] Token hasn't expired (check `exp` field)
- [ ] Algorithm matches (HS256)

**Fix**: Generate new token or check secret key

## Rollback Plan

If deployment fails or breaks existing functionality:

### 1. Quick Rollback
- [ ] In Render dashboard, go to "Events" tab
- [ ] Find previous successful deployment
- [ ] Click "Rollback to this version"

### 2. Remove OAuth Variables (if needed)
- [ ] Remove OAuth environment variables from Render
- [ ] Keep existing variables intact
- [ ] Redeploy

### 3. Revert Code Changes
```bash
git revert HEAD
git push origin main
```

## Success Criteria

All of these must pass:
- [ ] Existing `/roast` endpoint works without changes
- [ ] `/health` endpoint returns healthy status
- [ ] `/auth/google` redirects to Google login
- [ ] OAuth callback generates valid JWT token
- [ ] User is redirected to frontend with token
- [ ] No errors in Render logs
- [ ] No breaking changes to API contract

## Next Steps After Successful Deployment

1. **Frontend Integration**
   - Update frontend to use `/auth/google` endpoint
   - Handle token in callback page
   - Store token in localStorage/sessionStorage
   - Add token to API requests (future)

2. **User Management** (Future)
   - Store authenticated users in Supabase
   - Link roasts to user accounts
   - User profile management

3. **Protected Routes** (Future)
   - Add JWT verification middleware
   - Protect `/roast` endpoint
   - Require authentication for certain features

## Support Contacts

- **Backend Issues**: Check Render logs
- **OAuth Issues**: Check Google Cloud Console logs
- **Frontend Issues**: Check browser console

## Notes

- OAuth endpoints are optional - existing functionality works without them
- JWT tokens expire after 24 hours (configurable)
- All sensitive data is in environment variables (never in code)
- CORS is configured to allow frontend origin
