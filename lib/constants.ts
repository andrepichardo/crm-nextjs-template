/**
 * Application constants
 */

export const APP_NAME = "CRM System"
export const APP_DESCRIPTION = "Professional CRM with Portal and Backoffice"

export const DEAL_STAGES = {
  lead: { label: "Lead", color: "bg-gray-500" },
  qualified: { label: "Qualified", color: "bg-blue-500" },
  proposal: { label: "Proposal", color: "bg-yellow-500" },
  negotiation: { label: "Negotiation", color: "bg-orange-500" },
  closed_won: { label: "Closed Won", color: "bg-green-500" },
  closed_lost: { label: "Closed Lost", color: "bg-red-500" },
} as const

export const TASK_PRIORITIES = {
  low: { label: "Low", color: "bg-gray-500" },
  medium: { label: "Medium", color: "bg-blue-500" },
  high: { label: "High", color: "bg-orange-500" },
  urgent: { label: "Urgent", color: "bg-red-500" },
} as const

export const TASK_STATUSES = {
  todo: { label: "To Do", variant: "secondary" },
  in_progress: { label: "In Progress", variant: "default" },
  completed: { label: "Completed", variant: "outline" },
  cancelled: { label: "Cancelled", variant: "destructive" },
} as const

export const CONTACT_STATUSES = {
  active: { label: "Active", variant: "default" },
  inactive: { label: "Inactive", variant: "outline" },
  lead: { label: "Lead", variant: "secondary" },
} as const

export const USER_ROLES = {
  admin: { label: "Admin", description: "Full access to all features" },
  manager: { label: "Manager", description: "Manage team and view all data" },
  sales_rep: { label: "Sales Rep", description: "Manage own deals and contacts" },
  viewer: { label: "Viewer", description: "Read-only access" },
} as const

export const ACTIVITY_TYPES = {
  note: { label: "Note", icon: "FileText" },
  call: { label: "Call", icon: "Phone" },
  email: { label: "Email", icon: "Mail" },
  meeting: { label: "Meeting", icon: "Calendar" },
  status_change: { label: "Status Change", icon: "RefreshCw" },
} as const

export const CURRENCIES = ["USD", "EUR", "GBP"] as const

export const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"] as const

export const TASK_TYPES = ["call", "email", "meeting", "follow_up", "other"] as const
