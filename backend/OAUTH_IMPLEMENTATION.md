# Google OAuth Implementation - Backend

## Overview
This document describes the server-side Google OAuth authentication implementation for RoastMyStartup API.

## Architecture

### Flow Diagram
```
User → Frontend → /auth/google → Google OAuth → /auth/google/callback → JWT → Frontend
```

### Detailed Flow
1. User clicks "Login with Google" on frontend
2. Frontend redirects to backend: `GET /auth/google`
3. Backend redirects user to Google's OAuth consent screen
4. User grants permission on Google
5. Google redirects back to: `GET /auth/google/callback?code=...`
6. Backend exchanges code for access token
7. Backend fetches user profile (email, name)
8. Backend generates JWT token
9. Backend redirects to frontend: `https://roastmystartup.lovable.app/auth/callback?token=<JWT>`
10. Frontend stores token and authenticates user

## Files Modified/Created

### New Files
- `backend/app/routes/auth.py` - OAuth routes and JWT generation logic

### Modified Files
- `backend/app/main.py` - Registered auth router
- `backend/requirements.txt` - Added PyJWT==2.8.0
- `backend/app/config/settings.py` - Added OAuth and JWT configuration fields

## API Endpoints

### 1. Start OAuth Flow
```
GET /auth/google
```

**Purpose**: Initiates Google OAuth flow by redirecting to Google's consent screen

**Response**: 302 Redirect to Google OAuth URL

**Example**:
```bash
curl -L http://localhost:8000/auth/google
```

### 2. OAuth Callback
```
GET /auth/google/callback?code=<authorization_code>
```

**Purpose**: Handles Google's callback, exchanges code for token, generates JWT

**Query Parameters**:
- `code` (string, required): Authorization code from Google
- `error` (string, optional): Error message if OAuth failed

**Response**: 302 Redirect to frontend with JWT token

**Success Redirect**:
```
{FRONTEND_BASE_URL}/auth/callback?token=<JWT>
```

Default (if FRONTEND_BASE_URL not set):
```
http://localhost:8080/auth/callback?token=<JWT>
```

Production (with FRONTEND_BASE_URL set):
```
https://roastmystartup.lovable.app/auth/callback?token=<JWT>
```

**Error Redirect**:
```
{FRONTEND_BASE_URL}/auth/callback?error=<error_type>
```

**Error Types**:
- `oauth_failed` - Google returned an error
- `no_code` - No authorization code received
- `token_exchange_failed` - Failed to exchange code for token
- `no_access_token` - No access token in response
- `userinfo_failed` - Failed to fetch user info
- `no_email` - No email in user profile
- `network_error` - Network/connection error
- `config_error` - OAuth configuration error
- `unexpected_error` - Unexpected server error

## Environment Variables

### Required for OAuth (Set in Render)

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=https://your-backend.onrender.com/auth/google/callback

# JWT Configuration
JWT_SECRET_KEY=your_secret_key_here
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# Frontend Configuration
FRONTEND_BASE_URL=https://roastmystartup.lovable.app
```

### Important Notes

**GOOGLE_REDIRECT_URI vs FRONTEND_BASE_URL**
- `GOOGLE_REDIRECT_URI`: Where Google sends the user after login (backend callback endpoint)
- `FRONTEND_BASE_URL`: Where backend redirects the user after generating JWT (frontend app)

These are **different URLs**:
- Google → Backend: `https://your-backend.onrender.com/auth/google/callback`
- Backend → Frontend: `https://roastmystartup.lovable.app/auth/callback`

**Default Behavior**
- If `FRONTEND_BASE_URL` is not set, defaults to `http://localhost:8080`
- This allows local development without configuration

### How to Set in Render
1. Go to your Render dashboard
2. Select your backend service
3. Navigate to "Environment" tab
4. Add each variable with its value
5. Save changes (service will auto-redeploy)

## JWT Token Structure

### Payload
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "exp": 1234567890
}
```

### Fields
- `email` (string): User's email address from Google
- `name` (string): User's full name from Google
- `exp` (integer): Expiration timestamp (Unix epoch)

### Algorithm
- Default: HS256 (HMAC with SHA-256)
- Configurable via `JWT_ALGORITHM` environment variable

### Expiration
- Default: 24 hours
- Configurable via `JWT_EXPIRATION_HOURS` environment variable

## Security Considerations

### What's Secure
✅ OAuth secrets stored in environment variables (never in code)
✅ Authorization code flow (not implicit flow)
✅ JWT tokens signed with secret key
✅ HTTPS enforced for production URLs
✅ Token expiration implemented
✅ Comprehensive error handling without exposing internals

### What's NOT Implemented Yet
⚠️ Token refresh mechanism
⚠️ Token revocation
⚠️ User session management
⚠️ Database user storage
⚠️ Role-based access control
⚠️ Rate limiting on auth endpoints

## Testing

### Local Testing
1. Set environment variables in `.env` file:
```bash
GOOGLE_CLIENT_ID=your_test_client_id
GOOGLE_CLIENT_SECRET=your_test_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
JWT_SECRET_KEY=your_test_secret_key
```

2. Start the backend:
```bash
cd backend
uvicorn app.main:app --reload
```

3. Visit: `http://localhost:8000/auth/google`

