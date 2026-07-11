import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. Parse the incoming request body
    const body = await request.json();
    const { productId } = body;

    // 2. Validate the payload
    if (!productId) {
      return NextResponse.json(
        { error: 'Missing productId in request body.' },
        { status: 400 }
      );
    }

    // 3. Query the exact product from the database
    const product = await prisma.product.findUnique({
      where: { 
        id: productId 
      },
      // Select only the fields you need to send to the frontend to minimize payload size
      select: {
        id: true,
        title: true,
        // Assuming your DB stores price as a float or decimal
        priceUSD: true, 
      }
    });

    // 4. Handle non-existent products
    if (!product) {
      return NextResponse.json(
        { error: `No asset found matching ID: ${productId}` },
        { status: 404 }
      );
    }

    // 5. Return the exact product
    return NextResponse.json({ product }, { status: 200 });

  } catch (error) {
    console.error('[PRODUCT_FETCH_ERROR]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error while querying the database.' },
      { status: 500 }
    );
  }
}