# Quick Start Guide

## 🎯 First Steps

### 1. Run Database Scripts

Execute the following scripts in order from the v0 interface:

1. **001_create_database_schema.sql** - Creates all tables (companies, contacts, deals, tasks, activities)
2. **002_add_user_roles.sql** - Sets up user roles and permissions
3. **003_add_avatar_storage.sql** - Configures avatar storage bucket

### 2. Create Your First User

1. Navigate to `/auth/sign-up`
2. Enter your email and password
3. Check your email for verification link
4. Click the verification link
5. You'll be redirected to the app

### 3. Access the Backoffice

1. Go to `/backoffice` or click "Access Backoffice" from the homepage
2. You'll see the dashboard with:
   - Key metrics (contacts, companies, deals, tasks)
   - Deal pipeline visualization
   - Recent activities
   - Quick actions

### 4. Add Your First Data

#### Create a Company
1. Click "Companies" in the sidebar
2. Click "Add Company" button
3. Fill in company details:
   - Name (required)
   - Website
   - Industry
   - Company size
   - Description
4. Click "Create Company"

#### Create a Contact
1. Click "Contacts" in the sidebar
2. Click "Add Contact" button
3. Fill in contact details:
   - First name and last name (required)
   - Email (required)
   - Phone
   - Position
   - Select company (optional)
   - Status (active/inactive/lead)
4. Click "Create Contact"

#### Create a Deal
1. Click "Deals" in the sidebar
2. Click "Add Deal" button
3. Fill in deal details:
   - Title (required)
   - Value (required)
   - Currency
   - Stage (lead, qualified, proposal, negotiation, closed won/lost)
   - Probability (%)
   - Company and contact
   - Owner
   - Expected close date
   - Description
4. Click "Create Deal"

#### Create a Task
1. Click "Tasks" in the sidebar
2. Click "Add Task" button
3. Fill in task details:
   - Title (required)
   - Description
   - Priority (low, medium, high, urgent)
   - Status (todo, in progress, completed, cancelled)
   - Task type (call, email, meeting, follow up, other)
   - Due date
   - Assign to user
4. Click "Create Task"

## 🎨 Customization

### Change Your Avatar
1. Go to Settings (gear icon in top right)
2. Click "Change Avatar"
3. Select an image (max 2MB)
4. Your avatar will be uploaded and displayed

### Update Your Profile
1. Go to Settings
2. Update your full name
3. Click "Save Changes"

## 📊 Using the Features

### Data Tables
- **Search**: Use the search bar to filter results
- **Sort**: Click column headers to sort
- **Edit**: Click the three dots menu → Edit
- **Delete**: Click the three dots menu → Delete
- **Select**: Use checkboxes for bulk operations

### Pipeline View (Deals)
- Switch between "Pipeline View" and "Table View" using tabs
- Pipeline view shows deals organized by stage
- Drag and drop functionality (coming soon)

### Calendar View
- Navigate to Calendar from sidebar
- View all tasks and meetings in monthly grid
- Color-coded by type
- See upcoming events in sidebar

### Reports & Analytics
- Navigate to Reports from sidebar
- View revenue trends over time
- Analyze pipeline by stage
- See team performance leaderboard
- Industry breakdown charts

### Advanced Search
- Navigate to Search from sidebar
- Add multiple filters
- Search across all entities (contacts, companies, deals, tasks)
- Save common searches (coming soon)

## 🔐 User Roles

### Admin
- Full access to all features
- Can manage users and roles
- Can delete any data
- Access to all reports

### Manager
- Can view all data
- Can edit most data
- Can assign tasks
- Access to team reports

### Sales Rep
- Can manage own contacts and deals
- Can create and complete tasks
- Limited reporting access
- Can view team activities

### Viewer
- Read-only access
- Can view contacts, companies, deals
- Cannot edit or delete
- Limited reporting

## 🚀 Customer Portal

### Access Portal
1. Navigate to `/portal` or click "Access Portal" from homepage
2. Customers see:
   - Overview of their active deals
   - Recent activities
   - Deal progress tracking
   - Message interface

### Send Messages (Portal)
1. Go to Messages in portal
2. Type your message
3. Click "Send Message"
4. Account manager will see it in activities

## 💡 Tips & Tricks

1. **Use keyboard shortcuts**: Press `/` to focus search
2. **Bulk operations**: Select multiple items with checkboxes
3. **Quick filters**: Use status badges to filter quickly
4. **Export data**: Use the export button to download CSV/JSON
5. **Import data**: Use the import button to bulk upload contacts/companies

## 🐛 Troubleshooting

### Can't log in?
- Check your email for verification link
- Make sure you're using the correct email/password
- Try password reset if needed

### Data not showing?
- Refresh the page
- Check your internet connection
- Make sure you have the correct permissions

### Upload failed?
- Check file size (max 2MB for avatars)
- Make sure file is an image (JPG, PNG, GIF)
- Try a different browser

## 📞 Support

For issues or questions:
- Check the README.md for detailed documentation
- Review the database schema in scripts folder
- Contact your system administrator

---

Happy CRM-ing! 🎉
