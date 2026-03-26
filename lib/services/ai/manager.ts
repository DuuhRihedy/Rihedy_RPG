import { prisma } from "@/lib/db";
import { getAdapter, FALLBACK_ORDER } from "./adapters";
import type { AIGenerateOptions, AIResponse, ProviderName } from "./types";

// Cache de config (60s TTL)
let configCache: { data: Awaited<ReturnType<typeof fetchConfig>>; at: number } | null = null;

async function fetchConfig() {
  return prisma.aiProviderConfig.findUnique({ where: { id: "singleton" } });
}

async function getConfig() {
  if (configCache && Date.now() - configCache.at < 60_000) {
    return configCache.data;
  }
  try {
    const data = await fetchConfig();
    configCache = { data, at: Date.now() };
    return data;
  } catch {
    return configCache?.data ?? null;
  }
}

export function invalidateConfigCache() {
  configCache = null;
}

export async function generateText(
  options: AIGenerateOptions,
  source: string = "chat",
): Promise<AIResponse> {
  const config = await getConfig();

  const providerName: ProviderName = (config?.provider as ProviderName) || "gemini";
  const model = config?.model || undefined;
  const apiKey = config?.apiKey || undefined;
  const fallbackEnabled = config?.fallback ?? true;

  const finalOptions: AIGenerateOptions = {
    ...options,
    temperature: options.temperature ?? config?.temperature ?? 0.7,
    maxTokens: options.maxTokens ?? config?.maxTokens ?? 4096,
  };

  // Montar lista de providers (primário + fallbacks)
  const providers: ProviderName[] = [providerName];
  if (fallbackEnabled) {
    for (const fb of FALLBACK_ORDER) {
      if (fb !== providerName) providers.push(fb);
    }
  }

  let lastError: Error | null = null;

  for (const pName of providers) {
    try {
      const adapter = getAdapter(pName);
      // Só usa key/model customizado pro provider primário
      const useKey = pName === providerName ? apiKey : undefined;
      const useModel = pName === providerName ? model : undefined;

      const response = await adapter.generateText(finalOptions, useModel, useKey);

      // Registrar uso
      try {
        await prisma.apiUsage.create({
          data: {
            source,
            provider: response.provider,
            model: response.model,
            tokensUsed: response.tokensUsed,
          },
        });
      } catch (err) {
        console.error("[ApiUsage] Erro ao registrar:", err);
      }

      return response;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`[AIManager] ${pName} falhou: ${lastError.message}`);
      if (!fallbackEnabled) throw lastError;
    }
  }

  throw lastError || new Error("Todos os provedores de IA falharam.");
}
