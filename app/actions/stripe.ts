"use server";

import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";

// Initialize Supabase inside the Server Action for secure data fetching
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function fetchClientSecret(productId: string, quantity: number) {
  const origin = (await headers()).get("origin");

  if (!productId) {
    throw new Error("Product ID is required to create a session.");
  }

  // 1. Fetch the official product data from Supabase
  // We do this on the server so users can't manipulate the price in the browser

  const product = await prisma.product.findUnique({
    where : {
      id: productId
    }
  })

  if (!product) {
    throw new Error("Could not find product in database.");
  }

  // 2. Create the Stripe Session using price_data (Dynamic Product Creation)
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded_page",
    line_items: [
      {
        price_data: {
          currency: "NGN",
          product_data: {
            name: product.title,
            images:
              product.previewUrl && product.previewUrl.length > 0
                ? [product.previewUrl[0]]
                : [],
            description: product.description || "",
          },
          // unit_amount is in the smallest currency unit (kobo for NGN, cents for USD)
          unit_amount: Math.round(Number(product.priceUSD) * 100),
        },
        quantity: quantity,
      },
    ],
    mode: "payment",
    return_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`,
  });

  // Return the client secret to the Embedded Checkout component
  return session.client_secret;
}