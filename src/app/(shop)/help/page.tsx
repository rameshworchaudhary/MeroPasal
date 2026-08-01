import type { Metadata } from "next";
import { Phone, Mail, MapPin, HelpCircle } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants/site";

export const metadata: Metadata = { title: "Help Center" };

const FAQS = [
  {
    q: "How do I track my order?",
    a: "Go to 'My Orders' if you're logged in, or use the 'Track Order' page with your order number to see real-time delivery status.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept eSewa and Khalti digital wallets across Nepal.",
  },
  {
    q: "Do you deliver to all districts in Nepal?",
    a: "Yes! We deliver to all 77 districts across all 7 provinces of Nepal. Delivery times vary by location.",
  },
  {
    q: "How do I return a product?",
    a: "Visit our Return Policy page for full details. You can request a return within 7 days of delivery by contacting our support team.",
  },
  {
    q: "Can I cancel my order?",
    a: "Orders can be cancelled before they are shipped. Please contact support as soon as possible if you need to cancel.",
  },
  {
    q: "Is Cash on Delivery available everywhere?",
    a: "Cash on Delivery is available in most districts. Some remote areas may require prepayment via eSewa or Khalti.",
  },
];

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="flex items-center gap-3 mb-2">
        <HelpCircle className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-bold">Help Center</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Find answers to common questions or get in touch with our support team.
      </p>

      {/* Contact cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <a href={`tel:${SITE_CONFIG.contact.phone}`} className="border rounded-xl p-4 text-center hover:border-primary transition-colors">
          <Phone className="h-6 w-6 text-primary mx-auto mb-2" />
          <p className="font-semibold text-sm">Call Us</p>
          <p className="text-xs text-muted-foreground mt-1">{SITE_CONFIG.contact.phone}</p>
        </a>
        <a href={`mailto:${SITE_CONFIG.contact.email}`} className="border rounded-xl p-4 text-center hover:border-primary transition-colors">
          <Mail className="h-6 w-6 text-primary mx-auto mb-2" />
          <p className="font-semibold text-sm">Email Us</p>
          <p className="text-xs text-muted-foreground mt-1">{SITE_CONFIG.contact.email}</p>
        </a>
        <div className="border rounded-xl p-4 text-center">
          <MapPin className="h-6 w-6 text-primary mx-auto mb-2" />
          <p className="font-semibold text-sm">Visit Us</p>
          <p className="text-xs text-muted-foreground mt-1">{SITE_CONFIG.contact.address}</p>
        </div>
      </div>

      {/* FAQs */}
      <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>
      <div className="space-y-2">
        {FAQS.map((faq, i) => (
          <details key={i} className="border rounded-xl p-4 group">
            <summary className="font-medium text-sm cursor-pointer flex items-center justify-between">
              {faq.q}
            </summary>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{faq.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
