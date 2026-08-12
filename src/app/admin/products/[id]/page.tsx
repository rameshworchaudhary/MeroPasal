import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import ProductForm from "@/components/admin/ProductForm";
import { getAllCategories } from "@/lib/firebase/categories";
import { getProductById } from "@/lib/firebase/products";

export const dynamic = "force-dynamic";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [categories, product] = await Promise.all([
    getAllCategories(),
    getProductById(id),
  ]);

  if (!product) notFound();

  const serializedCategories = JSON.parse(JSON.stringify(categories));
  const serializedProduct = JSON.parse(JSON.stringify(product));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Edit Product</h1>
          <p className="text-sm text-muted-foreground">{product.name}</p>
        </div>
      </div>

      <ProductForm categories={serializedCategories} initialData={serializedProduct} />
    </div>
  );
}
