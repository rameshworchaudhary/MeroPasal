"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Package, ShoppingCart, DollarSign, TrendingUp,
  Plus, ArrowRight, AlertTriangle, Clock, CheckCircle,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { getProductsBySeller } from "@/lib/firebase/products";
import { getAllOrders } from "@/lib/firebase/orders";
import { getUserProfile } from "@/lib/firebase/auth";
import { useAuthStore } from "@/store/authStore";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants/site";
import type { Product } from "@/lib/types/product";
import type { Order } from "@/lib/types/order";

export default function SellerDashboardPage() {
  const { profile, user } = useAuth();
  const setProfile = useAuthStore((s) => s.setProfile);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    setRefreshing(true);
    try {
      const freshProfile = await getUserProfile(user.uid);
      if (freshProfile) setProfile(freshProfile);
    } catch {
      // ignore
    } finally {
      setRefreshing(false);
    }
  }, [user, setProfile]);

  useEffect(() => {
    if (!user) return;
    // Refresh profile every time dashboard loads
    refreshProfile();
    Promise.all([
      getProductsBySeller(user.uid),
      getAllOrders(),
    ]).then(([myProducts, allOrders]) => {
      const myProductIds = new Set(myProducts.map((p) => p.id));
      const myOrders = allOrders.filter((o) =>
        o.items.some((item) => myProductIds.has(item.productId))
      );
      setProducts(myProducts);
      setOrders(myOrders);
    }).finally(() => setLoading(false));
  }, [user, refreshProfile]);

  const isApproved = profile?.sellerProfile?.isApproved;
  const shopName = profile?.sellerProfile?.shopName || "My Shop";
  const commissionRate = profile?.sellerProfile?.commissionRate || 10;

  const totalRevenue = orders.reduce((sum, o) => {
    const myItemsTotal = o.items
      .filter((item) => products.some((p) => p.id === item.productId))
      .reduce((s, item) => s + item.subtotal, 0);
    return sum + myItemsTotal;
  }, 0);
  const myRevenue = totalRevenue * (1 - commissionRate / 100);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const lowStockProducts = products.filter((p) => p.stock <= p.lowStockThreshold && p.stock >= 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">{shopName}</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back!</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refreshProfile} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Checking..." : "Refresh Status"}
          </Button>
          {isApproved && (
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/seller/products/new">
                <Plus className="h-4 w-4 mr-2" /> Add Product
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Approval Banner */}
      {!isApproved ? (
        <Card className="border-yellow-300 bg-yellow-50">
          <CardContent className="p-5 flex items-start gap-4">
            <Clock className="h-8 w-8 text-yellow-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-yellow-800">Account Pending Approval</p>
              <p className="text-sm text-yellow-700 mt-1">
                Your seller account is under review. Once admin approves, you can add products.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 border-yellow-400 text-yellow-700"
                onClick={refreshProfile}
                disabled={refreshing}
              >
                <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${refreshing ? "animate-spin" : ""}`} />
                Check Approval Status
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-green-300 bg-green-50">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
            <p className="text-sm font-semibold text-green-800">
              Account Approved! You can add products and start selling.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "My Revenue", value: formatCurrency(myRevenue), sub: `After ${commissionRate}% commission`, icon: DollarSign, color: "bg-green-100 text-green-600" },
          { label: "Total Orders", value: orders.length, sub: `${pendingOrders} pending`, icon: ShoppingCart, color: "bg-blue-100 text-blue-600" },
          { label: "My Products", value: products.length, sub: `${products.filter((p) => p.isActive).length} active`, icon: Package, color: "bg-purple-100 text-purple-600" },
          { label: "Units Sold", value: products.reduce((s, p) => s + p.soldCount, 0), sub: "total units", icon: TrendingUp, color: "bg-orange-100 text-orange-600" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                  <p className="text-xl font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
                </div>
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts */}
      {isApproved && (pendingOrders > 0 || lowStockProducts.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pendingOrders > 0 && (
            <Link href="/seller/orders">
              <Card className="border-yellow-200 bg-yellow-50 hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <Clock className="h-8 w-8 text-yellow-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-yellow-800 text-sm">{pendingOrders} Pending Orders</p>
                    <p className="text-xs text-yellow-700">Require your attention</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-yellow-600" />
                </CardContent>
              </Card>
            </Link>
          )}
          {lowStockProducts.length > 0 && (
            <Link href="/seller/products">
              <Card className="border-red-200 bg-red-50 hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-red-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-red-800 text-sm">{lowStockProducts.length} Low Stock</p>
                    <p className="text-xs text-red-700">Restock needed soon</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-red-600" />
                </CardContent>
              </Card>
            </Link>
          )}
        </div>
      )}

      {/* Recent Orders + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/seller/orders">View All <ArrowRight className="h-3.5 w-3.5 ml-1" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-40" />
                <p className="text-sm text-muted-foreground">No orders yet</p>
              </div>
            ) : (
              orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                  <div>
                    <p className="text-sm font-medium">#{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{formatCurrency(order.total)}</span>
                    <Badge className={ORDER_STATUS_COLORS[order.status] + " text-xs"}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">My Products</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/seller/products">View All <ArrowRight className="h-3.5 w-3.5 ml-1" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {products.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-40" />
                <p className="text-sm text-muted-foreground mb-3">No products yet</p>
                {isApproved && (
                  <Button size="sm" asChild className="bg-green-600 hover:bg-green-700">
                    <Link href="/seller/products/new"><Plus className="h-4 w-4 mr-1" /> Add First Product</Link>
                  </Button>
                )}
              </div>
            ) : (
              products.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(product.price)}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant="secondary" className="text-xs">{product.stock} left</Badge>
                    {product.isAdminApproved
                      ? <CheckCircle className="h-4 w-4 text-green-500" />
                      : <Clock className="h-4 w-4 text-yellow-500" />
                    }
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}