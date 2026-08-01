import { DollarSign, ShoppingBag, TrendingUp, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/admin/StatCard";
import RevenueChart from "@/components/admin/RevenueChart";
import CategoryPieChart from "@/components/admin/CategoryPieChart";
import { getAllOrders } from "@/lib/firebase/orders";
import { getAllProductsForAdmin } from "@/lib/firebase/products";
import {
  calculateTotalRevenue, getMonthlySalesData, getCategorySalesBreakdown,
  getTopSellingProducts,
} from "@/lib/admin-analytics";
import { formatCurrency, formatNumber } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const [orders, products] = await Promise.all([
    getAllOrders(),
    getAllProductsForAdmin(),
  ]);

  const totalRevenue = calculateTotalRevenue(orders);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const totalUnitsSold = products.reduce((sum, p) => sum + p.soldCount, 0);
  const monthlySales = getMonthlySalesData(orders, 6);
  const categoryBreakdown = getCategorySalesBreakdown(products);
  const topProducts = getTopSellingProducts(products, 8);

  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
  const conversionRate = orders.length > 0 ? Math.round((deliveredOrders / orders.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Detailed insights into your store's performance
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} icon={DollarSign} iconColor="text-green-600" iconBg="bg-green-100" />
        <StatCard title="Avg. Order Value" value={formatCurrency(Math.round(avgOrderValue))} icon={ShoppingBag} iconColor="text-blue-600" iconBg="bg-blue-100" />
        <StatCard title="Units Sold" value={formatNumber(totalUnitsSold)} icon={TrendingUp} iconColor="text-purple-600" iconBg="bg-purple-100" />
        <StatCard title="Delivery Success Rate" value={`${conversionRate}%`} icon={Award} iconColor="text-orange-600" iconBg="bg-orange-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Revenue Trend (Last 6 Months)</CardTitle></CardHeader>
          <CardContent><RevenueChart data={monthlySales} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Revenue by Category</CardTitle></CardHeader>
          <CardContent><CategoryPieChart data={categoryBreakdown} /></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Top Selling Products</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No sales data yet</p>
            ) : (
              topProducts.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}`}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <span className="text-lg font-bold text-muted-foreground w-6 text-center">{index + 1}</span>
                  <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted border flex-shrink-0">
                    <Image src={product.thumbnailImage || "/images/placeholder.jpg"} alt={product.name} fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.categoryName}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold">{formatNumber(product.soldCount)} sold</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(product.price * product.soldCount)}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
