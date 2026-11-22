import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Send } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { supabase } from '../lib/supabase';
import { insertDesignRequest } from '../services/designRequestsDb';
import { generatePublicReference } from '../utils/referenceNumbers';
import { useToast } from '../components/ui/ToastProvider';

const DesignBriefPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('custom_apparel');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [requestNumber, setRequestNumber] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !supabase) {
      showToast('Please sign in to submit a design brief.', 'warning');
      return;
    }
    if (!title.trim() || description.trim().length < 20) {
      showToast('Add a title and a description (at least 20 characters).', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const request_number = generatePublicReference('DRQ');
      await insertDesignRequest(supabase, user.id, {
        request_number,
        title: title.trim(),
        description: description.trim(),
        category,
        budget: budget.trim() || undefined,
        timeline: timeline.trim() || undefined,
      });
      setRequestNumber(request_number);
      showToast('Design brief submitted.', 'success');
      setTitle('');
      setDescription('');
      setBudget('');
      setTimeline('');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Submission failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-black to-neutral-950 text-white pt-28 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <Palette className="h-12 w-12 mx-auto text-violet-400 mb-4" aria-hidden />
          <h1 className="text-3xl font-black tracking-tight">Design brief</h1>
          <p className="mt-3 text-neutral-400 text-sm">
            Submit a custom design request. You&apos;ll receive a reference number — our team reviews it in the admin
            portal under Tickets.
          </p>
        </motion.div>

        {requestNumber ? (
          <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-6 text-center">
            <p className="text-sm text-violet-200 font-semibold">Request logged</p>
            <p className="mt-2 text-2xl font-mono font-bold text-white">{requestNumber}</p>
            <button
              type="button"
              onClick={() => setRequestNumber(null)}
              className="mt-6 text-sm text-violet-400 underline"
            >
              Submit another brief
            </button>
          </div>
        ) : (
          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">Title</label>
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl bg-black/40 border border-white/15 px-3 py-2.5 text-sm"
                placeholder="e.g. School leavers hoodies"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl bg-black/40 border border-white/15 px-3 py-2.5 text-sm"
              >
                <option value="custom_apparel">Custom apparel</option>
                <option value="printing">Printing / branding</option>
                <option value="uniform">Uniforms</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">Description</label>
              <textarea
                required
                rows={7}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl bg-black/40 border border-white/15 px-3 py-2.5 text-sm resize-y min-h-[160px]"
                placeholder="Sizes, colours, quantities, artwork notes…"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Budget (optional)</label>
                <input
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full rounded-xl bg-black/40 border border-white/15 px-3 py-2.5 text-sm"
                  placeholder="e.g. R5000"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Timeline (optional)</label>
                <input
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full rounded-xl bg-black/40 border border-white/15 px-3 py-2.5 text-sm"
                  placeholder="e.g. Needed by 15 June"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 py-3 font-semibold text-sm"
            >
              {submitting ? (
                'Submitting…'
              ) : (
                <>
                  <Send className="h-4 w-4" aria-hidden />
                  Submit design brief
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default DesignBriefPage;
