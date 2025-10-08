-- Emergency fix: Remove the problematic recursive policy
-- and use simpler policies that don't cause recursion

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Staff can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Staff can view all staff profiles" ON profiles;
DROP POLICY IF EXISTS "Service role has full access" ON profiles;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can view their own profile (no recursion)
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Policy 2: Users can update their own profile (no recursion)
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Policy 3: Allow authenticated users to view all profiles
-- This is simpler and avoids recursion - we'll handle access control in the app layer
CREATE POLICY "Authenticated users can view profiles"
ON profiles FOR SELECT
USING (auth.role() = 'authenticated');

-- Policy 4: Service role has full access (for server-side operations)
CREATE POLICY "Service role full access"
ON profiles FOR ALL
USING (auth.jwt()->>'role' = 'service_role');
