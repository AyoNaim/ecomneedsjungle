"use client";

import React, { useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Script from "next/script";
import { Loader2, ArrowRight, CreditCard, CheckCircle2 } from "lucide-react";
import { initializePaystackTransaction } from "@/app/actions/paystack";

// Extend the window interface to register Paystack globally from the CDN script
declare global {
  interface Window {
    PaystackPop: any;
  }
}

function PaymentCore() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  // 🛡️ Telemetry State
  const [agreed, setAgreed] = useState(false);
  const [termsTimestamp, setTermsTimestamp] = useState<string | null>(null);

  // Extract parameters from route query
  const productId = searchParams.get("product_id") || searchParams.get("product_ud");
  const quantity = parseInt(searchParams.get("qty") || "1", 10);

  const toggleAgreement = () => {
    if (!agreed) {
      setTermsTimestamp(new Date().toISOString());
      setAgreed(true);
    } else {
      setTermsTimestamp(null);
      setAgreed(false);
    }
  };

  const handleInitiateOrder = useCallback(async () => {
    if (!productId) {
      setError("Missing product verification parameters.");
      return;
    }

    if (!agreed || !termsTimestamp) {
      setError("You must accept the waiver terms to proceed.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Securely calculate price, generate reference, and fetch key from Server Side
      // Pass the telemetry data to be logged in the database transaction
      const transactionData = await initializePaystackTransaction(
        productId, 
        quantity,
        agreed,
        termsTimestamp  
      );

      if (!transactionData || !transactionData.success) {
        throw new Error(transactionData?.error || "Failed to initialize payment gateway.");
      }

      const { publicKey, email, amountInCents, reference, currency } = transactionData;

      // 2. Open the Paystack Pop-Up Secure Overlay
      const popup = new window.PaystackPop();
      popup.newTransaction({
        key: publicKey,
        email: email,
        amount: amountInCents,
        currency: currency,
        ref: reference,
        onSuccess: (transaction: { reference: string }) => {
          setPaymentSuccess(true);
          setLoading(false);
        },
        onCancel: () => {
          setLoading(false);
          setError("Transaction was cancelled by user.");
        },
      });

    } catch (err: any) {
      setError(err.message || "An unhandled execution error occurred.");
      setLoading(false);
    }
  }, [productId, quantity, agreed, termsTimestamp]);

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
    <>
      <Script 
        src="https://js.paystack.co/v2/inline.js" 
        strategy="afterInteractive"
      />

      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white font-sans">
        <div className="w-full max-w-md">
          
          {!paymentSuccess ? (
            /* VIEW 1: Premium Dark Order Summary Form */
            <div className="p-1 bg-gradient-to-tr from-zinc-800 to-zinc-900 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-300">
              <div className="bg-zinc-950 p-8 rounded-[14px] border border-white/5">
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-white mb-2">Order Summary</h3>
                  <p className="text-zinc-400 text-sm">Review asset procurement details prior to deployment.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <span className="text-zinc-500">Asset Identity</span>
                    <span className="text-white font-mono text-sm max-w-[180px] truncate">
                      {productId}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <span className="text-zinc-500">Quantity</span>
                    <span className="text-white font-mono text-sm">{quantity}</span>
                  </div>
                </div>

                {/* 🛡️ Premium Agreement Component */}
                <div className="mt-8 flex items-start gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreed}
                    onChange={toggleAgreement}
                    className="mt-1 h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-[11px] text-zinc-400 leading-relaxed cursor-pointer select-none">
                    I acknowledge and agree to waive all rights to chargebacks or disputes for this transaction. This agreement is legally binding and the timestamp of acceptance will be recorded: <span className="font-mono text-zinc-500">{termsTimestamp || "pending..."}</span>
                  </label>
                </div>

                <button
                  onClick={handleInitiateOrder}
                  disabled={loading || !agreed}
                  className="w-full mt-8 flex items-center justify-center gap-2 py-4 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    <>
                      Pay with Card <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                {error && (
                  <p className="mt-4 text-center text-red-400 text-xs bg-red-400/10 py-2 rounded-lg font-mono">
                    {error}
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* VIEW 2: Premium Success Confirmation View */
            <div className="p-1 bg-gradient-to-tr from-emerald-500/20 to-zinc-900 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-500">
              <div className="bg-zinc-950 p-8 rounded-[14px] border border-emerald-500/10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 mb-4">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">Transaction Authorized</h3>
                <p className="text-zinc-400 text-sm mb-6">
                  Payment confirmed successfully. Asset initialization in progress.
                </p>
                <button
                  onClick={() => router.push("/catalog")}
                  className="w-full py-3 bg-zinc-900 text-white font-medium rounded-xl border border-white/5 hover:bg-zinc-800 transition-colors text-sm"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-center gap-2 opacity-20">
            <CreditCard className="h-3 w-3" />
            <span className="text-[10px] uppercase tracking-widest font-mono">
              Secure Paystack Gateway Matrix
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default function PaystackCheckout() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col h-screen w-full items-center justify-center bg-black text-white gap-4">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-zinc-500">
            Parsing Gateway Security Protocol...
          </p>
        </div>
      }
    >
      <PaymentCore />
    </Suspense>
  );
}
