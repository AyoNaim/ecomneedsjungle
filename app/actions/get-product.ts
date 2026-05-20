"use server";

import { prisma } from "@/lib/prisma";

export async function getProduct(productId: string) {
  if (!productId) throw new Error("No product ID provided");

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      title: true,
      description: true,
      priceUSD: true,
      previewUrl: true,
    },
  });

  if (!product) throw new Error("Product not found");
  
  return product;
}