-- Fix RLS policies to allow trigger to create profiles
-- The trigger runs with SECURITY DEFINER so it needs proper policies

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Users can view staff profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "Allow profile creation on signup" ON profiles;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert their own profile (for trigger)
CREATE POLICY "Allow profile creation on signup"
ON profiles FOR INSERT
WITH CHECK (true);

-- Staff users can view other staff profiles
CREATE POLICY "Staff can view staff profiles"
ON profiles FOR SELECT
USING (
  user_type = 'staff' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND user_type = 'staff'
  )
);

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Admins can update any staff profile
CREATE POLICY "Admins can update staff profiles"
ON profiles FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin' AND user_type = 'staff'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin' AND user_type = 'staff'
  )
);

-- Admins can delete staff profiles
CREATE POLICY "Admins can delete staff profiles"
ON profiles FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin' AND user_type = 'staff'
  )
);
