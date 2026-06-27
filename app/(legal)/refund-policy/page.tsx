import LegalPageLayout from '@/components/legal/LegalPageLayout';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function RefundPolicyPage() {
  return (
    <>
      <Navbar />
      <div className="pt-16">
        <LegalPageLayout
          title="Refund Policy"
          subtitle="Simple and fair."
          lastUpdated="January 2025"
        >
          <div className="warning-box mb-6">
            <p className="text-sm">
              This document was last updated on January 1, 2025.
            </p>
          </div>

          <ul className="space-y-4">
            <li><strong>7-day money-back guarantee</strong> for new subscribers (first charge only).</li>
            <li>No refunds after 7 days — cancel to stop future charges.</li>
            <li><strong>Annual plan refunds:</strong> Prorated refund for unused months within 30 days of purchase.</li>
            <li>To request a refund: email <a href="mailto:support@wcagscanner.com" className="text-accent hover:underline">support@wcagscanner.com</a> with your account email and reason.</li>
            <li>Refunds processed within 5-10 business days via Stripe to your original payment method.</li>
            <li>If we discontinue the service, all subscribers receive a full prorated refund automatically.</li>
          </ul>
        </LegalPageLayout>
      </div>
      <Footer />
    </>
  );
}
