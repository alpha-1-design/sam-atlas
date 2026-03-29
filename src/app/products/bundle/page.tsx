"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { products } from "@/lib/products";

declare global {
  interface Window {
    PaystackPop?: {
      setup: (config: PaystackConfig) => PaystackHandler;
    };
  }
}

interface PaystackConfig {
  key: string;
  email: string;
  amount: number;
  currency?: string;
  callback: (response: { reference: string }) => void;
  onClose?: () => void;
}

interface PaystackHandler {
  openIframe: () => void;
}

export default function BundlePage() {
  const [customerEmail, setCustomerEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [region, setRegion] = useState<"ghana" | "global">("global");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detectRegion = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        if (data.country_code === "GH") {
          setRegion("ghana");
        }
      } catch {
        setRegion("global");
      }
    };
    detectRegion();
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);
    setIsLoading(false);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePurchase = async () => {
    if (!customerEmail) {
      alert("Please enter your email address");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/paystack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: customerEmail,
          productId: "bundle",
        }),
      });

      const data = await response.json();

      if (data.status && window.PaystackPop) {
        const handler = window.PaystackPop.setup({
          key: "pk_live_aa417b30a275348fef6da7cf998fd3719edb4cfb",
          email: customerEmail,
          amount: data.data.amount,
          currency: data.data.currency,
          callback: async (response) => {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ reference: response.reference, email: customerEmail, productId: "bundle" }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.status) {
              window.location.href = `/success?product=bundle&email=${customerEmail}`;
            }
          },
          onClose: () => {
            setIsProcessing(false);
          },
        });
        handler.openIframe();
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    }

    setIsProcessing(false);
  };

  const bundlePrice = region === "ghana" ? 1185 : 79;
  const originalPrice = 194;
  const savings = originalPrice - bundlePrice;

  return (
    <div className="py-20">
      <div className="container-custom">
        <Link href="/products" className="text-gray-400 hover:text-white mb-8 inline-block">
          Back to Products
        </Link>

        <div className="text-center mb-12">
          <span className="px-4 py-1 text-sm bg-secondary/20 text-secondary rounded-full mb-4 inline-block">
            Limited Time Offer
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Complete Agent Bundle
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Get ALL four products and start building your AI agent business today.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid md:grid-cols-2 gap-8">
            {products.map((product) => (
              <div key={product.id} className="card p-6 flex items-center gap-4">
                <span className="text-4xl">{product.preview}</span>
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-400">{product.tagline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <div className="gradient-border rounded-2xl p-8">
            <div className="text-center mb-6">
              <p className="text-gray-400 mb-2">Complete Bundle</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl font-bold line-through text-gray-500">${originalPrice}</span>
                <span className="text-5xl font-bold gradient-text">
                  {region === "ghana" ? `₵${bundlePrice}` : `$${bundlePrice}`}
                </span>
              </div>
              <p className="text-secondary mt-2">
                Save ${savings} ({(savings/originalPrice*100).toFixed(0)}% off)
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Your Email Address</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-card border border-card-border rounded-lg focus:outline-none focus:border-primary"
                />
              </div>

              <button
                onClick={handlePurchase}
                disabled={isProcessing || isLoading}
                className="w-full btn-primary py-4 text-lg disabled:opacity-50"
              >
                {isProcessing ? "Processing..." : `Pay ${region === "ghana" ? `₵${bundlePrice}` : `$${bundlePrice}`} with Paystack`}
              </button>

              <p className="text-center text-xs text-gray-500">
                Instant download after payment. Secure payment via Paystack.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">What's Included</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {products.flatMap(p => p.includes).slice(0, 8).map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-300">
                <svg className="w-5 h-5 text-secondary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
