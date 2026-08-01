import AdminCouponsClient from "@/components/admin/AdminCouponsClient";
import { getAllCoupons } from "@/lib/firebase/coupons";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const coupons = await getAllCoupons();
  return <AdminCouponsClient initialCoupons={coupons} />;
}
