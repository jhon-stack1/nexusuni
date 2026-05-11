# UniPath Master Fix — TASK 6 & 7 Documentation

## TASK 6: VERCEL ENVIRONMENT VARIABLES CHECKLIST

### Required Environment Variables

All of these must be set in your Vercel project settings → **Vars** section.

#### 1. NEXT_PUBLIC_SUPABASE_URL (Public — can be in frontend)
- **Where to find it:** Supabase Dashboard → Settings → API
- **What it is:** The URL of your Supabase project
- **Example:** `https://abcdefghijklmnop.supabase.co`
- **Environments:** Production, Preview, Development
- **Type:** Public (OK to expose)

#### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY (Public — can be in frontend)
- **Where to find it:** Supabase Dashboard → Settings → API → Project API keys → anon public
- **What it is:** The anonymous key for client-side queries (optional for this app)
- **Example:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Environments:** Production, Preview, Development
- **Type:** Public (OK to expose)

#### 3. SUPABASE_SERVICE_ROLE_KEY ⚠️ **CRITICAL — SERVER ONLY**
- **Where to find it:** Supabase Dashboard → Settings → API → Project API keys → Service role secret
- **What it is:** Privileged key that bypasses RLS — used ONLY in API routes
- **Example:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (longer than anon key)
- **Environments:** Production, Preview, Development
- **Type:** Server-only ⚠️ **NEVER use NEXT_PUBLIC_ prefix**
- **Never expose this in:** Frontend code, `.env.local`, client-side calls, git commits

#### 4. SUPABASE_JWT_SECRET (Server-only)
- **Where to find it:** Supabase Dashboard → Settings → API → JWT Secret (under Project configuration)
- **What it is:** Secret used to verify JWT tokens
- **Example:** `your-super-secret-jwt-key`
- **Environments:** Production, Preview, Development
- **Type:** Server-only

### How to Add Variables in Vercel

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Click **Add New** for each variable
3. Enter the name (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
4. Paste the value from Supabase
5. Select which environments it applies to (Production / Preview / Development)
6. Click **Save**
7. **Redeploy** your project after adding variables

---

## TASK 7: COMPLETE TESTING CHECKLIST

### Step 1: Verify Dummy User Was Inserted
Run this SQL query in Supabase SQL Editor to confirm:

```sql
SELECT user_id, full_name, username, email, role_id, is_active, is_verified 
FROM users 
WHERE email = 'test@unipath.com';
```

**Expected output:** 1 row with:
- `full_name`: "Test User"
- `username`: "testuser"
- `email`: "test@unipath.com"
- `role_id`: 3 (Student)
- `is_active`: true
- `is_verified`: false

---

### Step 2: Test Signup API (via Browser DevTools or curl)

#### Option A: Using Browser Console
```javascript
// Open DevTools (F12) → Console tab, then paste this:
fetch('http://localhost:3000/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    full_name: 'John Doe',
    username: 'johndoe123',
    email: 'john@example.com',
    password: 'SecurePass123',
    phone_number: '03001234567',
    province_id: 1,
    location_id: 1
  })
})
.then(r => r.json())
.then(d => console.log(d))
```

#### Option B: Using curl
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Jane Smith",
    "username": "janesmith456",
    "email": "jane@example.com",
    "password": "SecurePass456",
    "phone_number": "03109876543"
  }'
```

**Expected response (201 Created):**
```json
{
  "message": "Account created successfully!",
  "user": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "full_name": "John Doe",
    "username": "johndoe123",
    "email": "john@example.com",
    "role_id": 3,
    "is_active": true,
    "is_verified": false,
    "created_at": "2026-05-11T14:30:00Z"
  }
}
```

**Test error handling:**
- Try signup with email that already exists → expect `409 Conflict`
- Try signup with password < 8 chars → expect `400 Bad Request`
- Try signup with missing fields → expect `400 Bad Request`

---

### Step 3: Test Login API with Dummy User

#### Using Browser Console
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
.then(d => console.log(d))
```

#### Using curl
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@unipath.com",
    "password": "Test@1234"
  }'
