"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CreditCard, Loader2, ArrowRight, ChevronLeft, Cpu, AlertTriangle } from "lucide-react";
import Script from "next/script";

interface ProductMetadata {
  id: string;
  title: string;
  displayPrice: string; // Used dynamically to lock the checkout amount
  category?: string;
}

// --- CORE COMPONENT ---
function ChangeNowCheckoutCore() {
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

    const fetchProduct = async () => {
      setIsProductLoading(true);
      setError(null); 

      try {
        const response = await fetch("/api/get-product", {
          method: "POST", 
          headers: { 
            "Content-Type": "application/json" 
          },
          body: JSON.stringify({ 
            productId: productId 
          }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to retrieve asset data.");
        }

        if (data.product) {
          setProduct({
            ...data.product,
            displayPrice: Number(data.product.priceUSD).toFixed(2)
          });
        } else {
          throw new Error(`ERR_ASSET_NOT_FOUND: Registry query returned null.`);
        }
      } catch (err: any) {
        setError(err.message || "ERR_NETWORK_FAILURE: Unable to establish uplink to registry database.");
      } finally {
        setIsProductLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // 3. Construct Secure ChangeNOW Gateway Frame
  const handleInitiateOrder = async () => {
    if (!product) return;
    setIsInitializing(true);
    setError(null);

    try {
      const apiKey = process.env.NEXT_PUBLIC_CHANGENOW_API_KEY;
      const WALLET_ADDRESS = process.env.BUSINESS_WALLET_ADDRESS;
      
      // Target lower-fee networks out-of-the-box (e.g., USDT on Binance Smart Chain: usdtbsc)
      const targetCrypto = "usdtbsc"; 
      const defaultFiat = "usd";

      // Dynamically map item details to production parameter routes
      const generatedUrl = `https://changenow.io/embeds/exchange-widget/v2/widget.html?FAQ=false&amountFiat=${product.displayPrice}&link_id=${apiKey}&to=usdtbsc&address=${WALLET_ADDRESS}&lockAddress=true&toTheMoon=true&backgroundColor=FFFFFF&darkMode=false&primaryColor=00C26F`;
      // const testUrl = 'https://changenow.io/embeds/exchange-widget/v2/widget.html?FAQ=false&amount=0.1&backgroundColor=FFFFFF&darkMode=false&from=btc&horizontal=false&lang=en-US&link_id=4c51ac3c0107e3&locales=true&logo=true&primaryColor=00C26F&to=eth'
      setWidgetUrl(generatedUrl);
    } catch (err: any) {
      setError(err.message || "Failed to construct operational gateway parameters.");
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
        /* VIEW 2: Embedded ChangeNOW Checkout */
        <div className="animate-in fade-in zoom-in-95 duration-500">
          <button 
            onClick={() => setWidgetUrl(null)}
            className="mb-4 flex items-center gap-1 text-zinc-500 hover:text-white transition-colors text-sm font-mono tracking-wide"
          >
            <ChevronLeft className="h-4 w-4" /> ABORT UPLINK
          </button>

          {/* CHANGENOW INTERFACE CONTAINER */}
          <div className="relative w-full max-w-[480px] h-[650px] rounded-2xl shadow-2xl bg-zinc-950 border border-zinc-800 flex flex-col p-1 overflow-hidden">
            
            {/* THE GLASS SHIELD INTERCEPTOR
                Intercepts all click, focus, and selection behaviors directly over the 
                "You Send" fiat quantity input within the underlying iframe layout.
            */}
            <div 
              className="absolute top-[80px] left-0 right-0 h-[80px] z-20 bg-transparent cursor-not-allowed"
              title="Transaction amount is hardlocked to current checkout valuation."
              aria-hidden="true"
            />

            <iframe
              id="changeNowTerminalFrame"
              src={widgetUrl}
              // Mandatory camera capabilities enabled for native mobile KYC scanning sequences
              allow="camera;microphone;payment"
              className="w-full h-full rounded-[12px] border-none bg-transparent z-10"
            />
            <Script 
              src="https://changenow.io/embeds/exchange-widget/v2/stepper-connector.js"
              strategy="afterInteractive"
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
export default function ChangeNowCheckoutTerminal() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white font-sans selection:bg-emerald-500/30">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">Booting Secure Container...</span>
        </div>
      }>
        <ChangeNowCheckoutCore />
      </Suspense>
    </div>
  );
}