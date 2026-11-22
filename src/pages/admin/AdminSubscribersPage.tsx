import React, { useCallback, useEffect, useState } from 'react';
import { Download, Mail, RefreshCw, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import {
  deleteNewsletterSubscriber,
  fetchNewsletterSubscribers,
  subscribersToCsv,
  type NewsletterSubscriber,
} from '../../services/adminNewsletter';

const AdminSubscribersPage: React.FC = () => {
  const [rows, setRows] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!supabase) {
      setError('Database is not configured.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNewsletterSubscribers(supabase);
      setRows(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleDelete = async (id: string, email: string) => {
    if (!supabase) return;
    if (!window.confirm(`Remove ${email} from the newsletter list?`)) return;
    setDeletingId(id);
    try {
      await deleteNewsletterSubscriber(supabase, id);
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const handleExport = () => {
    const csv = subscribersToCsv(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Mail className="h-6 w-6 text-violet-400" aria-hidden />
            Newsletter subscribers
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Emails collected from the site newsletter signup. Export or remove entries as needed.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200 hover:border-zinc-500"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden />
            Refresh
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={rows.length === 0}
            className="inline-flex items-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 px-3 py-2 text-sm font-medium text-white"
          >
            <Download className="h-4 w-4" aria-hidden />
            Export CSV
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
          <p className="text-xs text-red-300/80 mt-2">
            If this is a permissions error, run the migration{' '}
            <code className="text-red-100">20260522120000_admin_newsletter_orders_rls.sql</code> in
            Supabase.
          </p>
        </div>
      ) : null}

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-800 text-sm text-zinc-400">
          {loading ? 'Loading…' : `${rows.length} subscriber${rows.length === 1 ? '' : 's'}`}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-zinc-500 text-xs uppercase text-left border-b border-zinc-800 bg-zinc-950/50">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Subscribed</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {!loading && rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-zinc-500">
                    No subscribers yet.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="hover:bg-zinc-800/20">
                    <td className="px-4 py-3 text-white font-medium">{row.email}</td>
                    <td className="px-4 py-3 text-zinc-400">{row.source || '—'}</td>
                    <td className="px-4 py-3 text-zinc-400">
                      {new Date(row.subscribedAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        disabled={deletingId === row.id}
                        onClick={() => void handleDelete(row.id, row.email)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 text-red-300 hover:bg-red-500/10 px-2 py-1 text-xs disabled:opacity-40"
                        title="Unsubscribe / remove"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden />
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminSubscribersPage;
