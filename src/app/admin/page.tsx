import Link from "next/link";
import {
  DollarSign, ShoppingCart, Users, Package, AlertTriangle,
  ArrowRight, Star, Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/admin/StatCard";
import RevenueChart from "@/components/admin/RevenueChart";
import SalesChart from "@/components/admin/SalesChart";
import CategoryPieChart from "@/components/admin/CategoryPieChart";
import { getAllOrders, getRecentOrders } from "@/lib/firebase/orders";
import { getAllProductsForAdmin, getLowStockProducts } from "@/lib/firebase/products";
import { getAllCustomers } from "@/lib/firebase/users";
import {
  calculateTotalRevenue, getDailySalesData, getCategorySalesBreakdown,
  calculatePercentageChange,
} from "@/lib/admin-analytics";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants/site";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [orders, products, customers, lowStock, recentOrders] = await Promise.all([
    getAllOrders(),
    getAllProductsForAdmin(),
    getAllCustomers(),
    getLowStockProducts(),
    getRecentOrders(5),
  ]);

  const totalRevenue = calculateTotalRevenue(orders);

  // This month vs last month comparison
  const now = new Date();
  const thisMonthOrders = orders.filter((o) => {
    const d = new Date(o.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthOrders = orders.filter((o) => {
    const d = new Date(o.createdAt);
    return d.getMonth() === lastMonthDate.getMonth() && d.getFullYear() === lastMonthDate.getFullYear();
  });

  const thisMonthRevenue = calculateTotalRevenue(thisMonthOrders);
  const lastMonthRevenue = calculateTotalRevenue(lastMonthOrders);
  const revenueTrend = calculatePercentageChange(thisMonthRevenue, lastMonthRevenue);
  const ordersTrend = calculatePercentageChange(thisMonthOrders.length, lastMonthOrders.length);

  const dailySales = getDailySalesData(orders, 14);
  const categoryBreakdown = getCategorySalesBreakdown(products);

  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          trend={{ value: revenueTrend, isPositive: revenueTrend >= 0 }}
          iconColor="text-green-600"
          iconBg="bg-green-100"
        />
        <StatCard
          title="Total Orders"
          value={String(orders.length)}
          icon={ShoppingCart}
          trend={{ value: ordersTrend, isPositive: ordersTrend >= 0 }}
          iconColor="text-blue-600"
          iconBg="bg-blue-100"
        />
        <StatCard
          title="Total Customers"
          value={String(customers.length)}
          icon={Users}
          iconColor="text-purple-600"
          iconBg="bg-purple-100"
        />
        <StatCard
          title="Total Products"
          value={String(products.length)}
          icon={Package}
          iconColor="text-orange-600"
          iconBg="bg-orange-100"
        />
      </div>

      {/* Alert bar */}
      {(pendingOrders > 0 || lowStock.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pendingOrders > 0 && (
            <Link href="/admin/orders?status=pending">
              <Card className="border-yellow-200 bg-yellow-50 hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center gap-3">
                  <Clock className="h-8 w-8 text-yellow-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-yellow-800">{pendingOrders} Pending Orders</p>
                    <p className="text-xs text-yellow-700">Require your attention</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-yellow-600" />
                </CardContent>
              </Card>
            </Link>
          )}
          {lowStock.length > 0 && (
            <Link href="/admin/products?filter=low-stock">
              <Card className="border-red-200 bg-red-50 hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-red-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-red-800">{lowStock.length} Low Stock Products</p>
                    <p className="text-xs text-red-700">Restock needed soon</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-red-600" />
                </CardContent>
              </Card>
            </Link>
          )}
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Revenue Overview (Last 14 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart data={dailySales} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryPieChart data={categoryBreakdown} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Order Volume (Last 14 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesChart data={dailySales} />
        </CardContent>
      </Card>

      {/* Recent orders + low stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/orders">View All <ArrowRight className="h-3.5 w-3.5 ml-1" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No orders yet</p>
            ) : (
              recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium">#{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">{order.userName} • {formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{formatCurrency(order.total)}</span>
                    <Badge className={ORDER_STATUS_COLORS[order.status] + " text-xs"}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </Badge>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" /> Low Stock Alerts
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/products">View All <ArrowRight className="h-3.5 w-3.5 ml-1" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowStock.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">All products well stocked ✓</p>
            ) : (
              lowStock.slice(0, 5).map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                    <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                  </div>
                  <Badge variant={product.stock === 0 ? "destructive" : "warning"} className="text-xs flex-shrink-0">
                    {product.stock === 0 ? "Out of Stock" : `${product.stock} left`}
                  </Badge>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
