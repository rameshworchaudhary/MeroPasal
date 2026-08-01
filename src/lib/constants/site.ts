export const SITE_CONFIG = {
  name: "Kinbey",
  tagline: "Sabai kura, ekai thau ma",
  description:
    "Kinbey is Nepal's premier online marketplace — shop electronics, fashion, groceries, home essentials and more with fast delivery across all 77 districts.",
  url: "https://kinbey.com.np",
  ogImage: "/images/og-image.jpg",
  links: {
    facebook: "https://facebook.com/kinbey.np",
    instagram: "https://instagram.com/kinbey.np",
    tiktok: "https://tiktok.com/@kinbey.np",
  },
  contact: {
    email: "support@kinbey.com.np",
    phone: "+977 9742491352",
    address: "Kathmandu & Pokhara, Nepal",
  },
};

export const CURRENCY = { code: "NPR", symbol: "Rs." };

export const PAGINATION = {
  productsPerPage: 20,
  ordersPerPage: 10,
  reviewsPerPage: 5,
};

export const FREE_SHIPPING_THRESHOLD = 5000;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  "out-for-delivery": "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-indigo-100 text-indigo-800",
  shipped: "bg-purple-100 text-purple-800",
  "out-for-delivery": "bg-orange-100 text-orange-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  returned: "bg-gray-100 text-gray-800",
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  esewa: "eSewa",
  khalti: "Khalti",
  cod: "Cash on Delivery",
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  paid: "Paid",
  failed: "Failed",
  refunded: "Refunded",
};
