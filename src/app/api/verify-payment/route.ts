import { NextRequest, NextResponse } from "next/server";
import { products, getProductBySlug } from "@/lib/products";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reference, email } = body;

    if (!reference || !email) {
      return NextResponse.json(
        { status: false, message: "Missing reference or email" },
        { status: 400 }
      );
    }

    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

    if (!PAYSTACK_SECRET_KEY || reference.startsWith("demo_")) {
      const productId = request.nextUrl.searchParams.get("product");
      const demoProduct = productId ? products.find((p) => p.id === productId) : products[0];

      return NextResponse.json({
        status: true,
        message: "Demo payment verified",
        data: {
          reference,
          amount: (demoProduct?.price.africa || 5) * 100,
          currency: "USD",
          customer: { email },
          product: demoProduct,
        },
      });
    }

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    const data = await response.json();

    if (data.data.status === "success") {
      return NextResponse.json({
        status: true,
        message: "Payment verified",
        data: {
          reference: data.data.reference,
          amount: data.data.amount,
          currency: data.data.currency,
          customer: data.data.customer,
        },
      });
    }

    return NextResponse.json(
      { status: false, message: "Payment verification failed" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { status: false, message: "Verification failed" },
      { status: 500 }
    );
  }
}
