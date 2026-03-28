import { NextRequest, NextResponse } from "next/server";

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

    const currency = body.region === "africa" ? "GHS" : "USD";
    const callbackUrl = `${BASE_URL}/success?product=${productId}&email=${encodeURIComponent(email)}`;

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
          custom_fields: [
            {
              display_name: "Product ID",
              variable_name: "product_id",
              value: productId,
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
