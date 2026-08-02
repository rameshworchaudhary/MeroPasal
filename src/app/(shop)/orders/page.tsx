"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, ChevronRight, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { getOrdersByUser } from "@/lib/firebase/orders";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants/site";
import type { Order } from "@/lib/types/order";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (user) {
      getOrdersByUser(user.uid)
        .then(setOrders)
        .catch((err) => {
          console.error("Failed to load orders:", err);
          toast.error("Couldn't load your orders. Please try again.");
        })
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Package className="h-6 w-6 text-primary" /> My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <p className="font-semibold text-lg">No orders yet</p>
          <p className="text-sm text-muted-foreground mt-1 mb-6">
            Start shopping to see your orders here
          </p>
          <Button asChild>
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} href={`/orders/${order.id}`}>
              <Card className="hover:border-primary hover:shadow-md transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-semibold text-sm">Order #{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <Badge className={ORDER_STATUS_COLORS[order.status]}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </Badge>
                  </div>

                  {/* Item thumbnails */}
                  <div className="flex items-center gap-2 mb-3">
                    {order.items.slice(0, 4).map((item, i) => (
                      <div key={i} className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted border flex-shrink-0">
                        <Image
                          src={item.productImage || "/images/placeholder.jpg"}
                          alt={item.productName}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground flex-shrink-0">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {order.items.length} {order.items.length === 1 ? "item" : "items"}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary">{formatCurrency(order.total)}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}