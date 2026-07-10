alter table public.votes
  add column if not exists proof_image_url text;
