"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { products } from "@/lib/products";

function SuccessContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("product");
  const email = searchParams.get("email");
  const [product, setProduct] = useState(products[0]);

  useEffect(() => {
    if (productId) {
      const found = products.find((p) => p.id === productId);
      if (found) setProduct(found);
    }

    const verifyPayment = async () => {
      const reference = searchParams.get("reference");
      if (reference && email) {
        try {
          await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              reference,
              email,
              productId
            }),
          });
        } catch (e) {
          console.error("Automatic verification failed:", e);
        }
      }
    };

    verifyPayment();
  }, [productId, email, searchParams]);

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-secondary/20 flex items-center justify-center">
        <svg className="w-10 h-10 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-xl text-gray-400 mb-8">
        Thank you for your purchase. Your download is ready.
      </p>

      {email && (
        <div className="mb-8 p-4 bg-card rounded-lg">
          <p className="text-sm text-gray-400">Confirmation sent to:</p>
          <p className="font-medium">{email}</p>
        </div>
      )}

      <div className="gradient-border rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-2">Your Purchase</h2>
        <div className="flex items-center justify-center gap-4">
          <span className="text-4xl">{product.preview}</span>
          <div className="text-left">
            <p className="font-semibold">{product.name}</p>
            <p className="text-sm text-gray-400">{product.tagline}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <a
          href={`/downloads/${product.downloadFile}`}
          className="btn-primary w-full max-w-md mx-auto block text-center py-4"
        >
          Download Your Product
        </a>

        <p className="text-sm text-gray-500">
          Having trouble? Email support with your order reference.
        </p>
      </div>

      <div className="mt-12 pt-8 border-t border-card-border">
        <h3 className="font-semibold mb-4">What to Do Next</h3>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products" className="btn-secondary">
            Browse More Products
          </Link>
          <Link href="/about" className="btn-secondary">
            Learn About Sam Atlas
          </Link>
        </div>
      </div>
    </div>
  );
}

function LoadingContent() {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="animate-spin w-12 h-12 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
      <p className="text-gray-400">Loading...</p>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20">
      <div className="container-custom">
        <Suspense fallback={<LoadingContent />}>
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  );
}
