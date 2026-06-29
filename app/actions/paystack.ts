"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function initializePaystackTransaction(productId: string, quantity: number, agreed: boolean, termsTimestamp: any) {
  try {
    // 1. Fetch active session user email securely
    const session = await auth();
    const userEmail = session?.user?.email;

    // 2. Fetch original product price from database to guarantee security
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new Error("Product data reference unresolved.");
    const basePrice: any = product.priceUSD;
    const totalAmount = quantity * basePrice;
    
    // Paystack takes amounts in lowest currency denominations (Kobo for NGN / Cents for USD)
    const amountInCents = Math.round(totalAmount * 100 * 1500); 
    const customReference = `ESJ-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    return {
      success: true,
      publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
      amountInCents,
      email: userEmail,
      reference: customReference,
      currency: "NGN",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed context initialization",
    };
  }
}
