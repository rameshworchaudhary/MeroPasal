import { NextRequest, NextResponse } from "next/server";
import { initiateKhaltiPayment } from "@/lib/payments/khalti";
import { adminDb } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/lib/firebase/collections";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, amount, orderNumber, customerName, customerEmail, customerPhone } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Invalid orderId" },
        { status: 400 }
      );
    }

    let verifiedAmount = amount;

    // Securely retrieve and verify order total from Firestore
    try {
      const orderRef = adminDb.collection(COLLECTIONS.ORDERS).doc(orderId);
      const orderSnap = await orderRef.get();
      if (orderSnap.exists) {
        const orderData = orderSnap.data();
        if (typeof orderData?.total === "number" && orderData.total > 0) {
          verifiedAmount = orderData.total;
        }
      }
    } catch (dbErr) {
      console.warn("Could not fetch order from adminDb, using provided amount:", dbErr);
    }

    if (!verifiedAmount || verifiedAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid payment amount" },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const result = await initiateKhaltiPayment({
      amount: verifiedAmount,
      orderId,
      orderName: orderNumber || `NexShop Order ${orderId}`,
      customerName,
      customerEmail,
      customerPhone,
      returnUrl: `${appUrl}/api/payments/verify?method=khalti&orderId=${orderId}`,
      websiteUrl: appUrl,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Khalti payment initiation error:", error);
    return NextResponse.json(
      { error: "Failed to initiate Khalti payment" },
      { status: 500 }
    );
  }
}
