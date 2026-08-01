"use client";

import React from "react";
import Link from "next/link";
import { Clock, CheckCircle, Mail, Phone, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { SITE_CONFIG } from "@/lib/constants/site";

export default function SellerPendingPage() {
  const { profile } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="h-20 w-20 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
            <Clock className="h-10 w-10 text-yellow-600" />
          </div>
          <h1 className="text-2xl font-bold">Account Under Review</h1>
          <p className="text-muted-foreground mt-2">
            Your seller account is pending admin approval
          </p>
        </div>

        <Card className="mb-4">
          <CardContent className="p-6 space-y-4">
            {/* Shop details */}
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">Your Shop Details</p>
              <p className="text-sm">
                <span className="text-muted-foreground">Shop Name:</span>{" "}
                <span className="font-medium">{profile?.sellerProfile?.shopName}</span>
              </p>
              <p className="text-sm mt-1">
                <span className="text-muted-foreground">Email:</span>{" "}
                <span className="font-medium">{profile?.email}</span>
              </p>
              <p className="text-sm mt-1">
                <span className="text-muted-foreground">Phone:</span>{" "}
                <span className="font-medium">{profile?.sellerProfile?.phone}</span>
              </p>
            </div>

            {/* What happens next */}
            <div>
              <p className="text-sm font-semibold mb-3">What happens next?</p>
              <div className="space-y-3">
                {[
                  "Our team will review your seller application within 1-2 business days",
                  "You will receive an email notification once your account is approved",
                  "After approval, you can login and start adding your products",
                  "Your products will be visible to customers on Kinyo",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-sm text-muted-foreground">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-green-800 mb-2">
                Need help? Contact us:
              </p>
              <div className="space-y-1">
                <a
                  href={`mailto:${SITE_CONFIG.contact.email}`}
                  className="flex items-center gap-2 text-sm text-green-700 hover:underline"
                >
                  <Mail className="h-4 w-4" /> {SITE_CONFIG.contact.email}
                </a>
                <a
                  href={`tel:${SITE_CONFIG.contact.phone}`}
                  className="flex items-center gap-2 text-sm text-green-700 hover:underline"
                >
                  <Phone className="h-4 w-4" /> {SITE_CONFIG.contact.phone}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" asChild>
            <Link href="/">Browse Store</Link>
          </Button>
          <Button
            variant="outline"
            className="flex-1 text-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>
      </div>
    </div>
  );
}