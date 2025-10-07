-- Update existing users with user_type
-- Run this AFTER executing scripts 007 and 008

-- IMPORTANT: Replace 'your-email@example.com' with your actual email address

-- Set your user as staff (backoffice admin)
UPDATE profiles 
SET user_type = 'staff' 
WHERE email = 'your-email@example.com';

-- Optional: Set all users with roles as staff
-- UPDATE profiles 
-- SET user_type = 'staff' 
-- WHERE id IN (SELECT user_id FROM user_roles);

-- Optional: Set specific users as customers
-- UPDATE profiles 
-- SET user_type = 'customer' 
-- WHERE email IN ('customer1@example.com', 'customer2@example.com');

-- Verify the changes
SELECT id, email, user_type, created_at 
FROM profiles 
ORDER BY created_at DESC;
