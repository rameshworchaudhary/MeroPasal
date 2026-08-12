"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Package, MapPin, CreditCard, Phone, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OrderTimeline from "@/components/orders/OrderTimeline";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  ORDER_STATUS_LABELS, ORDER_STATUS_COLORS,
  PAYMENT_METHOD_LABELS, PAYMENT_STATUS_LABELS,
} from "@/lib/constants/site";
import type { Order } from "@/lib/types/order";

interface CustomerOrderDetailViewProps {
  order: Order;
  success?: string;
}

export default function CustomerOrderDetailView({ order, success }: CustomerOrderDetailViewProps) {
  const { user, profile, loading } = useAuth();

  // Security check: Customer can only view their own orders (unless admin or guest order)
  const isOwner = user && order.userId && user.uid === order.userId;
  const isAdmin = profile?.role === "admin";
  const isGuestOrder = !order.userId || order.userId === "guest";

  if (!loading && user && !isOwner && !isAdmin && !isGuestOrder) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md text-center">
        <Card className="p-8 space-y-4">
          <ShieldAlert className="h-12 w-12 text-destructive mx-auto" />
          <h2 className="text-xl font-bold">Unauthorized Access</h2>
          <p className="text-sm text-muted-foreground">
            You do not have permission to view this order. You can only view orders placed by your account.
          </p>
          <Button asChild className="w-full">
            <Link href="/orders">View My Orders</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Success banner */}
      {success === "true" && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="font-bold text-green-800">Order Placed Successfully!</p>
            <p className="text-sm text-green-700">
              Thank you for shopping with NexShop. We'll notify you as your order progresses.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Placed on {formatDateTime(order.createdAt)}
          </p>
        </div>
        <Badge className={ORDER_STATUS_COLORS[order.status]}>
          {ORDER_STATUS_LABELS[order.status]}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" /> Order Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OrderTimeline order={order} />
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order Items ({order.items.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <Link href={`/products/${item.productSlug}`} className="flex-shrink-0">
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted border">
                      <Image
                        src={item.productImage || "/images/placeholder.jpg"}
                        alt={item.productName}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.productSlug}`}>
                      <p className="text-sm font-medium line-clamp-1 hover:text-primary transition-colors">
                        {item.productName}
                      </p>
                    </Link>
                    {item.variant && Object.keys(item.variant).length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {Object.entries(item.variant).map(([k, v]) => `${k}: ${v}`).join(", ")}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatCurrency(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold flex-shrink-0">
                    {formatCurrency(item.subtotal)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Shipping address */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium">{order.shippingAddress.fullName}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <Phone className="h-3 w-3" /> {order.shippingAddress.phone}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {order.shippingAddress.streetAddress}, Ward {order.shippingAddress.ward},{" "}
                {order.shippingAddress.municipality}, {order.shippingAddress.district},{" "}
                {order.shippingAddress.province}
              </p>
              {order.shippingAddress.landmark && (
                <p className="text-xs text-muted-foreground mt-1">
                  Landmark: {order.shippingAddress.landmark}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Payment summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" /> Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Method</span>
                <span className="font-medium">{PAYMENT_METHOD_LABELS[order.paymentMethod]}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge
                  variant={order.paymentStatus === "paid" ? "success" : order.paymentStatus === "failed" ? "destructive" : "outline"}
                  className="text-xs"
                >
                  {PAYMENT_STATUS_LABELS[order.paymentStatus]}
                </Badge>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{order.shippingCharge === 0 ? "FREE" : formatCurrency(order.shippingCharge)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount {order.couponCode && `(${order.couponCode})`}</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(order.total)}</span>
              </div>
            </CardContent>
          </Card>

          <Button variant="outline" className="w-full" asChild>
            <Link href="/orders">View All Orders</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
