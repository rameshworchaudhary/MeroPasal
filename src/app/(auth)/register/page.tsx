"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, UserPlus, Mail, Lock, User, Phone, Store, Building } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { registerWithEmail, loginWithGoogle, logout } from "@/lib/firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { isValidNepaliPhone } from "@/lib/utils";
import { validateEmailClient } from "@/lib/emailValidation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import NexShopLogo from "@/components/common/NexShopLogo";

const emailSchema = z.string().superRefine((val, ctx) => {
  const res = validateEmailClient(val);
  if (!res.valid) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: res.error || "Please enter a valid email address.",
    });
  }
});

const customerSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  email: emailSchema,
  phone: z.string().optional().refine((v) => !v || isValidNepaliPhone(v), "Enter valid Nepali phone (98XXXXXXXX)"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const sellerSchema = z.object({
  displayName: z.string().min(2, "Your full name is required"),
  email: emailSchema,
  phone: z.string().refine(isValidNepaliPhone, "Enter valid Nepali phone (98XXXXXXXX)"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  shopName: z.string().min(3, "Shop name is required"),
  shopDescription: z.string().min(20, "Please describe your shop (min 20 characters)"),
  shopAddress: z.string().min(5, "Shop address is required"),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type CustomerFormData = z.infer<typeof customerSchema>;
type SellerFormData = z.infer<typeof sellerSchema>;
type RegisterMode = "customer" | "seller";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = (searchParams.get("role") as RegisterMode) || "customer";

  const [mode, setMode] = useState<RegisterMode>(defaultRole);
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const customerForm = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    mode: "onChange",
  });
  const sellerForm = useForm<SellerFormData>({
    resolver: zodResolver(sellerSchema),
    mode: "onChange",
  });

  const onCustomerSubmit = async (data: CustomerFormData) => {
    try {
      await registerWithEmail(data.email, data.password, data.displayName, data.phone);
      await logout();
      toast.success("Account created! A verification link has been sent to your email. Please verify your email before logging in.");
      router.push("/login?mode=customer&registered=customer");
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Registration failed. Please try again.";
      if (
        errMsg === "Temporary or disposable email addresses are not allowed." ||
        errMsg === "Please enter a valid email address."
      ) {
        customerForm.setError("email", { type: "manual", message: errMsg });
        toast.error(errMsg);
      } else if (errMsg.includes("email-already-in-use")) {
        const msg = "An account with this email already exists";
        customerForm.setError("email", { type: "manual", message: msg });
        toast.error(msg);
      } else {
        toast.error(errMsg || "Registration failed. Please try again.");
      }
    }
  };

  const onSellerSubmit = async (data: SellerFormData) => {
    try {
      const user = await registerWithEmail(data.email, data.password, data.displayName, data.phone);

      // Update role to seller and add seller profile
      await updateDoc(doc(db, "users", user.uid), {
        role: "seller",
        sellerProfile: {
          shopName: data.shopName,
          shopDescription: data.shopDescription,
          phone: data.phone,
          address: data.shopAddress,
          isApproved: false, // Admin must approve
          isActive: false,
          totalProducts: 0,
          totalSales: 0,
          totalRevenue: 0,
          rating: 0,
          reviewCount: 0,
          commissionRate: 10, // Default 10%
          createdAt: new Date().toISOString(),
        },
      });

      await logout();

      toast.success("Seller account registered! A verification link has been sent to your email. Please verify your email and sign in to your seller account.");
      router.push("/login?mode=seller&registered=seller");
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Registration failed. Please try again.";
      if (
        errMsg === "Temporary or disposable email addresses are not allowed." ||
        errMsg === "Please enter a valid email address."
      ) {
        sellerForm.setError("email", { type: "manual", message: errMsg });
        toast.error(errMsg);
      } else if (errMsg.includes("email-already-in-use")) {
        const msg = "An account with this email already exists";
        sellerForm.setError("email", { type: "manual", message: msg });
        toast.error(msg);
      } else {
        toast.error(errMsg || "Registration failed. Please try again.");
      }
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      toast.success("Welcome to NexShop!");
      router.push("/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google signup failed. Please try again.";
      toast.error(msg);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <Card className="shadow-xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-3">
            <NexShopLogo size="md" href="/" />
          </div>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Join NexShop today</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          {/* Mode Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-xl">
            <button
              onClick={() => setMode("customer")}
              className={cn(
                "flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all",
                mode === "customer"
                  ? "bg-background shadow-sm text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <User className="h-4 w-4" /> Customer
            </button>
            <button
              onClick={() => setMode("seller")}
              className={cn(
                "flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all",
                mode === "seller"
                  ? "bg-background shadow-sm text-green-600"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Store className="h-4 w-4" /> Seller
            </button>
          </div>

          {/* Seller info banner */}
          {mode === "seller" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs text-green-700 font-medium">
                🏪 Seller accounts require admin approval before you can list products.
                You will be notified once approved.
              </p>
            </div>
          )}

          {/* Google Signup (customer only) */}
          {mode === "customer" && (
            <>
              <Button variant="outline" className="w-full gap-3 h-11" onClick={handleGoogleSignup} disabled={googleLoading}>
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {googleLoading ? "Connecting..." : "Sign up with Google"}
              </Button>
              <div className="flex items-center gap-3">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground">OR</span>
                <Separator className="flex-1" />
              </div>
            </>
          )}

          {/* Customer Form */}
          {mode === "customer" && (
            <form onSubmit={customerForm.handleSubmit(onCustomerSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Hari Prasad Sharma" className="pl-9" {...customerForm.register("displayName")} />
                </div>
                {customerForm.formState.errors.displayName && <p className="text-xs text-destructive">{customerForm.formState.errors.displayName.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="email" placeholder="your@email.com" className="pl-9" {...customerForm.register("email")} />
                </div>
                {customerForm.formState.errors.email && <p className="text-xs text-destructive">{customerForm.formState.errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>Phone (Optional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="98XXXXXXXX" className="pl-9" {...customerForm.register("phone")} />
                </div>
                {customerForm.formState.errors.phone && <p className="text-xs text-destructive">{customerForm.formState.errors.phone.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type={showPassword ? "text" : "password"} placeholder="Min 8 characters" className="pl-9 pr-10" {...customerForm.register("password")} />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {customerForm.formState.errors.password && <p className="text-xs text-destructive">{customerForm.formState.errors.password.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="password" placeholder="Repeat password" className="pl-9" {...customerForm.register("confirmPassword")} />
                </div>
                {customerForm.formState.errors.confirmPassword && <p className="text-xs text-destructive">{customerForm.formState.errors.confirmPassword.message}</p>}
              </div>

              <Button type="submit" className="w-full h-11" disabled={customerForm.formState.isSubmitting}>
                <UserPlus className="h-4 w-4 mr-2" />
                {customerForm.formState.isSubmitting ? "Creating..." : "Create Customer Account"}
              </Button>
            </form>
          )}

          {/* Seller Form */}
          {mode === "seller" && (
            <form onSubmit={sellerForm.handleSubmit(onSellerSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Your name" className="pl-9" {...sellerForm.register("displayName")} />
                  </div>
                  {sellerForm.formState.errors.displayName && <p className="text-xs text-destructive">{sellerForm.formState.errors.displayName.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="98XXXXXXXX" className="pl-9" {...sellerForm.register("phone")} />
                  </div>
                  {sellerForm.formState.errors.phone && <p className="text-xs text-destructive">{sellerForm.formState.errors.phone.message}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="email" placeholder="your@email.com" className="pl-9" {...sellerForm.register("email")} />
                </div>
                {sellerForm.formState.errors.email && <p className="text-xs text-destructive">{sellerForm.formState.errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>Shop Name</Label>
                <div className="relative">
                  <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Hari Electronics Pasal" className="pl-9" {...sellerForm.register("shopName")} />
                </div>
                {sellerForm.formState.errors.shopName && <p className="text-xs text-destructive">{sellerForm.formState.errors.shopName.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>Shop Description</Label>
                <Textarea placeholder="What do you sell? Tell customers about your shop..." rows={3} {...sellerForm.register("shopDescription")} />
                {sellerForm.formState.errors.shopDescription && <p className="text-xs text-destructive">{sellerForm.formState.errors.shopDescription.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>Shop Address</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="New Road, Kathmandu" className="pl-9" {...sellerForm.register("shopAddress")} />
                </div>
                {sellerForm.formState.errors.shopAddress && <p className="text-xs text-destructive">{sellerForm.formState.errors.shopAddress.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type={showPassword ? "text" : "password"} placeholder="Min 8 chars" className="pl-9" {...sellerForm.register("password")} />
                  </div>
                  {sellerForm.formState.errors.password && <p className="text-xs text-destructive">{sellerForm.formState.errors.password.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="password" placeholder="Repeat" className="pl-9" {...sellerForm.register("confirmPassword")} />
                  </div>
                  {sellerForm.formState.errors.confirmPassword && <p className="text-xs text-destructive">{sellerForm.formState.errors.confirmPassword.message}</p>}
                </div>
              </div>

              <Button type="submit" className="w-full h-11 bg-green-600 hover:bg-green-700" disabled={sellerForm.formState.isSubmitting}>
                <Store className="h-4 w-4 mr-2" />
                {sellerForm.formState.isSubmitting ? "Creating..." : "Register as Seller"}
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex justify-center pt-0">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">Login here</Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}