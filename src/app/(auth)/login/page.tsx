"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, LogIn, Mail, Lock, ShieldCheck, Store, User, AlertTriangle, Send, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { loginWithEmail, loginWithGoogle, getUserProfile, resendVerificationForEmail } from "@/lib/firebase/auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import NexShopLogo from "@/components/common/NexShopLogo";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;
type LoginMode = "customer" | "seller" | "admin";

const MODES = [
  {
    id: "customer" as LoginMode,
    label: "Customer",
    icon: User,
    color: "text-blue-500",
    bg: "bg-blue-500/10 border-blue-500/30",
    activeBg: "bg-blue-600",
    description: "Shop on NexShop",
  },
  {
    id: "seller" as LoginMode,
    label: "Seller",
    icon: Store,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10 border-emerald-500/30",
    activeBg: "bg-emerald-600",
    description: "Manage your shop",
  },
  {
    id: "admin" as LoginMode,
    label: "Admin",
    icon: ShieldCheck,
    color: "text-rose-500",
    bg: "bg-rose-500/10 border-rose-500/30",
    activeBg: "bg-rose-600",
    description: "Platform management",
  },
];

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryMode = searchParams.get("mode") as LoginMode | null;
  const isRegisteredParam = searchParams.get("registered");

  const [mode, setMode] = useState<LoginMode>(queryMode || "customer");
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<{ email: string; pass: string } | null>(null);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (queryMode && ["customer", "seller", "admin"].includes(queryMode)) {
      setMode(queryMode);
    }
  }, [queryMode]);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormData) => {
    setUnverifiedEmail(null);
    try {
      const user = await loginWithEmail(data.email, data.password);
      const profile = await getUserProfile(user.uid);

      if (!profile) {
        toast.error("Account profile not found. Please register again.");
        return;
      }

      // Role check
      if (mode === "admin" && profile.role !== "admin") {
        toast.error("You do not have admin permissions.");
        return;
      }
      if (mode === "seller" && profile.role !== "seller") {
        toast.error("No seller account found with this email. Please register as a seller.");
        return;
      }
      if (mode === "customer" && profile.role !== "customer") {
        if (profile.role === "seller") {
          toast.info("Seller account detected. Redirecting to seller portal...");
          router.push("/seller/dashboard");
          return;
        }
        if (profile.role === "admin") {
          toast.info("Admin account detected. Redirecting to admin panel...");
          router.push("/admin");
          return;
        }
      }

      toast.success("Logged in successfully!");

      // Redirect based on role
      if (profile.role === "admin") {
        router.push("/admin");
      } else if (profile.role === "seller") {
        router.push("/seller/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "";
      if (message === "EMAIL_NOT_VERIFIED") {
        setUnverifiedEmail({ email: data.email, pass: data.password });
        toast.error("Your email address is not verified yet. Please check your Inbox. If you don't see it, please check your Spam/Junk folder and mark it as Not Spam. You can also resend verification.");
      } else if (message.includes("user-not-found") || message.includes("invalid-credential")) {
        toast.error("Invalid email or password.");
      } else if (message.includes("wrong-password")) {
        toast.error("Incorrect password.");
      } else {
        toast.error("Login failed. Please check credentials and try again.");
      }
    }
  };

  const handleResendEmail = async () => {
    if (!unverifiedEmail) return;
    setResending(true);
    try {
      await resendVerificationForEmail(unverifiedEmail.email, unverifiedEmail.pass);
      toast.success("Verification email resent! Please check your Inbox. If you don't see it, please check your Spam/Junk folder and mark it as Not Spam.");
    } catch (err: unknown) {
      const msg = err instanceof Error && err.message === "EMAIL_ALREADY_VERIFIED"
        ? "Email is already verified! You can log in now."
        : "Failed to resend verification email. Please try again.";
      toast.error(msg);
    } finally {
      setResending(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (mode === "admin") {
      toast.error("Admin login requires secure password authentication.");
      return;
    }
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      toast.success("Signed in with Google!");
      if (mode === "seller") {
        router.push("/seller/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google authentication failed.";
      toast.error(msg);
    } finally {
      setGoogleLoading(false);
    }
  };

  const currentMode = MODES.find((m) => m.id === mode)!;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <Card className="shadow-2xl border border-slate-800 bg-slate-900/90 text-slate-100 backdrop-blur-xl">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-3">
            <NexShopLogo size="md" href="/" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white">Welcome Back</CardTitle>
          <CardDescription className="text-slate-400">
            {mode === "seller" ? "Access your Seller Dashboard" : mode === "admin" ? "Access Admin Panel" : "Sign in to NexShop Nepal"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 pt-4">
          {/* Registration Notice */}
          {isRegisteredParam && (
            <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-blue-200 leading-relaxed">
                <p className="font-semibold text-blue-300">Registration Complete!</p>
                <p>We sent a verification link to your email. Please verify your email before signing in below.</p>
              </div>
            </div>
          )}

          {/* Email Verification Error Alert */}
          {unverifiedEmail && (
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3.5 space-y-2 text-amber-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0" />
                <p className="text-xs font-semibold text-amber-300">Email Verification Required</p>
              </div>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                Your email ({unverifiedEmail.email}) needs to be verified before you can access your account.
              </p>
              <Button
                type="button"
                size="sm"
                onClick={handleResendEmail}
                disabled={resending}
                className="w-full h-8 text-xs bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 text-amber-200"
              >
                <Send className="h-3.5 w-3.5 mr-1.5" />
                {resending ? "Sending Verification Email..." : "Resend Verification Email"}
              </Button>
            </div>
          )}

          {/* Mode Selector */}
          <div className="grid grid-cols-3 gap-2">
            {MODES.map((m) => {
              const Icon = m.icon;
              const isActive = mode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => { setMode(m.id); setUnverifiedEmail(null); }}
                  className={cn(
                    "flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200",
                    isActive
                      ? `border-blue-500/60 bg-blue-600/15 text-blue-400 shadow-md`
                      : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  )}
                >
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center",
                    isActive ? `${m.activeBg} text-white shadow-sm` : "bg-slate-800 text-slate-400"
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className={cn(
                    "text-xs font-semibold",
                    isActive ? "text-white" : "text-slate-400"
                  )}>
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Google Login */}
          {mode !== "admin" && (
            <>
              <Button
                variant="outline"
                className="w-full gap-3 h-11 border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {googleLoading ? "Connecting..." : `Continue with Google`}
              </Button>

              <div className="flex items-center gap-3">
                <Separator className="flex-1 bg-slate-800" />
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Or with password</span>
                <Separator className="flex-1 bg-slate-800" />
              </div>
            </>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-300">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  className="pl-9 bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:border-blue-500"
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="text-xs text-rose-400">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                {mode !== "admin" && (
                  <Link href="/forgot-password" className="text-xs text-blue-400 hover:underline">
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-9 pr-10 bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:border-blue-500"
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-rose-400">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/20" disabled={isSubmitting}>
              <LogIn className="h-4 w-4 mr-2" />
              {isSubmitting ? "Authenticating..." : `Login as ${currentMode.label}`}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-slate-800/80 pt-4">
          {mode === "customer" && (
            <p className="text-sm text-slate-400">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-blue-400 font-semibold hover:underline">
                Create Customer Account
              </Link>
            </p>
          )}
          {mode === "seller" && (
            <p className="text-sm text-slate-400">
              Want to sell on NexShop?{" "}
              <Link href="/register?role=seller" className="text-emerald-400 font-semibold hover:underline">
                Register Seller Shop
              </Link>
            </p>
          )}
          {mode === "admin" && (
            <p className="text-xs text-slate-500">
              Authorized administrators only. Unauthorized attempts are logged.
            </p>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-md p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400">
        Loading authentication portal...
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  );
}