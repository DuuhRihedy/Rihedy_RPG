import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = Promise<{ id: string }>;

export async function PATCH(request: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const body = await request.json();

  const data: Record<string, unknown> = {};
  if (body.title !== undefined) data.title = body.title?.trim() || "";
  if (body.content !== undefined) data.content = body.content || "";
  if (body.sortOrder !== undefined) data.sortOrder = body.sortOrder;

  const chapter = await prisma.chapter.update({ where: { id }, data });
  return NextResponse.json(chapter);
}

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  await prisma.chapter.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
