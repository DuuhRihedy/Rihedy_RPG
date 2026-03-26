"use server";

import { askAssistant, type AssistantMode } from "@/lib/services/ai-assistant";
import { prisma } from "@/lib/db";

export async function sendMessage(
  message: string,
  mode: AssistantMode,
  campaignId?: string,
  sessionId?: string,
) {
  try {
    const response = await askAssistant({
      message,
      mode,
      campaignId: campaignId || undefined,
      sessionId: sessionId || undefined,
    });

    return response;
  } catch (err) {
    console.error("[sendMessage] Erro:", err);
    return {
      text: `❌ Erro ao processar mensagem: ${err instanceof Error ? err.message : "Erro desconhecido"}`,
      tokensUsed: 0,
    };
  }
}

export async function getCampaignsForSelector() {
  try {
    return await prisma.campaign.findMany({
      select: { id: true, name: true, edition: true, status: true },
      orderBy: { updatedAt: "desc" },
    });
  } catch (err) {
    console.error("[getCampaignsForSelector] Erro:", err);
    return [];
  }
}

export async function getSessionsForCampaign(campaignId: string) {
  try {
    return await prisma.session.findMany({
      where: { campaignId },
      select: { id: true, number: true, title: true },
      orderBy: { number: "desc" },
    });
  } catch (err) {
    console.error("[getSessionsForCampaign] Erro:", err);
    return [];
  }
}

export async function getChatHistory(limit: number = 20) {
  try {
    return await prisma.chatHistory.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  } catch (err) {
    console.error("[getChatHistory] Erro:", err);
    return [];
  }
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
  try {
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
  } catch (err) {
    console.error("[saveNpcFromAi] Erro:", err);
    throw new Error(`Falha ao salvar NPC: ${err instanceof Error ? err.message : "Erro desconhecido"}`);
  }
}

export async function getTodayRequestCount() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const count = await prisma.apiUsage.count({
      where: { createdAt: { gte: today } },
    });
    return count;
  } catch (err) {
    console.error("[getTodayRequestCount] Erro:", err);
    return 0;
  }
}

export async function saveRecapToSession(sessionId: string, recap: string) {
  try {
    return await prisma.session.update({
      where: { id: sessionId },
      data: { aiRecap: recap },
    });
  } catch (err) {
    console.error("[saveRecapToSession] Erro:", err);
    throw new Error(`Falha ao salvar recap: ${err instanceof Error ? err.message : "Erro desconhecido"}`);
  }
}
