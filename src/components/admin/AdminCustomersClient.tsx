"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/admin/DataTable";
import { toggleCustomerActiveStatus } from "@/lib/firebase/users";
import { formatDate, getInitials } from "@/lib/utils";
import type { UserProfile } from "@/lib/types/user";
import { toast } from "sonner";

interface AdminCustomersClientProps {
  initialCustomers: UserProfile[];
}

export default function AdminCustomersClient({ initialCustomers }: AdminCustomersClientProps) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? customers.filter(
        (c) =>
          c.displayName.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase())
      )
    : customers;

  const handleToggleStatus = async (customer: UserProfile) => {
    try {
      await toggleCustomerActiveStatus(customer.uid, !customer.isActive);
      setCustomers((prev) =>
        prev.map((c) => (c.uid === customer.uid ? { ...c, isActive: !c.isActive } : c))
      );
      toast.success(customer.isActive ? "Customer blocked" : "Customer unblocked");
    } catch {
      toast.error("Failed to update customer status");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="text-sm text-muted-foreground mt-1">{customers.length} registered customers</p>
      </div>

      <DataTable
        data={filtered}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name or email..."
        rowKey={(c) => c.uid}
        pageSize={15}
        columns={[
          {
            header: "Customer",
            accessor: (c) => (
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={c.photoURL} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {getInitials(c.displayName)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-medium text-sm">{c.displayName}</p>
                  <p className="text-xs text-muted-foreground">{c.email}</p>
                </div>
              </div>
            ),
          },
          { header: "Phone", accessor: (c) => c.phone || "—" },
          { header: "Addresses", accessor: (c) => c.addresses?.length || 0 },
          { header: "Wishlist", accessor: (c) => c.wishlist?.length || 0 },
          { header: "Joined", accessor: (c) => formatDate(c.createdAt) },
          {
            header: "Status",
            accessor: (c) => (
              <Badge variant={c.isActive ? "success" : "destructive"}>
                {c.isActive ? "Active" : "Blocked"}
              </Badge>
            ),
          },
          {
            header: "Actions",
            accessor: (c) => (
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                onClick={() => handleToggleStatus(c)}
              >
                {c.isActive ? "Block" : "Unblock"}
              </Button>
            ),
          },
        ]}
      />
    </div>
  );
}
