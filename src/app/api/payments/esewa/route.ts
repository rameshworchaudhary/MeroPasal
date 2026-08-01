import { NextRequest, NextResponse } from "next/server";
import { buildEsewaFormData } from "@/lib/payments/esewa";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, amount } = body;

    if (!orderId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid orderId or amount" },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    // transaction_uuid must be unique per transaction attempt; combine orderId with timestamp
    const transactionUuid = `${orderId}-${Date.now()}`;

    const formData = buildEsewaFormData({
      amount,
      totalAmount: amount,
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
