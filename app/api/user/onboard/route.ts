// app/api/user/onboard/route.ts
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. Authenticate the edge-session
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized. Node not verified.", { status: 401 });
    }

    const body = await req.json();
    const { name, base64Image } = body;

    // 2. Simple Validation (Database Safety)
    if (!name || name.length < 2) {
      return new NextResponse("Merchant alias required (min 2 chars).", { status: 400 });
    }

    // Crucial check: Base64 string must not exceed roughly ~65,000 characters for 50KB binary
    if (base64Image && base64Image.length > 70000) {
      return new NextResponse("Payload terminal: Image data too dense (>50KB).", { status: 413 });
    }

    if (!base64Image || base64Image === "") {
      return new NextResponse("Payload terminal: No Image data provided.", { status: 413 });
    }

    // 3. Update Supabase User record via Prisma
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name,
        image: base64Image || session.user.image, // Use new image or keep existing Google avatar
        isOnboarded: true, // 👈 THE GATE OPENER
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        image: updatedUser.image,
        isOnboarded: (updatedUser as any).isOnboarded,
      }
    });

  } catch (error) {
    console.error("[ONBOARDING_CORE_ERROR]", error);
    return new NextResponse("Internal System Failure during Initialization", { status: 500 });
  }
}