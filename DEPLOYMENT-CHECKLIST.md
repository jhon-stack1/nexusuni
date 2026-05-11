# 🚀 UniPath Master Fix — Deployment Checklist

## Pre-Deployment (Supabase)

### ✅ Step 1: Run Database Fixes
1. Open Supabase → Your Project → SQL Editor
2. Copy entire contents of `supabase-fixes.sql` from this repo
3. Paste into SQL Editor and click **RUN**
4. Verify output shows no errors

**What this does:**
- Inserts dummy test user (test@unipath.com)
- Enables RLS on all critical tables
- Fixes 2FA trigger (Students exempt)
- Fixes test deadline trigger (INSERT only)
- Adds 'account_inactive' to login_attempts constraint

### ✅ Step 2: Verify Database Changes
Run these in Supabase SQL Editor to confirm:

```sql
-- Check dummy user exists
SELECT * FROM users WHERE email = 'test@unipath.com';
-- Expected: 1 row, role_id=3, is_active=true

-- Check RLS enabled
SELECT tablename, (pg_class.relrowsecurity) FROM pg_class 
WHERE relname IN ('users', 'user_sessions', 'login_attempts');
-- Expected: All show true

-- Check roles
SELECT * FROM roles ORDER BY role_id;
-- Expected: 3 rows with role_id 1, 2, 3
```

---

## Pre-Deployment (Vercel)

### ✅ Step 3: Set Environment Variables
Go to your Vercel Project → Settings → Environment Variables

**Add these 4 variables:**

1. **NEXT_PUBLIC_SUPABASE_URL** (Public)
   - Find in: Supabase → Settings → API → URL
   - Example: `https://abcdefg.supabase.co`
   - Environments: Production, Preview, Development

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY** (Public)
   - Find in: Supabase → Settings → API → Project API keys → anon public
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Environments: Production, Preview, Development

3. **SUPABASE_SERVICE_ROLE_KEY** ⚠️ (Server-only)
   - Find in: Supabase → Settings → API → Project API keys → Service role secret
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (longer)
   - ⚠️ **DO NOT** use `NEXT_PUBLIC_` prefix
   - Environments: Production, Preview, Development

4. **SUPABASE_JWT_SECRET** (Server-only)
   - Find in: Supabase → Settings → Configuration → JWT Secret
   - Example: `your-super-secret-jwt-key`
   - Environments: Production, Preview, Development

**After adding all 4:**
1. Click Save
2. Wait for "Updated" confirmation
3. Redeploy your application

---

## Code Review

### ✅ Step 4: Review Code Changes
The following files have been fixed:

```
✅ app/api/auth/signup/route.ts
   - Uses .ilike() for case-insensitive role lookup
   - Defaults to role_id=3 (Student), not 1 (SuperAdmin)
   - All error messages in English
   - Handles error codes 23505 and P0001

✅ app/api/auth/login/route.ts
   - Uses .ilike() for case-insensitive email lookup
   - Passes null for failure_reason when account_inactive
   - All error messages in English
   - Properly updates last_active after login

✅ lib/db.ts
   - Specific error messages for missing env vars
   - Clarifies SUPABASE_SERVICE_ROLE_KEY must be server-only
   - All comments in English
```

---

## Local Testing (Before Deploy)

### ✅ Step 5: Test Locally First
```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

**Test Signup:**
```javascript
// Open DevTools Console (F12)
fetch('http://localhost:3000/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    full_name: 'John Doe',
    username: 'johndoe2024',
    email: 'john@example.com',
    password: 'SecurePass123'
  })
})
.then(r => r.json())
.then(d => console.log('Signup:', d))
// Expected: 201 with user object
```

**Test Login (with dummy user):**
```javascript
fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    email: 'test@unipath.com',
    password: 'Test@1234'
  })
})
.then(r => r.json())
.then(d => console.log('Login:', d))
// Expected: 200 with user object
```

**Check Session Cookie:**
- DevTools → Application → Cookies
- Look for `unipath_session`
- Should have: httpOnly=true, SameSite=Lax

### ✅ Step 6: Error Testing
Test error handling:

```javascript
// Test wrong password
fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@unipath.com',
    password: 'WrongPassword'
  })
})
.then(r => r.json())
.then(d => console.log('Result:', d))
// Expected: 401, "Invalid email or password."

