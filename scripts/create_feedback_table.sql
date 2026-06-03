-- Run this SQL in Supabase SQL editor to create the feedback table

create table if not exists feedback (
  id text primary key,
  name text not null,
  email text,
  message text not null,
  created_at timestamptz not null default now()
);
