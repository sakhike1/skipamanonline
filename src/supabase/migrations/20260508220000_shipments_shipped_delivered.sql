-- Timestamps on shipments for admin touches + customer visibility.
-- Run in Supabase SQL Editor after review.

alter table public.shipments
  add column if not exists shipped_at timestamptz;

alter table public.shipments
  add column if not exists delivered_at timestamptz;

comment on column public.shipments.shipped_at is 'When the shipment left fulfillment / carrier pickup';
comment on column public.shipments.delivered_at is 'When delivery was completed';
