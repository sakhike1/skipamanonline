import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  MessageCircle,
  X,
  Send,
  Package,
  ChevronLeft,
  Headphones,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { supabase } from '../../lib/supabase';
import {
  buildSupportWhatsAppMessage,
  formatWhatsAppDisplay,
  openWhatsAppSupport,
} from '../../lib/whatsapp';
import { detectSupportIntent, intentCategory, intentReply } from '../../lib/supportChatIntents';
import { createSupportTicket } from '../../services/supportTickets';
import {
  fetchUserOrdersForChat,
  formatOrderStatusMessage,
  lookupOrderByReference,
  lookupOrderForSignedInUser,
  type UserOrderSummary,
} from '../../services/orderLookup';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  at: number;
};

type PanelView = 'chat' | 'track' | 'whatsapp';

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  text: 'Welcome to Skipaman Support. Ask about orders, shipping, or products — we usually reply within a few hours on WhatsApp.',
  at: Date.now(),
};

function newId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatTime(at: number): string {
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date(at));
}

function useFooterNearViewport(): boolean {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = document.getElementById('footer');
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setNear(entry.isIntersecting),
      { root: null, rootMargin: '0px', threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return near;
}

const launcherBottom = (footerNear: boolean, open: boolean) => {
  if (open) return footerNear ? 'bottom-[7.5rem]' : 'bottom-24';
  return footerNear ? 'bottom-[5.5rem]' : 'bottom-5';
};

const SupportChatWidget: React.FC = () => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const footerNear = useFooterNearViewport();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<PanelView>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [draft, setDraft] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [orderRef, setOrderRef] = useState('');
  const [trackEmail, setTrackEmail] = useState('');
  const [userOrders, setUserOrders] = useState<UserOrderSummary[]>([]);
  const [busy, setBusy] = useState(false);
  const [lastTicket, setLastTicket] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isHomePage = location.pathname === '/';
  const isAdminRoute = location.pathname.startsWith('/admin');

  const appendAssistant = useCallback((text: string) => {
    setMessages((prev) => [...prev, { id: newId(), role: 'assistant', text, at: Date.now() }]);
  }, []);

  const appendUser = useCallback((text: string) => {
    setMessages((prev) => [...prev, { id: newId(), role: 'user', text, at: Date.now() }]);
  }, []);

  useEffect(() => {
    if (!open || !scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open, view, busy]);

  useEffect(() => {
    if (!open || !isAuthenticated || !supabase || !user?.id) {
      setUserOrders([]);
      return;
    }
    void fetchUserOrdersForChat(supabase, user.id)
      .then(setUserOrders)
      .catch(() => setUserOrders([]));
  }, [open, isAuthenticated, user?.id]);

  useEffect(() => {
    if (isAuthenticated && user?.email) setTrackEmail(user.email);
  }, [isAuthenticated, user?.email]);

  if (isAdminRoute || !isHomePage) return null;

  const fabPos = launcherBottom(footerNear, open);
  const panelPos = footerNear ? 'bottom-[7.5rem] sm:bottom-[8rem]' : 'bottom-24 sm:bottom-28';

  const whatsAppPreview = buildSupportWhatsAppMessage({
    userName: isAuthenticated ? undefined : guestName.trim() || undefined,
    userEmail: isAuthenticated ? user?.email : guestEmail.trim() || undefined,
    ticketNumber: lastTicket ?? undefined,
    orderRef: orderRef.trim() || undefined,
    lastQuestion: [...messages].reverse().find((m) => m.role === 'user')?.text,
    pagePath: location.pathname,
  });

  const goToWhatsApp = () => {
    openWhatsAppSupport({
      userName: isAuthenticated ? undefined : guestName.trim() || undefined,
      userEmail: isAuthenticated ? user?.email : guestEmail.trim() || undefined,
      ticketNumber: lastTicket ?? undefined,
      orderRef: orderRef.trim() || undefined,
      lastQuestion: [...messages].reverse().find((m) => m.role === 'user')?.text,
      pagePath: location.pathname,
    });
    setOpen(false);
  };

  const submitMessage = async () => {
    const text = draft.trim();
    if (!text || busy) return;

    appendUser(text);
    setDraft('');
    setBusy(true);

    await new Promise((r) => setTimeout(r, 450));

    const intent = detectSupportIntent(text);

    if (intent === 'track_order') {
      appendAssistant(intentReply('track_order'));
      setView('track');
      setBusy(false);
      return;
    }

    appendAssistant(intentReply(intent));

    if (supabase) {
      try {
        const subject =
          intent === 'general' ? text.slice(0, 80) : `[Chat] ${intent.replace(/_/g, ' ')}`;
        const body = [
          text,
          guestEmail ? `Contact email: ${guestEmail}` : null,
          orderRef ? `Order ref: ${orderRef}` : null,
          `Page: ${location.pathname}`,
        ]
          .filter(Boolean)
          .join('\n\n');

        const { ticket_number } = await createSupportTicket(supabase, {
          userId: user?.id ?? null,
          guestName: !isAuthenticated ? guestName.trim() || undefined : undefined,
          guestEmail: !isAuthenticated ? guestEmail.trim() || undefined : user?.email,
          subject,
          body,
          category: intentCategory(intent),
        });

        setLastTicket(ticket_number);
        appendAssistant(
          `Saved as ticket ${ticket_number}. Our team will follow up. For a faster reply, continue on WhatsApp — tap “WhatsApp support” below.`,
        );
      } catch {
        appendAssistant('Couldn’t save your message right now. Use WhatsApp support below and we’ll help you directly.');
      }
    } else {
      appendAssistant('Chat tickets are offline — use WhatsApp support below.');
    }

    setBusy(false);
  };

  const runTrackLookup = async (ref: string, email: string) => {
    if (!supabase) {
      appendAssistant('Order lookup is unavailable. Use WhatsApp support with your order reference.');
      return;
    }
    setBusy(true);
    appendUser(`Track order ${ref}`);
    await new Promise((r) => setTimeout(r, 400));
    try {
      const result =
        isAuthenticated && user?.id
          ? await lookupOrderForSignedInUser(supabase, user.id, ref).then(async (r) =>
              r.found ? r : lookupOrderByReference(supabase, ref, email),
            )
          : await lookupOrderByReference(supabase, ref, email);
      appendAssistant(formatOrderStatusMessage(result));
      if (result.found && result.orderNumber) setOrderRef(result.orderNumber);
    } catch {
      appendAssistant('Something went wrong. Try again or contact us on WhatsApp.');
    } finally {
      setBusy(false);
      setView('chat');
    }
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = orderRef.trim();
    const email = (isAuthenticated ? user?.email : trackEmail).trim();
    if (!ref || !email) {
      appendAssistant('Enter your order reference (SKP-…) and checkout email.');
      return;
    }
    void runTrackLookup(ref, email);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className={`fixed left-4 z-[70] flex h-[min(520px,calc(100vh-8rem))] w-[min(100vw-2rem,400px)] flex-col overflow-hidden rounded-2xl border border-neutral-800/90 bg-neutral-950 shadow-2xl shadow-black/60 sm:left-6 ${panelPos}`}
            role="dialog"
            aria-label="Skipaman support chat"
          >
            <header className="shrink-0 border-b border-neutral-800 bg-gradient-to-br from-neutral-900 via-black to-neutral-950 px-4 py-3.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {view !== 'chat' ? (
                    <button
                      type="button"
                      onClick={() => setView('chat')}
                      className="rounded-lg p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white"
                      aria-label="Back to chat"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                  ) : (
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-neutral-700 to-black text-sm font-bold text-white ring-2 ring-emerald-500/40"
                      aria-hidden
                    >
                      S
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">Skipaman Support</p>
                    <p className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
                      Online · replies on WhatsApp
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setView('chat');
                  }}
                  className="rounded-lg p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white"
                  aria-label="Close chat"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </header>

            {view === 'whatsapp' ? (
              <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
                <p className="text-sm text-neutral-300">
                  Continue this conversation on <strong className="text-white">WhatsApp</strong> with our support
                  team at <span className="text-emerald-400">{formatWhatsAppDisplay()}</span>.
                </p>
                <p className="text-xs text-neutral-500 rounded-lg bg-neutral-900/80 border border-neutral-800 p-3">
                  You’ll send a message <em>to Skipaman</em>, not to yourself. If you’re testing on the store phone,
                  WhatsApp may show your own number — that’s normal for owners only.
                </p>
                <pre className="max-h-40 overflow-y-auto rounded-xl bg-black/60 border border-neutral-800 p-3 text-[11px] text-neutral-400 whitespace-pre-wrap font-sans">
                  {whatsAppPreview}
                </pre>
                <button
                  type="button"
                  onClick={goToWhatsApp}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-semibold text-white hover:bg-[#20bd5a]"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  Open WhatsApp
                  <ExternalLink className="h-3.5 w-3.5 opacity-80" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => setView('chat')}
                  className="text-xs text-neutral-500 hover:text-neutral-300"
                >
                  ← Back to chat
                </button>
              </div>
            ) : view === 'track' ? (
              <form onSubmit={handleTrackSubmit} className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
                <p className="text-xs text-neutral-400">
                  Order reference from your confirmation + email used at checkout.
                </p>
                <input
                  value={orderRef}
                  onChange={(e) => setOrderRef(e.target.value)}
                  placeholder="Order ref e.g. SKP-…"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-white"
                  required
                />
                <input
                  type="email"
                  value={isAuthenticated ? user?.email ?? '' : trackEmail}
                  onChange={(e) => setTrackEmail(e.target.value)}
                  readOnly={isAuthenticated}
                  placeholder="Email used at checkout"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-white disabled:opacity-70"
                  required
                />
                {isAuthenticated && userOrders.length > 0 ? (
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
                      Recent orders
                    </p>
                    {userOrders.map((o) => (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => {
                          setOrderRef(o.orderNumber);
                          if (user?.email) void runTrackLookup(o.orderNumber, user.email);
                        }}
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-2.5 text-left text-xs hover:border-neutral-600"
                      >
                        <span className="font-mono font-semibold text-white">{o.orderNumber}</span>
                        <span className="ml-2 text-neutral-500 capitalize">{o.status.replace(/_/g, ' ')}</span>
                      </button>
                    ))}
                  </div>
                ) : null}
                <button
                  type="submit"
                  disabled={busy}
                  className="mt-auto rounded-xl bg-white py-2.5 text-sm font-semibold text-black hover:bg-neutral-200 disabled:opacity-50"
                >
                  {busy ? 'Checking…' : 'Check order status'}
                </button>
              </form>
            ) : (
              <>
                <div
                  ref={scrollRef}
                  className="flex flex-1 flex-col gap-3 overflow-y-auto bg-neutral-950/80 px-4 py-4"
                >
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {m.role === 'assistant' ? (
                        <div
                          className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-neutral-600 to-black text-[10px] font-bold text-white"
                          aria-hidden
                        >
                          S
                        </div>
                      ) : null}
                      <div className={`max-w-[82%] ${m.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                        <div
                          className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                            m.role === 'user'
                              ? 'rounded-br-md bg-white text-black'
                              : 'rounded-bl-md border border-neutral-800 bg-neutral-900 text-neutral-100'
                          }`}
                        >
                          {m.text}
                        </div>
                        <span className="mt-1 px-1 text-[10px] text-neutral-600">{formatTime(m.at)}</span>
                      </div>
                    </div>
                  ))}
                  {busy ? (
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <span className="flex gap-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-500 [animation-delay:0ms]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-500 [animation-delay:150ms]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-500 [animation-delay:300ms]" />
                      </span>
                      Support is typing…
                    </div>
                  ) : null}
                </div>

                <div className="shrink-0 border-t border-neutral-800 bg-black/40 px-3 py-2">
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    <button
                      type="button"
                      onClick={() => setView('track')}
                      className="shrink-0 inline-flex items-center gap-1 rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-[11px] font-medium text-neutral-200 hover:border-neutral-500"
                    >
                      <Package className="h-3 w-3" aria-hidden />
                      Track order
                    </button>
                    <button
                      type="button"
                      onClick={() => setView('whatsapp')}
                      className="shrink-0 inline-flex items-center gap-1 rounded-full border border-[#25D366]/30 bg-[#25D366]/10 px-3 py-1.5 text-[11px] font-medium text-[#5fe08a] hover:bg-[#25D366]/20"
                    >
                      <MessageCircle className="h-3 w-3" aria-hidden />
                      WhatsApp
                    </button>
                    <Link
                      to="/support"
                      onClick={() => setOpen(false)}
                      className="shrink-0 inline-flex items-center gap-1 rounded-full border border-neutral-700 px-3 py-1.5 text-[11px] font-medium text-neutral-300"
                    >
                      <Headphones className="h-3 w-3" aria-hidden />
                      Full support
                    </Link>
                  </div>
                </div>

                {!isAuthenticated ? (
                  <div className="shrink-0 grid grid-cols-2 gap-2 border-t border-neutral-800/80 px-3 py-2">
                    <input
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      type="email"
                      placeholder="Email (for replies)"
                      className="rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-2 text-xs text-white"
                    />
                    <input
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Name"
                      className="rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-2 text-xs text-white"
                    />
                  </div>
                ) : null}

                <div className="shrink-0 flex gap-2 border-t border-neutral-800 p-3">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        void submitMessage();
                      }
                    }}
                    placeholder="Message Skipaman Support…"
                    className="min-w-0 flex-1 rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-neutral-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    disabled={!draft.trim() || busy}
                    onClick={() => void submitMessage()}
                    className="shrink-0 rounded-xl bg-white p-2.5 text-black hover:bg-neutral-200 disabled:opacity-35"
                    aria-label="Send"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        layout
        onClick={() => setOpen((v) => !v)}
        className={`support-chat-fab fixed left-4 z-[70] flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-neutral-900 via-black to-neutral-950 px-4 py-3.5 text-sm font-semibold text-white ring-1 ring-white/10 transition-[bottom] duration-300 hover:ring-white/20 sm:left-6 ${fabPos} ${
          open ? 'pr-4 pl-4' : 'pr-5 pl-4'
        }`}
        aria-expanded={open}
        aria-label={open ? 'Close support chat' : 'Open support chat'}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <X className="h-5 w-5" />
              <span className="hidden sm:inline">Close</span>
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-5 w-5 text-white/90" />
              <span className="hidden sm:inline">Chat</span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
};

export default SupportChatWidget;
