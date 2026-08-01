import type { Order } from "@/lib/types/order";
import type { Product } from "@/lib/types/product";

export interface DailySales {
  date: string;
  revenue: number;
  orders: number;
}

export interface CategorySales {
  name: string;
  value: number;
}

/**
 * Compute total revenue from a list of paid orders.
 */
export function calculateTotalRevenue(orders: Order[]): number {
  return orders
    .filter((o) => o.paymentStatus === "paid" || o.paymentMethod === "cod")
    .reduce((sum, o) => sum + o.total, 0);
}

/**
 * Compute revenue for the last N days, grouped by date, for charting.
 */
export function getDailySalesData(orders: Order[], days = 30): DailySales[] {
  const now = new Date();
  const result: DailySales[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const dayOrders = orders.filter((o) => {
      const orderDate = new Date(o.createdAt).toISOString().split("T")[0];
      return orderDate === dateStr;
    });

    result.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      revenue: dayOrders.reduce((sum, o) => sum + o.total, 0),
      orders: dayOrders.length,
    });
  }

  return result;
}

/**
 * Compute revenue grouped by month for the last N months.
 */
export function getMonthlySalesData(orders: Order[], months = 6): DailySales[] {
  const now = new Date();
  const result: DailySales[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthLabel = date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });

    const monthOrders = orders.filter((o) => {
      const orderDate = new Date(o.createdAt);
      return orderDate.getMonth() === date.getMonth() && orderDate.getFullYear() === date.getFullYear();
    });

    result.push({
      date: monthLabel,
      revenue: monthOrders.reduce((sum, o) => sum + o.total, 0),
      orders: monthOrders.length,
    });
  }

  return result;
}

/**
 * Group products by category and compute total sold count per category.
 */
export function getCategorySalesBreakdown(products: Product[]): CategorySales[] {
  const map = new Map<string, number>();

  for (const product of products) {
    const current = map.get(product.categoryName) || 0;
    map.set(product.categoryName, current + product.soldCount);
  }

  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
}

/**
 * Get top-selling products by soldCount.
 */
export function getTopSellingProducts(products: Product[], count = 5): Product[] {
  return [...products].sort((a, b) => b.soldCount - a.soldCount).slice(0, count);
}

/**
 * Calculate order status distribution for a pie/donut chart.
 */
export function getOrderStatusBreakdown(orders: Order[]): CategorySales[] {
  const map = new Map<string, number>();
  for (const order of orders) {
    map.set(order.status, (map.get(order.status) || 0) + 1);
  }
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}

/**
 * Calculate percentage change between two numeric values.
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}
