import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = Promise<{ id: string }>;

export async function PATCH(request: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const body = await request.json();

  const data: Record<string, unknown> = {};
  if (body.title !== undefined) data.title = body.title?.trim() || null;
  if (body.notes !== undefined) data.notes = body.notes?.trim() || null;
  if (body.date !== undefined) data.date = body.date ? new Date(body.date) : null;
  if (body.durationMin !== undefined) data.durationMin = body.durationMin ? parseInt(body.durationMin) : null;
  if (body.aiRecap !== undefined) data.aiRecap = body.aiRecap?.trim() || null;

  const session = await prisma.session.update({ where: { id }, data });
  return NextResponse.json(session);
}

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  await prisma.session.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
