// create USDC stablecoin order

export async function POST(req: Request) {
  const apiKey = process.env.CROSSMINT_SERVER_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "Server configuration error: Missing API Key" },
      { status: 500 }
    );
  }

  const response = await fetch(
    "https://staging.crossmint.com/api/2022-06-09/orders",
    {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient: {
          walletAddress: process.env.CROSSMINT_WALLET_ADDRESS,
        },
        payment: {
          method: "card",
          currency: "usd",
          payerEmail: "ayonaim101@gmail.com",
        },
        lineItems: [
          {
            // For fungible tokens, use the blockchain:address format
            collectionLocator:
              "polygon-amoy:0x14196F08a4Fa0B66B7331bC40dd6bCd8A1dEeA9F",
            callData: {
              _amount: "20.00",
              totalPrice: "20.00",
            },
          },
        ],
      }),
    }
  );

  const order = await response.json();

  if (!response.ok) {
    console.error("Crossmint Error:", order);
    return Response.json({ error: order.message }, { status: response.status });
  }

  return Response.json({
    clientSecret: order.clientSecret,
    orderId: order.orderId,
  });
}
