import type { Metadata } from "next";
import { RotateCcw, CheckCircle, XCircle, Clock } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants/site";

export const metadata: Metadata = { title: "Return Policy" };

export default function ReturnPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="flex items-center gap-3 mb-2">
        <RotateCcw className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-bold">Return Policy</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        We want you to be completely satisfied with your purchase from {SITE_CONFIG.name}.
      </p>

      <div className="space-y-6">
        <div className="border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">7-Day Return Window</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            You may request a return within 7 days of receiving your order. Returns requested
            after this period will not be accepted.
          </p>
        </div>

        <div className="border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h2 className="font-semibold">Eligible for Return</h2>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
            <li>Item arrived damaged or defective</li>
            <li>Wrong item was delivered</li>
            <li>Item significantly differs from its description</li>
            <li>Item is unused, unworn, and in original packaging with tags attached</li>
          </ul>
        </div>

        <div className="border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="h-5 w-5 text-destructive" />
            <h2 className="font-semibold">Not Eligible for Return</h2>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
            <li>Perishable goods (groceries, fresh food items)</li>
            <li>Personal care and hygiene products that have been opened</li>
            <li>Items marked as "Final Sale" or "Non-returnable"</li>
            <li>Products damaged due to misuse after delivery</li>
          </ul>
        </div>

        <div className="border rounded-xl p-5">
          <h2 className="font-semibold mb-2">How to Request a Return</h2>
          <ol className="text-sm text-muted-foreground space-y-1.5 list-decimal list-inside">
            <li>Go to "My Orders" and select the order you wish to return</li>
            <li>Contact our support team at {SITE_CONFIG.contact.email} or {SITE_CONFIG.contact.phone}</li>
            <li>Provide your order number and reason for return with photos if applicable</li>
            <li>Our team will arrange pickup or guide you on how to send the item back</li>
            <li>Once received and inspected, refunds are processed within 5-7 business days</li>
          </ol>
        </div>

        <div className="border rounded-xl p-5 bg-muted/30">
          <h2 className="font-semibold mb-2">Refund Methods</h2>
          <p className="text-sm text-muted-foreground">
            Refunds for eSewa and Khalti payments are credited back to the original payment method.
            For Cash on Delivery orders, refunds are issued via bank transfer or store credit, as
            preferred by the customer.
          </p>
        </div>
      </div>
    </div>
  );
}
