import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET — listar vínculos (?type=npc&id=xxx ou ?campaignId=xxx)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const id = searchParams.get("id");
    const campaignId = searchParams.get("campaignId");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (campaignId) {
      where.campaignId = campaignId;
    }

    if (type && id) {
      // Busca vínculos onde a entidade aparece como origem OU destino
      where.OR = [
        { fromType: type, fromId: id },
        { toType: type, toId: id },
      ];
    }

    const links = await prisma.link.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(links);
  } catch (error) {
    console.error("Erro ao listar vínculos:", error);
    return NextResponse.json({ error: "Erro ao listar vínculos" }, { status: 500 });
  }
}

// POST — criar vínculo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fromType, fromId, toType, toId, label, campaignId } = body;

    if (!fromType || !fromId || !toType || !toId || !campaignId) {
      return NextResponse.json(
        { error: "fromType, fromId, toType, toId e campaignId são obrigatórios" },
        { status: 400 },
      );
    }

    const link = await prisma.link.create({
      data: { fromType, fromId, toType, toId, label: label || null, campaignId },
    });

    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar vínculo:", error);
    return NextResponse.json({ error: "Erro ao criar vínculo" }, { status: 500 });
  }
}

// DELETE — excluir vínculo por ?id=xxx
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
    }

    await prisma.link.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao excluir vínculo:", error);
    return NextResponse.json({ error: "Erro ao excluir vínculo" }, { status: 500 });
  }
}
