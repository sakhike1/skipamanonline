/** Same shape as SEO title/description; kept local to avoid importing routeSeo. */
export interface PrintingSeoMeta {
  title: string;
  description: string;
}

export interface PrintingLandingFAQ {
  question: string;
  answer: string;
}

export interface PrintingLandingBlock {
  slug: string;
  kind: 'location' | 'service';
  seoTitle: string;
  seoDescription: string;
  h1: string;
  heroSubtitle: string;
  /** Public path e.g. /images/… */
  heroImage: string;
  intro: string[];
  whoItsFor: string[];
  whatWePrint: string[];
  minimums: string;
  leadTimes: string;
  artworkRequirements: string;
  deliveryPickup: string;
  /** Plain-language ballpark; always subject to quote */
  pricingRange: string;
  faqs: PrintingLandingFAQ[];
}

export const printingHubSeo: PrintingSeoMeta = {
  title: 'Custom Printing South Africa | Screen, DTF, Embroidery & Uniforms | Skipaman',
  description:
    'T-shirt printing in Centurion, Pretoria, and Johannesburg: bulk screen print, DTF, embroidery, school uniforms, and corporate wear. Min order, lead times, artwork help, and delivery, request a quote.',
};

const loc = (slug: string) => `/locations/${slug}`;
const svc = (slug: string) => `/services/${slug}`;

export const printingHubLinks = {
  locations: [
    { slug: 'centurion' as const, label: 'T-shirt printing Centurion' },
    { slug: 'pretoria' as const, label: 'T-shirt printing Pretoria' },
    { slug: 'johannesburg' as const, label: 'T-shirt printing Johannesburg' },
  ],
  services: [
    { slug: 'bulk-screen-printing' as const, label: 'Bulk screen printing' },
    { slug: 'dtf-printing' as const, label: 'DTF printing' },
    { slug: 'embroidery' as const, label: 'Embroidery' },
    { slug: 'school-uniforms' as const, label: 'School uniforms' },
    { slug: 'corporate-wear' as const, label: 'Corporate wear' },
  ],
};

