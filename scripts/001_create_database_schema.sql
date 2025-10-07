-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create users profile table (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin', 'sales', 'manager')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create companies table
create table if not exists public.companies (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  website text,
  industry text,
  size text check (size in ('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+')),
  description text,
  logo_url text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create contacts table
create table if not exists public.contacts (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references public.companies(id) on delete set null,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  position text,
  avatar_url text,
  status text not null default 'active' check (status in ('active', 'inactive', 'lead')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create deals table
create table if not exists public.deals (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  company_id uuid references public.companies(id) on delete set null,
  contact_id uuid references public.contacts(id) on delete set null,
  value numeric(12, 2) not null default 0,
  currency text not null default 'USD',
  stage text not null default 'lead' check (stage in ('lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
  probability integer check (probability >= 0 and probability <= 100),
  expected_close_date date,
  description text,
  owner_id uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create tasks table
create table if not exists public.tasks (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  due_date timestamp with time zone,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'completed', 'cancelled')),
  task_type text check (task_type in ('call', 'email', 'meeting', 'follow_up', 'other')),
  related_to_type text check (related_to_type in ('contact', 'company', 'deal')),
  related_to_id uuid,
  assigned_to uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create activities table (activity log)
create table if not exists public.activities (
  id uuid primary key default uuid_generate_v4(),
  activity_type text not null check (activity_type in ('note', 'call', 'email', 'meeting', 'status_change')),
  title text not null,
  description text,
  related_to_type text check (related_to_type in ('contact', 'company', 'deal', 'task')),
  related_to_id uuid,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.contacts enable row level security;
alter table public.deals enable row level security;
alter table public.tasks enable row level security;
alter table public.activities enable row level security;

-- Profiles policies
create policy "Users can view all profiles" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Companies policies (all authenticated users can CRUD)
create policy "Authenticated users can view companies" on public.companies for select using (auth.uid() is not null);
create policy "Authenticated users can create companies" on public.companies for insert with check (auth.uid() is not null);
create policy "Authenticated users can update companies" on public.companies for update using (auth.uid() is not null);
create policy "Authenticated users can delete companies" on public.companies for delete using (auth.uid() is not null);

-- Contacts policies
create policy "Authenticated users can view contacts" on public.contacts for select using (auth.uid() is not null);
create policy "Authenticated users can create contacts" on public.contacts for insert with check (auth.uid() is not null);
create policy "Authenticated users can update contacts" on public.contacts for update using (auth.uid() is not null);
create policy "Authenticated users can delete contacts" on public.contacts for delete using (auth.uid() is not null);

-- Deals policies
create policy "Authenticated users can view deals" on public.deals for select using (auth.uid() is not null);
create policy "Authenticated users can create deals" on public.deals for insert with check (auth.uid() is not null);
create policy "Authenticated users can update deals" on public.deals for update using (auth.uid() is not null);
create policy "Authenticated users can delete deals" on public.deals for delete using (auth.uid() is not null);

-- Tasks policies
create policy "Authenticated users can view tasks" on public.tasks for select using (auth.uid() is not null);
create policy "Authenticated users can create tasks" on public.tasks for insert with check (auth.uid() is not null);
create policy "Authenticated users can update tasks" on public.tasks for update using (auth.uid() is not null);
create policy "Authenticated users can delete tasks" on public.tasks for delete using (auth.uid() is not null);

-- Activities policies
create policy "Authenticated users can view activities" on public.activities for select using (auth.uid() is not null);
create policy "Authenticated users can create activities" on public.activities for insert with check (auth.uid() is not null);

-- Create indexes for better performance
create index if not exists idx_contacts_company_id on public.contacts(company_id);
create index if not exists idx_contacts_email on public.contacts(email);
create index if not exists idx_deals_company_id on public.deals(company_id);
create index if not exists idx_deals_contact_id on public.deals(contact_id);
create index if not exists idx_deals_owner_id on public.deals(owner_id);
create index if not exists idx_deals_stage on public.deals(stage);
create index if not exists idx_tasks_assigned_to on public.tasks(assigned_to);
create index if not exists idx_tasks_status on public.tasks(status);
create index if not exists idx_activities_related_to on public.activities(related_to_type, related_to_id);

-- Create function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', null)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Create trigger for new user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Create function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Create triggers for updated_at
create trigger set_updated_at before update on public.profiles for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.companies for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.contacts for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.deals for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.tasks for each row execute function public.handle_updated_at();
