import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getVisibilityFilter } from "@/lib/visibility";

export async function GET() {
  try {
    const filter = await getVisibilityFilter();
    const campaigns = await prisma.campaign.findMany({
      where: { status: "active", ...filter },
      select: { id: true, name: true },
      orderBy: { updatedAt: "desc" },
      take: 5,
    });

    return NextResponse.json(campaigns);
  } catch {
    return NextResponse.json([]);
  }
}
