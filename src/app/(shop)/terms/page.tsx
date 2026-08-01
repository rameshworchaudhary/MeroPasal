import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants/site";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Terms & Conditions</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing and using {SITE_CONFIG.name}, you agree to be bound by these Terms & Conditions.
            If you do not agree, please do not use our platform.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">2. Orders & Payment</h2>
          <p>
            All orders are subject to availability and confirmation. We accept payments via eSewa,
            Khalti, and Cash on Delivery. Prices are listed in Nepalese Rupees (NPR) and are inclusive
            of applicable taxes unless stated otherwise.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">3. Delivery</h2>
          <p>
            We deliver across all 77 districts of Nepal. Delivery times vary by location, with the
            Kathmandu Valley typically receiving orders faster than remote districts. Delivery
            estimates are not guaranteed and may be affected by weather, festivals, or logistics
            disruptions.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">4. Returns & Refunds</h2>
          <p>
            Products may be returned within 7 days of delivery if they are damaged, defective, or
            significantly different from their description. See our Return Policy for full details.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">5. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials. You
            must provide accurate information when creating an account and placing orders.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">6. Limitation of Liability</h2>
          <p>
            {SITE_CONFIG.name} is not liable for indirect, incidental, or consequential damages
            arising from the use of our platform, to the maximum extent permitted by Nepali law.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">7. Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. Continued use of {SITE_CONFIG.name} after
            changes constitutes acceptance of the revised terms.
          </p>
        </section>
      </div>
    </div>
  );
}
