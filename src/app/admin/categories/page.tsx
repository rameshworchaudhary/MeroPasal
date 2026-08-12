import AdminCategoriesClient from "@/components/admin/AdminCategoriesClient";
import { getAllCategories } from "@/lib/firebase/categories";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();
  const serializedCategories = JSON.parse(JSON.stringify(categories));
  return <AdminCategoriesClient initialCategories={serializedCategories} />;
}
