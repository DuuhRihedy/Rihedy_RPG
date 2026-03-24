"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getCampaigns() {
  return prisma.campaign.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { sessions: true, npcs: true, notes: true } },
    },
  });
}

export async function getCampaign(id: string) {
  return prisma.campaign.findUnique({
    where: { id },
    include: {
      sessions: { orderBy: { number: "desc" }, take: 20 },
      npcs: { include: { npc: true } },
      notes: { orderBy: { createdAt: "desc" }, take: 10 },
      arcs: true,
      _count: { select: { sessions: true, npcs: true, notes: true } },
    },
  });
}

export async function createCampaign(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const edition = formData.get("edition") as string || "3.5";

  if (!name?.trim()) return;

  const campaign = await prisma.campaign.create({
    data: { name: name.trim(), description: description?.trim() || null, edition },
  });

  revalidatePath("/campanhas");
  redirect(`/campanhas/${campaign.id}`);
}

export async function updateCampaign(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const edition = formData.get("edition") as string;
  const status = formData.get("status") as string;

  await prisma.campaign.update({
    where: { id },
    data: {
      ...(name && { name: name.trim() }),
      ...(description !== null && { description: description?.trim() || null }),
      ...(edition && { edition }),
      ...(status && { status }),
    },
  });

  revalidatePath(`/campanhas/${id}`);
  revalidatePath("/campanhas");
}

export async function deleteCampaign(id: string) {
  await prisma.campaign.delete({ where: { id } });
  revalidatePath("/campanhas");
  redirect("/campanhas");
}

// ── Vincular/Desvincular NPCs ──────

export async function linkNpcToCampaign(campaignId: string, npcId: string) {
  await prisma.campaignNpc.upsert({
    where: { npcId_campaignId: { npcId, campaignId } },
    create: { npcId, campaignId },
    update: {},
  });
  revalidatePath(`/campanhas/${campaignId}`);
}

export async function unlinkNpcFromCampaign(campaignId: string, npcId: string) {
  await prisma.campaignNpc.delete({
    where: { npcId_campaignId: { npcId, campaignId } },
  });
  revalidatePath(`/campanhas/${campaignId}`);
}

export async function getAvailableNpcsForCampaign(campaignId: string) {
  const linked = await prisma.campaignNpc.findMany({
    where: { campaignId },
    select: { npcId: true },
  });
  const linkedIds = linked.map((l) => l.npcId);

  return prisma.npc.findMany({
    where: { id: { notIn: linkedIds } },
    select: { id: true, name: true, race: true, class: true, type: true },
    orderBy: { name: "asc" },
  });
}

// ── Notas da Campanha ──────────────

export async function createNote(formData: FormData) {
  const campaignId = formData.get("campaignId") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!campaignId || !title?.trim()) return;

  await prisma.note.create({
    data: {
      campaignId,
      title: title.trim(),
      content: content?.trim() || "",
    },
  });

  revalidatePath(`/campanhas/${campaignId}`);
}

export async function deleteNote(id: string, campaignId: string) {
  await prisma.note.delete({ where: { id } });
  revalidatePath(`/campanhas/${campaignId}`);
}

// ── Arcos Narrativos ───────────────

export async function createArc(formData: FormData) {
  const campaignId = formData.get("campaignId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  if (!campaignId || !title?.trim()) return;

  await prisma.storyArc.create({
    data: {
      campaignId,
      title: title.trim(),
      description: description?.trim() || null,
    },
  });

  revalidatePath(`/campanhas/${campaignId}`);
}

export async function updateArcStatus(id: string, status: string, campaignId: string) {
  await prisma.storyArc.update({
    where: { id },
    data: { status },
  });
  revalidatePath(`/campanhas/${campaignId}`);
}

export async function deleteArc(id: string, campaignId: string) {
  await prisma.storyArc.delete({ where: { id } });
  revalidatePath(`/campanhas/${campaignId}`);
}
