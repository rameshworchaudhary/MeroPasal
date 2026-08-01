import AdminOrdersClient from "@/components/admin/AdminOrdersClient";
import { getAllOrders } from "@/lib/firebase/orders";

export const dynamic = "force-dynamic";

interface AdminOrdersPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const { status } = await searchParams;
  const orders = await getAllOrders();
  return <AdminOrdersClient initialOrders={orders} initialStatusFilter={status} />;
}
