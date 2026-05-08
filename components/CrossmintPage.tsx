"use client";

import {
  CrossmintProvider,
  CrossmintEmbeddedCheckout,
} from "@crossmint/client-sdk-react-ui";

export default function CrossmintPage() {
  const clientApiKey = process.env.NEXT_PUBLIC_CLIENT_API_KEY as string;
  const collectionId = process.env.NEXT_PUBLIC_COLLECTION_ID as string;

  return (
    <div className="flex flex-col items-center justify-start h-screen p-6 bg-white">
      <CrossmintProvider apiKey={clientApiKey}>
        <div className="max-w-[450px] w-full">
          <CrossmintEmbeddedCheckout
            lineItems={{
              collectionLocator: `crossmint:${collectionId}`,
              callData: {
                totalPrice: "0.001",
                quantity: 1,
              },
            }}
            payment={{
              crypto: { enabled: true },
              fiat: { enabled: true },
            }}
          />
        </div>
      </CrossmintProvider>
    </div>
  );
}
