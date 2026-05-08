"use client";

import React, { useState } from "react";
import { CreditCard, Loader2, ArrowRight } from "lucide-react";

export default function CrossmintPayButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/crossmint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Add any dynamic data here, like user email or product ID
        body: JSON.stringify({ email: "ayonaim101@gmail.com" }),
      });

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Failed to create order");

      // Crossmint returns a 'hostedCheckoutUrl' in the order response
      if (data.hostedCheckoutUrl) {
        window.location.href = data.hostedCheckoutUrl;
      } else {
        throw new Error("No checkout URL returned from Crossmint.");
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-1 bg-gradient-to-tr from-zinc-800 to-zinc-900 rounded-2xl shadow-2xl">
      <div className="bg-zinc-950 p-8 rounded-[14px] border border-white/5">
        <div className="mb-6">
          <h3 className="text-xl font-medium text-white mb-2">Checkout</h3>
          <p className="text-zinc-400 text-sm">
            Purchase 20.00 USDC to your treasury.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-white/5">
            <span className="text-zinc-500">Asset</span>
            <span className="text-white font-mono">USDXM (Polygon)</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-white/5">
            <span className="text-zinc-500">Amount</span>
            <span className="text-white font-medium">$20.00</span>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full mt-8 flex items-center justify-center gap-2 py-4 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            <>
              Pay with Card
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        {error && (
          <p className="mt-4 text-center text-red-400 text-xs font-medium bg-red-400/10 py-2 rounded-lg">
            {error}
          </p>
        )}

        <div className="mt-6 flex items-center justify-center gap-2 opacity-30">
          <CreditCard className="h-3 w-3 text-white" />
          <span className="text-[10px] uppercase tracking-widest text-white">
            Secure Cloud Infrastructure
          </span>
        </div>
      </div>
    </div>
  );
}
