import { NextRequest, NextResponse } from "next/server";
import { products, bundle, getPricingTier, getPriceByTier, PricingTier } from "@/lib/products";

const TIER1_CURRENCY = "USD";
const TIER2_CURRENCY = "USD";
const TIER3_CURRENCY = "USD";

interface DetectedRegion {
  tier: PricingTier;
  countryCode: string;
  currency: string;
}

async function detectRegionFromIP(ip: string): Promise<DetectedRegion> {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/country_code/`);
    const text = await response.text();
    const countryCode = text.trim();
    
    const tier = getPricingTier(countryCode);
    
    return {
      tier,
      countryCode,
      currency: TIER1_CURRENCY,
    };
  } catch (error) {
    console.error("Failed to detect region:", error);
  }
  
  return {
    tier: "tier3",
    countryCode: "US",
    currency: TIER3_CURRENCY,
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
    const { email, productId, amount } = body;

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

    let product = products.find(p => p.id === productId);
    if (!product && productId === "bundle") {
      product = bundle;
    }

    if (!product) {
      return NextResponse.json(
        { status: false, message: "Invalid product ID" },
        { status: 400 }
      );
    }

    const finalAmount = getPriceByTier(product, detected.tier);
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
          tier: detected.tier,
        },
      });
    }

    const callbackUrl = `${BASE_URL}/success?product=${productId}&email=${encodeURIComponent(email)}&tier=${detected.tier}`;

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
          pricing_tier: detected.tier,
          country_code: detected.countryCode,
          client_ip: clientIP,
          custom_fields: [
            {
              display_name: "Product ID",
              variable_name: "product_id",
              value: productId,
            },
            {
              display_name: "Pricing Tier",
              variable_name: "pricing_tier",
              value: detected.tier,
            },
            {
              display_name: "Country",
              variable_name: "country_code",
              value: detected.countryCode,
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
