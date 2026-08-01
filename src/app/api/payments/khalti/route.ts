import { NextRequest, NextResponse } from "next/server";
import { initiateKhaltiPayment } from "@/lib/payments/khalti";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, amount, orderNumber, customerName, customerEmail, customerPhone } = body;

    if (!orderId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid orderId or amount" },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const result = await initiateKhaltiPayment({
      amount,
      orderId,
      orderName: orderNumber || `Kinyo Order ${orderId}`,
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