// Test missing fields
fetch('http://localhost:3000/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@test.com' })
})
.then(r => r.json())
.then(d => console.log('Result:', d))
// Expected: 400, "Full name, username, email and password are required."
```

---

## Deployment

### ✅ Step 7: Deploy to Production
1. Commit all changes (already done)
2. Push to your branch:
   ```bash
   git push origin v0/jhondeere614-8109-5df5e612
   ```
3. In Vercel: Deployments will auto-trigger
4. Wait for deployment to complete
5. Check for any function errors in Vercel logs

---

## Post-Deployment Testing

### ✅ Step 8: Test Production Signup
```bash
curl -X POST https://your-vercel-url.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Jane Smith",
    "username": "janesmith2024",
    "email": "jane@example.com",
    "password": "SecurePass456"
  }'
```

Expected Response:
```json
{
  "message": "Account created successfully!",
  "user": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "full_name": "Jane Smith",
    "username": "janesmith2024",
    "email": "jane@example.com",
    "role_id": 3,
    "is_active": true,
    "is_verified": false,
    "created_at": "2026-05-11T15:30:00Z"
  }
}
```

### ✅ Step 9: Test Production Login
```bash
curl -X POST https://your-vercel-url.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@unipath.com",
    "password": "Test@1234"
  }'
```

Expected Response:
```json
{
  "message": "Login successful!",
  "user": {
    "user_id": "...",
    "full_name": "Test User",
    "username": "testuser",
    "email": "test@unipath.com",
    "role_id": 3,
    "is_verified": false
  }
}
```

---

## Troubleshooting

### ❌ Getting "Supabase environment variables not set"
```
✓ Check Vercel: Settings → Environment Variables
✓ Verify ALL 4 variables are added
✓ Verify SUPABASE_SERVICE_ROLE_KEY has NO NEXT_PUBLIC_ prefix
✓ Redeploy after adding variables
```

### ❌ Getting 409 "email is already registered"
```
✓ Try with a different email address
✓ Or delete the test user and re-insert it:
  DELETE FROM users WHERE email = 'test@example.com';
```

### ❌ Getting "Account temporarily locked"
```
✓ This is working correctly! (5 failed login attempts lock account for 30 min)
✓ Wait 30 minutes or check database:
  UPDATE users SET locked_until = NULL WHERE email = 'test@unipath.com';
```

### ❌ Session cookie not set
```
✓ Check DevTools → Application → Cookies
✓ If empty, check browser console for errors
✓ Verify the login response was successful (200 OK)
✓ Check Vercel Function logs for session insert errors
```

### ❌ Supabase logs showing RLS errors
```
✓ Run supabase-fixes.sql again to verify RLS policies
✓ Check that user_sessions and login_attempts have correct column types
✓ Verify service role key in Vercel matches Supabase
```

---

## Reference Files

| File | Purpose |
|------|---------|
| `supabase-fixes.sql` | Database fixes (RLS, triggers, roles, dummy user) — run in Supabase |
| `UNIPATH-FIX-GUIDE.md` | Detailed testing guide for all 7 tasks |
| `QUICK-TEST-REFERENCE.sql` | Quick copy-paste SQL and curl commands |
| `MASTER-FIX-SUMMARY.md` | Complete summary of all changes |
| `app/api/auth/signup/route.ts` | Fixed signup endpoint |
| `app/api/auth/login/route.ts` | Fixed login endpoint |
| `lib/db.ts` | Fixed database client with better error messages |

---

## Test Credentials

**Dummy User (from supabase-fixes.sql):**
- Email: `test@unipath.com`
- Password: `Test@1234`
- Role: Student (role_id = 3)
- Status: Active, Not Verified

---

## Success Criteria

✅ Signup creates user with role_id=3 (Student)
✅ Login with correct password returns 200 + user object
✅ Login with wrong password returns 401 + "Invalid email or password."
✅ Session cookie `unipath_session` is set with httpOnly=true
✅ All error messages are in English (no Roman Urdu)
✅ Vercel logs show no "environment variables not set" errors
✅ Supabase logs show no RLS policy violations
✅ Account locks after 4 failed login attempts in 30 minutes
✅ New users default to Student role, not SuperAdmin

---

**🎉 You're all set! Deploy with confidence!**
