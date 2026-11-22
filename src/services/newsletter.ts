import { supabase } from '../lib/supabase';

export type NewsletterSubscribeResult =
  | { ok: true; duplicate: boolean }
  | { ok: false; message: string };

/**
 * Persists newsletter signups to `newsletter_subscribers` (see Supabase migration).
 * Email should already be normalized (trim + lowercase).
 */
export async function subscribeToNewsletter(
  email: string,
  source: string
): Promise<NewsletterSubscribeResult> {
  if (!supabase) {
    return {
      ok: false,
      message: 'Newsletter signup is unavailable right now. Please try again later.',
    };
  }

  const { error } = await supabase.from('newsletter_subscribers').insert({
    email,
    source: source || 'unknown',
  });

  if (!error) {
    return { ok: true, duplicate: false };
  }

  // Postgres unique violation
  if (error.code === '23505') {
    return { ok: true, duplicate: true };
  }

  if (error.code === '42P01' || /relation .* does not exist/i.test(error.message ?? '')) {
    return {
      ok: false,
      message: 'Newsletter is still being connected. Please try again in a little while.',
    };
  }

  return {
    ok: false,
    message: error.message || 'Could not subscribe. Please try again.',
  };
}
