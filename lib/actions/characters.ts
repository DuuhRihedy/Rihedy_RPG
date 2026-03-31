"use server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// ── Listar Personagens ────────────────

export async function getCharacters(edition?: string) {
  const session = await getSession();
  if (!session) return [];

  const where: any = { createdById: session.userId };
  if (edition) where.edition = edition;

  return prisma.character.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: {
      campaign: { select: { id: true, name: true } },
    },
  });
}

// ── Buscar Personagem ─────────────────

export async function getCharacter(id: string) {
  return prisma.character.findUnique({
    where: { id },
    include: {
      campaign: { select: { id: true, name: true } },
    },
  });
}

// ── Criar Personagem (Wizard / Form) ──

export async function createCharacter(data: {
  name: string;
  edition: string;
  race?: string;
  class?: string;
  level?: number;
  alignment?: string;
  background?: string;
  deity?: string;
  gender?: string;
  str?: number;
  dex?: number;
  con?: number;
  intl?: number;
  wis?: number;
  cha?: number;
  maxHp?: number;
  ac?: number;
  speed?: number;
  initiative?: number;
  bab?: number;
  fortSave?: number;
  refSave?: number;
  willSave?: number;
  proficiencyBonus?: number;
  hitDice?: string;
  skills?: string;
  feats?: string;
  features?: string;
  equipment?: string;
  weapons?: string;
  spells?: string;
  spellcasting?: string;
  proficiencies?: string;
  currency?: string;
  traits?: string;
  notes?: string;
  campaignId?: string;
}) {
  const session = await getSession();
  if (!session) throw new Error("Não autenticado");

  const conMod = data.con ? Math.floor((data.con - 10) / 2) : 0;
  const dexMod = data.dex ? Math.floor((data.dex - 10) / 2) : 0;

  const character = await prisma.character.create({
    data: {
      name: data.name,
      edition: data.edition,
      race: data.race || null,
      class: data.class || null,
      level: data.level || 1,
      alignment: data.alignment || null,
      background: data.background || null,
      deity: data.deity || null,
      gender: data.gender || null,
      str: data.str || 10,
      dex: data.dex || 10,
      con: data.con || 10,
      intl: data.intl || 10,
      wis: data.wis || 10,
      cha: data.cha || 10,
      maxHp: data.maxHp || 8 + conMod,
      currentHp: data.maxHp || 8 + conMod,
      ac: data.ac || 10 + dexMod,
      speed: data.speed || 30,
      initiative: data.initiative || dexMod,
      bab: data.bab,
      fortSave: data.fortSave,
      refSave: data.refSave,
      willSave: data.willSave,
      proficiencyBonus: data.proficiencyBonus,
      hitDice: data.hitDice,
      skills: data.skills || null,
      feats: data.feats || null,
      features: data.features || null,
      equipment: data.equipment || null,
      weapons: data.weapons || null,
      spells: data.spells || null,
      spellcasting: data.spellcasting || null,
      proficiencies: data.proficiencies || null,
      currency: data.currency || JSON.stringify({ cp: 0, sp: 0, gp: 0, pp: 0 }),
      traits: data.traits || null,
      notes: data.notes || null,
      createdById: session.userId,
      campaignId: data.campaignId || null,
    },
  });

  revalidatePath("/ferramentas/personagem");
  return character;
}

// ── Atualizar Personagem ──────────────

export async function updateCharacter(id: string, data: Record<string, any>) {
  await prisma.character.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  });
  revalidatePath("/ferramentas/personagem");
  revalidatePath(`/ferramentas/personagem/${id}`);
}

// ── Deletar Personagem ────────────────

export async function deleteCharacter(id: string) {
  await prisma.character.delete({ where: { id } });
  revalidatePath("/ferramentas/personagem");
}

// ── Dados auxiliares SRD ──────────────

export async function getSrdRaces(edition: string) {
  return prisma.srdRace.findMany({
    where: { edition },
    select: {
      index: true, name: true, namePtBr: true,
      speed: true, abilityBonuses: true, size: true,
      traits: true,
    },
    orderBy: { name: "asc" },
  });
}

export async function getSrdClasses(edition: string) {
  return prisma.srdClass.findMany({
    where: { edition },
    select: {
      index: true, name: true, namePtBr: true,
      hitDie: true, savingThrows: true, proficiencies: true,
    },
    orderBy: { name: "asc" },
  });
}

export async function getSrdFeats(edition: string) {
  return prisma.srdFeat.findMany({
    where: { edition },
    select: {
      index: true, name: true, namePtBr: true,
      description: true, descriptionPtBr: true,
    },
    orderBy: { name: "asc" },
    take: 200,
  });
}

export async function getCampaignsForCharacter() {
  const session = await getSession();
  if (!session) return [];

  return prisma.campaign.findMany({
    where: { status: "active" },
    select: { id: true, name: true, edition: true },
    orderBy: { updatedAt: "desc" },
  });
}
