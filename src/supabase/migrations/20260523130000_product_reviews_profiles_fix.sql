-- Fix admin/product review loads: FK to profiles + staff can read profile names for embeds.

-- Point user_id at profiles (same UUID as auth.users) so PostgREST can embed profiles(...)
alter table public.product_reviews
  drop constraint if exists product_reviews_user_id_fkey;

alter table public.product_reviews
  add constraint product_reviews_user_id_fkey
  foreign key (user_id) references public.profiles (id) on delete cascade;

-- Avoid RLS recursion when checking staff role on profiles
create or replace function public.is_staff_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('admin', 'store_manager')
  );
$$;

revoke all on function public.is_staff_user() from public;
grant execute on function public.is_staff_user() to authenticated, anon;

drop policy if exists "profiles_staff_select" on public.profiles;
create policy "profiles_staff_select"
  on public.profiles
  for select
  using (id = auth.uid() or public.is_staff_user());
