import { NextRequest, NextResponse } from "next/server";
import { products } from "@/lib/products";

const VALID_TOKENS = new Map<string, { productId: string; expiresAt: number; used: boolean }>();

function generateDownloadToken(productId: string, expiresInHours = 24): string {
  const token = `${productId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  VALID_TOKENS.set(token, {
    productId,
    expiresAt: Date.now() + expiresInHours * 60 * 60 * 1000,
    used: false,
  });
  return token;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, email, reference } = body;

    if (!productId || !email) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = products.find((p) => p.id === productId);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const downloadToken = generateDownloadToken(productId, 48);
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://sam-atlas.vercel.app";
    const downloadUrl = `${BASE_URL}/api/download-file?token=${downloadToken}`;

    return NextResponse.json({
      success: true,
      downloadUrl,
      expiresIn: "48 hours",
      product: {
        name: product.name,
        filename: product.downloadFile,
      },
    });
  } catch (error) {
    console.error("Download generation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate download" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { success: false, message: "No token provided" },
      { status: 401 }
    );
  }

  const tokenData = VALID_TOKENS.get(token);

  if (!tokenData) {
    return NextResponse.json(
      { success: false, message: "Invalid token" },
      { status: 401 }
    );
  }

  if (tokenData.used) {
    return NextResponse.json(
      { success: false, message: "Token already used" },
      { status: 410 }
    );
  }

  if (Date.now() > tokenData.expiresAt) {
    return NextResponse.json(
      { success: false, message: "Download link expired" },
      { status: 410 }
    );
  }

  tokenData.used = true;

  const product = products.find((p) => p.id === tokenData.productId);
  if (!product) {
    return NextResponse.json(
      { success: false, message: "Product not found" },
      { status: 404 }
    );
  }

  return NextResponse.redirect(`/downloads/${product.downloadFile}`);
}
