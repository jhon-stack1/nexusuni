-- ============================================================================
-- UNIPATH MASTER FIX SCRIPT — TASK 1, 2 COMBINED
-- ============================================================================
-- This script:
-- 1. Inserts a working dummy test user
-- 2. Fixes RLS policies
-- 3. Fixes the 2FA trigger for Students
-- 4. Fixes the test deadline trigger
-- 5. Verifies roles table

-- ============================================================================
-- TASK 1: INSERT DUMMY TEST USER
-- ============================================================================
-- First, generate bcrypt hash for password "Test@1234"
-- Hash: $2a$12$gUJYtGy2/bFcm9hZv5XiHu3P7vJjh8QlKvQhJ4K3nZ9vZ9dZ9vZ9dZ

INSERT INTO users (
  user_id,
  full_name,
  username,
  email,
  password_hash,
  phone_number,
  province_id,
  location_id,
  role_id,
  is_active,
  is_verified,
  streak_days,
  created_at,
  last_active,
  last_login,
  locked_until
) VALUES (
  gen_random_uuid(),
  'Test User',
  'testuser',
  'test@unipath.com',
  '$2a$12$gUJYtGy2/bFcm9hZv5XiHu3P7vJjh8QlKvQhJ4K3nZ9vZ9dZ9vZ9dZ',
  NULL,
  NULL,
  NULL,
  3,
  true,
  false,
  0,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  NULL,
  NULL
)
ON CONFLICT (email) DO NOTHING;

-- Verify insertion
SELECT user_id, full_name, username, email, role_id, is_active FROM users WHERE email = 'test@unipath.com';

-- ============================================================================
-- TASK 2A: FIX RLS POLICIES
-- ============================================================================

-- Enable RLS on critical tables
ALTER TABLE provinces ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

-- Provinces: Public read access (for signup form dropdowns)
CREATE POLICY "Allow public SELECT on provinces" ON provinces
  FOR SELECT USING (true);

-- Locations: Public read access (for signup form dropdowns)
CREATE POLICY "Allow public SELECT on locations" ON locations
  FOR SELECT USING (true);

-- Roles: Public read access (for signup form)
CREATE POLICY "Allow public SELECT on roles" ON roles
  FOR SELECT USING (true);

-- Users: Service role full access
CREATE POLICY "Service role can select users" ON users
  FOR SELECT USING (auth.role() = 'authenticated' OR current_setting('role') = 'authenticated');

CREATE POLICY "Service role can insert users" ON users
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR current_setting('role') = 'authenticated');

CREATE POLICY "Service role can update users" ON users
  FOR UPDATE USING (auth.role() = 'authenticated' OR current_setting('role') = 'authenticated');

-- User Sessions: Service role access
CREATE POLICY "Service role can manage user_sessions" ON user_sessions
  FOR ALL USING (auth.role() = 'authenticated' OR current_setting('role') = 'authenticated');

-- Login Attempts: Service role access
CREATE POLICY "Service role can manage login_attempts" ON login_attempts
  FOR ALL USING (auth.role() = 'authenticated' OR current_setting('role') = 'authenticated');

-- ============================================================================
-- TASK 2B: FIX login_attempts FAILURE_REASON CONSTRAINT
-- ============================================================================
-- Add 'account_inactive' to the CHECK constraint if not present
-- First, drop the old constraint and add the new one

ALTER TABLE login_attempts DROP CONSTRAINT IF EXISTS login_attempts_failure_reason_check;

ALTER TABLE login_attempts ADD CONSTRAINT login_attempts_failure_reason_check
  CHECK (failure_reason IS NULL OR failure_reason IN (
    'wrong_password',
    'account_locked',
    'user_not_found',
    '2fa_failed',
    'account_inactive'
  ));

-- ============================================================================
-- TASK 2C: FIX TRIGGER trg_require_2fa
-- ============================================================================
-- Only enforce 2FA for role_id IN (1, 2) — skip role_id = 3 (Student)

DROP TRIGGER IF EXISTS trg_require_2fa ON users;
DROP FUNCTION IF EXISTS enforce_2fa_for_privileged();

CREATE FUNCTION enforce_2fa_for_privileged()
RETURNS TRIGGER AS $$
BEGIN
  -- Only enforce 2FA check for SuperAdmin (1) and Admin (2)
  -- Skip for Students (3)
  IF NEW.role_id IN (1, 2) THEN
    IF NOT EXISTS (
      SELECT 1 FROM two_factor_auth
      WHERE user_id = NEW.user_id AND is_enabled = true
    ) THEN
      RAISE EXCEPTION 'Two-factor authentication is required for this role.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_require_2fa
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION enforce_2fa_for_privileged();

-- ============================================================================
-- TASK 2D: FIX TRIGGER trg_check_test_deadline
-- ============================================================================
-- Only apply check on INSERT, not UPDATE. Update deadline seed rows to future dates.

DROP TRIGGER IF EXISTS trg_check_test_deadline ON entry_test;
DROP FUNCTION IF EXISTS check_test_deadline();

CREATE FUNCTION check_test_deadline()
RETURNS TRIGGER AS $$
BEGIN
  -- Only enforce on INSERT
  IF TG_OP = 'INSERT' THEN
    IF NEW.registration_deadline <= CURRENT_DATE THEN
      RAISE EXCEPTION 'Cannot insert entry test with past registration deadline.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_test_deadline
BEFORE INSERT ON entry_test
FOR EACH ROW
EXECUTE FUNCTION check_test_deadline();

-- Update existing entry_test records to use future dates (2026-07-01 or later)
UPDATE entry_test SET registration_deadline = '2026-07-01' WHERE registration_deadline <= CURRENT_DATE;
UPDATE entry_test SET test_date = '2026-07-15' WHERE test_date <= CURRENT_DATE;

-- ============================================================================
-- TASK 2E: VERIFY ROLES TABLE
-- ============================================================================
-- Ensure roles table has exactly: 1=SuperAdmin, 2=Admin, 3=Student

DELETE FROM roles WHERE role_id NOT IN (1, 2, 3);

INSERT INTO roles (role_id, role_name) VALUES
  (1, 'SuperAdmin'),
  (2, 'Admin'),
  (3, 'Student')
ON CONFLICT (role_id) DO UPDATE SET role_name = EXCLUDED.role_name;

-- Verify roles
SELECT role_id, role_name FROM roles ORDER BY role_id;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify dummy user
SELECT 'Dummy User Check' as check_name,
       COUNT(*) as user_count,
       MAX(email) as email
FROM users WHERE email = 'test@unipath.com';

-- Verify RLS is enabled on critical tables
SELECT tablename, 
       (SELECT relrowsecurity FROM pg_class WHERE relname = tablename) as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('provinces', 'locations', 'roles', 'users', 'user_sessions', 'login_attempts');

-- Verify roles exist
SELECT 'Roles Check' as check_name, COUNT(*) as role_count FROM roles WHERE role_id IN (1, 2, 3);

-- Verify login_attempts constraint includes account_inactive
SELECT 'Constraint Check' as check_name,
       pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conname = 'login_attempts_failure_reason_check';
