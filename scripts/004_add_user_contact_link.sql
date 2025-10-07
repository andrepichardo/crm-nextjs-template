-- Add user_id to contacts table to link contacts to authenticated users
alter table public.contacts add column if not exists user_id uuid references auth.users(id) on delete set null;

-- Create index for better performance
create index if not exists idx_contacts_user_id on public.contacts(user_id);

-- Add policy for users to view their own contact
create policy "Users can view their own contact" on public.contacts for select using (auth.uid() = user_id);

-- Add policy for users to update their own contact
create policy "Users can update their own contact" on public.contacts for update using (auth.uid() = user_id);

-- Comment explaining the user_id field
comment on column public.contacts.user_id is 'Links contact to an authenticated user for portal access';
