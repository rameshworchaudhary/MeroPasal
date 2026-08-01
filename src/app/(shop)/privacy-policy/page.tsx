import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants/site";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">1. Information We Collect</h2>
          <p>
            When you create an account or place an order on {SITE_CONFIG.name}, we collect information
            such as your name, email address, phone number, and delivery address. This information is
            necessary to process your orders and provide customer support.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">2. How We Use Your Information</h2>
          <p>
            We use your information to process orders, communicate order status, provide customer
            support, and improve our services. We do not sell your personal information to third parties.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">3. Payment Information</h2>
          <p>
            Payments made through eSewa or Khalti are processed directly by these payment gateways.
            {SITE_CONFIG.name} does not store your payment card details or wallet credentials.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">4. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your personal information,
            including encrypted connections and secure authentication via Firebase.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">5. Your Rights</h2>
          <p>
            You may access, update, or delete your account information at any time through your
            profile settings. Contact us at {SITE_CONFIG.contact.email} for any privacy-related requests.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">6. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at{" "}
            {SITE_CONFIG.contact.email} or {SITE_CONFIG.contact.phone}.
          </p>
        </section>
      </div>
    </div>
  );
}
