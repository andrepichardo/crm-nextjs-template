export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: "user" | "admin" | "sales" | "manager"
  created_at: string
  updated_at: string
}

export interface Company {
  id: string
  name: string
  website: string | null
  industry: string | null
  size: string | null
  description: string | null
  logo_url: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface Contact {
  id: string
  company_id: string | null
  first_name: string
  last_name: string
  email: string
  phone: string | null
  position: string | null
  avatar_url: string | null
  status: "active" | "inactive" | "lead"
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface Deal {
  id: string
  title: string
  company_id: string | null
  contact_id: string | null
  value: number
  currency: string
  stage: "lead" | "qualified" | "proposal" | "negotiation" | "closed_won" | "closed_lost"
  probability: number | null
  expected_close_date: string | null
  description: string | null
  owner_id: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  title: string
  description: string | null
  due_date: string | null
  priority: "low" | "medium" | "high" | "urgent"
  status: "todo" | "in_progress" | "completed" | "cancelled"
  task_type: "call" | "email" | "meeting" | "follow_up" | "other" | null
  related_to_type: "contact" | "company" | "deal" | null
  related_to_id: string | null
  assigned_to: string | null
  created_by: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface Activity {
  id: string
  activity_type: "note" | "call" | "email" | "meeting" | "status_change"
  title: string
  description: string | null
  related_to_type: "contact" | "company" | "deal" | "task" | null
  related_to_id: string | null
  created_by: string | null
  created_at: string
}
