import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        // 1. Extract the dynamic amount (and optionally email) from the frontend request
        const body = await req.json();
        const { amount, userEmail } = body;

        // Failsafe: Ensure the frontend actually sent an amount
        if (!amount) {
            return NextResponse.json({ error: "Amount is required" }, { status: 400 });
        }

        // 2. Switched to the PRODUCTION Crossmint URL (www instead of staging)
        const response = await fetch("https://www.crossmint.com/api/2022-06-09/orders", {
            method: "POST",
            headers: {
                "X-API-KEY": process.env.CROSSMINT_SERVER_API_KEY!,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                payment: {
                    method: "card", 
                    currency: "usd",
                    // Makes the receipt email dynamic if provided, otherwise uses a fallback
                    receiptEmail: userEmail || "ayonaim101@gmail.com", 
                },
                lineItems: [
                    {
                        // 3. Switched to Polygon Mainnet and the official Native USDC contract
                        tokenLocator: "polygon:0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
                        
                        executionParameters: {
                            mode: "exact-in",
                            // 4. Injects the dynamic amount. Converted to String to satisfy the API
                            amount: String(amount), 
                        },
                    },
                ],
                recipient: {
                    // Ensure this is your secure production Admin wallet
                    walletAddress: "0xB3dF186D943C884695f7ba1DD3ecc689bc02CC2d"
                },
            }),
        });

        const data = await response.json();
        return NextResponse.json(data);
        
    } catch (error) {
        console.error("Payment API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}