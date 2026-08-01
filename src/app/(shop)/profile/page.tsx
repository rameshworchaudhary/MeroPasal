"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User, MapPin, Settings, LogOut, Plus, Trash2,
  Pencil, Phone, Mail, Loader2, ShieldCheck, Store, CheckCircle, AlertTriangle, Camera, Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import AddressForm, { type AddressFormData } from "@/components/checkout/AddressForm";
import ImageUploader from "@/components/common/ImageUploader";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import {
  updateUserProfile, addUserAddress,
  updateUserAddress, removeUserAddress,
} from "@/lib/firebase/users";
import { getUserProfile, resendVerificationEmail, logout } from "@/lib/firebase/auth";
import { getInitials, isValidNepaliPhone } from "@/lib/utils";
import type { DeliveryAddress } from "@/lib/types/nepal-address";
import type { UserProfile } from "@/lib/types/user";
import { toast } from "sonner";

const profileSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .optional()
    .refine((v) => !v || isValidNepaliPhone(v), "Enter a valid Nepali phone number"),
  photoURL: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ROLE_LABELS: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  admin: {
    label: "Administrator",
    icon: <ShieldCheck className="h-3.5 w-3.5" />,
    color: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  },
  seller: {
    label: "Seller",
    icon: <Store className="h-3.5 w-3.5" />,
    color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  customer: {
    label: "Customer",
    icon: <User className="h-3.5 w-3.5" />,
    color: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  },
};

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const setProfile = useAuthStore((s) => s.setProfile);

  // Local fresh profile state — fetched directly from Firestore
  const [freshProfile, setFreshProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<DeliveryAddress | null>(null);
  const [resending, setResending] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getUserProfile(user.uid);
      if (data) {
        setFreshProfile(data);
        setProfile(data);
      } else {
        setError("Profile not found. Please contact support.");
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      setError("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user, setProfile]);

  // Fetch fresh profile from Firestore on mount
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetchProfile();
  }, [user, fetchProfile]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: freshProfile?.displayName || "",
      phone: freshProfile?.phone || "",
      photoURL: freshProfile?.photoURL || "",
    },
  });

  // Reset form when freshProfile loads
  useEffect(() => {
    if (freshProfile) {
      reset({
        displayName: freshProfile.displayName || "",
        phone: freshProfile.phone || "",
        photoURL: freshProfile.photoURL || "",
      });
    }
  }, [freshProfile, reset]);

  const handleResendEmail = async () => {
    setResending(true);
    try {
      await resendVerificationEmail();
      toast.success("Verification link sent! Check your email inbox.");
    } catch (err: unknown) {
      const msg = err instanceof Error && err.message.includes("already verified")
        ? "Your email is already verified!"
        : "Failed to send verification email.";
      toast.error(msg);
    } finally {
      setResending(false);
    }
  };

  // ─── Loading state ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500 mx-auto" />
          <p className="text-slate-400 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // ─── Not logged in ────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <User className="h-12 w-12 text-slate-500 mx-auto mb-4 opacity-40" />
        <h2 className="text-2xl font-bold mb-2 text-slate-100">Please Login</h2>
        <p className="text-slate-400 mb-6">You need to be signed in to access your profile settings.</p>
        <Button className="w-full bg-blue-600 hover:bg-blue-500" onClick={() => router.push("/login")}>
          Go to Login
        </Button>
      </div>
    );
  }

  // ─── Error state ─────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <p className="text-rose-400 mb-4">{error}</p>
        <Button onClick={fetchProfile} variant="outline" className="border-slate-700 text-slate-200">Try Again</Button>
      </div>
    );
  }

  // ─── Profile not found ────────────────────────────────────────────────────
  if (!freshProfile) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <p className="text-slate-400 mb-4">Profile data not available.</p>
        <Button onClick={fetchProfile} variant="outline" className="border-slate-700 text-slate-200">Retry</Button>
      </div>
    );
  }

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      await updateUserProfile(user.uid, data);
      const updated = { ...freshProfile, ...data };
      setFreshProfile(updated);
      setProfile(updated);
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleAddAddress = async (data: AddressFormData) => {
    try {
      const address: DeliveryAddress = { ...data, ward: Number(data.ward) };
      if (editingAddress?.id) {
        await updateUserAddress(user.uid, editingAddress.id, address);
        toast.success("Address updated!");
      } else {
        await addUserAddress(user.uid, address);
        toast.success("Address added!");
      }
      setAddressDialogOpen(false);
      setEditingAddress(null);
      await fetchProfile();
    } catch {
      toast.error("Failed to save address. Please try again.");
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await removeUserAddress(user.uid, addressId);
      toast.success("Address removed");
      await fetchProfile();
    } catch {
      toast.error("Failed to remove address. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch {
      toast.error("Failed to logout. Please try again.");
    }
  };

  const roleInfo = ROLE_LABELS[freshProfile.role] || ROLE_LABELS.customer;

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl space-y-5 sm:space-y-6">
      {/* Admin / Seller Dashboard Banner */}
      {freshProfile.role === "admin" && (
        <div className="p-4 sm:p-5 rounded-2xl border border-blue-500/40 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white font-black shadow-md">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="font-extrabold text-base text-white flex items-center gap-2">
                Administrator Control Center
              </p>
              <p className="text-xs text-blue-200 mt-0.5">
                Full access to products, orders, categories, banners, sellers, coupons & store management.
              </p>
            </div>
          </div>
          <Button
            onClick={() => router.push("/admin")}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 shrink-0"
          >
            Open Admin Panel &rarr;
          </Button>
        </div>
      )}

      {freshProfile.role === "seller" && (
        <div className="p-4 sm:p-5 rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-black shadow-md">
              <Store className="h-6 w-6" />
            </div>
            <div>
              <p className="font-extrabold text-base text-white flex items-center gap-2">
                Seller Dashboard
              </p>
              <p className="text-xs text-emerald-200 mt-0.5">
                Manage your store listings, inventory stock, orders & earnings.
              </p>
            </div>
          </div>
          <Button
            onClick={() => router.push("/seller/dashboard")}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 shrink-0"
          >
            Open Seller Portal &rarr;
          </Button>
        </div>
      )}

      {/* Profile header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-6 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="relative group">
          <Avatar className="h-20 w-20 border-2 border-blue-500/40 shadow-lg shadow-blue-500/10">
            <AvatarImage src={watch("photoURL") || freshProfile.photoURL || ""} />
            <AvatarFallback className="bg-blue-600 text-white text-xl font-bold">
              {getInitials(freshProfile.displayName)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-white truncate">{freshProfile.displayName}</h1>
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${roleInfo.color}`}>
              {roleInfo.icon}
              {roleInfo.label}
            </span>
          </div>

          <p className="text-sm text-slate-400 flex items-center gap-1.5 pt-1">
            <Mail className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate text-slate-300">{user.email}</span>
            {user.emailVerified ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <CheckCircle className="h-3 w-3" /> Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                <AlertTriangle className="h-3 w-3" /> Unverified
              </span>
            )}
          </p>

          {freshProfile.phone && (
            <p className="text-sm text-slate-400 flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
              {freshProfile.phone}
            </p>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="gap-1.5 text-rose-400 border-rose-500/30 hover:bg-rose-500/20 hover:text-rose-300 flex-shrink-0"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <TabsTrigger value="info" className="gap-2 text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <User className="h-4 w-4" /> Profile Info
          </TabsTrigger>
          <TabsTrigger value="addresses" className="gap-2 text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <MapPin className="h-4 w-4" /> Saved Addresses
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2 text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Settings className="h-4 w-4" /> Account Settings
          </TabsTrigger>
        </TabsList>

        {/* ── Profile Info Tab ── */}
        <TabsContent value="info" className="mt-6">
          <Card className="border-slate-800 bg-slate-900/80 text-slate-100">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-white">Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-6 max-w-lg">
                {/* Avatar Upload */}
                <div className="space-y-2">
                  <Label className="text-slate-200">Profile Picture</Label>
                  <ImageUploader
                    value={watch("photoURL")}
                    onChange={(url) => setValue("photoURL", url)}
                    folder="users/avatars"
                    label=""
                    description="Upload a photo for your profile avatar"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="displayName" className="text-slate-200">Full Name</Label>
                  <Input id="displayName" className="bg-slate-950 border-slate-800 text-slate-100" {...register("displayName")} />
                  {errors.displayName && (
                    <p className="text-xs text-rose-400">{errors.displayName.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-slate-200">Phone Number (Nepali 98XXXXXXXX)</Label>
                  <Input id="phone" placeholder="98XXXXXXXX" className="bg-slate-950 border-slate-800 text-slate-100" {...register("phone")} />
                  {errors.phone && (
                    <p className="text-xs text-rose-400">{errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-slate-200">Email Address</Label>
                  <Input value={user.email || ""} disabled className="bg-slate-950/60 border-slate-800 text-slate-400 cursor-not-allowed" />
                  <p className="text-xs text-slate-500">Email address cannot be modified.</p>
                </div>

                {!user.emailVerified && (
                  <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-between gap-3">
                    <div className="text-xs text-amber-200">
                      <p className="font-semibold text-amber-300">Email Unverified</p>
                      <p>Please verify your email address for account security.</p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleResendEmail}
                      disabled={resending}
                      className="bg-amber-500/20 text-amber-200 hover:bg-amber-500/30 border border-amber-500/30 text-xs"
                    >
                      <Send className="h-3 w-3 mr-1" />
                      {resending ? "Sending..." : "Resend Link"}
                    </Button>
                  </div>
                )}

                <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving...</>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Addresses Tab ── */}
        <TabsContent value="addresses" className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-white">
              Saved Addresses ({freshProfile.addresses?.length || 0})
            </h2>
            <Dialog open={addressDialogOpen} onOpenChange={setAddressDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white" onClick={() => setEditingAddress(null)}>
                  <Plus className="h-4 w-4 mr-1" /> Add Address
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-800 text-slate-100">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    {editingAddress ? "Edit Address" : "Add New Address"}
                  </DialogTitle>
                </DialogHeader>
                <AddressForm
                  defaultValues={editingAddress || undefined}
                  onSubmit={handleAddAddress}
                  submitLabel={editingAddress ? "Update Address" : "Add Address"}
                  onCancel={() => setAddressDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          {!freshProfile.addresses || freshProfile.addresses.length === 0 ? (
            <Card className="border-slate-800 bg-slate-900/80">
              <CardContent className="py-12 text-center">
                <MapPin className="h-10 w-10 text-slate-500 mx-auto mb-3 opacity-40" />
                <p className="text-slate-300 font-medium">No saved addresses yet</p>
                <p className="text-xs text-slate-500 mt-1">
                  Add a shipping address to enjoy seamless 1-click checkout across Nepal
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {freshProfile.addresses.map((addr) => (
                <Card key={addr.id} className="border-slate-800 bg-slate-900/80 text-slate-200">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-semibold text-sm text-white">{addr.fullName}</p>
                      {addr.isDefault && (
                        <Badge variant="outline" className="text-[10px] border-blue-500/40 text-blue-400 bg-blue-500/10">Default</Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Phone className="h-3 w-3 text-blue-400" /> {addr.phone}
                    </p>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {addr.streetAddress}, Ward {addr.ward},{" "}
                      {addr.municipality}, {addr.district}, {addr.province}
                    </p>
                    <div className="flex gap-2 mt-4 pt-3 border-t border-slate-800">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-8 text-xs border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-200"
                        onClick={() => {
                          setEditingAddress(addr);
                          setAddressDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-3 w-3 mr-1" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-8 text-xs border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                        onClick={() => addr.id && handleDeleteAddress(addr.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Settings Tab ── */}
        <TabsContent value="settings" className="mt-6">
          <Card className="border-slate-800 bg-slate-900/80 text-slate-100">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-white">Account Overview & Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-3 text-sm">
                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Account Name</span>
                  <span className="font-semibold text-white">{freshProfile.displayName}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Email Address</span>
                  <span className="font-semibold text-white">{user.email}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Account Type</span>
                  <span className={`font-semibold ${roleInfo.color} px-2.5 py-0.5 rounded-full text-xs border`}>
                    {roleInfo.label}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Security Verification</span>
                  <span className={user.emailVerified ? "text-emerald-400 font-semibold" : "text-amber-400 font-semibold"}>
                    {user.emailVerified ? "Verified Email" : "Pending Email Verification"}
                  </span>
                </div>
              </div>

              <Button
                variant="destructive"
                onClick={handleLogout}
                className="gap-2 w-full sm:w-auto bg-rose-600 hover:bg-rose-500 text-white font-semibold"
              >
                <LogOut className="h-4 w-4" /> Logout from Account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}