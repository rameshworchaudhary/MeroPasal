import { notFound } from "next/navigation";
import AdminOrderDetailClient from "@/components/admin/AdminOrderDetailClient";
import { getOrderById } from "@/lib/firebase/orders";

export const dynamic = "force-dynamic";

interface AdminOrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();
  return <AdminOrderDetailClient order={order} />;
}
