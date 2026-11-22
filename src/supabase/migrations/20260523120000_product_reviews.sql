-- Product reviews: logged-in customers write; public reads published; admin manages all.

create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id text not null,
  user_id uuid not null references auth.users (id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  title text not null,
  comment text not null check (char_length(trim(comment)) >= 10),
  size text,
  color text,
  fit text,
  quality text,
  would_recommend boolean not null default true,
  image_urls text[] not null default '{}',
  helpful_count integer not null default 0,
  status text not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_reviews_status_check check (status in ('published', 'hidden', 'pending')),
  constraint product_reviews_user_product_unique unique (user_id, product_id)
);

create index if not exists product_reviews_product_id_idx on public.product_reviews (product_id);
create index if not exists product_reviews_created_idx on public.product_reviews (created_at desc);
create index if not exists product_reviews_status_idx on public.product_reviews (status);

alter table public.product_reviews enable row level security;

drop policy if exists "product_reviews_select" on public.product_reviews;
create policy "product_reviews_select"
  on public.product_reviews for select
  using (
    status = 'published'
    or user_id = auth.uid()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('admin', 'store_manager')
    )
  );

drop policy if exists "product_reviews_insert_own" on public.product_reviews;
create policy "product_reviews_insert_own"
  on public.product_reviews for insert
  with check (
    auth.uid() is not null
    and user_id = auth.uid()
    and status in ('published', 'pending')
  );

drop policy if exists "product_reviews_update_own" on public.product_reviews;
create policy "product_reviews_update_own"
  on public.product_reviews for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "product_reviews_admin_all" on public.product_reviews;
create policy "product_reviews_admin_all"
  on public.product_reviews for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('admin', 'store_manager')
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('admin', 'store_manager')
    )
  );
