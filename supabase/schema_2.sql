
-- SHANMUGAVEL BOOKUNIVERSE - Supabase Schema - 6 tables
-- P2 DONE: Storage ebooks + covers + audiobooks PUBLIC

-- Enable pgcrypto
create extension if not exists "pgcrypto";

-- ebooks table
create table if not exists ebooks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  pdf_url text not null,
  pdf_path text not null,
  cover_url text not null,
  cover_path text not null,
  cover_cloudinary text,
  mrp int default 299,
  authors text[] default '{"Shanmugavel M"}',
  publisher text default 'SHANMUGAVEL BOOKUNIVERSE',
  description text default 'World is a fantasy, My books are fairies, let my fairy guide you to explore the fantasy',
  created_at timestamp with time zone default now()
);

-- audiobooks table
create table if not exists audiobooks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  cover_url text not null,
  cover_path text not null,
  cover_cloudinary text,
  opening_url text,
  opening_path text,
  ending_url text,
  ending_path text,
  chapters jsonb default '[]'::jsonb,
  mrp int default 199,
  authors text[] default '{"Shanmugavel M"}',
  publisher text default 'SHANMUGAVEL BOOKUNIVERSE',
  description text default 'Gold BIG BOX Audiobook - Howler PLAY ONLY',
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table ebooks enable row level security;
alter table audiobooks enable row level security;

-- Policies - allow public read, allow all for anon (since founder vault bypass dev)
drop policy if exists "Public read ebooks" on ebooks;
create policy "Public read ebooks" on ebooks for select using (true);

drop policy if exists "Public insert ebooks" on ebooks;
create policy "Public insert ebooks" on ebooks for insert with check (true);

drop policy if exists "Public update ebooks" on ebooks;
create policy "Public update ebooks" on ebooks for update using (true);

drop policy if exists "Public delete ebooks" on ebooks;
create policy "Public delete ebooks" on ebooks for delete using (true);

drop policy if exists "Public read audiobooks" on audiobooks;
create policy "Public read audiobooks" on audiobooks for select using (true);

drop policy if exists "Public insert audiobooks" on audiobooks;
create policy "Public insert audiobooks" on audiobooks for insert with check (true);

drop policy if exists "Public update audiobooks" on audiobooks;
create policy "Public update audiobooks" on audiobooks for update using (true);

drop policy if exists "Public delete audiobooks" on audiobooks;
create policy "Public delete audiobooks" on audiobooks for delete using (true);

-- Storage buckets: create ebooks, covers, audiobooks as PUBLIC
-- Run in Supabase Dashboard > Storage > New Bucket > Public checked
-- Then run these storage policies in SQL Editor:

-- Storage policies for ebooks, covers, audiobooks
-- Allow public read
-- INSERT: You need service_role key via /api/upload route to bypass CORS Failed to fetch

-- For quick fix, make buckets public and add storage policies:
-- Go to Storage > Policies > ebooks > New Policy > Allow public read + Allow insert for anon
