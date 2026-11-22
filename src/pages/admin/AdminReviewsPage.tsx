import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, RefreshCw, Trash2, Eye, EyeOff, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import {
  deleteReviewAdmin,
  fetchAllReviewsForAdmin,
  updateReviewStatusAdmin,
  type ProductReviewRow,
} from '../../services/productReviews';
import { getProductById } from '../../data/products';

const STATUS_OPTIONS = ['all', 'published', 'hidden', 'pending'] as const;

const AdminReviewsPage: React.FC = () => {
  const [rows, setRows] = useState<ProductReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_OPTIONS)[number]>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ProductReviewRow | null>(null);

  const load = useCallback(async () => {
    if (!supabase) {
      setError('Database is not configured.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllReviewsForAdmin(supabase);
      setRows(data);
    } catch (e) {
      const msg =
        e && typeof e === 'object' && 'message' in e
          ? String((e as { message: string }).message)
          : e instanceof Error
            ? e.message
            : 'Failed to load reviews';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (!q) return true;
      const product = getProductById(r.product_id);
      const productName = product?.name?.toLowerCase() ?? '';
      return (
        r.product_id.toLowerCase().includes(q) ||
        productName.includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q) ||
        (r.profiles?.full_name?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [rows, statusFilter, search]);

  const setStatus = async (row: ProductReviewRow, status: ProductReviewRow['status']) => {
    if (!supabase) return;
    try {
      await updateReviewStatusAdmin(supabase, row.id, status);
      await load();
      if (selected?.id === row.id) setSelected({ ...row, status });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed');
    }
  };

  const remove = async (row: ProductReviewRow) => {
    if (!supabase) return;
    if (!window.confirm('Delete this review permanently?')) return;
    try {
      await deleteReviewAdmin(supabase, row.id);
      setSelected(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Star className="h-6 w-6 text-amber-400" aria-hidden />
            Product reviews
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Reviews submitted by logged-in customers on product pages.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200 hover:border-zinc-500"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden />
          Refresh
        </button>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
          <p className="text-xs text-red-300/80 mt-2">
            Run migrations{' '}
            <code className="text-red-100">20260523120000_product_reviews.sql</code> and{' '}
            <code className="text-red-100">20260523130000_product_reviews_profiles_fix.sql</code>. Ensure your
            account has <code className="text-red-100">role = admin</code> in the{' '}
            <code className="text-red-100">profiles</code> table.
          </p>
        </div>
      ) : null}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" aria-hidden />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product, title, comment, customer…"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 pl-10 pr-3 py-2.5 text-sm text-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as (typeof STATUS_OPTIONS)[number])}
          className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2.5 text-sm text-white"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s === 'all' ? 'All statuses' : s}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 rounded-2xl border border-zinc-800 bg-zinc-900/30 overflow-hidden max-h-[70vh] flex flex-col">
          <div className="px-4 py-3 border-b border-zinc-800 text-xs text-zinc-500">
            {loading ? 'Loading…' : `${filtered.length} review${filtered.length === 1 ? '' : 's'}`}
          </div>
          <ul className="overflow-y-auto flex-1 divide-y divide-zinc-800/80">
            {filtered.length === 0 ? (
              <li className="px-4 py-8 text-center text-sm text-zinc-500">No reviews yet.</li>
            ) : (
              filtered.map((r) => {
                const product = getProductById(r.product_id);
                return (
                  <li key={r.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(r)}
                      className={`w-full text-left px-4 py-3 hover:bg-zinc-800/40 transition-colors ${
                        selected?.id === r.id ? 'bg-violet-500/10' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-amber-400 text-xs font-medium">
                          {'★'.repeat(r.rating)}
                          <span className="text-zinc-600 ml-1">{r.rating}/5</span>
                        </span>
                        <span
                          className={`text-[10px] uppercase px-1.5 py-0.5 rounded ${
                            r.status === 'published'
                              ? 'bg-emerald-500/15 text-emerald-300'
                              : r.status === 'hidden'
                                ? 'bg-zinc-500/20 text-zinc-400'
                                : 'bg-amber-500/15 text-amber-300'
                          }`}
                        >
                          {r.status}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-white mt-1 line-clamp-1">{r.title}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {product?.name ?? r.product_id} · {r.profiles?.full_name ?? 'Customer'}
                      </p>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 min-h-[320px]">
          {!selected ? (
            <p className="text-sm text-zinc-500">Select a review to manage visibility or delete it.</p>
          ) : (
            <motion.div key={selected.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-white">{selected.title}</h2>
                  <p className="text-sm text-zinc-400 mt-1">
                    {selected.profiles?.full_name ?? 'Customer'} ·{' '}
                    {new Date(selected.created_at).toLocaleString()}
                  </p>
                  <Link
                    to={`/product/${selected.product_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-violet-400 hover:text-violet-300 mt-1 inline-block"
                  >
                    View product →
                  </Link>
                </div>
                <div className="text-2xl text-amber-400" aria-label={`${selected.rating} stars`}>
                  {'★'.repeat(selected.rating)}
                </div>
              </div>

              <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">{selected.comment}</p>

              {(selected.size || selected.color || selected.fit) && (
                <dl className="grid grid-cols-2 gap-2 text-xs text-zinc-400">
                  {selected.size ? (
                    <div>
                      <dt className="text-zinc-600">Size</dt>
                      <dd className="text-zinc-300">{selected.size}</dd>
                    </div>
                  ) : null}
                  {selected.color ? (
                    <div>
                      <dt className="text-zinc-600">Colour</dt>
                      <dd className="text-zinc-300">{selected.color}</dd>
                    </div>
                  ) : null}
                  {selected.fit ? (
                    <div>
                      <dt className="text-zinc-600">Fit</dt>
                      <dd className="text-zinc-300">{selected.fit}</dd>
                    </div>
                  ) : null}
                </dl>
              )}

              <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-800">
                {selected.status !== 'published' ? (
                  <button
                    type="button"
                    onClick={() => void setStatus(selected, 'published')}
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-600/20 border border-emerald-500/30 px-3 py-2 text-xs font-medium text-emerald-300"
                  >
                    <Eye className="h-3.5 w-3.5" aria-hidden />
                    Publish
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => void setStatus(selected, 'hidden')}
                    className="inline-flex items-center gap-1 rounded-lg border border-zinc-600 px-3 py-2 text-xs font-medium text-zinc-300"
                  >
                    <EyeOff className="h-3.5 w-3.5" aria-hidden />
                    Hide from shop
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => void remove(selected)}
                  className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-3 py-2 text-xs font-medium text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                  Delete
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReviewsPage;
