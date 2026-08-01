import AdminBannersClient from "@/components/admin/AdminBannersClient";
import { getAllBanners } from "@/lib/firebase/banners";

export const dynamic = "force-dynamic";

export default async function AdminBannersPage() {
  const banners = await getAllBanners();
  return <AdminBannersClient initialBanners={banners} />;
}
