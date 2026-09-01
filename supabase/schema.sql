-- SHANMUGAVEL BOOKUNIVERSE - Supabase Schema
-- Run in Supabase SQL Editor

-- Enable UUID
create extension if not exists "uuid-ossp";

-- EBOOKS - Front Cover JPG = First Page logic
create table ebooks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  authors text[] not null default '{Shanmugavel M}',
  cover_url text not null, -- R2 key, mandatory first page
  pdf_url text not null, -- after merge cover as page 1
  epub_url text, -- optional
  original_file_url text, -- original doc/mobi before conversion
  mrp integer not null, -- in paise
  visibility text check (visibility in ('public','private')) default 'public',
  preview_start int default 1,
  preview_end int default 10,
  isbn text,
  publisher text default 'SHANMUGAVEL BOOKUNIVERSE',
  language text[] default '{English}',
  category text[] default '{}',
  about_authors text default 'Shanmugavel M - For 5% THINKERS',
  description text default 'World is a fantasy, My books are fairies, let my fairy guide you to explore the fantasy',
  kindle_link text,
  paperback_link text,
  archived boolean default false,
  is_draft boolean default false,
  sku text default 'GUN-STORY-' || substr(md5(random()::text),1,6),
  created_at timestamptz default now()
);

-- AUDIOBOOKS
create table audiobooks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null default 'Shanmugavel M',
  narrator text not null default 'Shanmugavel M',
  is_ai_voice boolean default false,
  is_series boolean default false,
  brand_name text default 'SHANMUGAVEL BOOKUNIVERSE',
  ebook_id uuid references ebooks(id),
  pdf_reference_url text not null, -- verification only, not for readers
  sample_audio_url text,
  language text default 'English',
  mrp integer not null,
  cover_url text not null,
  cover_rect_url text,
  opening_track_url text not null,
  closing_track_url text not null,
  additional_pdf_url text,
  audible_link text,
  description text default 'World is a fantasy, My books are fairies...',
  genre1 text,
  visibility text default 'public',
  archived boolean default false,
  is_draft boolean default false,
  sku text default 'GUN-AUDIO-' || substr(md5(random()::text),1,6),
  created_at timestamptz default now()
);

create table audio_chapters (
  id uuid primary key default gen_random_uuid(),
  audiobook_id uuid references audiobooks(id) on delete cascade,
  title text not null,
  track_url text not null,
  position int not null, -- 01,02,03...
  duration_seconds int,
  file_size_mb numeric,
  is_opening boolean default false,
  is_ending boolean default false,
  created_at timestamptz default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  razorpay_order_id text not null,
  razorpay_payment_id text,
  total_amount int not null,
  status text default 'created',
  created_at timestamptz default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  ebook_id uuid references ebooks(id),
  audiobook_id uuid references audiobooks(id),
  price int not null,
  created_at timestamptz default now()
);

create table user_library (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  ebook_id uuid references ebooks(id),
  audiobook_id uuid references audiobooks(id),
  order_id uuid references orders(id),
  purchased_at timestamptz default now(),
  unique(user_id, ebook_id, audiobook_id)
);

create table founder_profile (
  id uuid primary key default gen_random_uuid(),
  name text default 'Shanmugavel M',
  tagline text default 'For 5% THINKERS',
  fairy_quote text default 'World is a fantasy, My books are fairies, let my fairy guide you to explore the fantasy',
  bio text,
  coin_logo_url text,
  email text default 'founder@velsbookstore.com',
  updated_at timestamptz default now()
);

insert into founder_profile (name) values ('Shanmugavel M') on conflict do nothing;

-- RLS
alter table ebooks enable row level security;
create policy "public read public ebooks" on ebooks for select using (visibility='public' and is_draft=false);
create policy "founder all ebooks" on ebooks for all using (auth.jwt() ->> 'email' = 'founder@velsbookstore.com');

alter table audiobooks enable row level security;
create policy "public read public audiobooks" on audiobooks for select using (visibility='public' and is_draft=false);

alter table audio_chapters enable row level security;
create policy "public read chapters" on audio_chapters for select using (true);

alter table orders enable row level security;
create policy "user own orders" on orders for select using (auth.uid() = user_id);

alter table user_library enable row level security;
create policy "user own library" on user_library for select using (auth.uid() = user_id);

alter table founder_profile enable row level security;
create policy "public read founder" on founder_profile for select using (true);
