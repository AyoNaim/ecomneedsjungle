"use client";

import { useEffect, useState } from "react";
import {
  CrossmintProvider,
  CrossmintCheckoutProvider,
  CrossmintEmbeddedCheckout,
} from "@crossmint/client-sdk-react-ui";

export default function CrossmintPage() {
  const [isMounted, setIsMounted] = useState(false);

  // API Keys from your .env
  const clientApiKey = process.env.NEXT_PUBLIC_CLIENT_API_KEY || "";
  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "";
  const collectionId = process.env.NEXT_PUBLIC_COLLECTION_ID || "";

  if (!clientApiKey || !collectionId) return <div>no env keys</div>
  // 1. Prevent Hydration Error: Ensure we only render the SDK on the client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted)
    return <div className="p-10 text-center">Initializing Checkout...</div>;

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-6 bg-white">
      {/* 2. CrossmintProvider manages the API connection */}
      <CrossmintProvider apiKey={clientApiKey}>
        {/* 3. CrossmintCheckoutProvider is REQUIRED for the Embedded component */}
        <CrossmintCheckoutProvider>
          <div className="max-w-[450px] w-full shadow-lg rounded-xl overflow-hidden border border-gray-100">
            <CrossmintEmbeddedCheckout
              orderId={"150a1df5-3550-47ae-9d8c-d0cc2012d7c6"}
              clientSecret={"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmRlcklkZW50aWZpZXIiOiIxNTBhMWRmNS0zNTUwLTQ3YWUtOWQ4Yy1kMGNjMjAxMmQ3YzYiLCJjb2xsZWN0aW9uSWQiOiI0N2VmMzE1MC01NjFhLTQyNjktOWM3OC1jMWY3YzQ3MjE3NmUiLCJpYXQiOjE3NzgzOTkxMTksImV4cCI6MTc3ODQ4NTUxOX0.i8iCzYXabsjZFQArwKYDSYaH44mwVvz0gGglaniyKzg"}
              
              payment={{
                fiat: { enabled: true },
                crypto: { enabled: true },
              }}
              appearance={{
                variables: {
                  borderRadius: "8px",
                },
              }}
            />
          </div>
        </CrossmintCheckoutProvider>
      </CrossmintProvider>
    </div>
  );
}
