/**
 * NexShop Database Seed Script
 *
 * Populates Firestore with initial data so the store isn't empty on first run:
 * - Sample categories with subcategories
 * - Nepal shipping zones (Kathmandu Valley, Major Cities, Rest of Nepal)
 * - A welcome coupon (WELCOME10)
 *
 * USAGE:
 *   1. Make sure .env.local has your Firebase Admin credentials set
 *   2. Run: npx tsx scripts/seed.ts
 *
 * NOTE: This uses the Firebase Admin SDK, so it bypasses Firestore security
 * rules and requires FIREBASE_ADMIN_* env vars to be configured.
 */

import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

function getAdminApp() {
  if (getApps().length > 0) return getApp();

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    console.error(
      "❌ Missing Firebase Admin credentials in .env.local. Please set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL and FIREBASE_ADMIN_PRIVATE_KEY."
    );
    process.exit(1);
  }

  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

const app = getAdminApp();
const db = getFirestore(app);

const CATEGORIES = [
  {
    name: "Electronics",
    slug: "electronics",
    description: "Smartphones, laptops, gadgets and accessories",
    icon: "📱",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80",
    isActive: true,
    displayOrder: 1,
    subCategories: [
      { id: "sub_phones", name: "Smartphones", slug: "smartphones" },
      { id: "sub_laptops", name: "Laptops", slug: "laptops" },
      { id: "sub_accessories", name: "Accessories", slug: "accessories" },
    ],
  },
  {
    name: "Fashion",
    slug: "fashion",
    description: "Clothing, footwear and accessories for everyone",
    icon: "👗",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80",
    isActive: true,
    displayOrder: 2,
    subCategories: [
      { id: "sub_mens", name: "Men's Fashion", slug: "mens-fashion" },
      { id: "sub_womens", name: "Women's Fashion", slug: "womens-fashion" },
      { id: "sub_footwear", name: "Footwear", slug: "footwear" },
    ],
  },
  {
    name: "Home & Kitchen",
    slug: "home-kitchen",
    description: "Everything for your home and kitchen",
    icon: "🏠",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
    isActive: true,
    displayOrder: 3,
    subCategories: [
      { id: "sub_furniture", name: "Furniture", slug: "furniture" },
      { id: "sub_kitchenware", name: "Kitchenware", slug: "kitchenware" },
    ],
  },
  {
    name: "Grocery",
    slug: "grocery",
    description: "Daily essentials and groceries",
    icon: "🛒",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80",
    isActive: true,
    displayOrder: 4,
    subCategories: [],
  },
  {
    name: "Beauty & Personal Care",
    slug: "beauty-personal-care",
    description: "Skincare, makeup, and personal care products",
    icon: "💄",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80",
    isActive: true,
    displayOrder: 5,
    subCategories: [],
  },
  {
    name: "Sports & Outdoors",
    slug: "sports-outdoors",
    description: "Sports gear and outdoor equipment",
    icon: "⚽",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80",
    isActive: true,
    displayOrder: 6,
    subCategories: [],
  },
];

const SHIPPING_ZONES = [
  {
    name: "Inside Kathmandu Valley",
    districts: ["Kathmandu", "Lalitpur", "Bhaktapur"],
    charge: 100,
    freeShippingThreshold: 5000,
    estimatedDays: "1-2 days",
    isActive: true,
  },
  {
    name: "Major Cities",
    districts: [
      "Pokhara", "Chitwan", "Morang", "Sunsari", "Rupandehi",
      "Kaski", "Jhapa", "Kailali", "Banke", "Parsa",
    ],
    charge: 150,
    freeShippingThreshold: 5000,
    estimatedDays: "2-4 days",
    isActive: true,
  },
  {
    name: "Rest of Nepal",
    districts: [], // fallback zone, matched when no other zone applies
    charge: 200,
    freeShippingThreshold: 8000,
    estimatedDays: "4-7 days",
    isActive: true,
  },
];

async function seed() {
  console.log("🌱 Starting NexShop database seed...\n");

  // Seed categories
  console.log("📁 Seeding categories...");
  const categoryIds: Record<string, string> = {};
  for (const cat of CATEGORIES) {
    const ref = await db.collection("categories").add({
      ...cat,
      productCount: 0,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    categoryIds[cat.slug] = ref.id;
    console.log(`  ✓ Created category: ${cat.name} (${ref.id})`);
  }

  // Seed shipping zones
  console.log("\n🚚 Seeding shipping zones...");
  for (const zone of SHIPPING_ZONES) {
    const ref = await db.collection("shippingZones").add({
      ...zone,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    console.log(`  ✓ Created shipping zone: ${zone.name} (${ref.id})`);
  }

  // Seed welcome coupon
  console.log("\n🎟️  Seeding welcome coupon...");
  const couponRef = await db.collection("coupons").add({
    code: "WELCOME10",
    description: "10% off for new customers",
    type: "percentage",
    value: 10,
    minOrderValue: 1000,
    maxDiscountAmount: 500,
    usageLimit: 0,
    usedCount: 0,
    perUserLimit: 1,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  console.log(`  ✓ Created coupon: WELCOME10 (${couponRef.id})`);

  console.log("\n✅ Seed complete!");
  console.log("\n📌 Next steps:");
  console.log("  1. Register a user account at /register");
  console.log("  2. Go to Firebase Console > Firestore > users collection");
  console.log("  3. Find your user document and change 'role' field from 'customer' to 'admin'");
  console.log("  4. Login again and visit /admin to access the admin panel");
  console.log("  5. Add products through the admin panel under each category created above\n");

  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
