"use client";

import React, { useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { fetchClientSecret } from "@/app/actions/stripe";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// 1. Move the core logic into a separate internal component
function PaymentCore() {
  const searchParams = useSearchParams();

  // Get product_id from URL
  const productId =
    searchParams.get("product_id") || searchParams.get("product_ud");
  const quantity = parseInt(searchParams.get("qty") || "1", 10);

  const getClientSecret = useCallback(async () => {
    if (!productId) {
      throw new Error("Missing product ID in checkout");
    }

    const secret = await fetchClientSecret(productId, quantity);

    if (!secret) {
      throw new Error("Failed to retrieve client secret");
    }

    return secret;
  }, [productId, quantity]);

  if (!productId) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-950 text-white">
        <p className="font-mono font-bold uppercase tracking-widest text-red-500">
          [ ERR: Invalid Asset Parameters ]
        </p>
      </div>
    );
  }

  return (
    // Changed bg-white to bg-zinc-950 to keep your dark premium vibe continuous, 
    // but you can revert to bg-white if Stripe embedded checkout looks better on light mode
    <div id="checkout" className="min-h-screen bg-zinc-950 pt-20"> 
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ fetchClientSecret: getClientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}

// 2. Wrap the Default Export in Next.js Suspense
export default function StripeCheckout() {
  return (
    <Suspense 
      fallback={
        <div className="flex flex-col h-screen w-full items-center justify-center bg-zinc-950 text-white gap-4">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-zinc-500">
            Establishing Secure Gateway...
          </p>
        </div>
      }
    >
      <PaymentCore />
    </Suspense>
  );
}