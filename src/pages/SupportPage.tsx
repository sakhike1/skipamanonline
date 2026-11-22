import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LifeBuoy, Send, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { supabase } from '../lib/supabase';
import { createSupportTicket } from '../services/supportTickets';
import { useToast } from '../components/ui/ToastProvider';

const CATEGORIES = [
  { value: 'order', label: 'Order & payment' },
  { value: 'shipping', label: 'Shipping & delivery' },
  { value: 'returns', label: 'Returns & exchanges' },
  { value: 'product', label: 'Product question' },
  { value: 'general', label: 'General' },
] as const;

const SupportPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<string>('general');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      showToast('Support is unavailable (database not configured).', 'error');
      return;
    }
    if (!subject.trim() || body.trim().length < 10) {
      showToast('Please enter a subject and at least 10 characters in the message.', 'warning');
      return;
    }
    if (!isAuthenticated && (!guestEmail.trim() || !guestName.trim())) {
      showToast('Please enter your name and email so we can reply.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const { ticket_number } = await createSupportTicket(supabase, {
        userId: user?.id ?? null,
        guestName: !isAuthenticated ? guestName.trim() : undefined,
        guestEmail: !isAuthenticated ? guestEmail.trim() : undefined,
        subject: subject.trim(),
        body: body.trim(),
        category,
      });
      setTicketNumber(ticket_number);
      showToast('Ticket submitted.', 'success');
      setSubject('');
      setBody('');
      setGuestName('');
      setGuestEmail('');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not submit ticket', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-black to-neutral-950 text-white pt-28 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <LifeBuoy className="h-12 w-12 mx-auto text-violet-400 mb-4" aria-hidden />
          <h1 className="text-3xl font-black tracking-tight">Support</h1>
          <p className="mt-3 text-neutral-400 text-sm">
            Submit a ticket with a unique ticket number. Our team will respond by email.
          </p>
        </motion.div>

        {ticketNumber ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center"
          >
            <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto mb-3" aria-hidden />
            <p className="text-sm text-emerald-200 font-semibold">Ticket created</p>
            <p className="mt-2 text-2xl font-mono font-bold tracking-wider text-white">{ticketNumber}</p>
            <p className="mt-3 text-sm text-neutral-400">
              Save this reference. You can quote it in follow-up emails to{' '}
              <a href="mailto:admin@skipaman.co.za" className="text-violet-400 underline">
                admin@skipaman.co.za
              </a>
              .
            </p>
            <button
              type="button"
              onClick={() => setTicketNumber(null)}
              className="mt-6 text-sm text-violet-400 hover:text-violet-300 underline"
            >
              Submit another ticket
            </button>
          </motion.div>
        ) : (
          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
            {!isAuthenticated && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Your name</label>
                  <input
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full rounded-xl bg-black/40 border border-white/15 px-3 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full rounded-xl bg-black/40 border border-white/15 px-3 py-2.5 text-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl bg-black/40 border border-white/15 px-3 py-2.5 text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">Subject</label>
              <input
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-xl bg-black/40 border border-white/15 px-3 py-2.5 text-sm"
                placeholder="Short summary"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">Message</label>
              <textarea
                required
                rows={6}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full rounded-xl bg-black/40 border border-white/15 px-3 py-2.5 text-sm resize-y min-h-[140px]"
                placeholder="Describe your issue (min. 10 characters)."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 py-3 font-semibold text-sm"
            >
              {submitting ? (
                'Sending…'
              ) : (
                <>
                  <Send className="h-4 w-4" aria-hidden />
                  Submit ticket
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SupportPage;
