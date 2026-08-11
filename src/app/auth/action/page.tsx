"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  verifyPasswordResetCode,
  confirmPasswordReset,
  applyActionCode,
  checkActionCode,
} from "firebase/auth";
import {
  CheckCircle2,
  AlertCircle,
  KeyRound,
  MailCheck,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  Lock,
  RefreshCw,
  Sparkles,
  Check,
  ArrowLeft,
  Home,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/firebase/config";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import NexShopLogo from "@/components/common/NexShopLogo";

type ActionStatus =
  | "verifying"
  | "resetPassword_input"
  | "resetPassword_success"
  | "verifyEmail_success"
  | "recoverEmail_success"
  | "error";

function AuthActionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const mode = searchParams.get("mode");
  const oobCode = searchParams.get("oobCode");
  const continueUrl = searchParams.get("continueUrl");
  const lang = searchParams.get("lang");

  const [status, setStatus] = useState<ActionStatus>("verifying");
  const [userEmail, setUserEmail] = useState<string>("");
  const [restoredEmail, setRestoredEmail] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Form states for password reset
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (lang) {
      auth.languageCode = lang;
    }

    if (!oobCode || !mode) {
      setStatus("error");
      setErrorMessage("Missing parameters in the action link. Please verify the URL or request a new link.");
      return;
    }

    let isMounted = true;

    async function handleAction() {
      try {
        switch (mode) {
          case "resetPassword": {
            const email = await verifyPasswordResetCode(auth, oobCode!);
            if (isMounted) {
              setUserEmail(email);
              setStatus("resetPassword_input");
            }
            break;
          }

          case "verifyEmail": {
            await applyActionCode(auth, oobCode!);
            if (isMounted) {
              setStatus("verifyEmail_success");
              toast.success("Your email address has been successfully verified!");
            }
            break;
          }

          case "recoverEmail": {
            try {
              const info = await checkActionCode(auth, oobCode!);
              if (info.data.email && isMounted) {
                setRestoredEmail(info.data.email);
              }
            } catch {
              // Ignore checkActionCode error if applyActionCode succeeds
            }
            await applyActionCode(auth, oobCode!);
            if (isMounted) {
              setStatus("recoverEmail_success");
              toast.success("Your original email address has been restored.");
            }
            break;
          }

          default: {
            if (isMounted) {
              setStatus("error");
              setErrorMessage("Invalid or unsupported action mode.");
            }
            break;
          }
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        setStatus("error");
        const msg = err instanceof Error ? err.message : "";

        if (msg.includes("auth/invalid-action-code")) {
          setErrorMessage("This action code is invalid, improperly formatted, or has already been used.");
        } else if (msg.includes("auth/expired-action-code")) {
          setErrorMessage("This action link has expired. Please request a new verification or reset link.");
        } else if (msg.includes("auth/user-disabled")) {
          setErrorMessage("The account associated with this code has been disabled.");
        } else if (msg.includes("auth/user-not-found")) {
          setErrorMessage("No user found corresponding to this action code.");
        } else {
          setErrorMessage("An unexpected error occurred while processing your request. Please try again.");
        }
      }
    }

    handleAction();

    return () => {
      isMounted = false;
    };
  }, [mode, oobCode, lang]);

  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match. Please verify both fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await confirmPasswordReset(auth, oobCode!, newPassword);
      setStatus("resetPassword_success");
      toast.success("Password reset successfully! You can now log in.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to reset password.";
      if (msg.includes("auth/weak-password")) {
        toast.error("Password is too weak. Please choose a stronger password.");
      } else if (msg.includes("auth/expired-action-code") || msg.includes("auth/invalid-action-code")) {
        setStatus("error");
        setErrorMessage("The reset code is expired or invalid. Please request a new password reset email.");
      } else {
        toast.error("Failed to reset password. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Password requirements calculation
  const hasMinLength = newPassword.length >= 6;
  const hasLetter = /[a-zA-Z]/.test(newPassword);
  const hasNumberOrSymbol = /[0-9!@#$%^&*()]/.test(newPassword);
  const isMatch = newPassword.length > 0 && newPassword === confirmPassword;

  // Safe redirect URL helper
  const safeContinueHref = continueUrl && (continueUrl.startsWith("/") || continueUrl.includes("nexshop"))
    ? continueUrl
    : "/login";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md my-auto px-4"
    >
      <Card className="shadow-2xl border border-slate-800 bg-slate-900/90 text-slate-100 backdrop-blur-xl rounded-2xl overflow-hidden">
        {/* Card Header Branding */}
        <CardHeader className="text-center pb-2 pt-6">
          <div className="flex justify-center mb-3">
            <NexShopLogo size="md" href="/" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-2 pb-6">
          {/* STATE 1: Verifying */}
          {status === "verifying" && (
            <div className="py-8 text-center space-y-4">
              <div className="relative inline-flex items-center justify-center">
                <div className="h-14 w-14 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
                <Sparkles className="h-6 w-6 text-blue-400 absolute" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Verifying Action Link</h3>
                <p className="text-xs text-slate-400">Communicating with NexShop security services...</p>
              </div>
            </div>
          )}

          {/* STATE 2: Reset Password Form */}
          {status === "resetPassword_input" && (
            <form onSubmit={handlePasswordResetSubmit} className="space-y-5">
              <div className="text-center space-y-1">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <KeyRound className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-bold text-white">Set New Password</CardTitle>
                <CardDescription className="text-slate-400 text-xs">
                  {userEmail ? (
                    <>
                      Resetting password for <span className="font-semibold text-slate-200">{userEmail}</span>
                    </>
                  ) : (
                    "Enter a new secure password for your NexShop account"
                  )}
                </CardDescription>
              </div>

              <div className="space-y-4">
                {/* New Password Input */}
                <div className="space-y-1.5">
                  <Label htmlFor="newPassword" className="text-slate-300 text-xs font-semibold">
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="pl-9 pr-10 bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:border-blue-500 text-sm"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-slate-300 text-xs font-semibold">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="pl-9 pr-10 bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:border-blue-500 text-sm"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Password Requirements Checklist */}
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 space-y-2 text-[11px]">
                  <p className="font-semibold text-slate-300">Password Requirements:</p>
                  <ul className="space-y-1 text-slate-400">
                    <li className="flex items-center gap-1.5">
                      <span className={cn("h-4 w-4 rounded-full flex items-center justify-center text-[10px]", hasMinLength ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-500")}>
                        {hasMinLength ? <Check className="h-3 w-3" /> : "•"}
                      </span>
                      At least 6 characters
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className={cn("h-4 w-4 rounded-full flex items-center justify-center text-[10px]", hasLetter ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-500")}>
                        {hasLetter ? <Check className="h-3 w-3" /> : "•"}
                      </span>
                      Contains letters
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className={cn("h-4 w-4 rounded-full flex items-center justify-center text-[10px]", hasNumberOrSymbol ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-500")}>
                        {hasNumberOrSymbol ? <Check className="h-3 w-3" /> : "•"}
                      </span>
                      Contains number or special character
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className={cn("h-4 w-4 rounded-full flex items-center justify-center text-[10px]", isMatch ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-500")}>
                        {isMatch ? <Check className="h-3 w-3" /> : "•"}
                      </span>
                      Passwords match
                    </li>
                  </ul>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !hasMinLength || !isMatch}
                className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/20 rounded-xl"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" /> Updating Password...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Update Password <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>
          )}

          {/* STATE 3: Reset Password Success */}
          {status === "resetPassword_success" && (
            <div className="py-4 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">Password Reset Complete</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Your password has been securely updated. You can now log into your NexShop account with your new password.
                </p>
              </div>

              <Button
                asChild
                className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 mt-2"
              >
                <Link href={safeContinueHref}>
                  Sign In Now <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          )}

          {/* STATE 4: Verify Email Success */}
          {status === "verifyEmail_success" && (
            <div className="py-4 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <MailCheck className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">Email Verified Successfully</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Thank you for verifying your email address with NexShop Nepal. Your account is now fully active!
                </p>
              </div>

              <Button
                asChild
                className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 mt-2"
              >
                <Link href={safeContinueHref}>
                  Continue to NexShop <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          )}

          {/* STATE 5: Recover Email Success */}
          {status === "recoverEmail_success" && (
            <div className="py-4 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">Email Address Restored</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  {restoredEmail ? (
                    <>Your original email address (<span className="font-semibold text-slate-200">{restoredEmail}</span>) has been restored.</>
                  ) : (
                    "Your original account email address has been successfully restored."
                  )}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <Button
                  asChild
                  className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20"
                >
                  <Link href="/forgot-password">
                    Reset Password
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full h-10 border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl"
                >
                  <Link href="/login">
                    Sign In to Account
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {/* STATE 6: Error State */}
          {status === "error" && (
            <div className="py-4 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400">
                <AlertCircle className="h-8 w-8" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-white">Action Link Error</h3>
                <p className="text-xs text-rose-300/90 leading-relaxed max-w-xs mx-auto bg-rose-500/10 border border-rose-500/20 rounded-xl p-3">
                  {errorMessage || "The authentication link is invalid or has expired."}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                {mode === "resetPassword" && (
                  <Button
                    asChild
                    className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20"
                  >
                    <Link href="/forgot-password">
                      Request New Password Reset
                    </Link>
                  </Button>
                )}
                <Button
                  asChild
                  variant="outline"
                  className="w-full h-10 border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl"
                >
                  <Link href="/login">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Login
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full h-9 text-xs text-slate-400 hover:text-slate-200"
                >
                  <Link href="/">
                    <Home className="h-3.5 w-3.5 mr-1.5" /> Return to Homepage
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-center border-t border-slate-800/80 py-4 bg-slate-950/40">
          <p className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} NexShop Nepal — Secure Authentication Portal
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default function AuthActionPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between selection:bg-blue-500 selection:text-white">
      {/* Top Header Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <NexShopLogo size="md" href="/" />
          <Link
            href="/login"
            className="text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 hover:bg-slate-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Return to Store
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <Suspense
          fallback={
            <div className="w-full max-w-md p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400 shadow-2xl">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                <p className="text-sm font-medium text-slate-300">Loading security parameters...</p>
              </div>
            </div>
          }
        >
          <AuthActionContent />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-500 bg-slate-950">
        NexShop Nepal — Sabai Kura, Ekai Thau Ma
      </footer>
    </div>
  );
}
