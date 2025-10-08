-- Fix infinite recursion in RLS policies by using a helper function

-- Drop the problematic policy
DROP POLICY IF EXISTS "Staff can view all staff profiles" ON profiles;

-- Create a security definer function to check if current user is staff
-- This function runs with elevated privileges and bypasses RLS
CREATE OR REPLACE FUNCTION is_staff_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND user_type = 'staff'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the policy using the helper function
-- This avoids infinite recursion because the function runs with SECURITY DEFINER
CREATE POLICY "Staff can view all staff profiles"
ON profiles FOR SELECT
USING (
  is_staff_user() AND user_type = 'staff'
);
