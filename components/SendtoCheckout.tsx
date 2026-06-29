"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { CreditCard, Loader2, ArrowRight, ChevronLeft, Cpu, AlertTriangle } from "lucide-react";
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

interface Product {
  id: string;
  title: string;
  priceUSD: number;
  category?: string;
}

// --- CORE COMPONENT ---
function CheckoutCore() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("product_id");
  const { data: session } = useSession();
  
  const userEmail = session?.user?.email || "";

  const [product, setProduct] = useState<Product | null>(null);
  const [isProductLoading, setIsProductLoading] = useState(true);
  
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const clientApiKey = process.env.NEXT_PUBLIC_CLIENT_API_KEY || "";

  // 1. Mount State
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 2. Fetch Product Data from Database API
  useEffect(() => {
    if (!productId) {
      setError("ERR_NO_ASSET_ID: Search parameters missing valid tracking identifier.");
      setIsProductLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await fetch("/api/products"); // Your Prisma API route
        const data = await res.json();
        
        if (data.success || data.products) {
          const foundProduct = data.products.find((p: Product) => p.id === productId);
          if (foundProduct) {
            setProduct(foundProduct);
          } else {
            setError(`ERR_ASSET_NOT_FOUND: Registry query for ID ${productId.substring(0,8)}... returned null.`);
          }
        }
      } catch (err) {
        setError("ERR_NETWORK_FAILURE: Unable to establish uplink to registry database.");
      } finally {
        setIsProductLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // 3. Initiate Crossmint Order
  const handleInitiateOrder = async () => {
    if (!product) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/crossmint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Injecting dynamic email and product details into the payload
        body: JSON.stringify({ 
          email: userEmail,
          productId: product.id,
          amount: product.priceUSD
        }),
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

  // RENDER: Loading Product State
  if (isProductLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Cpu className="w-10 h-10 text-emerald-500 animate-pulse" />
        <span className="text-xs font-mono tracking-[0.3em] uppercase text-zinc-500">Querying Database...</span>
      </div>
    );
  }

  // RENDER: Error State
  if (error && !product) {
    return (
      <div className="max-w-md w-full bg-zinc-950 border border-red-500/20 p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50" />
        <AlertTriangle className="w-10 h-10 text-red-500 mb-4" />
        <h2 className="text-xl font-mono font-bold text-white mb-2">SYSTEM FAULT</h2>
        <p className="text-xs font-mono text-zinc-500 tracking-wider leading-relaxed mb-6">
          {error}
        </p>
      </div>
    );
  }

  // RENDER: Main View
  return (
    <div className="w-full max-w-md">
      {/* VIEW 1: Summary Form */}
      {!orderData ? (
        <div className="p-1 bg-gradient-to-tr from-zinc-800 to-zinc-900 rounded-2xl shadow-2xl">
          <div className="bg-zinc-950 p-8 rounded-[14px] border border-white/5">
            <div className="mb-6">
              <h3 className="text-xl font-medium text-white mb-2">Order Summary</h3>
              <p className="text-zinc-400 text-sm">Review asset procurement details prior to deployment.</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-zinc-500">Asset</span>
                <span className="text-white font-mono text-sm max-w-[200px] text-right truncate">
                  {product?.title || "Unknown Asset"}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-zinc-500">Category</span>
                <span className="text-white font-mono text-sm">
                  {product?.category || "Digital Good"}
                </span>
              </div>
              {/* Added Dynamic Email UI Row */}
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-zinc-500">Account</span>
                <span className="text-white font-mono text-sm max-w-[200px] text-right truncate">
                  {userEmail || "Guest Session"}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-zinc-500">Amount</span>
                <span className="text-white font-medium text-lg">
                  ${Number(product?.priceUSD).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleInitiateOrder}
              disabled={loading || !product}
              className="w-full mt-8 flex items-center justify-center gap-2 py-4 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                <>Establish Uplink <ArrowRight className="h-4 w-4" /></>
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
  );
}

// --- MAIN EXPORT W/ SUSPENSE BOUNDARY ---
export default function SendtoCheckout() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white font-sans">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">Initializing Secure Container...</span>
        </div>
      }>
        <CheckoutCore />
      </Suspense>
    </div>
  );
}
