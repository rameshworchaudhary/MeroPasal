"use client";

import React from "react";
import { CheckCircle, Circle, Package, Truck, Home, XCircle, Clock } from "lucide-react";
import { cn, formatDateTime } from "@/lib/utils";
import type { Order, OrderStatus } from "@/lib/types/order";

interface OrderTimelineProps {
  order: Order;
}

const STATUS_FLOW: { status: OrderStatus; label: string; icon: typeof Package }[] = [
  { status: "pending", label: "Order Placed", icon: Clock },
  { status: "confirmed", label: "Confirmed", icon: CheckCircle },
  { status: "processing", label: "Processing", icon: Package },
  { status: "shipped", label: "Shipped", icon: Truck },
  { status: "out-for-delivery", label: "Out for Delivery", icon: Truck },
  { status: "delivered", label: "Delivered", icon: Home },
];

export default function OrderTimeline({ order }: OrderTimelineProps) {
  if (order.status === "cancelled" || order.status === "returned") {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
        <XCircle className="h-8 w-8 text-red-500 flex-shrink-0" />
        <div>
          <p className="font-semibold text-red-700">
            Order {order.status === "cancelled" ? "Cancelled" : "Returned"}
          </p>
          <p className="text-sm text-red-600">
            {order.statusHistory[order.statusHistory.length - 1]?.note || ""}
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = STATUS_FLOW.findIndex((s) => s.status === order.status);

  return (
    <div className="space-y-0">
      {STATUS_FLOW.map((step, index) => {
        const isComplete = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const historyEntry = order.statusHistory.find((h) => h.status === step.status);
        const Icon = step.icon;

        return (
          <div key={step.status} className="flex gap-4">
            {/* Icon + line */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                  isComplete ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              {index < STATUS_FLOW.length - 1 && (
                <div
                  className={cn(
                    "w-0.5 flex-1 min-h-[2.5rem]",
                    index < currentIndex ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>

            {/* Content */}
            <div className="pb-8">
              <p className={cn("font-semibold text-sm", isCurrent && "text-primary")}>
                {step.label}
              </p>
              {historyEntry && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatDateTime(historyEntry.timestamp)}
                </p>
              )}
              {historyEntry?.note && (
                <p className="text-xs text-muted-foreground mt-0.5">{historyEntry.note}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
