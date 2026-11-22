import { useEffect } from 'react';
import LegalDocumentLayout from '../components/legal/LegalDocumentLayout';

export default function TermsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <LegalDocumentLayout title="Terms & Conditions">
      <p>
        These Terms &amp; Conditions (“Terms”) govern your use of the Skipaman website and related services (together, the “Services”).
        By accessing or purchasing through our Services, you agree to these Terms. If you do not agree, please do not use the Services.
      </p>

      <h2>1. Who we are</h2>
      <p>
        The Services are operated by Skipaman (“we”, “us”, “our”). Contact details published on the website (including email and phone)
        apply for notices and support.
      </p>

      <h2>2. Orders &amp; contract</h2>
      <p>
        Product descriptions, prices, and availability are shown on the site subject to correction of obvious errors. When you place an order,
        you offer to buy at the price shown (plus applicable delivery). We may accept or decline orders (for example due to stock,
        pricing errors, fraud checks, or operational limits). A contract is formed when we confirm acceptance (for example by order confirmation
        email or by completing payment capture where applicable).
      </p>

      <h2>3. Pricing &amp; payment</h2>
      <p>
        Prices are in South African Rand (ZAR) unless stated otherwise and include VAT where applicable. Delivery fees (if any) are shown at
        checkout. Payments are processed via our payment providers; you agree to their terms where relevant.
      </p>

      <h2>4. Delivery</h2>
      <p>
        Delivery timelines are estimates and depend on couriers and your area. Risk of loss passes in line with our courier terms or when you
        collect goods where offered. Inspect deliveries on receipt and contact us promptly if something is wrong.
      </p>

      <h2>5. Custom printing &amp; branded orders</h2>
      <p>
        Custom, printed, or made-to-order items may require artwork approval, minimum quantities, and production time. Once production starts,
        cancellation or changes may not be possible. You warrant that artwork and instructions you supply do not infringe third-party rights.
      </p>

      <h2>6. Returns &amp; refunds</h2>
      <p>
        Return and refund rules depend on whether goods are standard retail or custom-made, and on the Consumer Protection Act (CPA) where it
        applies. Faulty or incorrectly supplied goods: contact us with details and photos; we will respond in line with applicable law and our
        published policy. Change-of-mind returns (where offered) are subject to conditions stated at checkout or on the product page.
      </p>

      <h2>7. Accounts &amp; security</h2>
      <p>
        You are responsible for keeping login credentials confidential and for activity under your account. Notify us if you suspect
        unauthorised access.
      </p>

      <h2>8. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by applicable law (including the CPA), we limit liability for indirect or consequential loss and for
        loss arising from events outside our reasonable control. Nothing in these Terms excludes liability that cannot legally be excluded.
      </p>

      <h2>9. Intellectual property</h2>
      <p>
        Site content, branding, and materials are protected by copyright and other laws. You may not copy or exploit them except as allowed for
        normal browsing or as we expressly permit.
      </p>

      <h2>10. Governing law</h2>
      <p>
        These Terms are governed by the laws of the Republic of South Africa. Disputes should first be raised with us in writing; if unresolved,
        courts with jurisdiction in South Africa may hear the matter as applicable.
      </p>

      <h2>11. Changes</h2>
      <p>
        We may update these Terms from time to time. The “Last updated” date will change; continued use after changes constitutes acceptance
        where permitted by law.
      </p>
    </LegalDocumentLayout>
  );
}
