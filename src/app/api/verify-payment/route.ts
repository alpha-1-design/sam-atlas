import { NextRequest, NextResponse } from "next/server";
import { products } from "@/lib/products";
import { sendProductEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reference, email, productId } = body;

    if (!reference || !email) {
      return NextResponse.json(
        { status: false, message: "Missing reference or email" },
        { status: 400 }
      );
    }

    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://sam-atlas.vercel.app";

    if (!PAYSTACK_SECRET_KEY || reference.startsWith("demo_")) {
      const product = productId ? products.find((p) => p.id === productId) : products[0];

      if (product) {
        const downloadUrl = `${BASE_URL}/downloads/${product.downloadFile}`;
        
        await sendProductEmail({
          email,
          productName: product.name,
          downloadUrl,
          reference,
        });
      }

      return NextResponse.json({
        status: true,
        message: "Demo payment verified",
        data: { reference, email, product },
      });
    }

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    const data = await response.json();

    if (data.data.status === "success") {
      const paidAmount = data.data.amount / 100;
      const currency = data.data.currency;
      const metadata = data.data.metadata || {};
      const detectedRegion = metadata.detected_region || (currency === "GHS" ? "africa" : "global");
      
      const product = productId ? products.find((p) => p.id === productId) : products[0];
      
      if (product) {
        const expectedAmount = detectedRegion === "africa" ? product.price.africa : product.price.global;
        
        if (paidAmount < expectedAmount * 0.9) {
          console.error(`Fraud alert: Expected ~$${expectedAmount} but got $${paidAmount} (${currency})`);
          return NextResponse.json(
            { status: false, message: "Payment amount mismatch - possible fraud" },
            { status: 400 }
          );
        }
      }

      if (product) {
        const downloadUrl = `${BASE_URL}/downloads/${product.downloadFile}`;
        
        await sendProductEmail({
          email,
          productName: product.name,
          downloadUrl,
          reference,
        });
      }

      return NextResponse.json({
        status: true,
        message: "Payment verified and email sent",
        data: {
          reference: data.data.reference,
          amount: data.data.amount,
          currency: data.data.currency,
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
