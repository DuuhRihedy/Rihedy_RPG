"use server";

import { prisma } from "@/lib/db";

// ── Magias ───────────────────────────

export async function searchSpells(query?: string, level?: number, school?: string, className?: string, edition?: string) {
  const where: Record<string, unknown> = {};

  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { namePtBr: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
      { descriptionPtBr: { contains: query, mode: "insensitive" } },
    ];
  }
  if (level !== undefined && level >= 0) {
    where.level = level;
  }
  if (school) {
    where.school = { equals: school, mode: "insensitive" };
  }
  if (className) {
    where.classes = { contains: className, mode: "insensitive" };
  }
  if (edition) {
    where.edition = edition;
  }

  return prisma.srdSpell.findMany({
    where,
    orderBy: [{ name: "asc" }, { level: "asc" }],
    take: 100,
  });
}

export async function getSpell(index: string) {
  return prisma.srdSpell.findUnique({ where: { index } });
}

export async function getSpellFilters() {
  const [schools, classes, editions] = await Promise.all([
    prisma.srdSpell.findMany({ select: { school: true }, distinct: ["school"], orderBy: { school: "asc" } }),
    prisma.srdSpell.findMany({ select: { classes: true }, distinct: ["classes"] }),
    prisma.srdSpell.findMany({ select: { edition: true }, distinct: ["edition"], orderBy: { edition: "asc" } }),
  ]);

  const uniqueClasses = new Set<string>();
  classes.forEach((c) => c.classes.split(", ").forEach((cls) => uniqueClasses.add(cls)));

  return {
    schools: schools.map((s) => s.school),
    classes: [...uniqueClasses].sort(),
    levels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    editions: editions.map((e) => e.edition),
  };
}

// ── Monstros ─────────────────────────

export async function searchMonsters(query?: string, type?: string, crMin?: number, crMax?: number, edition?: string) {
  const where: Record<string, unknown> = {};

  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { namePtBr: { contains: query, mode: "insensitive" } },
      { type: { contains: query, mode: "insensitive" } },
    ];
  }
  if (type) {
    where.type = { equals: type, mode: "insensitive" };
  }
  if (crMin !== undefined || crMax !== undefined) {
    where.challengeRating = {};
    if (crMin !== undefined) (where.challengeRating as Record<string, number>).gte = crMin;
    if (crMax !== undefined) (where.challengeRating as Record<string, number>).lte = crMax;
  }
  if (edition) {
    where.edition = edition;
  }

  return prisma.srdMonster.findMany({
    where,
    orderBy: [{ name: "asc" }, { challengeRating: "asc" }],
    take: 100,
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
      edition: true,
    },
  });
}

export async function getMonster(index: string) {
  return prisma.srdMonster.findUnique({ where: { index } });
}

export async function getMonsterFilters() {
  const [types, editions] = await Promise.all([
    prisma.srdMonster.findMany({
      select: { type: true },
      distinct: ["type"],
      orderBy: { type: "asc" },
    }),
    prisma.srdMonster.findMany({
      select: { edition: true },
      distinct: ["edition"],
      orderBy: { edition: "asc" },
    }),
  ]);

  return {
    types: types.map((t) => t.type),
    editions: editions.map((e) => e.edition),
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

export async function searchEquipment(query?: string, category?: string, edition?: string) {
  const where: Record<string, unknown> = {};
  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { namePtBr: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ];
  }
  if (category) where.category = { equals: category, mode: "insensitive" };
  if (edition) where.edition = edition;

  return prisma.srdEquipment.findMany({
    where,
    orderBy: [{ name: "asc" }, { category: "asc" }],
    take: 100,
  });
}

export async function getEquipment(index: string) {
  return prisma.srdEquipment.findUnique({ where: { index } });
}

export async function getEquipmentFilters() {
  const [cats, editions] = await Promise.all([
    prisma.srdEquipment.findMany({
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    }),
    prisma.srdEquipment.findMany({
      select: { edition: true },
      distinct: ["edition"],
      orderBy: { edition: "asc" },
    }),
  ]);
  return {
    categories: cats.map((c) => c.category),
    editions: editions.map((e) => e.edition),
  };
}

// ── Itens Mágicos ─────────────────────

export async function searchMagicItems(query?: string, rarity?: string, category?: string, edition?: string) {
  const where: Record<string, unknown> = {};
  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { namePtBr: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ];
  }
  if (rarity) where.rarity = { equals: rarity, mode: "insensitive" };
  if (category) where.category = { equals: category, mode: "insensitive" };
  if (edition) where.edition = edition;

  return prisma.srdMagicItem.findMany({
    where,
    orderBy: [{ name: "asc" }, { rarity: "asc" }],
    take: 100,
  });
}

export async function getMagicItem(index: string) {
  return prisma.srdMagicItem.findUnique({ where: { index } });
}

export async function getMagicItemFilters() {
  const [rarities, cats, editions] = await Promise.all([
    prisma.srdMagicItem.findMany({ select: { rarity: true }, distinct: ["rarity"], orderBy: { rarity: "asc" } }),
    prisma.srdMagicItem.findMany({ select: { category: true }, distinct: ["category"], orderBy: { category: "asc" } }),
    prisma.srdMagicItem.findMany({ select: { edition: true }, distinct: ["edition"], orderBy: { edition: "asc" } }),
  ]);
  return {
    rarities: rarities.map((r) => r.rarity),
    categories: cats.map((c) => c.category),
    editions: editions.map((e) => e.edition),
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

// ── Feats ─────────────────────────────

export async function searchFeats(query?: string, edition?: string) {
  const where: Record<string, unknown> = {};
  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { namePtBr: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ];
  }
  if (edition) where.edition = edition;

  return prisma.srdFeat.findMany({
    where,
    orderBy: { name: "asc" },
    take: 100,
  });
}

export async function getFeatFilters() {
  const editions = await prisma.srdFeat.findMany({
    select: { edition: true },
    distinct: ["edition"],
    orderBy: { edition: "asc" },
  });
  return {
    editions: editions.map((e) => e.edition),
  };
}
