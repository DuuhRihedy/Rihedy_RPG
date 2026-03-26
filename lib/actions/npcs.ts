"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getVisibilityFilter, getCurrentUserId } from "@/lib/visibility";

export async function getNpcs() {
  const filter = await getVisibilityFilter();
  return prisma.npc.findMany({
    where: filter,
    orderBy: { updatedAt: "desc" },
    include: {
      attributes: true,
      _count: { select: { items: true, campaigns: true } },
    },
  });
}

export async function getNpc(id: string) {
  return prisma.npc.findUnique({
    where: { id },
    include: {
      attributes: true,
      items: true,
      campaigns: { include: { campaign: true } },
      relationsFrom: { include: { target: true } },
      relationsTo: { include: { origin: true } },
    },
  });
}

export async function createNpc(formData: FormData) {

  const name = formData.get("name") as string;
  const race = formData.get("race") as string;
  const npcClass = formData.get("class") as string;
  const level = formData.get("level") as string;
  const alignment = formData.get("alignment") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as string || "neutral";
  const edition = formData.get("edition") as string || "3.5";

  if (!name?.trim()) return;

  const userId = await getCurrentUserId();
  const npc = await prisma.npc.create({
    data: {
      name: name.trim(),
      race: race?.trim() || null,
      class: npcClass?.trim() || null,
      level: level ? parseInt(level) : null,
      alignment: alignment?.trim() || null,
      description: description?.trim() || null,
      type,
      edition,
      createdById: userId,
      attributes: {
        create: {
          str: parseInt(formData.get("str") as string) || 10,
          dex: parseInt(formData.get("dex") as string) || 10,
          con: parseInt(formData.get("con") as string) || 10,
          intl: parseInt(formData.get("int") as string) || 10,
          wis: parseInt(formData.get("wis") as string) || 10,
          cha: parseInt(formData.get("cha") as string) || 10,
          hp: parseInt(formData.get("hp") as string) || 10,
          ac: parseInt(formData.get("ac") as string) || 10,
        },
      },
    },
  });

  revalidatePath("/npcs");
  redirect(`/npcs/${npc.id}`);
}

export async function updateNpc(id: string, formData: FormData) {

  const data: Record<string, unknown> = {};
  const fields = ["name", "race", "class", "alignment", "description", "backstory", "gmNotes", "type", "status", "edition", "imageUrl"];

  for (const field of fields) {
    const value = formData.get(field);
    if (value !== null) {
      data[field] = (value as string).trim() || null;
    }
  }

  const level = formData.get("level");
  if (level !== null) data.level = level ? parseInt(level as string) : null;

  await prisma.npc.update({ where: { id }, data });

  const str = formData.get("str");
  if (str !== null) {
    await prisma.npcAttributes.upsert({
      where: { npcId: id },
      update: {
        str: parseInt(formData.get("str") as string) || 10,
        dex: parseInt(formData.get("dex") as string) || 10,
        con: parseInt(formData.get("con") as string) || 10,
        intl: parseInt(formData.get("int") as string) || 10,
        wis: parseInt(formData.get("wis") as string) || 10,
        cha: parseInt(formData.get("cha") as string) || 10,
        hp: parseInt(formData.get("hp") as string) || 10,
        ac: parseInt(formData.get("ac") as string) || 10,
      },
      create: {
        npcId: id,
        str: parseInt(formData.get("str") as string) || 10,
        dex: parseInt(formData.get("dex") as string) || 10,
        con: parseInt(formData.get("con") as string) || 10,
        intl: parseInt(formData.get("int") as string) || 10,
        wis: parseInt(formData.get("wis") as string) || 10,
        cha: parseInt(formData.get("cha") as string) || 10,
        hp: parseInt(formData.get("hp") as string) || 10,
        ac: parseInt(formData.get("ac") as string) || 10,
      },
    });
  }

  revalidatePath(`/npcs/${id}`);
  revalidatePath("/npcs");
}

export async function deleteNpc(id: string) {

  await prisma.npc.delete({ where: { id } });
  revalidatePath("/npcs");
  redirect("/npcs");
}

// ── Itens do NPC ───────────────────

export async function addItemToNpc(formData: FormData) {
  const npcId = formData.get("npcId") as string;
  const name = formData.get("name") as string;
  const type = formData.get("type") as string || "misc";
  const description = formData.get("description") as string;
  const value = formData.get("value") as string;
  const weight = formData.get("weight") as string;
  const magical = formData.get("magical") === "true";
  const imageUrl = formData.get("itemImageUrl") as string;

  if (!npcId || !name?.trim()) return;

  await prisma.item.create({
    data: {
      npcId,
      name: name.trim(),
      type,
      description: description?.trim() || null,
      value: value?.trim() || null,
      weight: weight ? parseFloat(weight) : null,
      magical,
      imageUrl: imageUrl?.trim() || null,
    },
  });

  revalidatePath(`/npcs/${npcId}`);
}

export async function removeItemFromNpc(itemId: string, npcId: string) {
  await prisma.item.delete({ where: { id: itemId } });
  revalidatePath(`/npcs/${npcId}`);
}

// ── Relações entre NPCs ────────────

export async function createRelation(formData: FormData) {
  const originId = formData.get("originId") as string;
  const targetId = formData.get("targetId") as string;
  const type = formData.get("type") as string;
  const description = formData.get("description") as string;

  if (!originId || !targetId || !type?.trim()) return;

  await prisma.relation.create({
    data: {
      originId,
      targetId,
      type: type.trim(),
      description: description?.trim() || null,
    },
  });

  revalidatePath(`/npcs/${originId}`);
}

export async function deleteRelation(id: string, npcId: string) {
  await prisma.relation.delete({ where: { id } });
  revalidatePath(`/npcs/${npcId}`);
}

export async function getAllNpcsForSelector(excludeId?: string) {
  const where = excludeId ? { id: { not: excludeId } } : {};
  return prisma.npc.findMany({
    where,
    select: { id: true, name: true, type: true },
    orderBy: { name: "asc" },
  });
}
