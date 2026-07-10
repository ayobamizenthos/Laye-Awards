create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

grant execute on function public.current_user_role() to anon, authenticated;

drop policy if exists "profiles_admin_read" on public.profiles;
create policy "profiles_admin_read" on public.profiles
  for select to authenticated
  using (public.current_user_role() = 'admin');

drop policy if exists "categories_admin_write" on public.categories;
create policy "categories_admin_write" on public.categories
  for all to authenticated
  using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

drop policy if exists "applications_admin_read" on public.applications;
create policy "applications_admin_read" on public.applications
  for select to authenticated
  using (public.current_user_role() = 'admin');

drop policy if exists "applications_admin_update" on public.applications;
create policy "applications_admin_update" on public.applications
  for update to authenticated
  using (public.current_user_role() = 'admin');

drop policy if exists "nominees_admin_write" on public.nominees;
create policy "nominees_admin_write" on public.nominees
  for all to authenticated
  using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

drop policy if exists "votes_admin_read" on public.votes;
create policy "votes_admin_read" on public.votes
  for select to authenticated
  using (public.current_user_role() = 'admin');

drop policy if exists "voting_settings_admin_write" on public.voting_settings;
create policy "voting_settings_admin_write" on public.voting_settings
  for all to authenticated
  using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

drop policy if exists "applications_owner_read" on storage.objects;
create policy "applications_owner_read" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'applications'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.current_user_role() = 'admin'
    )
  );

drop policy if exists "nominees_admin_write" on storage.objects;
create policy "nominees_admin_write" on storage.objects
  for all to authenticated
  using (bucket_id = 'nominees' and public.current_user_role() = 'admin')
  with check (bucket_id = 'nominees' and public.current_user_role() = 'admin');

