"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  Zap, 
  CreditCard, 
  Building2, 
  ShoppingCart, 
  ChevronRight,
  Info
} from "lucide-react";
import { useRouter } from "next/navigation";

type PaymentMethod = "card" | "transfer";

interface Feature {
  label: string;
  value: string;
}

interface ProductDescriptionProps {
  title?: string;
  price?: string;
  description?: string;
  features?: Feature[];
  onMethodChange?: (method: PaymentMethod) => void;
  onBuyNow?: () => void;
  onAddToCart?: () => void;
}

export default function ProductDescription({
  title = "20.00 USDC Liquidity",
  price = "$20.00",
  description = "Secure 20.00 USDC directly into your vault on the Polygon network. Guaranteed low-latency execution and high-fidelity smart contract security.",
  features = [
    { label: "Network", value: "Polygon POS" },
    { label: "Asset Type", value: "Stablecoin" },
    { label: "Est. Time", value: "< 2 mins" },
    { label: "Slippage", value: "0.01%" }
  ],
  onMethodChange = (method) => console.log("Method changed:", method),
  onBuyNow = () => console.log("Initialize purchase..."),
  onAddToCart = () => console.log("Item reserved.")
}: ProductDescriptionProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("card");

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    onMethodChange(method);
  };

  const router = useRouter();
  const handleBuyNow = () => {
    selectedMethod === 'card' ? router.push('/card-purchase') : router.push('/payment')
  };

  return (
    <div className="w-full max-w-md bg-zinc-950 border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
      {/* Subtle Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[100px] pointer-events-none" />

      {/* Header & Price */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Asset v1.0.4</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-500 uppercase font-medium">Price</p>
          <p className="text-xl font-mono font-bold text-emerald-400">{price}</p>
        </div>
      </div>

      {/* Description Body */}
      <div className="space-y-4 mb-8">
        <p className="text-sm text-zinc-400 leading-relaxed">
          {description}
        </p>
        
        {/* Technical Specs / Features */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
          {features.map((f, i) => (
            <div key={i} className="bg-zinc-900/50 p-3 rounded-xl border border-white/5">
              <p className="text-[10px] text-zinc-500 uppercase mb-1">{f.label}</p>
              <p className="text-xs font-medium text-zinc-200">{f.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Method Selector */}
      <div className="mb-8">
        <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-3 block">
          Execution Protocol
        </label>
        <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-900 rounded-2xl border border-white/5">
          <button
            onClick={() => handleMethodSelect("card")}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 text-sm font-medium ${
              selectedMethod === "card" 
                ? "bg-zinc-800 text-white shadow-lg ring-1 ring-white/10" 
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <CreditCard className="h-4 w-4" /> Card
          </button>
          <button
            onClick={() => handleMethodSelect("transfer")}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 text-sm font-medium ${
              selectedMethod === "transfer" 
                ? "bg-zinc-800 text-white shadow-lg ring-1 ring-white/10" 
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Building2 className="h-4 w-4" /> Transfer
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleBuyNow}
          className="w-full relative overflow-hidden group/btn bg-white text-black font-bold py-4 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span className="relative z-10">Initialize Purchase</span>
          <ChevronRight className="h-4 w-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-200 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
        </button>

        <button
          onClick={onAddToCart}
          className="w-full bg-transparent border border-white/10 hover:border-white/20 text-white font-medium py-4 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <ShoppingCart className="h-4 w-4 text-zinc-500" /> 
          <span className="text-sm">Reserve for later</span>
        </button>
      </div>

      {/* Footer Info */}
      <div className="mt-6 flex items-center justify-between text-[9px] text-zinc-600 font-mono">
        <div className="flex items-center gap-1 uppercase tracking-tighter">
          <ShieldCheck className="h-3 w-3" /> Encrypted Transaction
        </div>
        <div className="uppercase">Lat: 6.5244° N | Lon: 3.3792° E</div>
      </div>
    </div>
  );
}