export const PRINTING_LOCATIONS: Record<string, PrintingLandingBlock> = {
  centurion: {
    slug: 'centurion',
    kind: 'location',
    seoTitle: 'T-Shirt Printing Centurion | DTF, Screen & Uniforms | Skipaman',
    seoDescription:
      'Custom t-shirt printing in Centurion, Gauteng: DTF, screen print, vinyl, school & corporate uniforms. Min orders, turnaround, artwork specs, and collection or delivery, get a quote from Skipaman.',
    h1: 'T-shirt printing in Centurion',
    heroSubtitle: 'Local production support, school & business runs, and nationwide delivery from our Centurion base.',
    heroImage: '/images/image1.jpg',
    intro: [
      'Skipaman supports custom apparel and branding for clients across Centurion, the northern suburbs, and the wider Gauteng corridor. Whether you need a small DTF run for an event or a larger screen-print order for a team or school, we walk you through fabrics, print method, and timeline.',
      'We work with schools, sports clubs, churches, small businesses, and marketing teams. If you are based in Centurion, you can often coordinate collection or drop-off; for other areas we ship via reliable couriers.',
    ],
    whoItsFor: [
      'Schools and parents ordering class tees, sports kits, or leavers’ gear',
      'Clubs, teams, and event organisers in Irene, Lyttelton, and Highveld',
      'Cafés, gyms, and retail staff who need repeat logo orders',
      'Brands testing a first custom drop before scaling',
    ],
    whatWePrint: [
      'Cotton and poly-cotton tees, hoodies, and sweats',
      'Polos, staff shirts, and basic corporate tops',
      'Caps, beanies, and selected accessories (method-dependent)',
      'Mugs and select promo items (enquire for current options)',
    ],
    minimums:
      'Minimums depend on the process: DTF and vinyl are friendlier for small runs; traditional screen printing is typically priced from higher quantities. Share your quantity and deadline, we will match you to the most cost-effective method.',
    leadTimes:
      'Standard decorated orders often fall in the 7–14 business day range after artwork approval and stock arrival, but peak season (back-to-school, year-end events) can extend that. Rush may be possible for a fee when capacity allows, ask when you brief us.',
    artworkRequirements:
      'Vector art (AI, EPS, or high-quality PDF) is ideal for screen and embroidery. For DTF, a transparent PNG at 300 DPI at print size works well. We can help with simple redraws or text layout; complex design work may be quoted separately. Colours: specify Pantone where brand accuracy matters.',
    deliveryPickup:
      'Centurion and nearby clients can often collect by arrangement. We also deliver across Pretoria, Johannesburg, and South Africa via courier. Shipping is quoted on weight and destination; insurance is available on request.',
    pricingRange:
      'Entry-level custom tees often start in a few hundred rand per unit for very small DTF/vinyl runs, scaling down per piece on volume. Screen and embroidery are quoted from quantity bands. You will always receive a written quote before we start production.',
    faqs: [
      {
        question: 'Do you only print for customers in Centurion?',
        answer:
          'No. Centurion is our local hub, but we supply schools, businesses, and teams across Gauteng and the rest of South Africa. Delivery is via courier; locals can often collect.',
      },
      {
        question: 'Can I see a sample or proof before the full run?',
        answer:
          'For many jobs we can provide a digital mock-up. Physical samples or strike-offs may be available for larger or corporate orders and may be charged, ask when you request a quote.',
      },
      {
        question: 'What if my event is in two weeks?',
        answer:
          'Tell us your in-hand date up front. We will say honestly if we can meet it. Rush fees may apply when we prioritise your slot.',
      },
    ],
  },

  pretoria: {
    slug: 'pretoria',
    kind: 'location',
    seoTitle: 'T-Shirt Printing Pretoria | Schools, Clubs & Business | Skipaman',
    seoDescription:
      'Custom printing for Pretoria: screen print, DTF, embroidery, uniforms, and corporate apparel. Minimums, lead times, artwork, and delivery across Pretoria and Gauteng, Skipaman.',
    h1: 'T-shirt printing for Pretoria',
    heroSubtitle: 'Northern Gauteng schools, government districts, and businesses, consistent branding from quote to delivery.',
    heroImage: '/images/image6.jpg',
    intro: [
      'From Brooklyn and Hatfield to Montana and the East, Pretoria clients use Skipaman for repeatable uniform programmes, club kits, and branded staff wear. We understand procurement timelines and BOQ-style ordering where needed.',
      'We serve the same print methods as our Centurion base, DTF for flexible short runs, screen for volume, embroidery for premium polos and headwear. Deliveries reach Pretoria metro via courier on agreed schedules.',
    ],
    whoItsFor: [
      'Government departments and NGOs needing batches with consistent specs',
      'High schools and primary schools refreshing sports or cultural uniforms',
      'Universities and residences ordering orientation or society merchandise',
      'Pretoria businesses onboarding teams or launching merch drops',
    ],
    whatWePrint: [
      'Event and campaign tees, hoodies, and layers',
      'Workwear polos, jackets, and basic corporate ranges',
      'Team kits and supporter merchandise',
      'Branded caps and selected accessories',
    ],
    minimums:
      'Small runs suit DTF or heat-transfer methods; larger repeat programmes suit screen or embroidery. Minimum piece counts vary, send your list of sizes and colours for a banded quote.',
    leadTimes:
      'After artwork approval, most orders progress in roughly 7–14 business days. Institutional orders with multiple approval steps should budget extra time; we document milestones in writing.',
    artworkRequirements:
      'Supply logo files in vector format where possible. Raster artwork should be print-resolution at final size. If you only have a JPG, we may be able to recreate or clean up, additional design time may apply.',
    deliveryPickup:
      'Door-to-door courier to Pretoria addresses is standard. Scheduled deliveries for larger school or corporate drops can be arranged. Pickup from our Centurion workspace may suit northern Pretoria clients, confirm when quoting.',
    pricingRange:
      'Small DTF orders might start from a few hundred rand per garment depending on size and placement. Volume screen programmes reduce price per unit. Embroidery is quoted by stitch count and quantity.',
    faqs: [
      {
        question: 'Do you work with school procurement departments?',
        answer:
          'Yes. Share your sizes, colours, and approval process early. We can align invoices and delivery notes with your internal requirements where possible.',
      },
      {
        question: 'Can you match an existing uniform supplier’s colours?',
        answer:
          'We aim for the closest match using Pantone references and fabric swatches. Perfect dye-lot matches across different factories are not always guaranteed, we will be transparent before production.',
      },
    ],
  },

  johannesburg: {
    slug: 'johannesburg',
    kind: 'location',
    seoTitle: 'T-Shirt Printing Johannesburg | Corporate & Events | Skipaman',
    seoDescription:
      'Johannesburg t-shirt printing and branding: DTF, bulk screen print, embroidery, and corporate wear. Turnaround, minimums, artwork, and courier delivery, based in Gauteng, serving JHB.',
    h1: 'T-shirt printing for Johannesburg',
    heroSubtitle: 'CBD corporates, Sandton teams, Soweto events, and East Rand logistics, fast coordination from Gauteng.',
    heroImage: '/images/6.jpg',
    intro: [
      'Johannesburg remains South Africa’s busiest commercial hub. Skipaman supplies branded apparel for activations, retail staff uniforms, music and sport events, and corporate onboarding packs.',
      'Courier networks from Gauteng mean regular JHB deliveries are straightforward. For tight activations, share your deadline immediately, we will advise if production and transit can meet your launch.',
    ],
    whoItsFor: [
      'Marketing and HR teams rolling out branded kits across branches',
      'Event promoters and venues needing dated or campaign merch',
      'SMEs and startups launching limited apparel lines',
      'Logistics and facility firms refreshing high-visibility workwear',
    ],
    whatWePrint: [
      'Activation tees, staff uniforms, and promoter kits',
      'Conference and trade-show apparel',
      'Limited merch drops and influencer packs',
      'Caps, bags, and add-ons (subject to stock and method)',
    ],
    minimums:
      'From single-digit DTF samples up to thousands of screen-printed units. Your quote states the method that hits your budget at your quantity.',
    leadTimes:
      'Typical decorated orders: about 7–14 business days after approval. Sandton and Rosebank rush requests are assessed case-by-case; weekend events need earlier locks on artwork.',
    artworkRequirements:
      'Brand guidelines welcome, include safe zones, minimum logo sizes, and colour breakdowns. For multi-branch rollouts, one approved master file avoids rework.',
    deliveryPickup:
      'Courier to Johannesburg addresses; tracking provided when available. Same-metro handoff can sometimes be arranged for urgent jobs, confirm when you book.',
    pricingRange:
      'Promo-tier tees on volume screen runs can land at competitive per-unit pricing; premium blanks and embroidery increase cost. We quote inclusive of agreed decoration unless you supply garments.',
    faqs: [
      {
        question: 'Do you handle Sandton and Rosebank office deliveries?',
        answer:
          'Yes, via courier to business addresses. Reception or security protocols should be shared so deliveries are smooth.',
      },
      {
        question: 'Can we split a bulk order across multiple JHB addresses?',
        answer:
          'Often yes, with a split-shipment fee. Outline addresses and quantities in your brief so we quote accurately.',
      },
    ],
  },
};

