import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Headphones, Palette, RefreshCw, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import {
  fetchSupportTicketsForAdmin,
  updateSupportTicketAdmin,
  type SupportTicketRow,
} from '../../services/supportTickets';
import {
  fetchDesignRequestsForAdmin,
  updateDesignRequestAdmin,
  type DesignRequestRow,
} from '../../services/designRequestsDb';

const TICKET_STATUS = ['open', 'in_progress', 'waiting_customer', 'resolved', 'closed'] as const;
const DESIGN_STATUS = ['pending', 'reviewed', 'in_progress', 'completed', 'rejected'] as const;

const AdminTicketsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const tab = tabParam === 'design' ? 'design' : 'support';

  const setTab = (t: 'support' | 'design') => {
    setSearchParams(t === 'support' ? {} : { tab: 'design' }, { replace: true });
  };

  const [supportRows, setSupportRows] = useState<SupportTicketRow[]>([]);
  const [designRows, setDesignRows] = useState<DesignRequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSupport, setSelectedSupport] = useState<SupportTicketRow | null>(null);
  const [selectedDesign, setSelectedDesign] = useState<DesignRequestRow | null>(null);

  const load = useCallback(async () => {
    if (!supabase) {
      setError('Database not configured.');
      setLoading(false);
      return;
    }
    try {
      setError(null);
      setLoading(true);
      const [s, d] = await Promise.all([
        fetchSupportTicketsForAdmin(supabase),
        fetchDesignRequestsForAdmin(supabase),
      ]);
      setSupportRows(s);
      setDesignRows(d);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!supabase) return () => {};
    const ch = supabase
      .channel('admin-tickets')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets' }, () => void load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'design_requests' }, () => void load())
      .subscribe();
    return () => {
      void supabase.removeChannel(ch);
    };
  }, [load]);

  const onUpdateSupport = async (row: SupportTicketRow, status: string, adminNotes: string) => {
    if (!supabase) return;
    try {
      await updateSupportTicketAdmin(supabase, row.id, { status, admin_notes: adminNotes });
      await load();
      setSelectedSupport(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed');
    }
  };

  const onUpdateDesign = async (row: DesignRequestRow, status: string, adminNotes: string) => {
    if (!supabase) return;
    try {
      await updateDesignRequestAdmin(supabase, row.id, { status, admin_notes: adminNotes });
      await load();
      setSelectedDesign(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed');
    }
  };

  const designCount = designRows.length;
  const supportCount = supportRows.length;

  const tabs = useMemo(
    () => [
      { id: 'support' as const, label: 'Support tickets', icon: Headphones, count: supportCount },
      { id: 'design' as const, label: 'Design requests', icon: Palette, count: designCount },
    ],
    [supportCount, designCount],
  );

  if (loading && supportRows.length === 0 && designRows.length === 0) {
    return (
      <div className="flex items-center justify-center gap-2 min-h-[40vh] text-zinc-400 text-sm">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
        Loading tickets…
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Tickets</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Customer support (SKT-…) and logged-in design briefs (DRQ-…). Apply the latest SQL migration if tables are
            missing.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center gap-2 text-xs font-medium text-violet-400 px-3 py-2 rounded-lg border border-violet-500/30 hover:bg-violet-500/10"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>
      )}

      <div className="flex gap-2 p-1 rounded-xl bg-zinc-900/80 border border-zinc-800 w-fit flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={[
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              tab === t.id ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white',
            ].join(' ')}
          >
            <t.icon className="h-4 w-4" aria-hidden />
            {t.label}
            <span className="text-xs text-zinc-500">({t.count})</span>
          </button>
        ))}
      </div>

      {tab === 'support' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-zinc-900/90 text-zinc-400 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3">Ticket #</th>
                  <th className="px-4 py-3">From</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {supportRows.map((r) => (
                  <tr key={r.id} className="hover:bg-zinc-800/40">
                    <td className="px-4 py-3 font-mono text-violet-300">{r.ticket_number}</td>
                    <td className="px-4 py-3 text-zinc-300">
                      {r.user_id ? (
                        <span className="text-xs font-mono text-zinc-500">{r.user_id.slice(0, 8)}…</span>
                      ) : (
                        <span>
                          {r.guest_name ?? '—'}
                          <br />
                          <span className="text-xs text-zinc-500">{r.guest_email}</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-white max-w-xs truncate">{r.subject}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300">{r.status}</span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500 whitespace-nowrap">
                      {new Date(r.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedSupport(r)}
                        className="text-violet-400 text-xs font-semibold hover:text-violet-300"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {supportRows.length === 0 && (
            <p className="px-4 py-10 text-center text-zinc-500 text-sm">No support tickets yet — share /support with customers.</p>
          )}
        </motion.div>
      )}

      {tab === 'design' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-zinc-900/90 text-zinc-400 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3">Request #</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {designRows.map((r) => (
                  <tr key={r.id} className="hover:bg-zinc-800/40">
                    <td className="px-4 py-3 font-mono text-cyan-300">{r.request_number}</td>
                    <td className="px-4 py-3 text-xs font-mono text-zinc-500">{r.user_id.slice(0, 8)}…</td>
                    <td className="px-4 py-3 text-white max-w-xs truncate">{r.title}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300">{r.status}</span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500 whitespace-nowrap">
                      {new Date(r.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedDesign(r)}
                        className="text-violet-400 text-xs font-semibold hover:text-violet-300"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {designRows.length === 0 && (
            <p className="px-4 py-10 text-center text-zinc-500 text-sm">
              No design briefs yet — customers can submit at /design-brief (signed in).
            </p>
          )}
        </motion.div>
      )}

      {selectedSupport && (
        <TicketModal
          key={selectedSupport.id}
          title={selectedSupport.ticket_number}
          onClose={() => setSelectedSupport(null)}
          bodyPreview={selectedSupport.body}
          extra={
            <div className="space-y-3 text-sm">
              <p className="text-zinc-400 whitespace-pre-wrap">{selectedSupport.body}</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-zinc-500">
                <span>Category: {selectedSupport.category}</span>
                <span>Priority: {selectedSupport.priority}</span>
              </div>
            </div>
          }
          statusValue={selectedSupport.status}
          statusOptions={[...TICKET_STATUS]}
          adminNotes={selectedSupport.admin_notes ?? ''}
          onSave={(status, notes) => void onUpdateSupport(selectedSupport, status, notes)}
        />
      )}

      {selectedDesign && (
        <TicketModal
          key={selectedDesign.id}
          title={selectedDesign.request_number}
          onClose={() => setSelectedDesign(null)}
          bodyPreview={selectedDesign.description}
          extra={
            <div className="space-y-3 text-sm">
              <p className="text-zinc-400 whitespace-pre-wrap">{selectedDesign.description}</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-zinc-500">
                <span>Category: {selectedDesign.category}</span>
                <span>Budget: {selectedDesign.budget ?? '—'}</span>
                <span>Timeline: {selectedDesign.timeline ?? '—'}</span>
              </div>
            </div>
          }
          statusValue={selectedDesign.status}
          statusOptions={[...DESIGN_STATUS]}
          adminNotes={selectedDesign.admin_notes ?? ''}
          onSave={(status, notes) => void onUpdateDesign(selectedDesign, status, notes)}
        />
      )}
    </div>
  );
};

function TicketModal({
  title,
  onClose,
  extra,
  statusValue,
  statusOptions,
  adminNotes: initialNotes,
  onSave,
}: {
  title: string;
  onClose: () => void;
  bodyPreview?: string;
  extra: React.ReactNode;
  statusValue: string;
  statusOptions: string[];
  adminNotes: string;
  onSave: (status: string, notes: string) => void | Promise<void>;
}) {
  const [status, setStatus] = useState(statusValue);
  const [notes, setNotes] = useState(initialNotes);
  const [busy, setBusy] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" role="dialog">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg rounded-2xl border border-zinc-700 bg-zinc-900 p-6 max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex justify-between items-start gap-4 mb-4">
          <h2 className="text-lg font-semibold text-white font-mono">{title}</h2>
          <button type="button" onClick={onClose} className="text-zinc-500 hover:text-white text-sm">
            Close
          </button>
        </div>
        {extra}
        <div className="mt-6 space-y-3">
          <label className="block text-xs text-zinc-500">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-lg bg-zinc-950 border border-zinc-700 px-3 py-2 text-sm text-white"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
          <label className="block text-xs text-zinc-500">Internal notes</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-lg bg-zinc-950 border border-zinc-700 px-3 py-2 text-sm text-white"
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setBusy(true);
              void Promise.resolve(onSave(status, notes)).finally(() => setBusy(false));
            }}
            className="w-full rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 py-2.5 text-sm font-semibold text-white"
          >
            {busy ? 'Saving…' : 'Save'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default AdminTicketsPage;
