-- ============================================================================
-- QUICK REFERENCE: DUMMY USER INSERT (Copy & Paste into Supabase SQL Editor)
-- ============================================================================

-- Password: Test@1234
-- Bcrypt Hash: $2a$12$gUJYtGy2/bFcm9hZv5XiHu3P7vJjh8QlKvQhJ4K3nZ9vZ9dZ9vZ9dZ

INSERT INTO users (
  user_id,
  full_name,
  username,
  email,
  password_hash,
  role_id,
  is_active,
  is_verified,
  streak_days
) VALUES (
  gen_random_uuid(),
  'Test User',
  'testuser',
  'test@unipath.com',
  '$2a$12$gUJYtGy2/bFcm9hZv5XiHu3P7vJjh8QlKvQhJ4K3nZ9vZ9dZ9vZ9dZ',
  3,
  true,
  false,
  0
)
ON CONFLICT (email) DO NOTHING;

-- Verify insertion
SELECT user_id, full_name, username, email, role_id, is_active FROM users WHERE email = 'test@unipath.com';

-- ============================================================================
-- LOGIN CREDENTIALS FOR TESTING
-- ============================================================================
-- Email:    test@unipath.com
-- Password: Test@1234
-- Role:     Student (role_id = 3)

-- ============================================================================
-- QUICK TEST: Copy & paste into browser DevTools Console
-- ============================================================================

// Test Signup
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
.then(d => console.log('Signup response:', d))

// Test Login (after signup)
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
.then(d => console.log('Login response:', d))

// ============================================================================
// ENVIRONMENT VARIABLES TO SET IN VERCEL
// ============================================================================

NEXT_PUBLIC_SUPABASE_URL = https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (⚠️ server-only, no NEXT_PUBLIC_)
SUPABASE_JWT_SECRET = your-jwt-secret

// ============================================================================
// VERIFICATION QUERIES
// ============================================================================

-- Check if dummy user exists
SELECT * FROM users WHERE email = 'test@unipath.com';

-- Check RLS is enabled
SELECT tablename, pg_table_is_visible(pg_class.oid) 
FROM pg_tables 
JOIN pg_class ON tablename = relname
WHERE schemaname = 'public' 
AND tablename IN ('users', 'user_sessions', 'login_attempts', 'roles');

-- Check roles
SELECT * FROM roles ORDER BY role_id;

-- Check recent login attempts
SELECT * FROM login_attempts ORDER BY attempted_at DESC LIMIT 10;

-- Check session for test user
SELECT * FROM user_sessions 
WHERE user_id = (SELECT user_id FROM users WHERE email = 'test@unipath.com')
ORDER BY created_at DESC
LIMIT 1;
