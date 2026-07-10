alter table public.profiles
  add column if not exists avatar_url text,
  add column if not exists instagram_handle text,
  add column if not exists twitter_handle text,
  add column if not exists facebook_handle text,
  add column if not exists business_name text,
  add column if not exists business_address text;
