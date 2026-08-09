import { NextRequest, NextResponse } from "next/server";
import dns from "dns";
import {
  isValidEmailFormat,
  isDisposableEmail,
  isKnownLegitimateDomain,
} from "@/lib/emailValidation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";

    if (!email || !isValidEmailFormat(email)) {
      return NextResponse.json(
        { valid: false, isDisposable: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (isDisposableEmail(email)) {
      return NextResponse.json(
        {
          valid: false,
          isDisposable: true,
          error: "Temporary or disposable email addresses are not allowed.",
        },
        { status: 400 }
      );
    }

    const domain = email.split("@")[1]?.toLowerCase().trim();
    if (!domain) {
      return NextResponse.json(
        { valid: false, isDisposable: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Skip DNS lookup for fast verification of known legitimate email providers
    if (isKnownLegitimateDomain(domain)) {
      return NextResponse.json({ valid: true });
    }

    // Perform DNS lookup for MX or A records to verify domain exists and receives email
    const hasMxOrMailRecord = await checkDomainMxOrDns(domain);
    if (!hasMxOrMailRecord) {
      return NextResponse.json(
        { valid: false, isDisposable: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    return NextResponse.json({ valid: true });
  } catch (err) {
    console.error("Email validation endpoint error:", err);
    // On unexpected server error during validation, fallback to format & disposable check
    return NextResponse.json({ valid: true });
  }
}

async function checkDomainMxOrDns(domain: string): Promise<boolean> {
  try {
    const mxPromise = dns.promises.resolveMx(domain);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("DNS_TIMEOUT")), 3000)
    );

    const mxRecords = await Promise.race([mxPromise, timeoutPromise]);
    if (Array.isArray(mxRecords) && mxRecords.length > 0) {
      return true;
    }
  } catch (err: any) {
    // If MX lookup failed or timed out, try resolving A/AAAA records
    if (err?.message === "DNS_TIMEOUT") {
      return true; // Don't block if DNS server was slow
    }
    try {
      const aRecords = await dns.promises.resolve4(domain);
      if (Array.isArray(aRecords) && aRecords.length > 0) {
        return true;
      }
    } catch {
      return false;
    }
  }

  return false;
}
