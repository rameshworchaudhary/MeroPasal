import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import FloatingActions from "@/components/layout/FloatingActions";
import { getActiveCategories } from "@/lib/firebase/categories";

export const dynamic = "force-dynamic";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getActiveCategories();

  return (
    <div className="flex flex-col min-h-screen relative pb-14 md:pb-0">
      <Navbar categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <MobileBottomNav />
      <FloatingActions />
    </div>
  );
}
