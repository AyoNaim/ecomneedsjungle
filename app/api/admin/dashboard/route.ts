import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 1. Fetch Products
    const products = await prisma.product.findMany({
      orderBy: { id: 'desc' }
    });

    // 2. Fetch Users with their cart and order counts
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: { orders: true, cartItems: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // 3. Fetch Orders (Ledger) with User and Product relations
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { email: true } },
        product: { select: { title: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      products,
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        purchases: u._count.orders,
        cartItems: u._count.cartItems,
        // Mocking status since isBlocked isn't in schema yet
        status: 'ACTIVE' 
      })),
      ledger: orders.map(o => ({
        id: o.id,
        tx: o.id.slice(0, 10), // Shortened ID for UI
        user: o.user.email,
        asset: o.product.title,
        amount: o.amount,
        status: o.status,
        time: o.createdAt
      }))
    });

  } catch (error) {
    console.error('Admin Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch telemetry' }, { status: 500 });
  }
}