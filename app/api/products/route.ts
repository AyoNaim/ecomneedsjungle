import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch all available products, ordered newest first
    const products = await prisma.product.findMany({
      where: { isAvailable: true },
      orderBy: { id: 'desc' },
      // Exclude r2Key from the client payload for absolute security
      select: {
        id: true,
        title: true,
        description: true,
        priceUSD: true,
        previewUrl: true,
      }
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("[CATALOG_FETCH_ERROR]", error);
    return new NextResponse("Failed to load catalog", { status: 500 });
  }
}