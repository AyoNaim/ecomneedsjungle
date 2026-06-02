import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.text()
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event;
    try {
        event = stripe.webhooks.constructEvent(
                body,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET!
            )
    } catch (error: any) {
      // the return line would stop database execution
        return NextResponse.json(`Webhook Error: ${error.message}`, { status: 400 })
    }

    const session = event?.data.object as any;
if (event?.type === "checkout.session.completed") {
    // Sync with your database here
    await prisma.order.create({
      data: {
        userId: session.metadata.userId,
        productId: session.metadata.productId,
        amount: session.amount_total / 100,
        status: "COMPLETED",
      },
    });
    
  }
  return new NextResponse(null, { status: 200 });
}