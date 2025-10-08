-- Update the role constraint to match the current role system
-- This fixes the "profiles_role_check" constraint violation

-- Drop the old constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Add the new constraint with the correct role values
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('admin', 'manager', 'sales_rep', 'viewer', 'user'));

-- Update any existing 'sales' roles to 'sales_rep' for consistency
UPDATE profiles SET role = 'sales_rep' WHERE role = 'sales';
