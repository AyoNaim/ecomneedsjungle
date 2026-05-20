"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { 
  CreditCard, Loader2, ChevronRight, ShieldCheck, 
  Building2, AlertCircle, ShoppingCart 
} from "lucide-react";
import Image from "next/image";
import { getProduct } from "@/app/actions/get-product";

export default function UnifiedCheckout() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("product_id");
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState<"card" | "transfer">("card");

  useEffect(() => {
    if (!productId) {
      setError("Asset signature not found in link.");
      setLoading(false);
      return;
    }

    getProduct(productId)
      .then((data: any) => setProduct(data))
      .catch(() => setError("Asset unavailable or restricted."))
      .finally(() => setLoading(false));
  }, [productId]);

  // ANIMATION VARIANTS
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
    </div>
  );

  if (error || !product) return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
        <AlertCircle className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
        <h2 className="text-white font-mono uppercase tracking-widest">{error || "404: Asset Null"}</h2>
      </motion.div>
    </div>
  );

  return (
    <main className="min-h-screen bg-black text-white p-6 flex items-center justify-center font-sans">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg bg-zinc-950/50 backdrop-blur-2xl border border-white/5 rounded-3xl p-1 shadow-[0_0_50px_-12px_rgba(16,185,129,0.15)] overflow-hidden"
      >
        {/* PRODUCT PREVIEW AREA */}
        <div className="relative p-3">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/5">
            <Image 
              src={product.previewUrl} 
              alt={product.title} 
              fill 
              className="object-cover grayscale hover:grayscale-0 transition-all duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <span className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase">Digital Asset</span>
              <h1 className="text-xl font-bold">{product.title}</h1>
            </div>
          </div>
        </div>

        {/* DESCRIPTION & CONTROLS */}
        <div className="px-6 pb-6 pt-2">
          <p className="text-sm text-zinc-400 leading-relaxed mb-6 font-light">
            {product.description}
          </p>

          {/* PAYMENT SELECTOR */}
          <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-black/40 rounded-xl border border-white/5">
            <button onClick={() => setMethod("card")} className={`py-3 rounded-lg text-xs font-bold transition-all ${method === 'card' ? 'bg-zinc-800 text-white' : 'text-zinc-600'}`}>
              <CreditCard className="inline mr-2 w-3 h-3" /> CARD
            </button>
            <button onClick={() => setMethod("transfer")} className={`py-3 rounded-lg text-xs font-bold transition-all ${method === 'transfer' ? 'bg-zinc-800 text-white' : 'text-zinc-600'}`}>
              <Building2 className="inline mr-2 w-3 h-3" /> TRANSFER
            </button>
          </div>

          {/* ACTION BUTTON */}
          <button className="w-full bg-white text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-400 transition-colors">
            EXECUTE PURCHASE (${Number(product.priceUSD).toFixed(2)})
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="mt-6 flex justify-between items-center text-[10px] text-zinc-600 uppercase tracking-widest font-mono">
             <div className="flex items-center gap-1"><ShieldCheck className="w-3 h-3"/> Encrypted</div>
             <div>Status: Ready</div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}