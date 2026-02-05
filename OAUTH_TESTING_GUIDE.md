# Google OAuth Testing Guide

## 🧪 Quick Test Checklist

### Prerequisites
- [ ] Backend deployed on Render with OAuth configured
- [ ] Frontend running locally or deployed
- [ ] Google OAuth credentials configured in backend

## 🚀 Test Scenarios

### ✅ Scenario 1: Successful Login Flow

**Steps**:
1. Open browser to `http://localhost:8080/auth/login`
2. Click "Continue with Google" button
3. Should redirect to Google login page
4. Enter Google credentials
5. Grant permissions if prompted
6. Should redirect back to app
7. Should see success message briefly
8. Should redirect to home page

**Expected Results**:
- ✅ No errors in console
- ✅ Token stored in localStorage (`auth_token`)
- ✅ User email stored in localStorage (`user_email`)
- ✅ User name stored in localStorage (`user_name`)
- ✅ Redirected to home page (/)

**Verify in Browser Console**:
```javascript
localStorage.getItem('auth_token')      // Should return JWT token
localStorage.getItem('user_email')      // Should return your email
localStorage.getItem('user_name')       // Should return your name
```

---

### ✅ Scenario 2: Successful Signup Flow

**Steps**:
1. Open browser to `http://localhost:8080/auth/signup`
2. Click "Sign up with Google" button
3. Follow same flow as login

**Expected Results**:
- Same as Scenario 1
- Signup and login use the same OAuth flow

---

### ✅ Scenario 3: Error Handling - OAuth Denied

**Steps**:
1. Open browser to `http://localhost:8080/auth/login`
2. Click "Continue with Google"
3. On Google consent screen, click "Cancel" or "Deny"

**Expected Results**:
- ✅ Redirected to callback page with error
- ✅ Error message displayed
- ✅ Automatically redirected to login after 3 seconds

---

### ✅ Scenario 4: Error Handling - Invalid Callback

**Steps**:
1. Manually visit: `http://localhost:8080/auth/callback`
2. (No token or error parameter)

**Expected Results**:
- ✅ Error message: "Invalid authentication callback."
- ✅ Automatically redirected to login after 3 seconds

---

### ✅ Scenario 5: Error Handling - Backend Error

**Steps**:
1. Manually visit: `http://localhost:8080/auth/callback?error=oauth_failed`

**Expected Results**:
- ✅ Error message: "Google authentication failed. Please try again."
- ✅ Automatically redirected to login after 3 seconds

---

## 🔍 Debugging Checklist

### If OAuth Button Doesn't Work

**Check**:
1. Open browser console (F12)
2. Click "Continue with Google"
3. Look for errors

**Common Issues**:
- Backend URL incorrect in `src/lib/api.ts`
- Network error (backend not accessible)
- CORS error (backend CORS not configured)

**Fix**:
```typescript
// Verify in src/lib/api.ts
const API_BASE_URL = "https://roast-my-startup-api.onrender.com";
```

---

### If Redirect Doesn't Work

**Check**:
1. Backend logs in Render dashboard
2. Look for OAuth errors
3. Verify `FRONTEND_BASE_URL` is set correctly

**Common Issues**:
- `FRONTEND_BASE_URL` not set in backend
- `FRONTEND_BASE_URL` has wrong value
- Google OAuth redirect URI mismatch

**Fix**:
```bash
# In Render, set:
FRONTEND_BASE_URL=http://localhost:8080  # For local testing
# OR
FRONTEND_BASE_URL=https://roastmystartup.lovable.app  # For production
```

---

### If Token Not Stored

**Check**:
1. Open browser console
2. Go to Application tab → Local Storage
3. Look for `auth_token`, `user_email`, `user_name`

**Common Issues**:
- JavaScript error in Callback.tsx
- Token not in URL
- localStorage disabled

**Fix**:
- Check console for errors
- Verify token is in URL: `/auth/callback?token=...`
- Enable localStorage in browser settings

---

### If Callback Shows Error

**Check**:
1. Look at error message
2. Check backend logs
3. Verify Google OAuth configuration

**Common Issues**:
- Google OAuth credentials invalid
- Redirect URI mismatch
- Backend configuration error

**Fix**:
- Verify Google OAuth credentials in Google Console
- Ensure redirect URI matches exactly
- Check backend environment variables

