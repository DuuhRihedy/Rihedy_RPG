import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const npc = await prisma.npc.create({
      data: {
        name: data.name,
        race: data.race,
        class: data.class,
        level: data.level || 1,
        alignment: data.alignment,
        description: data.description || null,
        type: data.type || "neutral",
        status: "alive",
        edition: data.edition || "3.5",
        attributes: {
          create: {
            str: data.abilities?.str || 10,
            dex: data.abilities?.dex || 10,
            con: data.abilities?.con || 10,
            intl: data.abilities?.int || 10,
            wis: data.abilities?.wis || 10,
            cha: data.abilities?.cha || 10,
            hp: data.hp || 10,
            ac: data.ac || 10,
          },
        },
      },
    });

    return NextResponse.json({ success: true, id: npc.id });
  } catch (error) {
    console.error("[character/create]", error);
    return NextResponse.json({ error: "Erro ao criar personagem" }, { status: 500 });
  }
}
