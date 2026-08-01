"use client";

import React, { useEffect, useState } from "react";
import { DollarSign, Package, ShoppingCart, TrendingUp, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { getAllOrders } from "@/lib/firebase/orders";
import { getProducts } from "@/lib/firebase/products";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { Product } from "@/lib/types/product";
import type { Order } from "@/lib/types/order";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

export default function SellerAnalyticsPage() {
  const { user, profile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getProducts({}, 200),
      getAllOrders(),
    ]).then(([{ products: allProducts }, allOrders]) => {
      const myProducts = allProducts.filter((p) => p.sellerId === user.uid);
      const myProductIds = new Set(myProducts.map((p) => p.id));
      const myOrders = allOrders.filter((o) =>
        o.items.some((item) => myProductIds.has(item.productId))
      );
      setProducts(myProducts);
      setOrders(myOrders);
    }).finally(() => setLoading(false));
  }, [user]);

  const commissionRate = profile?.sellerProfile?.commissionRate || 10;

  const totalRevenue = orders.reduce((sum, o) => {
    const sellerProductIds = new Set(products.map((p) => p.id));
    return sum + o.items
      .filter((item) => sellerProductIds.has(item.productId))
      .reduce((s, item) => s + item.subtotal, 0);
  }, 0);

  const myEarnings = totalRevenue * (1 - commissionRate / 100);
  const totalUnitsSold = products.reduce((sum, p) => sum + p.soldCount, 0);
  const avgRating = products.length > 0
    ? products.reduce((sum, p) => sum + p.rating, 0) / products.length
    : 0;

  // Monthly sales data
  const monthlyData = (() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const label = date.toLocaleDateString("en-US", { month: "short" });
      const monthOrders = orders.filter((o) => {
        const d = new Date(o.createdAt);
        return d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
      });
      const sellerProductIds = new Set(products.map((p) => p.id));
      const revenue = monthOrders.reduce((sum, o) =>
        sum + o.items
          .filter((item) => sellerProductIds.has(item.productId))
          .reduce((s, item) => s + item.subtotal, 0), 0);
      return { month: label, revenue, orders: monthOrders.length };
    });
  })();

  const topProducts = [...products]
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="space-y-4">
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
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your shop performance overview
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Total Earnings</p>
                <p className="text-xl font-bold mt-1">{formatCurrency(myEarnings)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  After {commissionRate}% commission
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Total Orders</p>
                <p className="text-xl font-bold mt-1">{orders.length}</p>
                <p className="text-xs text-muted-foreground mt-1">all time</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Units Sold</p>
                <p className="text-xl font-bold mt-1">{formatNumber(totalUnitsSold)}</p>
                <p className="text-xs text-muted-foreground mt-1">across all products</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Avg Rating</p>
                <p className="text-xl font-bold mt-1">{avgRating.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground mt-1">across products</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Revenue Last 6 Months</CardTitle>
        </CardHeader>
        <CardContent>
          {monthlyData.some((d) => d.revenue > 0) ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v / 1000}k`}
                />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), "Revenue"]}
                  contentStyle={{ borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="revenue" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[260px] flex flex-col items-center justify-center text-muted-foreground">
              <TrendingUp className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm">No sales data yet</p>
              <p className="text-xs mt-1">Start selling to see your revenue chart!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          {topProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-40" />
              <p className="text-sm text-muted-foreground">No products yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <span className="text-base font-bold text-muted-foreground w-6 text-center">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(product.price)}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-green-600">
                      {formatNumber(product.soldCount)} sold
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(product.price * product.soldCount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}