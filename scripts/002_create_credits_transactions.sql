-- Create credits transactions table
create table if not exists public.credits_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  amount integer not null,
  type text not null check (type in ('purchase', 'usage', 'bonus')),
  description text,
  stripe_session_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.credits_transactions enable row level security;

-- RLS Policies for credits_transactions
create policy "Users can view their own transactions"
  on public.credits_transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own transactions"
  on public.credits_transactions for insert
  with check (auth.uid() = user_id);
