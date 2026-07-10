create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  role text not null default 'applicant' check (role in ('applicant', 'admin')),
  created_at timestamptz default now()
);

create table if not exists public.categories (
  id text primary key,
  slug text unique not null,
  name text not null,
  short_name text not null,
  description text,
  category_group text not null check (category_group in ('A', 'B'))
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references public.profiles(id) on delete cascade,
  full_name text not null,
  age int,
  sex text,
  marital_status text,
  business_name text not null,
  business_address text,
  staff_strength int,
  annual_turnover text,
  social_media_id text,
  whatsapp_number text not null,
  alternative_number text,
  email text not null,
  category_slug text not null references public.categories(slug),
  statement text not null,
  headshot_url text,
  business_logo_url text,
  supporting_doc_url text,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'shortlisted')),
  admin_notes text,
  created_at timestamptz default now(),
  reviewed_at timestamptz
);

create index if not exists applications_status_idx on public.applications(status);
create index if not exists applications_category_idx on public.applications(category_slug);
create index if not exists applications_applicant_idx on public.applications(applicant_id);

create table if not exists public.nominees (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references public.applications(id) on delete set null,
  slug text unique not null,
  full_name text not null,
  business_name text not null,
  category_slug text not null references public.categories(slug),
  industry text,
  headline text not null,
  bio text not null,
  headshot_url text not null,
  share_image_url text,
  total_votes int not null default 0,
  is_published boolean default true,
  created_at timestamptz default now()
);

create index if not exists nominees_category_idx on public.nominees(category_slug);
create index if not exists nominees_published_idx on public.nominees(is_published);

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  nominee_id uuid not null references public.nominees(id) on delete cascade,
  voter_email text not null,
  voter_phone text,
  vote_count int not null default 1 check (vote_count > 0),
  amount_kobo int not null check (amount_kobo > 0),
  paystack_reference text unique not null,
  paystack_status text not null,
  created_at timestamptz default now()
);

create index if not exists votes_nominee_idx on public.votes(nominee_id);
create index if not exists votes_status_idx on public.votes(paystack_status);

create or replace function public.bump_nominee_votes()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.paystack_status = 'success' then
    update public.nominees
       set total_votes = total_votes + new.vote_count
     where id = new.nominee_id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_vote_inserted on public.votes;
create trigger on_vote_inserted
  after insert on public.votes
  for each row execute procedure public.bump_nominee_votes();

create table if not exists public.voting_settings (
  id int primary key check (id = 1),
  is_open boolean default false,
  price_per_vote_kobo int default 10000,
  voting_opens_at timestamptz,
  voting_closes_at timestamptz,
  updated_at timestamptz default now()
);

insert into public.voting_settings (id, voting_opens_at, voting_closes_at)
values (1, '2026-08-25T00:00:00+01:00', '2026-09-30T23:59:00+01:00')
on conflict (id) do nothing;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.applications enable row level security;
alter table public.nominees enable row level security;
alter table public.votes enable row level security;
alter table public.voting_settings enable row level security;

drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read" on public.categories
  for select to anon, authenticated using (true);

drop policy if exists "categories_admin_write" on public.categories;
create policy "categories_admin_write" on public.categories
  for all to authenticated
  using ((select role from public.profiles where id = auth.uid()) = 'admin')
  with check ((select role from public.profiles where id = auth.uid()) = 'admin');

drop policy if exists "profiles_self_read" on public.profiles;
create policy "profiles_self_read" on public.profiles
  for select to authenticated using (id = auth.uid());

drop policy if exists "profiles_admin_read" on public.profiles;
create policy "profiles_admin_read" on public.profiles
  for select to authenticated
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "applications_self_read" on public.applications;
create policy "applications_self_read" on public.applications
  for select to authenticated using (applicant_id = auth.uid());

drop policy if exists "applications_admin_read" on public.applications;
create policy "applications_admin_read" on public.applications
  for select to authenticated
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

drop policy if exists "applications_self_insert" on public.applications;
create policy "applications_self_insert" on public.applications
  for insert to authenticated with check (applicant_id = auth.uid());

drop policy if exists "applications_admin_update" on public.applications;
create policy "applications_admin_update" on public.applications
  for update to authenticated
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

drop policy if exists "nominees_public_read" on public.nominees;
create policy "nominees_public_read" on public.nominees
  for select to anon, authenticated using (is_published = true);

drop policy if exists "nominees_admin_write" on public.nominees;
create policy "nominees_admin_write" on public.nominees
  for all to authenticated
  using ((select role from public.profiles where id = auth.uid()) = 'admin')
  with check ((select role from public.profiles where id = auth.uid()) = 'admin');

drop policy if exists "votes_admin_read" on public.votes;
create policy "votes_admin_read" on public.votes
  for select to authenticated
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

drop policy if exists "voting_settings_public_read" on public.voting_settings;
create policy "voting_settings_public_read" on public.voting_settings
  for select to anon, authenticated using (true);

drop policy if exists "voting_settings_admin_write" on public.voting_settings;
create policy "voting_settings_admin_write" on public.voting_settings
  for all to authenticated
  using ((select role from public.profiles where id = auth.uid()) = 'admin')
  with check ((select role from public.profiles where id = auth.uid()) = 'admin');

insert into storage.buckets (id, name, public)
values ('applications', 'applications', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('nominees', 'nominees', true)
on conflict (id) do nothing;

drop policy if exists "applications_owner_upload" on storage.objects;
create policy "applications_owner_upload" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'applications' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "applications_owner_read" on storage.objects;
create policy "applications_owner_read" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'applications'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or (select role from public.profiles where id = auth.uid()) = 'admin'
    )
  );

drop policy if exists "nominees_public_read" on storage.objects;
create policy "nominees_public_read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'nominees');

drop policy if exists "nominees_admin_write" on storage.objects;
create policy "nominees_admin_write" on storage.objects
  for all to authenticated
  using (
    bucket_id = 'nominees'
    and (select role from public.profiles where id = auth.uid()) = 'admin'
  )
  with check (
    bucket_id = 'nominees'
    and (select role from public.profiles where id = auth.uid()) = 'admin'
  );

