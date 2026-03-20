"use server";

import { prisma } from "@/lib/db";

export async function searchSpells(query?: string, level?: number, school?: string, className?: string) {
  const where: Record<string, unknown> = {};

  if (query) {
    where.OR = [
      { name: { contains: query } },
      { namePtBr: { contains: query } },
    ];
  }
  if (level !== undefined && level >= 0) {
    where.level = level;
  }
  if (school) {
    where.school = school;
  }
  if (className) {
    where.classes = { contains: className };
  }

  return prisma.srdSpell.findMany({
    where,
    orderBy: [{ level: "asc" }, { name: "asc" }],
    take: 50,
  });
}

export async function getSpell(index: string) {
  return prisma.srdSpell.findUnique({ where: { index } });
}

export async function getSpellFilters() {
  const [schools, classes] = await Promise.all([
    prisma.srdSpell.findMany({ select: { school: true }, distinct: ["school"], orderBy: { school: "asc" } }),
    prisma.srdSpell.findMany({ select: { classes: true }, distinct: ["classes"] }),
  ]);

  const uniqueClasses = new Set<string>();
  classes.forEach((c) => c.classes.split(", ").forEach((cls) => uniqueClasses.add(cls)));

  return {
    schools: schools.map((s) => s.school),
    classes: [...uniqueClasses].sort(),
    levels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  };
}

export async function searchMonsters(query?: string, type?: string, crMin?: number, crMax?: number) {
  const where: Record<string, unknown> = {};

  if (query) {
    where.OR = [
      { name: { contains: query } },
      { namePtBr: { contains: query } },
    ];
  }
  if (type) {
    where.type = type;
  }
  if (crMin !== undefined || crMax !== undefined) {
    where.challengeRating = {};
    if (crMin !== undefined) (where.challengeRating as Record<string, number>).gte = crMin;
    if (crMax !== undefined) (where.challengeRating as Record<string, number>).lte = crMax;
  }

  return prisma.srdMonster.findMany({
    where,
    orderBy: [{ challengeRating: "asc" }, { name: "asc" }],
    take: 50,
    select: {
      id: true,
      index: true,
      name: true,
      namePtBr: true,
      size: true,
      type: true,
      alignment: true,
      armorClass: true,
      hitPoints: true,
      challengeRating: true,
      xp: true,
    },
  });
}

export async function getMonster(index: string) {
  return prisma.srdMonster.findUnique({ where: { index } });
}

export async function getMonsterFilters() {
  const types = await prisma.srdMonster.findMany({
    select: { type: true },
    distinct: ["type"],
    orderBy: { type: "asc" },
  });

  return {
    types: types.map((t) => t.type),
  };
}

export async function getSrdStats() {
  const [spells, monsters, classes, feats, equipment, magicItems] = await Promise.all([
    prisma.srdSpell.count(),
    prisma.srdMonster.count(),
    prisma.srdClass.count(),
    prisma.srdFeat.count(),
    prisma.srdEquipment.count(),
    prisma.srdMagicItem.count(),
  ]);

  return { spells, monsters, classes, feats, equipment, magicItems };
}

// ── Equipamentos ──────────────────────

export async function searchEquipment(query?: string, category?: string) {
  const where: Record<string, unknown> = {};
  if (query) {
    where.OR = [
      { name: { contains: query } },
      { namePtBr: { contains: query } },
    ];
  }
  if (category) where.category = category;

  return prisma.srdEquipment.findMany({
    where,
    orderBy: [{ category: "asc" }, { name: "asc" }],
    take: 100,
  });
}

export async function getEquipment(index: string) {
  return prisma.srdEquipment.findUnique({ where: { index } });
}

export async function getEquipmentFilters() {
  const cats = await prisma.srdEquipment.findMany({
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });
  return { categories: cats.map((c) => c.category) };
}

// ── Itens Mágicos ─────────────────────

export async function searchMagicItems(query?: string, rarity?: string, category?: string) {
  const where: Record<string, unknown> = {};
  if (query) {
    where.OR = [
      { name: { contains: query } },
      { namePtBr: { contains: query } },
    ];
  }
  if (rarity) where.rarity = rarity;
  if (category) where.category = category;

  return prisma.srdMagicItem.findMany({
    where,
    orderBy: [{ rarity: "asc" }, { name: "asc" }],
    take: 100,
  });
}

export async function getMagicItem(index: string) {
  return prisma.srdMagicItem.findUnique({ where: { index } });
}

export async function getMagicItemFilters() {
  const [rarities, cats] = await Promise.all([
    prisma.srdMagicItem.findMany({ select: { rarity: true }, distinct: ["rarity"], orderBy: { rarity: "asc" } }),
    prisma.srdMagicItem.findMany({ select: { category: true }, distinct: ["category"], orderBy: { category: "asc" } }),
  ]);
  return {
    rarities: rarities.map((r) => r.rarity),
    categories: cats.map((c) => c.category),
  };
}

// ── Classes ───────────────────────────

export async function getClasses() {
  return prisma.srdClass.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getClass(index: string) {
  return prisma.srdClass.findUnique({ where: { index } });
}
