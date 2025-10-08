# Full-Stack CRM System

A comprehensive Customer Relationship Management (CRM) system built with Next.js 15, featuring both a backoffice for internal teams and a customer portal.

## 🚀 Features

### Backoffice (Internal Team)
- **Dashboard**: Real-time metrics, deal pipeline visualization, and activity feed
- **Contacts Management**: Full CRUD operations with data tables, sorting, filtering, and pagination
- **Companies Management**: Manage company accounts with industry tracking and size categorization
- **Deals Pipeline**: Kanban board view and table view with stage tracking and probability scoring
- **Tasks Management**: Priority-based task system with due dates and status tracking
- **Activities Timeline**: Complete audit trail of all team actions
- **Reports & Analytics**: Revenue trends, pipeline analysis, team performance, and industry breakdowns
- **Calendar View**: Visual task and meeting management
- **Advanced Search**: Search across all entities with filters
- **User Management**: Role-based access control (Admin, Manager, Sales Rep, Viewer)
- **Settings**: Profile management with avatar upload

### Customer Portal
- **Overview Dashboard**: Active deals and recent activities
- **Deals View**: Track deal progress and status
- **Messages**: Direct communication with account manager
- **Profile**: View personal and company information

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **Validation**: Zod
- **Icons**: Lucide React
- **Data Tables**: TanStack Table

## 📁 Project Structure

\`\`\`
├── app/
│   ├── auth/                 # Authentication pages
│   ├── backoffice/           # Internal CRM dashboard
│   │   ├── contacts/
│   │   ├── companies/
│   │   ├── deals/
│   │   ├── tasks/
│   │   ├── activities/
│   │   ├── reports/
│   │   ├── calendar/
│   │   ├── search/
│   │   └── settings/
│   ├── portal/               # Customer-facing portal
│   │   ├── deals/
│   │   ├── messages/
│   │   └── profile/
│   └── api/                  # API routes
├── components/
│   ├── backoffice/           # Backoffice-specific components
│   ├── portal/               # Portal-specific components
│   └── ui/                   # Shared UI components (shadcn)
├── lib/
│   ├── supabase/             # Supabase client configuration
│   ├── validations/          # Zod schemas
│   ├── types/                # TypeScript types
│   ├── utils/                # Utility functions
│   ├── axios.ts              # Axios configuration
│   ├── query-client.ts       # TanStack Query setup
│   └── permissions.ts        # Role-based permissions
└── scripts/                  # Database migration scripts
\`\`\`

## 🗄️ Database Schema

### Core Tables
- **profiles**: User profiles with roles and avatar
- **companies**: Company accounts
- **contacts**: Contact information linked to companies
- **deals**: Sales opportunities with pipeline stages
- **tasks**: Task management with priorities and assignments
- **activities**: Activity log for audit trail
- **user_roles**: Role-based access control

### Features
- Row Level Security (RLS) on all tables
- Foreign key relationships
- Automatic timestamps
- Storage bucket for avatars

## 🔐 Authentication & Authorization

- Email/password authentication via Supabase
- Protected routes with middleware
- Role-based permissions:
  - **Admin**: Full access to all features
  - **Manager**: Manage team and view all data
  - **Sales Rep**: Manage own deals and contacts
  - **Viewer**: Read-only access

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- Supabase account
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables (already configured in v0):
   - Supabase URL and keys
   - Database connection strings

4. Run database migrations:
   - Execute `scripts/001_create_database_schema.sql`
   - Execute `scripts/002_add_user_roles.sql`
   - Execute `scripts/003_add_avatar_storage.sql`

5. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

6. Open [http://localhost:3000](http://localhost:3000)

## 📊 Key Features Explained

### Data Tables
All data tables include:
- Sorting by columns
- Search/filtering
- Pagination
- Column visibility controls
- Bulk selection
- Row actions (edit, delete)

### Forms
All forms feature:
- Real-time validation with Zod
- Error handling and display
- Loading states
- Success notifications
- Edit and create modes

### Real-time Updates
- Automatic data refresh after mutations
- Optimistic updates with TanStack Query
- Toast notifications for user feedback

### File Upload
- Avatar upload with image validation
- Max 2MB file size
- Stored in Supabase Storage
- Public URL generation

## 🎨 Design System

### Colors
- **Primary**: Sophisticated blue for main actions
- **Accent**: Teal for highlights and secondary actions
- **Neutrals**: Clean grays for backgrounds and text
- **Semantic**: Green (success), Red (destructive), Yellow (warning)

### Typography
- **Headings**: Inter font family
- **Body**: Inter with relaxed line height
- Responsive font sizes

### Layout
- Mobile-first responsive design
- Flexbox for most layouts
- CSS Grid for complex 2D layouts
- Consistent spacing scale

## 🔧 API Routes

All CRUD operations are handled through API routes:
- `GET /api/contacts` - List contacts
- `POST /api/contacts` - Create contact
- `PUT /api/contacts/[id]` - Update contact
- `DELETE /api/contacts/[id]` - Delete contact

Similar patterns for companies, deals, tasks, and activities.

## 📝 Environment Variables

The following environment variables are pre-configured:
- `SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `POSTGRES_URL`
- `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL`

## 🚀 Deployment

This project is optimized for deployment on Vercel:

1. Push to GitHub
2. Import to Vercel
3. Environment variables are automatically configured
4. Deploy!

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [TanStack Query Documentation](https://tanstack.com/query)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## 🤝 Contributing

This is a complete CRM system ready for customization and extension. Feel free to:
- Add new features
- Customize the design
- Extend the database schema
- Add integrations

## 📄 License

MIT License - feel free to use this project for your own purposes.

---

Built with ❤️ using Next.js, Supabase, and modern web technologies.
