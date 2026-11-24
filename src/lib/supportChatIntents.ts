export type SupportIntent =
  | 'track_order'
  | 'shipping'
  | 'returns'
  | 'printing'
  | 'product'
  | 'general';

export function detectSupportIntent(text: string): SupportIntent {
  const t = text.toLowerCase();
  if (/\b(track|tracking|where is my|order status|order number|skp-)\b/.test(t)) return 'track_order';
  if (/\b(ship|shipping|delivery|courier|deliver)\b/.test(t)) return 'shipping';
  if (/\b(return|refund|exchange)\b/.test(t)) return 'returns';
  if (/\b(print|uniform|cap|beanie|branding|dtf|vinyl|embroid)\b/.test(t)) return 'printing';
  if (/\b(size|fit|sizing|colour|color)\b/.test(t)) return 'product';
  return 'general';
}

export function intentReply(intent: SupportIntent): string {
  switch (intent) {
    case 'track_order':
      return 'I can help you track an order. Use “Track my order” below with your order reference (e.g. SKP-…) and the email you used at checkout.';
    case 'shipping':
      return 'Orders usually ship within a few business days after payment is confirmed. You’ll get tracking when your parcel is dispatched. Need a specific order? Tap “Track my order”.';
    case 'returns':
      return 'For returns or exchanges, share your order reference and reason. Our team will reply by email or WhatsApp. See our Terms page for the full policy.';
    case 'printing':
      return 'For custom printing, uniforms, caps, and bulk orders, visit our Printing hub or message us on WhatsApp with your quantity and deadline.';
    case 'product':
      return 'Check the product page for size and colour options. If you need advice before buying, send your question here or chat with us on WhatsApp.';
    default:
      return 'Thanks for your message. We’ve logged it for our team. For a faster reply, you can also chat with us on WhatsApp.';
  }
}

export function intentCategory(intent: SupportIntent): string {
  switch (intent) {
    case 'track_order':
      return 'order';
    case 'shipping':
      return 'shipping';
    case 'returns':
      return 'returns';
    case 'printing':
      return 'product';
    case 'product':
      return 'product';
    default:
      return 'general';
  }
}
