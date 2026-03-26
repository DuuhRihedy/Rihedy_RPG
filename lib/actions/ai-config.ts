"use server";

import { prisma } from "@/lib/db";
import { invalidateConfigCache, getAdapter } from "@/lib/services/ai";
import type { ProviderName } from "@/lib/services/ai";
import { requireRole } from "@/lib/auth";

export async function getAiConfig() {
  try {
    const config = await prisma.aiProviderConfig.findUnique({
      where: { id: "singleton" },
    });
    if (!config) {
      return {
        provider: "gemini" as ProviderName,
        hasApiKey: !!process.env.GEMINI_API_KEY,
        model: null,
        fallback: true,
        temperature: 0.7,
        maxTokens: 4096,
      };
    }
    return {
      provider: config.provider as ProviderName,
      hasApiKey: !!config.apiKey || !!process.env[getEnvKey(config.provider as ProviderName)],
      model: config.model,
      fallback: config.fallback,
      temperature: config.temperature,
      maxTokens: config.maxTokens,
    };
  } catch (err) {
    console.error("[getAiConfig] Erro:", err);
    return {
      provider: "gemini" as ProviderName,
      hasApiKey: false,
      model: null,
      fallback: true,
      temperature: 0.7,
      maxTokens: 4096,
    };
  }
}

function getEnvKey(provider: ProviderName): string {
  const map: Record<ProviderName, string> = {
    gemini: "GEMINI_API_KEY",
    groq: "GROQ_API_KEY",
    openrouter: "OPENROUTER_API_KEY",
  };
  return map[provider];
}

export async function saveAiConfig(data: {
  provider: ProviderName;
  apiKey?: string;
  model?: string;
  fallback: boolean;
  temperature: number;
  maxTokens: number;
}) {
  try {
    await prisma.aiProviderConfig.upsert({
      where: { id: "singleton" },
      create: {
        id: "singleton",
        provider: data.provider,
        apiKey: data.apiKey || null,
        model: data.model || null,
        fallback: data.fallback,
        temperature: data.temperature,
        maxTokens: data.maxTokens,
      },
      update: {
        provider: data.provider,
        ...(data.apiKey !== undefined && { apiKey: data.apiKey || null }),
        model: data.model || null,
        fallback: data.fallback,
        temperature: data.temperature,
        maxTokens: data.maxTokens,
      },
    });
    invalidateConfigCache();
    return { ok: true };
  } catch (err) {
    console.error("[saveAiConfig] Erro:", err);
    return { ok: false, error: "Erro ao salvar configuração" };
  }
}

export async function testAiProvider(
  provider: ProviderName,
  apiKey?: string,
  model?: string,
) {
  try {
    const adapter = getAdapter(provider);
    const start = Date.now();
    const response = await adapter.generateText(
      {
        systemPrompt: "Responda apenas com a palavra OK.",
        history: [],
        userMessage: "Teste de conexão. Responda apenas: OK",
        temperature: 0.1,
        maxTokens: 50,
      },
      model,
      apiKey,
    );
    const elapsed = Date.now() - start;
    return {
      ok: true,
      response: response.text.substring(0, 100),
      tokensUsed: response.tokensUsed,
      model: response.model,
      elapsed,
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Erro desconhecido",
    };
  }
}

export async function getAiUsageStats() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayCount, todayByProvider] = await Promise.all([
      prisma.apiUsage.count({ where: { createdAt: { gte: today } } }),
      prisma.apiUsage.groupBy({
        by: ["provider"],
        where: { createdAt: { gte: today } },
        _count: true,
        _sum: { tokensUsed: true },
      }),
    ]);

    return {
      today: todayCount,
      byProvider: todayByProvider.map((p) => ({
        provider: p.provider,
        requests: p._count,
        tokens: p._sum.tokensUsed || 0,
      })),
    };
  } catch (err) {
    console.error("[getAiUsageStats] Erro:", err);
    return { today: 0, byProvider: [] };
  }
}
