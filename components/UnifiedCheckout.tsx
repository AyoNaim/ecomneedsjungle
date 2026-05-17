"use client";

import React, { useState, useEffect } from "react";
import { CreditCard, Loader2, ArrowRight, ChevronLeft } from "lucide-react";
import dynamic from "next/dynamic";
import ProductPreview from "./ProductPreview";
import ProductDescription from "./ProductDescription";

// 🚨 FIX 1: Dynamically import Crossmint SDK to stop the Next.js compiler from freezing
const CrossmintProvider = dynamic(
  () => import("@crossmint/client-sdk-react-ui").then((mod) => mod.CrossmintProvider),
  { ssr: false }
);
const CrossmintCheckoutProvider = dynamic(
  () => import("@crossmint/client-sdk-react-ui").then((mod) => mod.CrossmintCheckoutProvider),
  { ssr: false }
);
const CrossmintEmbeddedCheckout = dynamic(
  () => import("@crossmint/client-sdk-react-ui").then((mod) => mod.CrossmintEmbeddedCheckout),
  { ssr: false }
);

interface OrderData {
  orderId: string;
  clientSecret: string;
}

export default function UnifiedCheckout() {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const clientApiKey = process.env.NEXT_PUBLIC_CLIENT_API_KEY || "";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleInitiateOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/crossmint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "ayonaim101@gmail.com" }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.message || "Failed to create order");
      }

      if (data.order?.orderId && data.clientSecret) {
        setOrderData({
          orderId: data.order.orderId,
          clientSecret: data.clientSecret,
        });
      } else {
        throw new Error("API response missing Order ID or Client Secret.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white font-sans">
      <div className="w-full max-w-md">
        <div>
          <ProductPreview />
        </div>
        <div className="mb-5">
          <ProductDescription/>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 opacity-20">
          <CreditCard className="h-3 w-3" />
          <span className="text-[10px] uppercase tracking-widest">Secure Checkout</span>
        </div>
      </div>
    </div>
  );
}