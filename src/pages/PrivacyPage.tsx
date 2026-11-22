import { useEffect } from 'react';
import LegalDocumentLayout from '../components/legal/LegalDocumentLayout';

export default function PrivacyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <LegalDocumentLayout title="Privacy Policy">
      <p>
        Skipaman (“we”, “us”, “our”) respects your privacy. This Privacy Policy explains how we collect, use, disclose, and protect personal
        information when you use our website, place orders, request quotes, or interact with our services (together, the “Services”). It is
        intended to align with the Protection of Personal Information Act (POPIA) and other applicable South African law.
      </p>

      <h2>1. Responsible party</h2>
      <p>
        We act as the responsible party for personal information processed for our own business purposes. Where we use processors (for example
        payment or hosting providers), they process information on our instructions and subject to appropriate safeguards.
      </p>

      <h2>2. What we collect</h2>
      <p>Depending on how you use the Services, we may collect:</p>
      <ul>
        <li>
          <strong>Identity &amp; contact:</strong> name, email, phone, delivery address, billing details where relevant.
        </li>
        <li>
          <strong>Account &amp; technical:</strong> login identifiers, session data, device/browser type, IP address, and cookies or similar
          technologies (see below).
        </li>
        <li>
          <strong>Transaction &amp; support:</strong> order history, payment status references (card data is handled by payment providers),
          support tickets, and messages you send us.
        </li>
        <li>
          <strong>Marketing:</strong> newsletter preferences and engagement where you opt in.
        </li>
      </ul>

      <h2>3. How we use personal information</h2>
      <p>We use personal information to:</p>
      <ul>
        <li>Provide the Services, process orders, deliver goods, and manage accounts;</li>
        <li>Communicate about orders, delivery, and service issues;</li>
        <li>Comply with law, respond to lawful requests, and protect our rights;</li>
        <li>Improve the site, security, and fraud prevention;</li>
        <li>
          Send marketing where you have consented or where law allows (you may unsubscribe using the link in emails or by contacting us).
        </li>
      </ul>

      <h2>4. Cookies &amp; similar technologies</h2>
      <p>
        We use essential cookies and similar technologies needed for the site to function (for example security and cart/session handling).
        Where you consent, we may also use analytics or advertising tools (such as Google Analytics or Meta Pixel) to measure use and
        campaign performance. You can control non-essential cookies through our cookie banner and your browser settings.
      </p>

      <h2>5. Sharing of personal information</h2>
      <p>
        We may share information with service providers (payments, delivery, email, hosting, IT support) who assist our operations, and with
        authorities when required by law. We do not sell your personal information as a commodity.
      </p>

      <h2>6. Cross-border transfers</h2>
      <p>
        Some providers may process data outside South Africa. Where we transfer personal information across borders, we take steps required by
        POPIA (including suitable contracts or safeguards where applicable).
      </p>

      <h2>7. Retention</h2>
      <p>
        We keep personal information only as long as needed for the purposes above, including legal, tax, and accounting requirements, and then
        delete or anonymise it where appropriate.
      </p>

      <h2>8. Security</h2>
      <p>
        We implement reasonable technical and organisational measures to protect personal information. No online transmission is completely
        secure; please use strong passwords and protect your devices.
      </p>

      <h2>9. Your rights (POPIA)</h2>
      <p>
        Subject to law, you may request access to, correction of, or deletion of your personal information we hold; object to certain
        processing; or complain to the Information Regulator (South Africa). Contact us using the details on the website to exercise these
        rights.
      </p>

      <h2>10. Children</h2>
      <p>
        Our Services are not directed at children without parental involvement. If you believe we have collected a child’s information
        improperly, contact us and we will address it.
      </p>

      <h2>11. Changes</h2>
      <p>
        We may update this Privacy Policy from time to time. The “Last updated” date will change; material changes may be communicated as
        appropriate.
      </p>

      <h2>12. Contact</h2>
      <p>
        For privacy questions or requests, use the contact details published on this website (email and phone). We will respond within a
        reasonable time.
      </p>
    </LegalDocumentLayout>
  );
}
