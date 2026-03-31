import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const npcs = await prisma.npc.findMany({
      select: {
        id: true,
        name: true,
        race: true,
        class: true,
        level: true,
        alignment: true,
        type: true,
        status: true,
        description: true,
        backstory: true,
        imageUrl: true,
        attributes: {
          select: {
            str: true, dex: true, con: true,
            intl: true, wis: true, cha: true,
            hp: true, ac: true,
          },
        },
      },
      orderBy: { name: "asc" },
      take: 100,
    });

    return NextResponse.json({ npcs });
  } catch (error) {
    console.error("NPCs API error:", error);
    return NextResponse.json({ npcs: [], error: "Erro ao carregar NPCs" }, { status: 500 });
  }
}
