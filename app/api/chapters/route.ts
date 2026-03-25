import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const campaignId = searchParams.get("campaignId");

  if (!campaignId) {
    return NextResponse.json({ error: "campaignId obrigatório" }, { status: 400 });
  }

  const chapters = await prisma.chapter.findMany({
    where: { campaignId },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(chapters);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { campaignId, title } = body;

  if (!campaignId || !title?.trim()) {
    return NextResponse.json({ error: "campaignId e title obrigatórios" }, { status: 400 });
  }

  const lastChapter = await prisma.chapter.findFirst({
    where: { campaignId },
    orderBy: { sortOrder: "desc" },
  });

  const chapter = await prisma.chapter.create({
    data: {
      campaignId,
      title: title.trim(),
      sortOrder: (lastChapter?.sortOrder ?? -1) + 1,
    },
  });

  return NextResponse.json(chapter, { status: 201 });
}
