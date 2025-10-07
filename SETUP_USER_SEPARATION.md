# User Type Separation Setup

This CRM system supports separating **staff users** (who access the backoffice) from **customer users** (who access the portal). This feature is currently **disabled by default** to avoid errors until the database is properly configured.

## Current Status

- ✅ Authentication works for all users
- ❌ User type separation is **DISABLED**
- ⚠️ Any authenticated user can access both backoffice and portal

## How to Enable User Type Separation

Follow these steps in order:

### Step 1: Run Database Migration Scripts

Execute these SQL scripts in your Supabase SQL Editor:

1. **scripts/007_add_user_types.sql** - Adds the `user_type` column to profiles table
2. **scripts/008_handle_user_type_on_signup.sql** - Creates trigger to set user_type on signup

### Step 2: Enable the Feature Flag

Add this environment variable to your project:

\`\`\`
ENABLE_USER_TYPE_SEPARATION=true
\`\`\`

You can add it in the **Vars** section of the v0 in-chat sidebar.

### Step 3: Test the Separation

1. Create a new staff user at `/auth/sign-up/staff`
2. Create a new customer user at `/auth/sign-up/customer`
3. Verify that:
   - Staff users can only access `/backoffice`
   - Customer users can only access `/portal`
   - Users are automatically redirected if they try to access the wrong area

## Existing Users

For users created before enabling this feature:

1. They will default to "customer" type
2. To make them staff users, update their profile in the database:

\`\`\`sql
UPDATE profiles 
SET user_type = 'staff' 
WHERE email = 'admin@example.com';
\`\`\`

## Troubleshooting

**Error: "column profiles.user_type does not exist"**
- You haven't run the migration scripts yet
- Run scripts 007 and 008 from Step 1

**Users can still access both areas**
- Check that `ENABLE_USER_TYPE_SEPARATION=true` is set
- Verify the migration scripts ran successfully
- Check the user's `user_type` in the profiles table
