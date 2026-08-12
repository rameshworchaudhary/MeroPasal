import AdminOrdersClient from "@/components/admin/AdminOrdersClient";
import { getAllOrders } from "@/lib/firebase/orders";

export const dynamic = "force-dynamic";

interface AdminOrdersPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const { status } = await searchParams;
  const orders = await getAllOrders();
  const serializedOrders = JSON.parse(JSON.stringify(orders));
  return <AdminOrdersClient initialOrders={serializedOrders} initialStatusFilter={status} />;
}
