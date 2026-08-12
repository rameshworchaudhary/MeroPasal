import AdminProductsClient from "@/components/admin/AdminProductsClient";
import { getAllProductsForAdmin } from "@/lib/firebase/products";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getAllProductsForAdmin();
  const serializedProducts = JSON.parse(JSON.stringify(products));
  return <AdminProductsClient initialProducts={serializedProducts} />;
}