---

## 🌐 Testing in Different Environments

### Local Development

**Frontend**: `http://localhost:8080`
**Backend**: `https://roast-my-startup-api.onrender.com`

**Backend Environment Variables**:
```bash
FRONTEND_BASE_URL=http://localhost:8080
GOOGLE_REDIRECT_URI=https://roast-my-startup-api.onrender.com/auth/google/callback
```

**Google Console**:
- Authorized JavaScript origins: `http://localhost:8080`
- Authorized redirect URIs: `https://roast-my-startup-api.onrender.com/auth/google/callback`

---

### Production

**Frontend**: `https://roastmystartup.lovable.app`
**Backend**: `https://roast-my-startup-api.onrender.com`

**Backend Environment Variables**:
```bash
FRONTEND_BASE_URL=https://roastmystartup.lovable.app
GOOGLE_REDIRECT_URI=https://roast-my-startup-api.onrender.com/auth/google/callback
```

**Google Console**:
- Authorized JavaScript origins: `https://roastmystartup.lovable.app`
- Authorized redirect URIs: `https://roast-my-startup-api.onrender.com/auth/google/callback`

---

## 📊 Test Results Template

Use this template to document your test results:

```
Date: ___________
Tester: ___________
Environment: [ ] Local [ ] Production

Scenario 1 - Successful Login:
[ ] Button redirects to Google
[ ] Google login works
[ ] Redirects back to app
[ ] Token stored in localStorage
[ ] User info stored
[ ] Redirected to home page
Notes: ___________

Scenario 2 - Successful Signup:
[ ] Button redirects to Google
[ ] Google login works
[ ] Redirects back to app
[ ] Token stored in localStorage
[ ] User info stored
[ ] Redirected to home page
Notes: ___________

Scenario 3 - OAuth Denied:
[ ] Error message displayed
[ ] Redirected to login
Notes: ___________

Scenario 4 - Invalid Callback:
[ ] Error message displayed
[ ] Redirected to login
Notes: ___________

Scenario 5 - Backend Error:
[ ] Error message displayed
[ ] Redirected to login
Notes: ___________

Overall Status: [ ] Pass [ ] Fail
Issues Found: ___________
```

---

## 🔧 Manual Testing Commands

### Check localStorage
```javascript
// In browser console
console.log('Token:', localStorage.getItem('auth_token'));
console.log('Email:', localStorage.getItem('user_email'));
console.log('Name:', localStorage.getItem('user_name'));
```

### Decode JWT Token
```javascript
// In browser console
const token = localStorage.getItem('auth_token');
if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  console.log('JWT Payload:', payload);
}
```

### Clear localStorage
```javascript
// In browser console
localStorage.removeItem('auth_token');
localStorage.removeItem('user_email');
localStorage.removeItem('user_name');
// OR clear everything:
localStorage.clear();
```

### Test Error Scenarios
```javascript
// Visit these URLs directly in browser:
http://localhost:8080/auth/callback?error=oauth_failed
http://localhost:8080/auth/callback?error=network_error
http://localhost:8080/auth/callback
```

---

## ✅ Success Criteria

All of these must pass:

- [ ] "Continue with Google" button works on login page
- [ ] "Sign up with Google" button works on signup page
- [ ] Google OAuth consent screen appears
- [ ] After Google login, redirects back to app
- [ ] Success message appears briefly
- [ ] Redirects to home page
- [ ] Token stored in localStorage
- [ ] User email stored in localStorage
- [ ] User name stored in localStorage
- [ ] No console errors
- [ ] Error handling works for all error types
- [ ] UI/styling unchanged from original

---

## 📞 Support

If tests fail:

1. **Check Backend Logs**: Render dashboard → Your service → Logs
2. **Check Browser Console**: F12 → Console tab
3. **Check Network Tab**: F12 → Network tab
4. **Verify Environment Variables**: Render dashboard → Environment
5. **Verify Google OAuth Config**: Google Cloud Console → Credentials

---

## 🎯 Quick Smoke Test

**Fastest way to verify everything works**:

1. Visit: `http://localhost:8080/auth/login`
2. Click "Continue with Google"
3. Log in with Google
4. Should end up on home page
5. Check console: `localStorage.getItem('auth_token')`
6. Should return a JWT token

If all 6 steps work → ✅ OAuth is working!