export const PRINTING_SERVICES: Record<string, PrintingLandingBlock> = {
  'bulk-screen-printing': {
    slug: 'bulk-screen-printing',
    kind: 'service',
    seoTitle: 'Bulk Screen Printing South Africa | High-Volume Tees & Uniforms | Skipaman',
    seoDescription:
      'Bulk screen printing for schools, teams, and brands: plastisol water-based options, repeat programmes, minimums, lead times, artwork for separations, and nationwide delivery, Skipaman Gauteng.',
    h1: 'Bulk screen printing',
    heroSubtitle: 'Economical per-unit pricing when your volume and design suit traditional screens.',
    heroImage: '/images/blacktFront.png',
    intro: [
      'Screen printing remains the workhorse for medium-to-large runs with stable artwork and solid colours. Once screens are made, reorders of the same design are efficient, ideal for annual school batches, club kits, and promo tees.',
      'We advise honest quantity bands: if your job is small or frequently changes artwork, DTF may save money and time. If you are ordering hundreds or thousands with a fixed design, screen usually wins on price.',
    ],
    whoItsFor: [
      'Schools and clubs reordering the same crest or layout annually',
      'Brands with campaign tees or retail-style drops at scale',
      'Events and festivals needing thousands of pieces',
      'Workwear programmes with one or two spot colours',
    ],
    whatWePrint: [
      'T-shirts, singlets, and performance tees on compatible fabrics',
      'Hoodies and sweats (ink and cure profile matched to fabric)',
      'Tote bags and flat panels where jigging allows',
    ],
    minimums:
      'Economically viable screen jobs typically start from roughly two dozen pieces per design/colour split, exact thresholds depend on colours and garment choice. Below that, we usually recommend DTF or hybrid approaches.',
    leadTimes:
      'First-time jobs include screen prep and testing, often 10–15 business days after approval. Repeat orders using existing screens can be faster if stock is on hand.',
    artworkRequirements:
      'Vector artwork with colour-separated layers is best. Each ink colour generally means a screen, fewer colours reduces cost. Halftones are possible for gradients but need discussion at quoting stage.',
    deliveryPickup:
      'Folded, bulk-packed cartons for freight or palletised loads on very large orders. Gauteng collection available; national courier quoted per carton.',
    pricingRange:
      'At volume, printed tees can reach strong per-unit pricing depending on colours and garment tier. Setup and screen fees are typically amortised across the run, your quote shows line items clearly.',
    faqs: [
      {
        question: 'Water-based vs plastisol: what do you use?',
        answer:
          'Choice depends on fabric, hand-feel, and colour requirements. We recommend the best fit per job and explain trade-offs in your quote.',
      },
      {
        question: 'Can we mix sizes within one bulk order?',
        answer:
          'Yes, within the same design and print placement. Very different garment types may need separate setups, we will flag that early.',
      },
    ],
  },

  'dtf-printing': {
    slug: 'dtf-printing',
    kind: 'service',
    seoTitle: 'DTF Printing South Africa | Short Runs & Full Colour | Skipaman',
    seoDescription:
      'DTF (direct-to-film) printing for small batches, full colour, and detailed artwork, minimums, turnaround, file tips, and shipping. Skipaman custom apparel Gauteng.',
    h1: 'DTF printing',
    heroSubtitle: 'Photographic detail and shorter runs without the screen setup overhead.',
    heroImage: '/images/blackTOne.png',
    intro: [
      'DTF transfers full-colour designs onto many cotton and blended garments with minimal setup compared to multi-colour screens. It suits prototypes, small merch drops, intricate artwork, and photos.',
      'Durability is good for many use cases; for extreme industrial wash or heavy abrasion, we may suggest screen or embroidery instead, we advise per garment and use case.',
    ],
    whoItsFor: [
      'Creators and brands testing designs before scaling',
      'Events needing dozens, not hundreds, of pieces',
      'Complex illustrations that would need excessive screens',
      'Teams wanting name personalisation alongside a shared graphic',
    ],
    whatWePrint: [
      'T-shirts, hoodies, and most cotton-rich blends',
      'Front, back, and sleeve placements within printable area limits',
      'Some headwear and bags, confirm substrate before ordering',
    ],
    minimums:
      'Often from single pieces upwards; pricing per unit reflects film and press time. Bundling sizes optimises efficiency.',
    leadTimes:
      'Many DTF orders complete within roughly 5–10 business days after artwork sign-off, subject to queue and stock.',
    artworkRequirements:
      'Transparent PNG at 300 DPI at intended print size is ideal. Outline fonts or supply working files. Avoid low-resolution social-media grabs, they rarely print sharply.',
    deliveryPickup:
      'Packed per size or flat-folded, your preference when quoting. Courier nationwide.',
    pricingRange:
      'Low tens to low hundreds of rand per position depending on size and garment tier; detailed quotes beat guessing from price lists.',
    faqs: [
      {
        question: 'Is DTF better than vinyl?',
        answer:
          'DTF often handles full colour and gradients better than basic vinyl. Vinyl still has a place for specialty films, tell us the garment and artwork and we will recommend.',
      },
      {
        question: 'Will DTF crack or peel?',
        answer:
          'With correct press parameters and washing inside-out, prints hold well. We supply care guidance with every order.',
      },
    ],
  },

  embroidery: {
    slug: 'embroidery',
    kind: 'service',
    seoTitle: 'Embroidery South Africa | Polos, Caps & Corporate Logo Stitching | Skipaman',
    seoDescription:
      'Professional embroidery for corporate wear, caps, and uniforms: stitch counts, minimums, digitising, lead times, and delivery. Skipaman based in Gauteng.',
    h1: 'Embroidery',
    heroSubtitle: 'Premium thread branding that lasts on polos, jackets, and headwear.',
    heroImage: '/images/blackPurpleTwo.png',
    intro: [
      'Embroidery elevates corporate polos, hospitality uniforms, and headwear with tactile, durable branding. Pricing scales with stitch count, colour changes, and quantity.',
      'New logos usually require digitising, a one-off setup that converts artwork into stitch files. Reorders of the same file are faster and cheaper.',
    ],
    whoItsFor: [
      'Corporate and franchise networks standardising staff appearance',
      'Golf days, sponsor caps, and executive gifting',
      'School blazers and formal uniform accents where embroidery is specified',
      'Industrial workwear needing visible, long-lasting branding',
    ],
    whatWePrint: [
      'Left-chest and centre-front logos on polos and shirts',
      'Cap fronts and sides within hoop limits',
      'Selected jacket backs and larger formats, hoop size permitting',
    ],
    minimums:
      'Often from around 6–12 pieces per design for sensible unit economics, but we evaluate small VIP orders case-by-case.',
    leadTimes:
      'First-run embroidery typically needs roughly 10–15 business days including digitising approval. Reorders can shorten significantly.',
    artworkRequirements:
      'Clean vector logos preferred. Fine typography below 5 mm height may need simplification. We send a sew-out or simulation for approval before full production.',
    deliveryPickup:
      'Individually folded or bulk, your choice. National courier.',
    pricingRange:
      'Digitising may be charged once; per-piece price drops as quantities rise. Cap embroidery often differs from flat garments, quoted separately.',
    faqs: [
      {
        question: 'Can you match thread to our Pantone?',
        answer:
          'We map to the closest stable thread colours. Near matches are standard; exact dye-sub thread matching is rarely economical for SME runs.',
      },
      {
        question: 'Do you embroider on customer-supplied garments?',
        answer:
          'Sometimes, after a risk waiver, mistakes can damage supplied stock. We prefer sourcing blanks we know hoop well.',
      },
    ],
  },

  'school-uniforms': {
    slug: 'school-uniforms',
    kind: 'service',
    seoTitle: 'School Uniform Printing & Branding South Africa | Skipaman',
    seoDescription:
      'School uniforms and sport kits: screen print, DTF, embroidery, sizing programmes, minimums, term timelines, artwork compliance, and Gauteng delivery.',
    h1: 'School uniforms & kits',
    heroSubtitle: 'Sports houses, cultural clubs, and class apparel, with realistic term-time planning.',
    heroImage: '/images/blacktback.png',
    intro: [
      'School communities need reliable sizing, repeatability for sibling years, and clear communication with parents. Skipaman supports sports kits, house shirts, leavers’ merch, and staff identification.',
      'We align production with term breaks where possible and flag peak windows (January intake, year-end) so committees can launch parent order windows early.',
    ],
    whoItsFor: [
      'SGB-funded programmes and parent pay-as-you-order models',
      'Sports coaches refreshing kit every season',
      'RCL and cultural committees needing event tees',
      'Alumni and fundraising merchandise',
    ],
    whatWePrint: [
      'PE uniforms, team tees, tracksuits (method matched to fabric)',
      'House and faction colours with consistent PMS references',
      'Leavers’ garments with approved naming lists',
    ],
    minimums:
      'Split across grades and sizes; per-design minimums still apply for screen. Parent clusters sometimes consolidate orders to hit better bands.',
    leadTimes:
      'Plan 4–6 weeks before needed handout for first-time programmes including samples. Reorders with locked specs are faster.',
    artworkRequirements:
      'Official crest usage rules respected, supply written approval where the school does not own full IP. Name lists in spreadsheets reduce engraving errors.',
    deliveryPickup:
      'Bulk delivery to school or staggered parent pickup, logistics agreed in writing.',
    pricingRange:
      'Budget tees for mass participation vs premium kits for first teams, both possible. Tiered quotes help committees decide democratically.',
    faqs: [
      {
        question: 'Can parents order directly?',
        answer:
          'Yes, if the school delegates a coordinator and we agree payment windows. Otherwise bulk school invoicing works too.',
      },
      {
        question: 'What about replacement pieces mid-year?',
        answer:
          'Reorders from the same spec sheet are quickest when we hold stitch files and ink mixes on record.',
      },
    ],
  },

  'corporate-wear': {
    slug: 'corporate-wear',
    kind: 'service',
    seoTitle: 'Corporate Wear & Branded Uniforms South Africa | Skipaman',
    seoDescription:
      'Corporate uniforms and branded workwear: polos, jackets, hospitality attire, embroidery, screen, DTF. Minimums, rollout timelines, brand guidelines, and delivery.',
    h1: 'Corporate wear',
    heroSubtitle: 'Consistent brand presentation from reception to warehouse.',
    heroImage: '/images/blacktFront.png',
    intro: [
      'Corporate programmes balance appearance, durability, and procurement governance. Skipaman supplies layered quotes, basics through premium blanks, with decoration matched to fabric and wear pattern.',
      'We support onboarding packs for new hires, regional replenishment, and rebrands when logos update.',
    ],
    whoItsFor: [
      'Facilities, retail, and hospitality chains',
      'Professional services needing client-facing polish',
      'Logistics and trades needing hi-vis compliant solutions (enquire for certified ranges)',
      'Franchise networks rolling out a shared kit',
    ],
    whatWePrint: [
      'Corporate polos, Oxford shirts, softshells, and knit layers',
      'Layered outerwear depending on supplier catalogue access',
      'Caps, beanies, and corporate gifting add-ons',
    ],
    minimums:
      'Mixed-size cartons are normal; some embroidery programmes start from ~12 units per logo revision.',
    leadTimes:
      'Brand onboarding typically 2–3 weeks after samples approved; replenishment orders faster once specs are frozen.',
    artworkRequirements:
      'Brand manuals with primary and reversed logos, minimum sizes, and exclusion zones. Multi-branch approvals should nominate one signatory.',
    deliveryPickup:
      'Dispatch to HQ or direct-to-branch, we quote split logistics separately.',
    pricingRange:
      'Entry corporate polos differ massively by fabric and decoration; expect mid-hundreds per piece for premium layers with embroidery, lower for basic tees with single-colour print.',
    faqs: [
      {
        question: 'Do you store inventory for us?',
        answer:
          'General practice is made-to-order; volume stocking agreements may be discussed for large accounts.',
      },
      {
        question: 'Can invoices split by cost centre?',
        answer:
          'We can line-item by department if your finance team needs it, brief us before the first order.',
      },
    ],
  },
};

