"use server";

import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function fetchClientSecret(productId: string, quantity: number) {
  
  const sessionUser = await auth();
  
  if (!sessionUser?.user?.email || !sessionUser.user.id) {
    throw new Error("You must be logged in to initiate bank transfer checkout.")
  };

  const origin = (await headers()).get("origin");

  if (!productId) {
    throw new Error("Product ID is required to create a session.");
  }

  // 1. Fetch the official product data from Supabase
  // We do this on the server so users can't manipulate the price in the browser

  const [product, dbUser] = await Promise.all([
    prisma.product.findUnique({ where: { id: productId }}),
    prisma.user.findUnique({ where: { id: sessionUser.user.id }})
  ])

  if (!product) throw new Error("Could not find product in database.");
  if (!dbUser) throw new Error("User record missing from system database.");


  let stripeCustomerId: string;

  if (dbUser.stripeCustomerId) {
    stripeCustomerId = dbUser.stripeCustomerId;
  } else {
    const newCustomer = await stripe.customers.create({
      email: sessionUser.user.email,
      name: sessionUser.user.name || undefined,
      metadata: {
        userId: sessionUser.user.id
      }
    });
    
    stripeCustomerId = newCustomer.id;
  };

  await prisma.user.update({
    where: { id: dbUser.id},
    data: {
      stripeCustomerId
    }
})
  // 2. Create the Stripe Session using price_data (Dynamic Product Creation)
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded_page",
    customer: stripeCustomerId,
    payment_method_types: [
      "us_bank_account",
      "customer_balance",
      "alipay"
    ],
    payment_method_options: {
          customer_balance: {
            funding_type: "bank_transfer",
            bank_transfer: {
              type: "eu_bank_transfer", // Defines the routing format (e.g., US routing numbers)
            },
          },
        },
    line_items: [
      {
        price_data: {
          currency: "USD",
          product_data: {
            name: product.title,
            images: product.previewUrl ? [product.previewUrl] : [],
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