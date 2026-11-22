import type { SupabaseClient } from '@supabase/supabase-js';

export interface NewsletterSubscriber {
  id: string;
  email: string;
  source: string | null;
  subscribedAt: string;
}

export async function fetchNewsletterSubscribers(
  supabase: SupabaseClient,
  limit = 500,
): Promise<NewsletterSubscriber[]> {
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .select('id, email, source, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id as string,
    email: row.email as string,
    source: (row.source as string | null) ?? null,
    subscribedAt: row.created_at as string,
  }));
}

export async function deleteNewsletterSubscriber(
  supabase: SupabaseClient,
  id: string,
): Promise<void> {
  const { error } = await supabase.from('newsletter_subscribers').delete().eq('id', id);
  if (error) throw error;
}

export async function countNewsletterSubscribers(supabase: SupabaseClient): Promise<number> {
  const { count, error } = await supabase
    .from('newsletter_subscribers')
    .select('*', { count: 'exact', head: true });
  if (error) throw error;
  return count ?? 0;
}

export function subscribersToCsv(rows: NewsletterSubscriber[]): string {
  const header = 'email,source,subscribed_at';
  const lines = rows.map(
    (r) =>
      `${r.email},${(r.source ?? '').replace(/,/g, ' ')},${new Date(r.subscribedAt).toISOString()}`,
  );
  return [header, ...lines].join('\n');
}
