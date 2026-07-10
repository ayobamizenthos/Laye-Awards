alter table public.votes
  alter column paystack_reference drop not null;

alter table public.votes
  add column if not exists payment_method text not null default 'paystack'
    check (payment_method in ('paystack', 'bank_transfer')),
  add column if not exists bank_reference text,
  add column if not exists voter_name text,
  add column if not exists confirmed_at timestamptz,
  add column if not exists confirmed_by uuid references public.profiles(id);

create or replace function public.bump_nominee_votes()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.paystack_status = 'success'
     and (tg_op = 'INSERT' or coalesce(old.paystack_status, '') <> 'success') then
    update public.nominees
       set total_votes = total_votes + new.vote_count
     where id = new.nominee_id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_vote_inserted on public.votes;
create trigger on_vote_inserted
  after insert or update on public.votes
  for each row execute procedure public.bump_nominee_votes();

drop policy if exists "votes_public_insert_pending" on public.votes;
create policy "votes_public_insert_pending" on public.votes
  for insert to anon, authenticated
  with check (
    payment_method = 'bank_transfer'
    and paystack_status = 'pending'
    and vote_count > 0
    and vote_count <= 500
  );
