-- Drop the problematic policy that already exists
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON profiles;

-- Now you can run script 018 after this
