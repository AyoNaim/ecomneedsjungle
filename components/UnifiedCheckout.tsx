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
        
        {/* VIEW 1: Summary Form */}
        {!orderData ? (
          <div className="p-1 bg-gradient-to-tr from-zinc-800 to-zinc-900 rounded-2xl shadow-2xl">
            <div className="bg-zinc-950 p-8 rounded-[14px] border border-white/5">
              <div className="mb-6">
                <h3 className="text-xl font-medium text-white mb-2">Order Summary</h3>
                <p className="text-zinc-400 text-sm">Purchase 20.00 USDC to your treasury.</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                  <span className="text-zinc-500">Asset</span>
                  <span className="text-white font-mono text-sm">USDC (Polygon)</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                  <span className="text-zinc-500">Amount</span>
                  <span className="text-white font-medium">$20.00</span>
                </div>
              </div>

              <button
                onClick={handleInitiateOrder}
                disabled={loading}
                className="w-full mt-8 flex items-center justify-center gap-2 py-4 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                  <>Pay with Card <ArrowRight className="h-4 w-4" /></>
                )}
              </button>

              {error && <p className="mt-4 text-center text-red-400 text-xs bg-red-400/10 py-2 rounded-lg">{error}</p>}
            </div>
          </div>
        ) : (
          /* VIEW 2: Embedded Checkout */
          <div className="animate-in fade-in zoom-in-95 duration-500">
             <button 
              onClick={() => setOrderData(null)}
              className="mb-4 flex items-center gap-1 text-zinc-500 hover:text-white transition-colors text-sm"
            >
              <ChevronLeft className="h-4 w-4" /> Back to summary
            </button>

            {/* Note: No 'appearance' prop on Providers */}
            <CrossmintProvider apiKey={clientApiKey}>
              <CrossmintCheckoutProvider>
                <div className="rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-900 min-h-[400px]">
                  
                  {/* 🚨 FIX 2 & 3: Appearance and Payment props go exactly here */}
                  <CrossmintEmbeddedCheckout
                    orderId={orderData.orderId}
                    clientSecret={orderData.clientSecret}
                    payment={{
                      fiat: { enabled: true },
                      crypto: { enabled: true },
                    }}
                    appearance={{
                        variables: {
                          borderRadius: "12px", // This stays at the root of variables
                          colors: {
                            // Colors must go inside this nested object
                            backgroundPrimary: "#09090b", // Replaces colorBackground
                            textPrimary: "#ffffff",       // Replaces colorText
                            textSecondary: "#a1a1aa",     // (Optional) For subtitles, matches zinc-400
                            borderPrimary: "#27272a",     // (Optional) For input borders, matches zinc-800
                            accent: "#ffffff",            // Replaces colorPrimary (buttons, highlights)
                          },
                        },
                      }}
                  />
                  
                </div>
              </CrossmintCheckoutProvider>
            </CrossmintProvider>
          </div>
        )}

        <div className="mt-8 flex items-center justify-center gap-2 opacity-20">
          <CreditCard className="h-3 w-3" />
          <span className="text-[10px] uppercase tracking-widest">Secure Checkout</span>
        </div>
      </div>
    </div>
  );
}