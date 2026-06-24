import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, priceUSD, previewUrl, r2Key, isAvailable } = body;

    // 1. Strict Validation
    if (!title || !description || priceUSD === undefined) {
      return NextResponse.json(
        { error: 'Missing required deployment parameters' },
        { status: 400 }
      );
    }

    // 2. Database Commit
    const product = await prisma.product.create({
      data: {
        title,
        description,
        priceUSD: parseFloat(priceUSD),
        previewUrl: previewUrl || 'pending',
        r2Key: r2Key || 'pending',
        isAvailable: isAvailable ?? true,
      },
    });

    // 3. Return created asset to update the UI optimistically
    return NextResponse.json(product, { status: 201 });
    
  } catch (error) {
    console.error('System Failure [POST /api/admin/products]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error during database commit' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    // Extract the ID from the query parameters (e.g., ?id=xyz)
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Target ID required for termination' },
        { status: 400 }
      );
    }

    // Database Purge
    await prisma.product.delete({
      where: { 
        id: id 
      },
    });

    return NextResponse.json({ success: true, message: 'Asset purged successfully' }, { status: 200 });
    
  } catch (error) {
    console.error('System Failure [DELETE /api/admin/products]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error during asset termination' },
      { status: 500 }
    );
  }
}