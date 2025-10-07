-- Add user types to separate staff from customers

-- Add user_type column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS user_type TEXT NOT NULL DEFAULT 'customer' CHECK (user_type IN ('staff', 'customer'));

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);

-- Update existing users with roles to be staff
UPDATE profiles 
SET user_type = 'staff' 
WHERE id IN (SELECT user_id FROM user_roles);

-- Add comment
COMMENT ON COLUMN profiles.user_type IS 'Determines if user is internal staff (backoffice) or external customer (portal)';
