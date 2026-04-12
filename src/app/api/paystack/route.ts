import { NextRequest, NextResponse } from "next/server";
import { products } from "@/lib/products";

const GHANA_COUNTRY_CODE = "GH";

const GHS_TO_USD_RATE = 15;

const PRODUCT_PRICES: Record<string, { ghana: number; global: number }> = {
  "1": { ghana: 5 * GHS_TO_USD_RATE, global: 19 },
  "2": { ghana: 9 * GHS_TO_USD_RATE, global: 29 },
  "3": { ghana: 15 * GHS_TO_USD_RATE, global: 49 },
  "4": { ghana: 19 * GHS_TO_USD_RATE, global: 97 },
  "bundle": { ghana: 79 * GHS_TO_USD_RATE, global: 79 },
};

interface DetectedRegion {
  region: "ghana" | "global";
  countryCode: string;
  currency: "GHS" | "USD";
  pricingTier: "africa" | "global";
}

async function detectRegionFromIP(ip: string): Promise<DetectedRegion> {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/country_code/`);
    const text = await response.text();
    const countryCode = text.trim();
    
    if (countryCode === GHANA_COUNTRY_CODE) {
      return {
        region: "ghana",
        countryCode,
        currency: "GHS",
        pricingTier: "africa"
      };
    }
  } catch (error) {
    console.error("Failed to detect region:", error);
  }
  
  return {
    region: "global",
    countryCode: "XX",
    currency: "USD",
    pricingTier: "global"
  };
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, productId, amount, clientRegion } = body;

    if (!email || !productId || !amount) {
      return NextResponse.json(
        { status: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const clientIP = getClientIP(request);
    const detected = await detectRegionFromIP(clientIP);

    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://sam-atlas.vercel.app";

    const prices = PRODUCT_PRICES[productId as keyof typeof PRODUCT_PRICES];
    if (!prices) {
      return NextResponse.json(
        { status: false, message: "Invalid product ID" },
        { status: 400 }
      );
    }

    const finalAmount = detected.pricingTier === "africa" ? prices.ghana : prices.global;
    const finalCurrency = detected.currency;

    if (!PAYSTACK_SECRET_KEY) {
      console.log("Demo mode - returning mock payment URL");
      return NextResponse.json({
        status: true,
        message: "Demo mode",
        data: {
          authorization_url: `${BASE_URL}/success?product=${productId}&email=${encodeURIComponent(email)}&demo=true`,
          reference: `demo_${Date.now()}`,
          amount: finalAmount * 100,
          currency: finalCurrency,
        },
      });
    }

    const callbackUrl = `${BASE_URL}/success?product=${productId}&email=${encodeURIComponent(email)}&region=${detected.region}`;

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: Math.round(finalAmount * 100),
        currency: finalCurrency,
        callback_url: callbackUrl,
        metadata: {
          product_id: productId,
          detected_region: detected.region,
          pricing_tier: detected.pricingTier,
          country_code: detected.countryCode,
          client_ip: clientIP,
          custom_fields: [
            {
              display_name: "Product ID",
              variable_name: "product_id",
              value: productId,
            },
            {
              display_name: "Region",
              variable_name: "region",
              value: detected.region,
            },
            {
              display_name: "Currency",
              variable_name: "currency",
              value: currency,
            },
          ],
        },
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Paystack API error:", error);
    return NextResponse.json(
      { status: false, message: "Payment initialization failed" },
      { status: 500 }
    );
  }
}
