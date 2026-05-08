export async function POST(amount: string) {
  const apiKey = process.env.CROSS_MINT_SERVER_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "Server configuration error: Missing API Key" },
      { status: 500 }
    );
  }

  const res = await fetch(
    "https://staging.crossmint.com/api/v1-alpha1/payouts",
    {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address: "0xf1Ba0212D9bd4303c02125a740D561594A181f45", // Source of funds
        amount: amount,
        currency: "usd",
        destination: {
          type: "bank_account",
          // These come from your Stripe Dashboard > Customer > Cash Balance
          accountNumber: process.env.STRIPE_ROUTING_NUMBER,
          routingNumber: process.env.STRIPE_ACCOUNT_NUMBER,
          accountType: "checking",
          country: "US",
        },
      }),
    }
  );

  return await res.json();
}