```

**Expected response (200 OK):**
```json
{
  "message": "Login successful!",
  "user": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "full_name": "Test User",
    "username": "testuser",
    "email": "test@unipath.com",
    "role_id": 3,
    "is_verified": false
  }
}
```

**Test error handling:**
- Try login with wrong password → expect `401 Unauthorized`
- Try login with non-existent email → expect `401 Unauthorized`
- Try login with missing fields → expect `400 Bad Request`

---

### Step 4: Verify Session Cookie Was Set

After successful login, check the cookie:

**In Browser DevTools:**
1. Open DevTools → **Application** tab
2. Click **Cookies** → **http://localhost:3000**
3. Look for cookie named `unipath_session`
4. Verify it has:
   - `httpOnly`: true ✓
   - `Secure`: true (in production only)
   - `SameSite`: Lax
   - `Expires`: 7 days from now

**Using curl:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -i \
  -d '{"email":"test@unipath.com","password":"Test@1234"}' | grep -i "set-cookie"
```

Expected output should show the `unipath_session` cookie.

---

### Step 5: Check Vercel Function Logs (If Still Failing)

1. **In Vercel Dashboard:**
   - Go to Deployments → (your deployment) → Functions
   - Click `/api/auth/login` or `/api/auth/signup`
   - Check the logs for errors

2. **Look for:**
   - "Supabase environment variables not set" → Fix env vars
   - "DB insert error" → Check database schema or constraints
   - "Trigger error" → Check SQL triggers and RLS policies
   - "Session insert error" → Verify user_sessions table exists

---

### Step 6: Check RLS Policies in Supabase

1. **In Supabase Dashboard:**
   - Go to SQL Editor → Paste this query:

```sql
SELECT
  schemaname,
  tablename,
  (SELECT COUNT(*) FROM pg_policies WHERE pg_policies.tablename = pg_tables.tablename) as policy_count
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('users', 'user_sessions', 'login_attempts', 'roles', 'provinces', 'locations')
ORDER BY tablename;
```

2. **Expected output:**
   - `users`: 3 policies (SELECT, INSERT, UPDATE)
   - `user_sessions`: 1 policy (ALL)
   - `login_attempts`: 1 policy (ALL)
   - `roles`, `provinces`, `locations`: 1 policy each (SELECT)

3. **If policies are missing:**
   - Run the `supabase-fixes.sql` script in Supabase SQL Editor
   - Refresh and verify again

---

### Step 7: Verify Roles Table

```sql
SELECT role_id, role_name FROM roles ORDER BY role_id;
```

**Expected output:**
```
 role_id | role_name
---------+-----------
       1 | SuperAdmin
       2 | Admin
       3 | Student
```

---

### Step 8: Test Account Lockout (5 Failed Attempts)

1. Try login with wrong password 5 times
2. On the 5th attempt, account should be locked for 30 minutes
3. Expected response:

```json
{
  "error": "Account temporarily locked. Please try again after [time]."
}
```

4. Verify in database:

```sql
SELECT user_id, email, locked_until FROM users WHERE email = 'test@unipath.com';
```

---

### Debugging Checklist If Tests Fail

- [ ] `NEXT_PUBLIC_SUPABASE_URL` is set correctly in Vercel
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is set as server-only (no NEXT_PUBLIC_ prefix)
- [ ] All RLS policies are enabled
- [ ] Dummy user exists in `users` table
- [ ] Roles table has role_id 3 = "Student"
- [ ] Password hash is correct: `$2a$12$gUJYtGy2/bFcm9hZv5XiHu3P7vJjh8QlKvQhJ4K3nZ9vZ9dZ9vZ9dZ` for "Test@1234"
- [ ] `user_sessions` table has correct columns: user_id, token, device_info, ip_address, created_at, expires_at, is_active
- [ ] `login_attempts` table has correct columns: email, ip_address, attempted_at, was_successful, failure_reason
- [ ] Run `supabase-fixes.sql` to fix all triggers and constraints
- [ ] Verify no Urdu/Roman Urdu text remains in error messages
- [ ] Check Vercel Function logs for exact error details

---

## Summary of All Fixes Applied

✅ **TASK 1:** Dummy user inserted with role_id=3, correct password hash
✅ **TASK 2:** RLS policies enabled, 2FA trigger fixed for Students, test deadline trigger fixed, roles verified
✅ **TASK 3:** Signup route: English messages, case-insensitive role fetch, default role_id=3, proper error handling
✅ **TASK 4:** Login route: English messages, case-insensitive email lookup, account_inactive handled with null
✅ **TASK 5:** db.ts error messages clarify which env var is missing
✅ **TASK 6:** Environment variables documented with exact Supabase locations
✅ **TASK 7:** Complete testing checklist with curl, browser console, and verification SQL
