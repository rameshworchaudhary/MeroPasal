import crypto from "crypto";

interface EsewaPaymentParams {
  amount: number;
  taxAmount?: number;
  totalAmount: number;
  transactionUuid: string;
  productCode: string;
  successUrl: string;
  failureUrl: string;
}

interface EsewaFormData {
  amount: string;
  tax_amount: string;
  total_amount: string;
  transaction_uuid: string;
  product_code: string;
  product_service_charge: string;
  product_delivery_charge: string;
  success_url: string;
  failure_url: string;
  signed_field_names: string;
  signature: string;
}

/**
 * Generate the HMAC-SHA256 signature required by eSewa's v2 ePay API.
 * eSewa requires signing a specific comma-separated string of field=value pairs.
 */
function generateEsewaSignature(message: string, secretKey: string): string {
  const hmac = crypto.createHmac("sha256", secretKey);
  hmac.update(message);
  return hmac.digest("base64");
}

/**
 * Build the complete form data payload to POST to eSewa's payment gateway.
 */
export function buildEsewaFormData(params: EsewaPaymentParams): EsewaFormData {
  const secretKey = process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";
  const productCode = process.env.ESEWA_MERCHANT_CODE || "EPAYTEST";

  const taxAmount = params.taxAmount ?? 0;
  const signedFieldNames = "total_amount,transaction_uuid,product_code";

  const message = `total_amount=${params.totalAmount},transaction_uuid=${params.transactionUuid},product_code=${productCode}`;
  const signature = generateEsewaSignature(message, secretKey);

  return {
    amount: String(params.amount),
    tax_amount: String(taxAmount),
    total_amount: String(params.totalAmount),
    transaction_uuid: params.transactionUuid,
    product_code: productCode,
    product_service_charge: "0",
    product_delivery_charge: "0",
    success_url: params.successUrl,
    failure_url: params.failureUrl,
    signed_field_names: signedFieldNames,
    signature,
  };
}

/**
 * Verify the signature returned by eSewa in its callback response.
 * eSewa returns a base64-encoded JSON payload in the `data` query parameter
 * on success redirect, which itself contains a signature field to verify.
 */
export function verifyEsewaResponseSignature(decodedData: Record<string, string>): boolean {
  const secretKey = process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";
  const signedFieldNames = decodedData.signed_field_names;
  if (!signedFieldNames) return false;

  const fields = signedFieldNames.split(",");
  const message = fields.map((field) => `${field}=${decodedData[field]}`).join(",");
  const expectedSignature = generateEsewaSignature(message, secretKey);

  return expectedSignature === decodedData.signature;
}

/**
 * Decode the base64 `data` query parameter eSewa sends back on success redirect.
 */
export function decodeEsewaResponseData(base64Data: string): Record<string, string> {
  const decoded = Buffer.from(base64Data, "base64").toString("utf-8");
  return JSON.parse(decoded);
}

/**
 * Query eSewa's transaction status check API directly (more reliable than
 * trusting the redirect alone — used for server-side verification).
 */
export async function checkEsewaTransactionStatus(
  productCode: string,
  totalAmount: string,
  transactionUuid: string
): Promise<{ status: string; [key: string]: unknown }> {
  const baseUrl =
    process.env.ESEWA_STATUS_CHECK_URL ||
    "https://rc.esewa.com.np/api/epay/transaction/status/";

  const url = `${baseUrl}?product_code=${productCode}&total_amount=${totalAmount}&transaction_uuid=${transactionUuid}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to verify eSewa transaction status");
  }
  return response.json();
}
