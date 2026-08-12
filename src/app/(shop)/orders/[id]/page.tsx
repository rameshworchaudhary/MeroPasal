import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/firebase/orders";
import CustomerOrderDetailView from "@/components/orders/CustomerOrderDetailView";

export const metadata: Metadata = { title: "Order Details" };
export const dynamic = "force-dynamic";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string }>;
}

export default async function OrderDetailPage({ params, searchParams }: OrderDetailPageProps) {
  const { id } = await params;
  const { success } = await searchParams;

  const order = await getOrderById(id);
  if (!order) notFound();

  const serializedOrder = JSON.parse(JSON.stringify(order));

  return <CustomerOrderDetailView order={serializedOrder} success={success} />;
}
