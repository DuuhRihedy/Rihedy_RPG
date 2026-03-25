import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const campaignId = searchParams.get("campaignId");

  const where = campaignId ? { campaignId } : {};

  const maps = await prisma.map.findMany({
    where,
    include: { campaign: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(maps);
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const name = (formData.get("name") as string)?.trim();
  const type = (formData.get("type") as string) || "other";
  const description = (formData.get("description") as string)?.trim() || null;
  const imageUrl = formData.get("imageUrl") as string;
  const campaignId = (formData.get("campaignId") as string) || null;

  if (!name || !imageUrl) {
    return NextResponse.json({ error: "Nome e imagem são obrigatórios" }, { status: 400 });
  }

  const map = await prisma.map.create({
    data: {
      name,
      type,
      description,
      imageUrl,
      ...(campaignId && { campaignId }),
    },
  });

  return NextResponse.json(map, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
  }

  await prisma.map.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
