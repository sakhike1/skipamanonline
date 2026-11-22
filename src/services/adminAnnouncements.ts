import { supabase } from '../lib/supabase';

export type AdminAnnouncementType = 'info' | 'warning' | 'success' | 'error';
export type AdminAnnouncementPriority = 'low' | 'medium' | 'high' | 'urgent';

export type AdminAnnouncementRow = {
  id: string;
  title: string;
  message: string;
  type: AdminAnnouncementType;
  priority: AdminAnnouncementPriority;
  action_required: boolean;
  action_url: string | null;
  persistent: boolean;
  created_by: string | null;
  created_at: string;
};

export async function createAdminAnnouncement(input: {
  title: string;
  message: string;
  type: AdminAnnouncementType;
  priority: AdminAnnouncementPriority;
  actionRequired?: boolean;
  actionUrl?: string;
  persistent?: boolean;
}): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured');
  const { error } = await supabase.from('admin_announcements').insert({
    title: input.title,
    message: input.message,
    type: input.type,
    priority: input.priority,
    action_required: Boolean(input.actionRequired),
    action_url: input.actionUrl?.trim() ? input.actionUrl.trim() : null,
    persistent: Boolean(input.persistent),
    created_by: (await supabase.auth.getUser()).data.user?.id ?? null,
  });
  if (error) throw error;
}

