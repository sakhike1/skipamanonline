import type { SupabaseClient } from '@supabase/supabase-js';

export type DesignRequestRow = {
  id: string;
  request_number: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  budget: string | null;
  timeline: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};

export async function fetchDesignRequestsForAdmin(supabase: SupabaseClient): Promise<DesignRequestRow[]> {
  const { data, error } = await supabase
    .from('design_requests')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) throw error;
  return (data ?? []) as DesignRequestRow[];
}

export async function updateDesignRequestAdmin(
  supabase: SupabaseClient,
  id: string,
  patch: Partial<Pick<DesignRequestRow, 'status' | 'admin_notes'>>,
): Promise<void> {
  const { error } = await supabase
    .from('design_requests')
    .update({
      ...patch,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);
  if (error) throw error;
}

export async function insertDesignRequest(
  supabase: SupabaseClient,
  userId: string,
  payload: {
    request_number: string;
    title: string;
    description: string;
    category: string;
    budget?: string;
    timeline?: string;
  },
): Promise<{ id: string }> {
  const { data, error } = await supabase
    .from('design_requests')
    .insert({
      user_id: userId,
      request_number: payload.request_number,
      title: payload.title,
      description: payload.description,
      category: payload.category,
      budget: payload.budget ?? null,
      timeline: payload.timeline ?? null,
    })
    .select('id')
    .single();

  if (error) throw error;
  return { id: String(data?.id ?? '') };
}
