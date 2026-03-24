"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getSessions(campaignId: string) {
  return prisma.session.findMany({
    where: { campaignId },
    orderBy: { number: "desc" },
    include: {
      _count: { select: { events: true, npcsPresent: true } },
    },
  });
}

export async function createSession(formData: FormData) {
  const campaignId = formData.get("campaignId") as string;
  const title = formData.get("title") as string;
  const notes = formData.get("notes") as string;
  const date = formData.get("date") as string;

  if (!campaignId) return;

  const lastSession = await prisma.session.findFirst({
    where: { campaignId },
    orderBy: { number: "desc" },
  });

  await prisma.session.create({
    data: {
      campaignId,
      number: (lastSession?.number ?? 0) + 1,
      title: title?.trim() || null,
      notes: notes?.trim() || null,
      date: date ? new Date(date) : new Date(),
    },
  });

  revalidatePath(`/campanhas/${campaignId}`);
}

export async function updateSession(id: string, formData: FormData) {
  const campaignId = formData.get("campaignId") as string;
  const title = formData.get("title") as string;
  const notes = formData.get("notes") as string;
  const date = formData.get("date") as string;
  const durationMin = formData.get("durationMin") as string;
  const aiRecap = formData.get("aiRecap") as string;

  const data: Record<string, unknown> = {};
  if (title !== null) data.title = title?.trim() || null;
  if (notes !== null) data.notes = notes?.trim() || null;
  if (date) data.date = new Date(date);
  if (durationMin) data.durationMin = parseInt(durationMin) || null;
  if (aiRecap !== null) data.aiRecap = aiRecap?.trim() || null;

  await prisma.session.update({ where: { id }, data });
  revalidatePath(`/campanhas/${campaignId}`);
}

export async function deleteSession(id: string, campaignId: string) {
  await prisma.session.delete({ where: { id } });
  revalidatePath(`/campanhas/${campaignId}`);
}

export async function getDashboardStats() {
  const [campaigns, npcs, sessions, aiChats] = await Promise.all([
    prisma.campaign.count({ where: { status: "active" } }),
    prisma.npc.count(),
    prisma.session.count(),
    prisma.chatHistory.count(),
  ]);

  const recentCampaign = await prisma.campaign.findFirst({
    where: { status: "active" },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { sessions: true, npcs: true } },
      sessions: { orderBy: { number: "desc" }, take: 1 },
    },
  });

  const recentNotes = await prisma.note.findMany({
    orderBy: { createdAt: "desc" },
    take: 4,
    include: { campaign: { select: { name: true } } },
  });

  return { campaigns, npcs, sessions, aiChats, recentCampaign, recentNotes };
}
