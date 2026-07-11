"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CreditCard, Loader2, ArrowRight, ChevronLeft, Cpu, AlertTriangle } from "lucide-react";

interface ProductMetadata {
  id: string;
  title: string;
  displayPrice: string; // Used strictly for UI display, backend determines actual charge
  category?: string;
}

// --- CORE COMPONENT ---
function TransakCheckoutCore() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("product_id");

  // State Management
  const [product, setProduct] = useState<ProductMetadata | null>(null);
  const [isProductLoading, setIsProductLoading] = useState(true);
  
  const [widgetUrl, setWidgetUrl] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // 1. Mount State to prevent hydration mismatches
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 2. Fetch Display Metadata for the Summary Screen
  useEffect(() => {
    if (!productId) {
      setError("ERR_NO_ASSET_ID: Search parameters missing valid tracking identifier.");
      setIsProductLoading(false);
      return;
    }

    // Fetch the product details just so the user sees what they are buying.
    // NOTE: The actual price charged is still determined securely by the backend later.
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        
        if (data.product) {
          setProduct(data.product);
        } else {
          setError(`ERR_ASSET_NOT_FOUND: Registry query for ID ${productId.substring(0,8)}... returned null.`);
        }
      } catch (err) {
        setError("ERR_NETWORK_FAILURE: Unable to establish uplink to registry database.");
      } finally {
        setIsProductLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // 3. Initiate Secure Transak Session (Server-Side Resolution)
  const handleInitiateOrder = async () => {
    if (!productId) return;
    setIsInitializing(true);
    setError(null);

    try {
      // We ONLY pass the productId (planId). 
      // The server resolves the price, auth() resolves the email, and process.env resolves the wallet.
      const response = await fetch("/api/checkout/transak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: productId }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to establish secure gateway tunnel");
      }

      if (data.widgetUrl) {
        setWidgetUrl(data.widgetUrl);
      } else {
        throw new Error("ERR_NO_WIDGET_URL: Gateway failed to return operational parameters.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsInitializing(false);
    }
  };

  if (!isMounted) return null;

  // RENDER: Loading State
  if (isProductLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Cpu className="w-10 h-10 text-emerald-500 animate-pulse" />
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-zinc-500">Querying Database...</span>
      </div>
    );
  }

  // RENDER: Error State
  if (error && !widgetUrl) {
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
      {!widgetUrl ? (
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
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-zinc-500">Amount</span>
                <span className="text-white font-medium text-lg">
                  ${product?.displayPrice || "0.00"}
                </span>
              </div>
            </div>

            <button
              onClick={handleInitiateOrder}
              disabled={isInitializing || !product}
              className="w-full mt-8 flex items-center justify-center gap-2 py-4 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isInitializing ? <Loader2 className="animate-spin h-5 w-5" /> : (
                <>Establish Gateway Uplink <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* VIEW 2: Embedded Transak Checkout */
        <div className="animate-in fade-in zoom-in-95 duration-500">
          <button 
            onClick={() => setWidgetUrl(null)}
            className="mb-4 flex items-center gap-1 text-zinc-500 hover:text-white transition-colors text-sm font-mono tracking-wide"
          >
            <ChevronLeft className="h-4 w-4" /> ABORT UPLINK
          </button>

          {/* TRANSAK COMPLIANCE CONTAINER 
            1. width: max-w-[480px] w-full (Ensures it fits mobile without breaking desktop)
            2. height: h-[700px] min-h-[650px] (Mandatory regulatory height limits so KYC camera UI doesn't clip)
            3. No overflow-hidden on the parent that would block Transak's internal scroll.
          */}
          <div className="w-full max-w-[480px] h-[700px] min-h-[650px] rounded-2xl shadow-2xl bg-[#121214] border border-zinc-800 flex flex-col p-1">
            <iframe
              id="transakCyberpunkFrame"
              src={widgetUrl}
              /* CRITICAL REGULATORY RULE: 
                Without this hardware string, the real-time KYC liveness check will freeze.
              */
              allow="camera;microphone;payment"
              className="w-full h-full rounded-[12px] border-none bg-[#121214]"
            />
          </div>
        </div>
      )}

      {/* Cyberpunk Footer Decor */}
      <div className="mt-8 flex items-center justify-center gap-2 opacity-20">
        <CreditCard className="h-3 w-3" />
        <span className="text-[10px] uppercase tracking-widest font-mono">Secure Fiat Node Activity</span>
      </div>
    </div>
  );
}

// --- MAIN EXPORT W/ SUSPENSE BOUNDARY ---
export default function TransakCheckoutTerminal() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white font-sans selection:bg-emerald-500/30">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">Booting Secure Container...</span>
        </div>
      }>
        <TransakCheckoutCore />
      </Suspense>
    </div>
  );
}