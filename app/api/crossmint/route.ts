import { NextResponse } from "next/server";

export async function POST() {
    const response = await fetch("https://staging.crossmint.com/api/2022-06-09/orders", {
        method: "POST",
        headers: {
            "X-API-KEY": process.env.CROSSMINT_SERVER_API_KEY!,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            payment: {
                method: "card", // "card" is the required string for onramp payments
                currency: "usd",
                receiptEmail: "ayonaim101@gmail.com", // 🚨 REQUIRED for Onramp KYC compliance
            },
            lineItems: [
                {
                    // 1. Switched to tokenLocator for fungible tokens
                    // 2. Format: <blockchain>:<contractAddress> (This is the official USDC contract on Amoy)
                    tokenLocator: "polygon-amoy:0x41E94Eb019C0762f9Bfcf9Fb1e58725bFb0e7582",
                    
                    // 3. Switched from callData to executionParameters
                    executionParameters: {
                        mode: "exact-in",
                        amount: "20.00", // The fiat amount you are charging
                    },
                },
            ],
            recipient: {
                walletAddress: "0xf1Ba0212D9bd4303c02125a740D561594A181f45"
            },
        }),
    });

    const data = await response.json();
    return NextResponse.json(data);
}