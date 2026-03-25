import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const campaignId = searchParams.get("campaignId");

  if (!campaignId) {
    return NextResponse.json({ error: "campaignId obrigatório" }, { status: 400 });
  }

  const sessions = await prisma.session.findMany({
    where: { campaignId },
    orderBy: { number: "desc" },
    include: { _count: { select: { events: true, npcsPresent: true } } },
  });

  return NextResponse.json(sessions);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { campaignId, title, date } = body;

  if (!campaignId) {
    return NextResponse.json({ error: "campaignId obrigatório" }, { status: 400 });
  }

  const lastSession = await prisma.session.findFirst({
    where: { campaignId },
    orderBy: { number: "desc" },
  });

  const session = await prisma.session.create({
    data: {
      campaignId,
      number: (lastSession?.number ?? 0) + 1,
      title: title?.trim() || null,
      date: date ? new Date(date) : new Date(),
    },
  });

  return NextResponse.json(session, { status: 201 });
}
