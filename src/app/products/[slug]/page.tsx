"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, products } from "@/lib/products";

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

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const [product, setProduct] = useState(getProductBySlug("ai-prompt-pack"));
  const [isLoading, setIsLoading] = useState(true);
  const [customerEmail, setCustomerEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [region, setRegion] = useState<"africa" | "global">("global");
  const [resolvedParams, setResolvedParams] = useState<{ slug: string } | null>(null);

  useEffect(() => {
    params.then(p => setResolvedParams(p));
  }, [params]);

  useEffect(() => {
    if (resolvedParams) {
      const foundProduct = getProductBySlug(resolvedParams.slug);
      if (foundProduct) {
        setProduct(foundProduct);
      }
      setIsLoading(false);
    }
  }, [resolvedParams]);

  useEffect(() => {
    const detectRegion = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        const africanCountries = ["GH", "NG", "KE", "ZA", "TZ", "UG", "RW", "ET", "ZM", "ZW"];
        if (africanCountries.includes(data.country_code)) {
          setRegion("africa");
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
          productId: product?.id,
          amount: region === "africa" ? product?.price.africa : product?.price.global,
        }),
      });

      const data = await response.json();

      if (data.status && window.PaystackPop) {
        const handler = window.PaystackPop.setup({
          key: "pk_live_aa417b30a275348fef6da7cf998fd3719edb4cfb",
          email: customerEmail,
          amount: data.data.amount * 100,
          currency: region === "africa" ? "GHS" : "USD",
          callback: async (response) => {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ reference: response.reference, email: customerEmail }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.status) {
              window.location.href = `/success?product=${product?.id}&email=${customerEmail}`;
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

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="py-20">
      <div className="container-custom">
        <Link href="/products" className="text-gray-400 hover:text-white mb-8 inline-block">
          Back to Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Product Info */}
          <div>
            <div className="text-6xl mb-6">{product.preview}</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.name}</h1>
            <p className="text-xl text-gray-400 mb-6">{product.tagline}</p>

            {product.popular && (
              <span className="inline-block px-4 py-1 text-sm bg-secondary/20 text-secondary rounded-full mb-6">
                Most Popular
              </span>
            )}

            <div className="prose prose-invert max-w-none mb-8">
              {product.longDescription.split("\n\n").map((paragraph, i) => (
                <p key={i} className="text-gray-300 mb-4">{paragraph}</p>
              ))}
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">What You Get:</h3>
              <ul className="space-y-3">
                {product.includes.map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-secondary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Features:</h3>
              <ul className="grid grid-cols-2 gap-2">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-400 text-sm">
                    <svg className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column - Purchase */}
          <div>
            <div className="gradient-border rounded-2xl p-8 sticky top-24">
              <h3 className="text-2xl font-bold mb-4">Get Instant Access</h3>

              {/* Region Detection */}
              <div className="mb-6">
                <div className={`p-3 rounded-lg border ${
                  region === "africa" 
                    ? "border-secondary/50 bg-secondary/10" 
                    : "border-primary/50 bg-primary/10"
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        region === "africa" ? "bg-secondary" : "bg-primary"
                      }`} />
                      <span className="text-sm font-medium">
                        {region === "africa" ? "🇬🇭 Ghana (GHS)" : "🌍 Global (USD)"}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      Auto-detected
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                {region === "africa" ? (
                  <div>
                    <span className="text-sm text-gray-400">Ghana Pricing</span>
                    <div>
                      <span className="text-4xl font-bold">₵{product.price.africa * 15}</span>
                      <span className="text-gray-400 ml-2">≈ ${product.price.africa} USD</span>
                    </div>
                    <span className="text-xs text-secondary">Special pricing for Ghana</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-sm text-gray-400">International Pricing</span>
                    <div>
                      <span className="text-4xl font-bold">${product.price.global}</span>
                      <span className="text-gray-400 ml-2">USD</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Your Email Address</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-card border border-card-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <button
                  onClick={handlePurchase}
                  disabled={isProcessing}
                  className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Processing..." : `Pay ${region === "africa" ? `₵${product.price.africa * 15}` : `$${product.price.global}`} with Paystack`}
                </button>

                <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Secure Payment
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Instant Access
                  </span>
                </div>

                <p className="text-center text-xs text-gray-500">
                  Payment processed securely by Paystack. You will receive an email with your download link immediately after payment.
                </p>
              </div>

              {/* Payment Methods */}
              <div className="mt-6 pt-6 border-t border-card-border">
                <p className="text-sm text-gray-500 text-center mb-3">Accepted Payment Methods</p>
                <div className="flex justify-center gap-4 text-gray-500">
                  <span className="text-sm">Cards</span>
                  <span className="text-sm">Bank Transfer</span>
                  <span className="text-sm">Mobile Money</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
