"use client"; // 1. This MUST be the very first line

import { useEffect, useState } from "react";
import {
  CrossmintProvider,
  CrossmintCheckoutProvider,
  CrossmintEmbeddedCheckout,
} from "@crossmint/client-sdk-react-ui";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  // 2. Prevent Hydration Error: Only render after the component mounts on the client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted)
    return <div className="p-10 text-white">Loading Marketplace...</div>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
        <h1 className="text-2xl font-bold text-white mb-6">Elite Checkout</h1>

        {/* 3. The Providers */}
        <CrossmintProvider
          apiKey={process.env.NEXT_PUBLIC_CROSSMINT_CLIENT_KEY || ""}
        >
          <CrossmintCheckoutProvider>
            <CrossmintEmbeddedCheckout
              // Make sure these match your .env or replace with your strings directly
              projectId={process.env.NEXT_PUBLIC_CROSSMINT_PROJECT_ID || ""}
              collectionId={
                process.env.NEXT_PUBLIC_CROSSMINT_COLLECTION_ID || ""
              }
              environment="staging"
              payment={{
                fiat: { enabled: true },
                crypto: { enabled: false },
              }}
              // If you're doing an NFT, you might need a recipient
              recipient={{
                email: "test-user@example.com", // Placeholder
              }}
              appearance={{
                variables: {
                  fontFamily: "Inter, sans-serif",
                  borderRadius: "12px",
                  colors: {
                    backgroundPrimary: "#18181b", // zinc-900
                    textPrimary: "#ffffff",
                    accent: "#3b82f6", // blue-500
                  },
                },
              }}
            />
          </CrossmintCheckoutProvider>
        </CrossmintProvider>
      </div>
    </main>
  );
}
