"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Loader2,
  ChevronRight,
  ShoppingCart,
  ShieldCheck,
  Terminal,
  AlertTriangle,
  Cpu,
  Wallet,
} from "lucide-react";

// --- TYPES ---
type PaymentMethod = "crypto" | "card";

type Product = {
  id: string;
  title: string;
  description: string;
  priceUSD: number;
  previewUrl: string;
  category: string;
};

// --- CORE CHECKOUT COMPONENT ---
function CheckoutCore() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();

  const productId = searchParams.get("product_id");

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Payment & Legal State
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("crypto");
  const [agreed, setAgreed] = useState(false);
  const [termsTimestamp, setTermsTimestamp] = useState<string | null>(null);

  // Action States
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

  // 1. Fetch Product Data
  useEffect(() => {
    if (!productId) {
      setError(
        "ERR_NO_ASSET_ID: Search parameters missing valid tracking identifier."
      );
      setIsLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        if (data.success || data.products) {
          const foundProduct = data.products.find(
            (p: Product) => p.id === productId
          );
          if (foundProduct) {
            setProduct({
              ...foundProduct,
              category: foundProduct.category || "DIGITAL ASSET",
            });
          } else {
            setError(
              `ERR_ASSET_NOT_FOUND: Registry query for ID ${productId.substring(
                0,
                8
              )}... returned null.`
            );
          }
        }
      } catch (err) {
        setError(
          "ERR_NETWORK_FAILURE: Unable to establish uplink to registry database."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // 2. Clickwrap Handler
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setAgreed(isChecked);
    // Capture precise ISO timestamp when the user interacted with the legal clause
    setTermsTimestamp(isChecked ? new Date().toISOString() : null);
  };

  // 3. Original Crossmint & Paystack Purchase Logic
  const handleInitiateOrder = async () => {
    if (!product) return;

    // 1. Enforce Terms & Conditions compliance lock
    if (!agreed || !termsTimestamp) {
      setError(
        "ERR_COMPLIANCE: Digital agreement must be authorized prior to execution."
      );
      return;
    }

    setIsPurchasing(true);
    setError(null);

    try {
      // 2. Route dynamically based on the payment protocol chosen
      if (selectedMethod === "crypto") {
        // Only call the Crossmint endpoint if crypto is selected
        // const response = await fetch("/api/crossmint", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({
        //     email: session?.user?.email,
        //     consentTimestamp: termsTimestamp,
        //     productId: productId,
        //   }),
        // });

        // const data = await response.json();

        // if (!response.ok || data.error) {
        //   throw new Error(
        //     data.message || "Failed to establish secure payment channel"
        //   );
        // }
          router.push(
            `/crossmintcheckout?product_id=${productId}`
          );
      } else {
        // If "card" is selected, bypass Crossmint entirely and route straight to Paystack
        router.push(
          `/paystack?product_id=${productId}&consent=${termsTimestamp}`
        );
      }
    } catch (err: any) {
      console.error(err.message);
      setError(err.message);
    } finally {
      setIsPurchasing(false);
    }
  };

  // 4. Cart Integration
  const handleAddToCart = async () => {
    if (!product || !session?.user) {
      return router.push("/api/auth/signin");
    }

    setIsAddingToCart(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulated DB delay
      setCartSuccess(true);
      setTimeout(() => setCartSuccess(false), 3000);
    } catch (error) {
      console.error("Cart insertion failed:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // --- RENDER: LOADING STATE ---
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Cpu className="w-10 h-10 text-emerald-500 animate-pulse" />
        <span className="text-xs font-mono tracking-[0.3em] uppercase text-zinc-500">
          Decrypting Asset Payload...
        </span>
      </div>
    );
  }

  // --- RENDER: ERROR / MISSING PRODUCT STATE ---
  if (error && !product) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center h-[60vh]"
      >
        <div className="max-w-md w-full bg-zinc-950 border border-red-500/20 p-8 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50" />
          <AlertTriangle className="w-10 h-10 text-red-500 mb-4" />
          <h2 className="text-xl font-mono font-bold text-white mb-2">
            SYSTEM FAULT
          </h2>
          <p className="text-xs font-mono text-zinc-500 tracking-wider leading-relaxed mb-6">
            {error}
          </p>
          <button
            onClick={() => router.push("/catalog")}
            className="text-xs uppercase tracking-widest font-bold text-red-400 hover:text-red-300 transition-colors flex items-center gap-2"
          >
            <Terminal className="w-4 h-4" /> Return to Catalog
          </button>
        </div>
      </motion.div>
    );
  }

  // --- RENDER: MAIN CHECKOUT UI ---
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-5xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-zinc-950/80 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-emerald-500/5 blur-[120px] pointer-events-none" />

        {/* LEFT PANE: The Asset Visualizer */}
        <div className="relative p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-white/5 bg-zinc-900/20 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.2em]">
                Secure Terminal
              </span>
            </div>
            <button
              onClick={() => router.back()}
              className="text-[10px] text-zinc-500 hover:text-white uppercase tracking-widest transition-colors font-mono"
            >
              [ Abort ]
            </button>
          </div>

          <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-white/10 group mb-6 flex-grow">
            <img
              src={
                product?.previewUrl ||
                "https://placehold.co/800x800/18181b/e4e4e7?text=ENCRYPTED"
              }
              alt={product?.title}
              className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105 ease-out"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(9,9,11,0.8)_100%)] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent pointer-events-none" />

            <div className="absolute top-0 right-0 p-4 pointer-events-none">
              <div className="h-1 w-8 bg-emerald-500/50 rotate-45 translate-x-3 -translate-y-1 blur-[1px]" />
            </div>
            <div className="absolute bottom-4 left-4 text-[9px] font-mono text-zinc-500 uppercase tracking-[0.3em]">
              ID: {product?.id.split("-")[0] || "SYS-001"}
            </div>
          </div>
        </div>

        {/* RIGHT PANE: The Data & Actions */}
        <div className="p-6 lg:p-10 flex flex-col relative z-10">
          <div className="mb-8">
            <span className="text-[10px] tracking-[0.2em] text-emerald-500 font-bold uppercase mb-2 block">
              {product?.category}
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tighter leading-tight mb-4">
              {product?.title}
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed font-light">
              {product?.description}
            </p>
          </div>

          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-5 mb-8 flex justify-between items-center backdrop-blur-sm">
            <div>
              <p className="text-[10px] text-zinc-500 uppercase font-mono tracking-widest mb-1">
                Exchange Value
              </p>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-mono font-bold text-white tracking-tighter">
                  ${Number(product?.priceUSD).toFixed(2)}
                </span>
                <span className="text-xs text-zinc-600 font-mono">USD</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-zinc-500 uppercase font-mono tracking-widest mb-1">
                Network
              </p>
              <p className="text-sm font-medium text-emerald-400 tracking-wide">
                SSL
              </p>
            </div>
          </div>

          {/* Execution Protocol (Payment Select) */}
          <div className="mb-6 flex-grow">
            <label className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold mb-3 block">
              Execution Protocol
            </label>
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-zinc-900/80 rounded-2xl border border-white/5 relative">
              <button
                onClick={() => setSelectedMethod("crypto")}
                className={`relative flex items-center justify-center gap-2 py-4 rounded-xl transition-all duration-300 text-xs uppercase tracking-widest font-bold z-10 ${
                  selectedMethod === "crypto"
                    ? "text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Wallet className="h-4 w-4" /> Crypto
              </button>
              <button
                onClick={() => setSelectedMethod("card")}
                className={`relative flex items-center justify-center gap-2 py-4 rounded-xl transition-all duration-300 text-xs uppercase tracking-widest font-bold z-10 ${
                  selectedMethod === "card"
                    ? "text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <CreditCard className="h-4 w-4" /> Card
              </button>

              <motion.div
                layoutId="activeMethodTab"
                className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-zinc-800 rounded-xl shadow-lg ring-1 ring-white/10"
                initial={false}
                animate={{
                  left: selectedMethod === "crypto" ? "6px" : "calc(50% + 3px)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>
          </div>

          {/* 🚨 THE NUCLEAR CLICKWRAP BOX */}
          <div className="mb-6 p-4 rounded-xl bg-zinc-900/50 border border-white/5 transition-all duration-200 dynamic-terms-container">
            <label className="flex items-start gap-3 cursor-pointer group selection:bg-transparent">
              <div className="relative flex items-center mt-0.5">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={handleCheckboxChange}
                  className="peer sr-only"
                />
                <div className="h-4 w-4 rounded border border-zinc-700 bg-zinc-950 transition-all peer-checked:border-emerald-500 peer-checked:bg-emerald-500 group-hover:border-zinc-500 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-sm bg-black opacity-0 transition-opacity peer-checked:opacity-100" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs text-zinc-400 leading-normal group-hover:text-zinc-300 transition-colors">
                  I authorize this transaction and acknowledge immediate digital
                  asset provisioning. I agree that all fulfillment logs are
                  final and explicitly wave standard chargeback provisions.
                </span>
                <a
                  href="/terms"
                  target="_blank"
                  className="text-[10px] text-emerald-500/70 hover:text-emerald-400 underline tracking-wide font-mono mt-1 transition-colors"
                >
                  Read Full Refund Agreement ↗
                </a>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={handleInitiateOrder}
              disabled={isPurchasing || !agreed}
              className="w-full relative overflow-hidden group/btn bg-white text-zinc-950 font-bold py-5 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span className="relative z-10 tracking-wide uppercase text-sm">
                {isPurchasing
                  ? "Establishing Uplink..."
                  : agreed
                  ? "Initialize Purchase"
                  : "Accept Terms to Unlock"}
              </span>
              {!isPurchasing && agreed && (
                <ChevronRight className="h-4 w-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
              )}
              {agreed && (
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-200 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
              )}
            </button>

            {/* Micro Telemetry Status Indicator */}
            {agreed && termsTimestamp && (
              <div className="flex items-center justify-center gap-1.5 text-zinc-500 text-[10px] font-mono uppercase tracking-wider animate-fade-in mb-2">
                <ShieldCheck className="h-3 w-3 text-emerald-500" />
                Consent Token Staged
              </div>
            )}

            {error && (
              <p className="text-center text-red-400 text-[10px] uppercase font-mono tracking-widest bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                {error}
              </p>
            )}

            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || cartSuccess}
              className={`w-full border py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-bold active:scale-[0.98]
                ${
                  cartSuccess
                    ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                    : "bg-transparent border-white/10 hover:border-white/20 text-zinc-400 hover:text-white"
                }
              `}
            >
              {isAddingToCart ? (
                <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
              ) : cartSuccess ? (
                <>Asset Reserved</>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" /> Reserve for later
                </>
              )}
            </button>
          </div>

          {/* Footer Metadata */}
          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[9px] text-zinc-600 font-mono">
            <div className="flex items-center gap-1.5 uppercase tracking-widest">
              <ShieldCheck className="h-3 w-3 text-emerald-500/70" /> Encrypted
              Protocol
            </div>
            <div className="uppercase tracking-widest">
              Lat: 6.5244° N | Lon: 3.3792° E
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- MAIN EXPORT W/ SUSPENSE BOUNDARY ---
export default function UnifiedCheckout() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 md:p-8 text-white font-sans selection:bg-emerald-500/30">
      {/* Background Grid Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative w-full z-10 flex flex-col items-center">
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
              <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
                Initializing Secure Container...
              </span>
            </div>
          }
        >
          <CheckoutCore />
        </Suspense>

        <div className="mt-12 flex items-center justify-center gap-3 opacity-30 text-[10px] uppercase tracking-[0.3em] font-mono">
          <CreditCard className="h-3 w-3" />
          <span>System_Core Checkout Architecture</span>
        </div>
      </div>
    </div>
  );
}
