import type { SupabaseClient } from '@supabase/supabase-js';
import { generatePublicReference } from '../utils/referenceNumbers';

export type SupportTicketRow = {
  id: string;
  ticket_number: string;
  user_id: string | null;
  guest_name: string | null;
  guest_email: string | null;
  subject: string;
  body: string;
  category: string;
  status: string;
  priority: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};

export async function fetchSupportTicketsForAdmin(supabase: SupabaseClient): Promise<SupportTicketRow[]> {
  const { data, error } = await supabase
    .from('support_tickets')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) throw error;
  return (data ?? []) as SupportTicketRow[];
}

export async function fetchSupportTicketsForUser(supabase: SupabaseClient, userId: string): Promise<SupportTicketRow[]> {
  const { data, error } = await supabase
    .from('support_tickets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data ?? []) as SupportTicketRow[];
}

export async function createSupportTicket(
  supabase: SupabaseClient,
  payload: {
    userId: string | null;
    guestName?: string;
    guestEmail?: string;
    subject: string;
    body: string;
    category: string;
  },
): Promise<{ ticket_number: string }> {
  const ticket_number = generatePublicReference('SKT');

  if (payload.userId) {
    const { error } = await supabase.from('support_tickets').insert({
      ticket_number,
      user_id: payload.userId,
      subject: payload.subject,
      body: payload.body,
      category: payload.category || 'general',
    });
    if (error) throw error;
    return { ticket_number };
  }

  const { error } = await supabase.from('support_tickets').insert({
    ticket_number,
    user_id: null,
    guest_name: payload.guestName ?? null,
    guest_email: payload.guestEmail ?? null,
    subject: payload.subject,
    body: payload.body,
    category: payload.category || 'general',
  });
  if (error) throw error;
  return { ticket_number };
}

export async function updateSupportTicketAdmin(
  supabase: SupabaseClient,
  id: string,
  patch: Partial<Pick<SupportTicketRow, 'status' | 'priority' | 'admin_notes'>>,
): Promise<void> {
  const { error } = await supabase
    .from('support_tickets')
    .update({
      ...patch,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);
  if (error) throw error;
}
