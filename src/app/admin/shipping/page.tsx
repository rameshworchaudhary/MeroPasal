import AdminShippingClient from "@/components/admin/AdminShippingClient";
import { getAllShippingZones } from "@/lib/firebase/shipping";

export const dynamic = "force-dynamic";

export default async function AdminShippingPage() {
  const zones = await getAllShippingZones();
  const serializedZones = JSON.parse(JSON.stringify(zones));
  return <AdminShippingClient initialZones={serializedZones} />;
}
