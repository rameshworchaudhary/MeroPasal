import AdminProductsClient from "@/components/admin/AdminProductsClient";
import { getAllProductsForAdmin } from "@/lib/firebase/products";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getAllProductsForAdmin();
  return <AdminProductsClient initialProducts={products} />;
}
