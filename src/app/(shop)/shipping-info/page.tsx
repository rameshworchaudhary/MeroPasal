import type { Metadata } from "next";
import { Truck, MapPin, Clock, Package } from "lucide-react";

export const metadata: Metadata = { title: "Shipping Information" };

export default function ShippingInfoPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="flex items-center gap-3 mb-2">
        <Truck className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-bold">Shipping Information</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        We deliver across all 7 provinces and 77 districts of Nepal.
      </p>

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border rounded-xl p-4 text-center">
            <MapPin className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="font-semibold text-sm">Kathmandu Valley</p>
            <p className="text-xs text-muted-foreground mt-1">1-2 business days</p>
          </div>
          <div className="border rounded-xl p-4 text-center">
            <MapPin className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="font-semibold text-sm">Major Cities</p>
            <p className="text-xs text-muted-foreground mt-1">2-4 business days</p>
          </div>
          <div className="border rounded-xl p-4 text-center">
            <MapPin className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="font-semibold text-sm">Remote Districts</p>
            <p className="text-xs text-muted-foreground mt-1">4-7 business days</p>
          </div>
        </div>

        <div className="border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Shipping Charges</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Shipping charges are calculated based on your delivery district and are shown at checkout
            before you place your order. Orders above Rs. 5,000 qualify for FREE delivery within the
            Kathmandu Valley, and discounted rates apply to other regions.
          </p>
        </div>

        <div className="border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Order Processing</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Orders are processed within 24 hours of confirmation. You will receive updates on your
            order status via email and can track your order anytime from "My Orders" or the public
            Track Order page using your order number.
          </p>
        </div>

        <div className="border rounded-xl p-5 bg-muted/30">
          <h2 className="font-semibold mb-2">Need Help?</h2>
          <p className="text-sm text-muted-foreground">
            If your order is delayed or you have questions about delivery to your area, please reach
            out to our support team — we're happy to help.
          </p>
        </div>
      </div>
    </div>
  );
}
