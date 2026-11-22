/** South Africa local 074… → 2774… for wa.me */
export function normalizeWhatsAppNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('27')) return digits;
  if (digits.startsWith('0')) return `27${digits.slice(1)}`;
  return digits;
}

const DEFAULT_WHATSAPP = '27744702010';

export function getWhatsAppNumber(): string {
  const fromEnv = import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined;
  if (fromEnv?.trim()) return normalizeWhatsAppNumber(fromEnv.trim());
  return DEFAULT_WHATSAPP;
}

/** E.164-style display for UI copy (not for wa.me). */
export function formatWhatsAppDisplay(): string {
  const n = getWhatsAppNumber();
  if (n.startsWith('27') && n.length >= 11) {
    return `+27 ${n.slice(2, 4)} ${n.slice(4, 7)} ${n.slice(7)}`;
  }
  return `+${n}`;
}

export type WhatsAppHandoffContext = {
  userName?: string;
  userEmail?: string;
  ticketNumber?: string;
  orderRef?: string;
  lastQuestion?: string;
  pagePath?: string;
};

/** Customer → business support. Avoid "Hi Skipaman" alone (reads like self-chat when testing on the store number). */
export function buildSupportWhatsAppMessage(ctx: WhatsAppHandoffContext = {}): string {
  const lines = [
    'Hello — I’m contacting *Skipaman Support* from the website.',
    '',
  ];
  if (ctx.userName) lines.push(`Name: ${ctx.userName}`);
  if (ctx.userEmail) lines.push(`Email: ${ctx.userEmail}`);
  if (ctx.orderRef) lines.push(`Order ref: ${ctx.orderRef}`);
  if (ctx.ticketNumber) lines.push(`Ticket: ${ctx.ticketNumber}`);
  if (ctx.pagePath) lines.push(`Page: ${ctx.pagePath}`);
  lines.push('');
  lines.push(ctx.lastQuestion?.trim() || 'I’d like help with my order / a product question.');
  return lines.join('\n');
}

export function buildWhatsAppUrl(message: string): string {
  const number = getWhatsAppNumber();
  const text = encodeURIComponent(
    message.trim() || buildSupportWhatsAppMessage(),
  );
  return `https://api.whatsapp.com/send?phone=${number}&text=${text}`;
}

export function openWhatsApp(message: string): void {
  window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
}

export function openWhatsAppSupport(ctx: WhatsAppHandoffContext = {}): void {
  openWhatsApp(buildSupportWhatsAppMessage(ctx));
}
