-- Fix RLS policies for profiles table to allow staff users to read all profiles

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Staff can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Staff can view all staff profiles" ON profiles;
-- Added drop for service role policy
DROP POLICY IF EXISTS "Service role has full access" ON profiles;

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Policy 2: Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Policy 3: Staff users can view all staff profiles (for assignee dropdowns)
CREATE POLICY "Staff can view all staff profiles"
ON profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.user_type = 'staff'
  )
  AND user_type = 'staff'
);

-- Policy 4: Allow service role to do anything (for server-side operations)
CREATE POLICY "Service role has full access"
ON profiles FOR ALL
USING (auth.jwt()->>'role' = 'service_role');
