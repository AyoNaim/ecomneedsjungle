import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';


export async function POST(request: Request) {
  const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBUElfS0VZIjoiM2QyNWU2ZDktZGJjYS00ZmM0LWIxYjEtNzAzMjBhYWM4ZDA4IiwiaWF0IjoxNzgzODQyNTI5LCJleHAiOjE3ODQ0NDczMjl9.sJudUs1qRgNYO2puQ85rdbghcpi2xz7fFoBBI9c4r4M"
  try {
    // 1. Authenticate the session entirely server-side
    const session = await auth();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized access token' }, { status: 401 });
    }
    const userEmail = session.user.email;

    // 2. Read only the product identifier from the incoming request body
    const { productId } = await request.json();
    
    if (!productId) {
      console.error("[API_ERROR]: targetId is undefined. Received body:", productId);
      return NextResponse.json(
        { error: 'Payload missing valid tracking identifier (productId).' },
        { status: 400 }
      );
    }
    // 3. Resolve the price securely on the server
    // Alternate Database lookup example:
    const plan = await prisma.product.findUnique({ where: { id: productId } });
    const strictAmount = plan?.priceUSD;

    if (!strictAmount) {
      return NextResponse.json({ error: 'Invalid item selection' }, { status: 400 });
    }

    // 4. Secure the target treasury wallet string away from client visibility
    const treasuryWallet = "0xB3dF186D943C884695f7ba1DD3ecc689bc02CC2d";
    if (!treasuryWallet) {
      console.error("Missing critical configuration: BUSINESS_WALLET_ADDRESS");
      return NextResponse.json({ error: 'Internal setup misconfiguration' }, { status: 500 });
    }

    // Determine target execution environments
    const isProduction = process.env.NODE_ENV === 'production';
    const baseUrl = isProduction 
      ? 'https://api-gateway.transak.com' 
      : 'https://api-gateway-stg.transak.com';

    // 5. Construct the final payment configuration payload
    const response = await fetch(`${baseUrl}/api/v2/auth/session`, {
      method: 'POST',
      headers: {
        'access-token': accessToken,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        widgetParams: {
          apiKey: process.env.NEXT_PUBLIC_TRANSAK_API_KEY,
          productsAvailed: "BUY",
          fiatCurrency: "USD",
          fiatAmount: strictAmount, // Secured value
          cryptoCurrencyCode: "USDC",
          network: "polygon", 
          walletAddress: treasuryWallet, // Secured value
          disableWalletAddressForm: true, 
          email: userEmail, // Secured value
          themeColor: "#18181b", 
          colorMode: "DARK",
          referrerDomain: process.env.AUTH_URL || "https://ubiquitous-parakeet-56rwgjppq54c7rp-3000.app.github.dev",
          redirectURL: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`
        }
      })
    });

    const data = await response.json();
    console.log("data returned by transak", data)
    return NextResponse.json({ data_retured: data });
    // return NextResponse.json({ widgetUrl: data.data?.widgetUrl || data.widgetUrl });
  } catch (error: any) {
    console.error("Transak session failure:", error.message);
    return NextResponse.json({ error: error.message || 'Failed to initialize secure session' }, { status: 500 });
  }
}