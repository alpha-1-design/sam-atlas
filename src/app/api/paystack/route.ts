import { NextRequest, NextResponse } from "next/server";

const AFRICAN_COUNTRIES = ["GH", "NG", "KE", "ZA", "TZ", "UG", "RW", "ET", "ZM", "ZW", "CI", "GHANA", "NIGERIA", "KENYA", "SOUTH AFRICA"];

async function detectRegionFromIP(ip: string): Promise<"africa" | "global"> {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/country_code/`);
    const countryCode = await response.text().trim();
    
    if (AFRICAN_COUNTRIES.includes(countryCode)) {
      return "africa";
    }
  } catch (error) {
    console.error("Failed to detect region:", error);
  }
  return "global";
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
    const serverDetectedRegion = await detectRegionFromIP(clientIP);
    
    const finalRegion = serverDetectedRegion;

    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://sam-atlas.vercel.app";

    if (!PAYSTACK_SECRET_KEY) {
      console.log("Demo mode - returning mock payment URL");
      return NextResponse.json({
        status: true,
        message: "Demo mode",
        data: {
          authorization_url: `${BASE_URL}/success?product=${productId}&email=${encodeURIComponent(email)}&demo=true`,
          reference: `demo_${Date.now()}`,
          amount: amount * 100,
        },
      });
    }

    const currency = finalRegion === "africa" ? "GHS" : "USD";
    const callbackUrl = `${BASE_URL}/success?product=${productId}&email=${encodeURIComponent(email)}&region=${finalRegion}`;

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amount * 100),
        currency,
        callback_url: callbackUrl,
        metadata: {
          product_id: productId,
          detected_region: finalRegion,
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
              value: finalRegion,
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
