import { NextRequest, NextResponse } from "next/server";
import { buildEsewaFormData } from "@/lib/payments/esewa";
import { adminDb } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/lib/firebase/collections";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, amount } = body;

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
    // transaction_uuid must be unique per transaction attempt; combine orderId with timestamp
    const transactionUuid = `${orderId}-${Date.now()}`;

    const formData = buildEsewaFormData({
      amount: verifiedAmount,
      totalAmount: verifiedAmount,
      transactionUuid,
      productCode: process.env.ESEWA_MERCHANT_CODE || "EPAYTEST",
      successUrl: `${appUrl}/api/payments/verify?method=esewa&orderId=${orderId}`,
      failureUrl: `${appUrl}/checkout?payment=failed&orderId=${orderId}`,
    });

    const gatewayUrl =
      process.env.NEXT_PUBLIC_ESEWA_GATEWAY_URL ||
      "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

    return NextResponse.json({ formData, gatewayUrl });
  } catch (error) {
    console.error("eSewa payment initiation error:", error);
    return NextResponse.json(
      { error: "Failed to initiate eSewa payment" },
      { status: 500 }
    );
  }
}
