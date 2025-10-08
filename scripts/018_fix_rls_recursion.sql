-- Fix infinite recursion in RLS policies
-- The problem: policies were querying profiles table to check permissions,
-- which creates a circular dependency

-- Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Allow profile creation on signup" ON profiles;
DROP POLICY IF EXISTS "Staff can view staff profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update staff profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can delete staff profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Staff can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Staff can view all staff profiles" ON profiles;
DROP POLICY IF EXISTS "Service role has full access" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON profiles;
DROP POLICY IF EXISTS "Service role full access" ON profiles;
-- Adding more policy drops to cover all possible existing policies
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Allow profile creation" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can update profiles" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can delete profiles" ON profiles;
DROP POLICY IF EXISTS "Allow staff to read all profiles" ON profiles;
DROP POLICY IF EXISTS "Allow staff to update all profiles" ON profiles;
DROP POLICY IF EXISTS "Allow staff to delete profiles" ON profiles;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Simple policies that don't cause recursion:

-- 1. Users can view their own profile (no recursion - just checks auth.uid())
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- 2. Users can update their own profile (no recursion)
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 3. Allow ALL authenticated users to view all profiles
-- We handle access control in the application layer
CREATE POLICY "Authenticated users can view all profiles"
ON profiles FOR SELECT
USING (auth.role() = 'authenticated');

-- 4. Allow ALL authenticated users to insert profiles (for signup/trigger)
CREATE POLICY "Allow profile creation"
ON profiles FOR INSERT
WITH CHECK (true);

-- 5. Allow authenticated users to update any profile
-- We handle admin checks in the application layer
CREATE POLICY "Authenticated users can update profiles"
ON profiles FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- 6. Allow authenticated users to delete profiles
-- We handle admin checks in the application layer
CREATE POLICY "Authenticated users can delete profiles"
ON profiles FOR DELETE
USING (auth.role() = 'authenticated');