### Production Testing
1. Ensure all environment variables are set in Render
2. Visit: `https://your-backend.onrender.com/auth/google`
3. Complete Google OAuth flow
4. Verify redirect to frontend with token

### Manual Token Verification
```python
import jwt

token = "your_jwt_token_here"
secret = "your_jwt_secret_key"

decoded = jwt.decode(token, secret, algorithms=["HS256"])
print(decoded)
```

## Error Handling

### Configuration Errors
If OAuth environment variables are missing, the endpoint will return:
```json
{
  "detail": "OAuth configuration error. Please contact support."
}
```

### Network Errors
If Google API calls fail, user is redirected to frontend with error parameter:
```
https://roastmystartup.lovable.app/auth/callback?error=network_error
```

### Validation Errors
All validation errors are logged server-side and user is redirected with appropriate error code.

## Logging

### Log Levels
- `INFO`: Successful operations (user authenticated, token generated)
- `ERROR`: Failures (missing config, API errors, validation failures)

### Example Logs
```
INFO: Redirecting user to Google OAuth consent screen
INFO: Successfully obtained access token, fetching user profile
INFO: Successfully authenticated user: user@example.com
INFO: Redirecting user user@example.com to frontend with JWT token
ERROR: OAuth configuration error: Missing required OAuth environment variables: GOOGLE_CLIENT_ID
ERROR: Failed to exchange code for token: {"error": "invalid_grant"}
```

## Integration with Existing Code

### No Breaking Changes
✅ Existing `/roast` endpoint unchanged
✅ Existing schemas unchanged
✅ Existing services unchanged
✅ Existing database logic unchanged
✅ No middleware added (yet)
✅ No auth guards on existing routes (yet)

### Clean Separation
- Auth logic isolated in `app/routes/auth.py`
- OAuth config optional in settings (doesn't break existing functionality)
- Auth router registered separately in main.py

## Next Steps (Future Work)

### Phase 2: User Management
- Store authenticated users in Supabase
- Link roasts to user accounts
- User profile endpoints

### Phase 3: Protected Routes
- Add JWT verification middleware
- Protect `/roast` endpoint (require authentication)
- Add user context to roast requests

### Phase 4: Advanced Features
- Token refresh mechanism
- Social login with other providers
- User preferences and settings
- Roast history per user

## Troubleshooting

### Issue: "OAuth configuration error"
**Solution**: Verify all required environment variables are set in Render

### Issue: "Failed to exchange code for token"
**Solution**: 
- Check `GOOGLE_CLIENT_SECRET` is correct
- Verify `GOOGLE_REDIRECT_URI` matches exactly in Google Console and Render

### Issue: "No email in user info response"
**Solution**: Ensure OAuth scope includes "email" (already configured)

### Issue: Token validation fails on frontend
**Solution**: 
- Verify `JWT_SECRET_KEY` matches between backend and frontend (if frontend validates)
- Check token hasn't expired
- Verify algorithm matches (HS256)

## Google Cloud Console Setup

### Required Configuration
1. Create OAuth 2.0 Client ID in Google Cloud Console
2. Set Authorized JavaScript origins:
   - `https://roastmystartup.lovable.app`
   - `http://localhost:3000` (for local testing)
3. Set Authorized redirect URIs:
   - `https://your-backend.onrender.com/auth/google/callback`
   - `http://localhost:8000/auth/google/callback` (for local testing)
4. Enable Google+ API (for userinfo endpoint)

## Deployment Checklist

### Before Deploying
- [ ] All environment variables set in Render
- [ ] Google OAuth client configured with correct redirect URI
- [ ] Frontend callback URL matches production URL
- [ ] PyJWT added to requirements.txt
- [ ] Code tested locally

### After Deploying
- [ ] Test OAuth flow end-to-end
- [ ] Verify JWT token generation
- [ ] Check logs for errors
- [ ] Test error scenarios
- [ ] Verify existing `/roast` endpoint still works

## Support

For issues or questions:
1. Check logs in Render dashboard
2. Verify environment variables are set correctly
3. Test OAuth flow manually
4. Review error messages in frontend callback URL
