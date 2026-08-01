"use client";

import React, { useState } from "react";
import { Search, Package, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import OrderTimeline from "@/components/orders/OrderTimeline";
import { getOrderByOrderNumber } from "@/lib/firebase/orders";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants/site";
import type { Order } from "@/lib/types/order";
import { toast } from "sonner";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const result = await getOrderByOrderNumber(orderNumber.trim().toUpperCase());
      setOrder(result);
      if (!result) toast.error("Order not found. Please check your order number.");
    } catch {
      toast.error("Failed to search for order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Package className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Track Your Order</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Enter your order number to check the delivery status
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <Input
          placeholder="e.g. MP-XXXXXX-XXXXX"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          className="uppercase"
        />
        <Button type="submit" disabled={loading || !orderNumber.trim()}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </form>

      {searched && !loading && !order && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="font-medium">No order found</p>
          <p className="text-sm mt-1">Please double-check your order number and try again.</p>
        </div>
      )}

      {order && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Order #{order.orderNumber}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>
              <Badge className={ORDER_STATUS_COLORS[order.status]}>
                {ORDER_STATUS_LABELS[order.status]}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <OrderTimeline order={order} />
            <div className="border-t pt-4 mt-2 flex justify-between font-semibold">
              <span>Total Amount</span>
              <span className="text-primary">{formatCurrency(order.total)}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
