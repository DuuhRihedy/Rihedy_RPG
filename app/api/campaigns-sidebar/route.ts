import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
      where: { status: "active" },
      select: { id: true, name: true },
      orderBy: { updatedAt: "desc" },
      take: 5,
    });

    return NextResponse.json(campaigns);
  } catch {
    return NextResponse.json([]);
  }
}
