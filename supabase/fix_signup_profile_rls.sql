-- Fix for: "AuthApiError: Database error saving new user" during Supabase sign-up.
-- Root cause (common): `profiles` has RLS enabled but no INSERT policy,
-- so the `handle_new_user` trigger insert can fail.

-- 1) Allow a user to insert their own profile row.
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'Users can insert own profile'
  ) then
    execute $p$
      create policy "Users can insert own profile"
      on public.profiles
      for insert
      with check (auth.uid() = id)
    $p$;
  end if;
end $$;

-- 2) Make the trigger function more robust (search_path safety).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Trigger name from your schema. Recreate safely.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

