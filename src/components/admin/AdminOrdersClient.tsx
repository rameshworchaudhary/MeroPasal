"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/admin/DataTable";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, PAYMENT_METHOD_LABELS } from "@/lib/constants/site";
import type { Order, OrderStatus } from "@/lib/types/order";

interface AdminOrdersClientProps {
  initialOrders: Order[];
  initialStatusFilter?: string;
}

export default function AdminOrdersClient({ initialOrders, initialStatusFilter }: AdminOrdersClientProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter || "all");

  const filtered = useMemo(() => {
    let result = initialOrders;
    if (statusFilter !== "all") {
      result = result.filter((o) => o.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.userName.toLowerCase().includes(q) ||
          o.userEmail.toLowerCase().includes(q)
      );
    }
    return result;
  }, [initialOrders, search, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">{initialOrders.length} total orders</p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.entries(ORDER_STATUS_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={filtered}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by order number, customer name or email..."
        rowKey={(o) => o.id}
        pageSize={15}
        columns={[
          {
            header: "Order",
            accessor: (o) => (
              <div>
                <p className="font-medium">#{o.orderNumber}</p>
                <p className="text-xs text-muted-foreground">{formatDate(o.createdAt)}</p>
              </div>
            ),
          },
          {
            header: "Customer",
            accessor: (o) => (
              <div>
                <p className="font-medium">{o.userName}</p>
                <p className="text-xs text-muted-foreground">{o.userEmail}</p>
              </div>
            ),
          },
          { header: "Items", accessor: (o) => `${o.items.length} items` },
          { header: "Total", accessor: (o) => <span className="font-semibold">{formatCurrency(o.total)}</span> },
          { header: "Payment", accessor: (o) => PAYMENT_METHOD_LABELS[o.paymentMethod] },
          {
            header: "Status",
            accessor: (o) => (
              <Badge className={ORDER_STATUS_COLORS[o.status] + " text-xs"}>
                {ORDER_STATUS_LABELS[o.status]}
              </Badge>
            ),
          },
          {
            header: "",
            accessor: (o) => (
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <Link href={`/admin/orders/${o.id}`}><Eye className="h-4 w-4" /></Link>
              </Button>
            ),
          },
        ]}
      />
    </div>
  );
}
