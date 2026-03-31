import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (id) {
    // Single character
    const character = await prisma.character.findUnique({
      where: { id },
      include: { campaign: { select: { id: true, name: true } } },
    });
    if (!character) {
      return NextResponse.json({ error: "Personagem não encontrado" }, { status: 404 });
    }
    return NextResponse.json({ character });
  }

  // List all
  const characters = await prisma.character.findMany({
    select: {
      id: true, name: true, edition: true,
      race: true, class: true, level: true,
      alignment: true, status: true, imageUrl: true,
      str: true, dex: true, con: true, intl: true, wis: true, cha: true,
      maxHp: true, currentHp: true, ac: true,
      initiative: true, speed: true,
      bab: true, fortSave: true, refSave: true, willSave: true,
      proficiencyBonus: true, hitDice: true,
    },
    orderBy: { updatedAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ characters });
}
