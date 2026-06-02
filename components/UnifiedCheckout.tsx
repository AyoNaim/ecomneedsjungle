"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, Loader2, ChevronRight, ShoppingCart, 
  ShieldCheck, Building2, Terminal, AlertTriangle, Cpu
} from "lucide-react";

// --- TYPES ---
type PaymentMethod = "card" | "transfer";

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
  
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("card");
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

  // 1. Fetch Product Data
  useEffect(() => {
    if (!productId) {
      setError("ERR_NO_ASSET_ID: Search parameters missing valid tracking identifier.");
      setIsLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        // Fetching from your existing catalog API
        const res = await fetch("/api/products");
        const data = await res.json();
        
        if (data.success || data.products) {
          const foundProduct = data.products.find((p: Product) => p.id === productId);
          if (foundProduct) {
            setProduct({
              ...foundProduct,
              category: foundProduct.category || "DIGITAL ASSET"
            });
          } else {
            setError(`ERR_ASSET_NOT_FOUND: Registry query for ID ${productId.substring(0,8)}... returned null.`);
          }
        }
      } catch (err) {
        setError("ERR_NETWORK_FAILURE: Unable to establish uplink to registry database.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // 2. Original Crossmint Purchase Logic
  const handleInitiateOrder = async () => {
    if (!product) return;
    setIsPurchasing(true);

    try {
      const response = await fetch("/api/crossmint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Using session email if available, fallback to default
        body: JSON.stringify({ email: session?.user?.email || "ayonaim101@gmail.com" }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.message || "Failed to establish secure payment channel");
      }

      if (data.order?.orderId && data.clientSecret) {
        // Route to success/processing page with data
        router.push(`/processing?order=${data.order.orderId}`);
      } else {
        throw new Error("API response missing validation keys.");
      }
    } catch (err: any) {
      console.error(err.message);
      // Optional: Add toast notification here for err.message
    } finally {
      setIsPurchasing(false);
    }
  };

  // 3. Cart Integration
  const handleAddToCart = async () => {
    if (!product || !session?.user) {
      // If not logged in, you might want to route to login
      return router.push('/api/auth/signin');
    }
    
    setIsAddingToCart(true);
    
    try {
      // TODO: Replace with your actual database cart POST route
      // e.g., await fetch("/api/cart", { method: "POST", body: JSON.stringify({ productId, userId: session.user.id }) })
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulated DB delay
      
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
        <span className="text-xs font-mono tracking-[0.3em] uppercase text-zinc-500">Decrypting Asset Payload...</span>
      </div>
    );
  }

  // --- RENDER: ERROR / MISSING PRODUCT STATE ---
  if (error || !product) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center h-[60vh]"
      >
        <div className="max-w-md w-full bg-zinc-950 border border-red-500/20 p-8 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50" />
          <AlertTriangle className="w-10 h-10 text-red-500 mb-4" />
          <h2 className="text-xl font-mono font-bold text-white mb-2">SYSTEM FAULT</h2>
          <p className="text-xs font-mono text-zinc-500 tracking-wider leading-relaxed mb-6">
            {error}
          </p>
          <button 
            onClick={() => router.push('/catalog')}
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

        {/* LEFT PANE: The Asset Visualizer (ProductPreview merged) */}
        <div className="relative p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-white/5 bg-zinc-900/20 flex flex-col justify-between">
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.2em]">Secure Terminal</span>
            </div>
            <button onClick={() => router.back()} className="text-[10px] text-zinc-500 hover:text-white uppercase tracking-widest transition-colors font-mono">
              [ Abort ]
            </button>
          </div>

          <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-white/10 group mb-6 flex-grow">
            <img
              src={product.previewUrl || "https://placehold.co/800x800/18181b/e4e4e7?text=ENCRYPTED"}
              alt={product.title}
              className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105 ease-out"
            />
            {/* Cyberpunk Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(9,9,11,0.8)_100%)] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent pointer-events-none" />
            
            {/* Corner Tech Accents */}
            <div className="absolute top-0 right-0 p-4 pointer-events-none">
              <div className="h-1 w-8 bg-emerald-500/50 rotate-45 translate-x-3 -translate-y-1 blur-[1px]" />
            </div>
            <div className="absolute bottom-4 left-4 text-[9px] font-mono text-zinc-500 uppercase tracking-[0.3em]">
              ID: {product.id.split('-')[0] || "SYS-001"}
            </div>
          </div>
        </div>

        {/* RIGHT PANE: The Data & Actions (ProductDescription merged) */}
        <div className="p-6 lg:p-10 flex flex-col relative z-10">
          
          {/* Header Info */}
          <div className="mb-8">
            <span className="text-[10px] tracking-[0.2em] text-emerald-500 font-bold uppercase mb-2 block">
              {product.category}
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tighter leading-tight mb-4">
              {product.title}
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed font-light">
              {product.description}
            </p>
          </div>

          {/* Value Display */}
          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-5 mb-8 flex justify-between items-center backdrop-blur-sm">
            <div>
              <p className="text-[10px] text-zinc-500 uppercase font-mono tracking-widest mb-1">Exchange Value</p>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-mono font-bold text-white tracking-tighter">
                  ${Number(product.priceUSD).toFixed(2)}
                </span>
                <span className="text-xs text-zinc-600 font-mono">USD</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-zinc-500 uppercase font-mono tracking-widest mb-1">Network</p>
              <p className="text-sm font-medium text-emerald-400 tracking-wide">SSL</p>
            </div>
          </div>

          {/* Execution Protocol (Payment Select) */}
          <div className="mb-8 flex-grow">
            <label className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold mb-3 block">
              Execution Protocol
            </label>
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-zinc-900/80 rounded-2xl border border-white/5 relative">
              <button
                onClick={() => setSelectedMethod("card")}
                className={`relative flex items-center justify-center gap-2 py-4 rounded-xl transition-all duration-300 text-xs uppercase tracking-widest font-bold z-10 ${
                  selectedMethod === "card" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <CreditCard className="h-4 w-4" /> Card
              </button>
              <button
                onClick={() => setSelectedMethod("transfer")}
                className={`relative flex items-center justify-center gap-2 py-4 rounded-xl transition-all duration-300 text-xs uppercase tracking-widest font-bold z-10 ${
                  selectedMethod === "transfer" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Building2 className="h-4 w-4" /> Transfer
              </button>

              {/* Animated Gliding Background for Selection */}
              <motion.div 
                layoutId="activeMethodTab"
                className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-zinc-800 rounded-xl shadow-lg ring-1 ring-white/10"
                initial={false}
                animate={{ 
                  left: selectedMethod === "card" ? "6px" : "calc(50% + 3px)" 
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={handleInitiateOrder}
              disabled={isPurchasing}
              className="w-full relative overflow-hidden group/btn bg-white text-zinc-950 font-bold py-5 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 tracking-wide uppercase text-sm">
                {isPurchasing ? "Establishing Uplink..." : "Initialize Purchase"}
              </span>
              {!isPurchasing && <ChevronRight className="h-4 w-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" />}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-200 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
            </button>

            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || cartSuccess}
              className={`w-full border py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-bold active:scale-[0.98]
                ${cartSuccess 
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
                <><ShoppingCart className="h-4 w-4" /> Reserve for later</>
              )}
            </button>
          </div>

          {/* Footer Metadata */}
          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[9px] text-zinc-600 font-mono">
            <div className="flex items-center gap-1.5 uppercase tracking-widest">
              <ShieldCheck className="h-3 w-3 text-emerald-500/70" /> Encrypted Protocol
            </div>
            {/* Keeping the specific coordinates as requested in your original setup */}
            <div className="uppercase tracking-widest">Lat: 6.5244° N | Lon: 3.3792° E</div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}

// --- MAIN EXPORT W/ SUSPENSE BOUNDARY ---
// Wrapping in Suspense is required when using useSearchParams in Next.js App Router
export default function UnifiedCheckout() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 md:p-8 text-white font-sans selection:bg-emerald-500/30">
      
      {/* Background Grid Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative w-full z-10 flex flex-col items-center">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">Initializing Secure Container...</span>
          </div>
        }>
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