export function getPrintingLocationSlugs(): string[] {
  return Object.keys(PRINTING_LOCATIONS);
}

export function getPrintingServiceSlugs(): string[] {
  return Object.keys(PRINTING_SERVICES);
}

export function getPrintingSeoForPath(pathname: string): PrintingSeoMeta | null {
  if (pathname === '/printing') return printingHubSeo;
  const locMatch = pathname.match(/^\/locations\/([^/]+)$/);
  if (locMatch) {
    const page = PRINTING_LOCATIONS[locMatch[1]];
    if (page) return { title: page.seoTitle, description: page.seoDescription };
  }
  const svcMatch = pathname.match(/^\/services\/([^/]+)$/);
  if (svcMatch) {
    const page = PRINTING_SERVICES[svcMatch[1]];
    if (page) return { title: page.seoTitle, description: page.seoDescription };
  }
  return null;
}

/** Internal linking blocks for bottom of landing pages */
export function getRelatedPrintingLinks(
  kind: 'location' | 'service',
  currentSlug: string,
): { title: string; links: { to: string; label: string }[] }[] {
  const otherLocs = printingHubLinks.locations
    .filter((l) => l.slug !== currentSlug)
    .map((l) => ({ to: loc(l.slug), label: l.label }));
  const otherSvcs = printingHubLinks.services
    .filter((s) => s.slug !== currentSlug)
    .map((s) => ({ to: svc(s.slug), label: s.label }));

  if (kind === 'location') {
    return [
      { title: 'Other areas', links: otherLocs },
      { title: 'Services', links: printingHubLinks.services.map((s) => ({ to: svc(s.slug), label: s.label })) },
      { title: 'Hub', links: [{ to: '/printing', label: 'All printing services' }, { to: '/virtual-stylist', label: 'Request a quote' }] },
    ];
  }
  return [
    { title: 'Locations', links: printingHubLinks.locations.map((l) => ({ to: loc(l.slug), label: l.label })) },
    { title: 'Other services', links: otherSvcs },
    { title: 'Hub', links: [{ to: '/printing', label: 'All printing services' }, { to: '/virtual-stylist', label: 'Request a quote' }] },
  ];
}
