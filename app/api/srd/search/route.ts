import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category") || "spells";
  const q = url.searchParams.get("q") || "";
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 50);

  if (!q.trim() && category !== "classes") {
    return NextResponse.json({ results: [] });
  }

  const search = `%${q.trim()}%`;

  try {
    let results: any[] = [];

    switch (category) {
      case "spells":
        results = await prisma.srdSpell.findMany({
          where: {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { namePtBr: { contains: q, mode: "insensitive" } },
            ],
          },
          select: {
            index: true, name: true, namePtBr: true, edition: true,
            level: true, school: true, castingTime: true, range: true,
            description: true, descriptionPtBr: true,
          },
          orderBy: { name: "asc" },
          take: limit,
        });
        break;

      case "monsters":
        results = await prisma.srdMonster.findMany({
          where: {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { namePtBr: { contains: q, mode: "insensitive" } },
            ],
          },
          select: {
            index: true, name: true, namePtBr: true, edition: true,
            type: true, challengeRating: true, hitPoints: true,
            armorClass: true,
          },
          orderBy: { name: "asc" },
          take: limit,
        });
        break;

      case "equipment":
        results = await prisma.srdEquipment.findMany({
          where: {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { namePtBr: { contains: q, mode: "insensitive" } },
            ],
          },
          select: {
            index: true, name: true, namePtBr: true, edition: true,
            category: true, cost: true, weight: true,
            description: true, descriptionPtBr: true,
          },
          orderBy: { name: "asc" },
          take: limit,
        });
        break;

      case "magic-items":
        results = await prisma.srdMagicItem.findMany({
          where: {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { namePtBr: { contains: q, mode: "insensitive" } },
            ],
          },
          select: {
            index: true, name: true, namePtBr: true, edition: true,
            rarity: true, description: true, descriptionPtBr: true,
          },
          orderBy: { name: "asc" },
          take: limit,
        });
        break;

      case "feats":
        results = await prisma.srdFeat.findMany({
          where: {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { namePtBr: { contains: q, mode: "insensitive" } },
            ],
          },
          select: {
            index: true, name: true, namePtBr: true, edition: true,
            prerequisites: true, description: true, descriptionPtBr: true,
          },
          orderBy: { name: "asc" },
          take: limit,
        });
        break;

      case "classes":
        results = await prisma.srdClass.findMany({
          select: {
            index: true, name: true, namePtBr: true, edition: true,
            hitDie: true,
          },
          orderBy: { name: "asc" },
          take: limit,
        });
        break;
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("SRD search API error:", error);
    return NextResponse.json({ results: [], error: "Erro na busca" }, { status: 500 });
  }
}
