interface KhaltiInitiateParams {
  amount: number; // in NPR (will be converted to paisa)
  orderId: string;
  orderName: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  returnUrl: string;
  websiteUrl: string;
}

interface KhaltiInitiateResponse {
  pidx: string;
  payment_url: string;
  expires_at: string;
  expires_in: number;
}

interface KhaltiLookupResponse {
  pidx: string;
  total_amount: number;
  status: "Completed" | "Pending" | "Expired" | "User canceled" | "Refunded" | "Partially Refunded";
  transaction_id: string | null;
  fee: number;
  refunded_amount: number;
}

/**
 * Initiate a Khalti payment session via Khalti's Web Checkout (e-Payment) API.
 * Khalti amounts are denominated in paisa (1 NPR = 100 paisa).
 */
export async function initiateKhaltiPayment(
  params: KhaltiInitiateParams
): Promise<KhaltiInitiateResponse> {
  const secretKey = process.env.KHALTI_SECRET_KEY;
  const gatewayUrl = process.env.KHALTI_GATEWAY_URL || "https://a.khalti.com/api/v2";

  if (!secretKey) {
    throw new Error("KHALTI_SECRET_KEY is not configured in environment variables");
  }

  const payload = {
    return_url: params.returnUrl,
    website_url: params.websiteUrl,
    amount: Math.round(params.amount * 100), // convert NPR to paisa
    purchase_order_id: params.orderId,
    purchase_order_name: params.orderName,
    customer_info: {
      name: params.customerName || "Kinyo Customer",
      email: params.customerEmail || "customer@Kinyo.com.np",
      phone: params.customerPhone || "9800000000",
    },
  };

  const response = await fetch(`${gatewayUrl}/epayment/initiate/`, {
    method: "POST",
    headers: {
      Authorization: `Key ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Khalti payment initiation failed: ${errorBody}`);
  }

  return response.json();
}

/**
 * Verify (lookup) the status of a Khalti payment by its pidx.
 * This should always be called server-side after the redirect to confirm
 * the payment actually succeeded before marking an order as paid.
 */
export async function lookupKhaltiPayment(pidx: string): Promise<KhaltiLookupResponse> {
  const secretKey = process.env.KHALTI_SECRET_KEY;
  const gatewayUrl = process.env.KHALTI_GATEWAY_URL || "https://a.khalti.com/api/v2";

  if (!secretKey) {
    throw new Error("KHALTI_SECRET_KEY is not configured in environment variables");
  }

  const response = await fetch(`${gatewayUrl}/epayment/lookup/`, {
    method: "POST",
    headers: {
      Authorization: `Key ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pidx }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Khalti payment lookup failed: ${errorBody}`);
  }

  return response.json();
}
