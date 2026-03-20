"use server";

import { askAssistant, type AssistantMode } from "@/lib/services/ai-assistant";
import { prisma } from "@/lib/db";

export async function sendMessage(
  message: string,
  mode: AssistantMode,
  campaignId?: string,
  sessionId?: string,
) {
  const response = await askAssistant({
    message,
    mode,
    campaignId: campaignId || undefined,
    sessionId: sessionId || undefined,
  });

  return response;
}

export async function getCampaignsForSelector() {
  return prisma.campaign.findMany({
    select: { id: true, name: true, edition: true, status: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getSessionsForCampaign(campaignId: string) {
  return prisma.session.findMany({
    where: { campaignId },
    select: { id: true, number: true, title: true },
    orderBy: { number: "desc" },
  });
}

export async function getChatHistory(limit: number = 20) {
  return prisma.chatHistory.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function saveNpcFromAi(
  name: string,
  race: string,
  npcClass: string,
  level: number,
  alignment: string,
  type: string,
  campaignId?: string,
) {
  const npc = await prisma.npc.create({
    data: {
      name,
      race,
      class: npcClass,
      level,
      alignment,
      type,
      status: "alive",
    },
  });

  if (campaignId) {
    await prisma.campaignNpc.create({
      data: { campaignId, npcId: npc.id },
    });
  }

  return npc;
}

export async function saveRecapToSession(sessionId: string, recap: string) {
  return prisma.session.update({
    where: { id: sessionId },
    data: { aiRecap: recap },
  });
}
