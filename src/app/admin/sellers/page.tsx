"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  CheckCircle, XCircle, Clock, Store,
  Phone, Mail, MapPin, Search, Eye,
  ExternalLink, RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  collection, getDocs, query, where,
  doc, updateDoc, serverTimestamp, orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { formatDate } from "@/lib/utils";
import type { UserProfile } from "@/lib/types/user";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "suspended">("all");
  const [viewSeller, setViewSeller] = useState<UserProfile | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchSellers = async () => {
    setLoading(true);
    try {
      // Fetch ALL users and filter client-side to avoid composite index issues
      const snapshot = await getDocs(collection(db, "users"));
      const allUsers = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          ...data,
          uid: d.id,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        } as UserProfile;
      });

      // Filter only sellers
      const sellerUsers = allUsers.filter((u) => u.role === "seller");
      sellerUsers.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setSellers(sellerUsers);
    } catch (err) {
      console.error("Error fetching sellers:", err);
      toast.error("Failed to load sellers. Check Firestore rules.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleApprove = async (seller: UserProfile) => {
    setProcessing(seller.uid);
    try {
      await updateDoc(doc(db, "users", seller.uid), {
        "sellerProfile.isApproved": true,
        "sellerProfile.isActive": true,
        updatedAt: serverTimestamp(),
      });
      setSellers((prev) =>
        prev.map((s) =>
          s.uid === seller.uid
            ? {
                ...s,
                sellerProfile: s.sellerProfile
                  ? { ...s.sellerProfile, isApproved: true, isActive: true }
                  : undefined,
              }
            : s
        )
      );
      if (viewSeller?.uid === seller.uid) {
        setViewSeller({
          ...seller,
          sellerProfile: seller.sellerProfile
            ? { ...seller.sellerProfile, isApproved: true, isActive: true }
            : undefined,
        });
      }
      toast.success(`${seller.sellerProfile?.shopName} approved! Seller can now login and add products.`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve seller");
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (seller: UserProfile) => {
    setProcessing(seller.uid);
    try {
      await updateDoc(doc(db, "users", seller.uid), {
        "sellerProfile.isApproved": false,
        "sellerProfile.isActive": false,
        updatedAt: serverTimestamp(),
      });
      setSellers((prev) =>
        prev.map((s) =>
          s.uid === seller.uid
            ? {
                ...s,
                sellerProfile: s.sellerProfile
                  ? { ...s.sellerProfile, isApproved: false, isActive: false }
                  : undefined,
              }
            : s
        )
      );
      setViewSeller(null);
      toast.success("Seller rejected.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject seller");
    } finally {
      setProcessing(null);
    }
  };

  const handleToggleActive = async (seller: UserProfile) => {
    const newStatus = !seller.sellerProfile?.isActive;
    setProcessing(seller.uid);
    try {
      await updateDoc(doc(db, "users", seller.uid), {
        "sellerProfile.isActive": newStatus,
        updatedAt: serverTimestamp(),
      });
      setSellers((prev) =>
        prev.map((s) =>
          s.uid === seller.uid
            ? {
                ...s,
                sellerProfile: s.sellerProfile
                  ? { ...s.sellerProfile, isActive: newStatus }
                  : undefined,
              }
            : s
        )
      );
      toast.success(newStatus ? "Seller activated" : "Seller suspended");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update seller status");
    } finally {
      setProcessing(null);
    }
  };

  const filtered = useMemo(() => {
    let result = sellers;
    if (filter === "pending") {
      result = result.filter((s) => !s.sellerProfile?.isApproved);
    } else if (filter === "approved") {
      result = result.filter((s) => s.sellerProfile?.isApproved && s.sellerProfile?.isActive);
    } else if (filter === "suspended") {
      result = result.filter((s) => s.sellerProfile?.isApproved && !s.sellerProfile?.isActive);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.sellerProfile?.shopName?.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.displayName.toLowerCase().includes(q)
      );
    }
    return result;
  }, [sellers, filter, search]);

  const pendingCount = sellers.filter((s) => !s.sellerProfile?.isApproved).length;
  const approvedCount = sellers.filter((s) => s.sellerProfile?.isApproved && s.sellerProfile?.isActive).length;
  const suspendedCount = sellers.filter((s) => s.sellerProfile?.isApproved && !s.sellerProfile?.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Store className="h-6 w-6 text-primary" /> Seller Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {sellers.length} total sellers
            {pendingCount > 0 && (
              <span className="ml-2 text-yellow-600 font-semibold">
                • {pendingCount} pending approval
              </span>
            )}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchSellers} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "All", value: sellers.length, color: "bg-blue-100 text-blue-700", filter: "all" as const },
          { label: "Pending", value: pendingCount, color: "bg-yellow-100 text-yellow-700", filter: "pending" as const },
          { label: "Approved", value: approvedCount, color: "bg-green-100 text-green-700", filter: "approved" as const },
          { label: "Suspended", value: suspendedCount, color: "bg-red-100 text-red-700", filter: "suspended" as const },
        ].map((stat) => (
          <Card
            key={stat.label}
            className={`cursor-pointer transition-all hover:shadow-md ${filter === stat.filter ? "ring-2 ring-primary" : ""}`}
            onClick={() => setFilter(stat.filter)}
          >
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${stat.color} rounded-lg px-2 py-1 inline-block`}>
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by shop name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Sellers List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <Store className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">
              {sellers.length === 0 ? "No sellers registered yet" : "No sellers match your filter"}
            </p>
            <p className="text-xs mt-1">
              {sellers.length === 0 && "Sellers will appear here once they register"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((seller) => {
            const isApproved = seller.sellerProfile?.isApproved;
            const isActive = seller.sellerProfile?.isActive;
            const isPending = !isApproved;

            return (
              <Card
                key={seller.uid}
                className={`hover:shadow-md transition-all ${isPending ? "border-yellow-200 bg-yellow-50/30" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isPending ? "bg-yellow-100" : isActive ? "bg-green-100" : "bg-red-100"
                    }`}>
                      <Store className={`h-6 w-6 ${
                        isPending ? "text-yellow-600" : isActive ? "text-green-600" : "text-red-600"
                      }`} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm">
                          {seller.sellerProfile?.shopName || "Unnamed Shop"}
                        </p>
                        {isPending && (
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">
                            <Clock className="h-3 w-3 mr-1" /> Pending
                          </Badge>
                        )}
                        {isApproved && isActive && (
                          <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" /> Active
                          </Badge>
                        )}
                        {isApproved && !isActive && (
                          <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">
                            Suspended
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {seller.displayName} • {seller.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Registered: {formatDate(seller.createdAt)}
                        {seller.sellerProfile?.address && ` • ${seller.sellerProfile.address}`}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1 text-xs"
                        onClick={() => setViewSeller(seller)}
                      >
                        <Eye className="h-3.5 w-3.5" /> Details
                      </Button>

                      {isPending ? (
                        <>
                          <Button
                            size="sm"
                            className="h-8 bg-green-600 hover:bg-green-700 text-xs"
                            onClick={() => handleApprove(seller)}
                            disabled={processing === seller.uid}
                          >
                            <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            {processing === seller.uid ? "..." : "Approve"}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 text-xs"
                            onClick={() => handleReject(seller)}
                            disabled={processing === seller.uid}
                          >
                            <XCircle className="h-3.5 w-3.5 mr-1" />
                            {processing === seller.uid ? "..." : "Reject"}
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className={`h-8 text-xs ${
                            isActive
                              ? "text-destructive hover:text-destructive border-destructive/30"
                              : "text-green-600 hover:text-green-600 border-green-300"
                          }`}
                          onClick={() => handleToggleActive(seller)}
                          disabled={processing === seller.uid}
                        >
                          {processing === seller.uid
                            ? "..."
                            : isActive ? "Suspend" : "Activate"}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Seller Detail Dialog */}
      {viewSeller && (
        <Dialog open={!!viewSeller} onOpenChange={() => setViewSeller(null)}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Store className="h-5 w-5 text-green-600" />
                {viewSeller.sellerProfile?.shopName || "Unnamed Shop"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Status */}
              <div className="flex flex-wrap gap-2">
                {!viewSeller.sellerProfile?.isApproved ? (
                  <Badge className="bg-yellow-100 text-yellow-800">Pending Approval</Badge>
                ) : (
                  <Badge className="bg-green-100 text-green-800">Approved</Badge>
                )}
                {viewSeller.sellerProfile?.isActive ? (
                  <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800">Inactive</Badge>
                )}
              </div>

              <Separator />

              {/* Owner Info */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Owner Details
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span>{viewSeller.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span>{viewSeller.sellerProfile?.phone || "Not provided"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span>{viewSeller.sellerProfile?.address || "Not provided"}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Shop Description */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Shop Description
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed bg-muted/30 rounded-lg p-3">
                  {viewSeller.sellerProfile?.shopDescription || "No description provided"}
                </p>
              </div>

              {/* Bank Details */}
              {viewSeller.sellerProfile?.bankDetails?.bankName && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Bank Details
                    </p>
                    <div className="bg-muted/30 rounded-lg p-3 space-y-1 text-sm">
                      <p><span className="text-muted-foreground">Bank:</span> {viewSeller.sellerProfile.bankDetails.bankName}</p>
                      <p><span className="text-muted-foreground">Account:</span> {viewSeller.sellerProfile.bankDetails.accountNumber}</p>
                      <p><span className="text-muted-foreground">Holder:</span> {viewSeller.sellerProfile.bankDetails.accountHolder}</p>
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* Commission */}
              <div className="flex items-center justify-between bg-muted/30 rounded-lg p-3">
                <p className="text-sm font-medium">Commission Rate</p>
                <p className="text-sm font-bold text-primary">
                  {viewSeller.sellerProfile?.commissionRate || 10}%
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center bg-muted/30 rounded-lg p-3">
                  <p className="font-bold text-lg">{viewSeller.sellerProfile?.totalProducts || 0}</p>
                  <p className="text-xs text-muted-foreground">Products</p>
                </div>
                <div className="text-center bg-muted/30 rounded-lg p-3">
                  <p className="font-bold text-lg">{viewSeller.sellerProfile?.totalSales || 0}</p>
                  <p className="text-xs text-muted-foreground">Sales</p>
                </div>
                <div className="text-center bg-muted/30 rounded-lg p-3">
                  <p className="font-bold text-lg">{viewSeller.sellerProfile?.rating?.toFixed(1) || "0.0"}</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                {!viewSeller.sellerProfile?.isApproved ? (
                  <>
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleApprove(viewSeller)}
                      disabled={processing === viewSeller.uid}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {processing === viewSeller.uid ? "Approving..." : "Approve Seller"}
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => handleReject(viewSeller)}
                      disabled={processing === viewSeller.uid}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </>
                ) : (
                  <Button
                    variant={viewSeller.sellerProfile?.isActive ? "destructive" : "default"}
                    className="flex-1"
                    onClick={() => handleToggleActive(viewSeller)}
                    disabled={processing === viewSeller.uid}
                  >
                    {viewSeller.sellerProfile?.isActive ? "Suspend Seller" : "Activate Seller"}
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}