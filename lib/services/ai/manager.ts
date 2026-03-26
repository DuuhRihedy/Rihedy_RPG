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

/**
 * Busca a próxima key disponível do pool para o provider.
 * Ignora keys bloqueadas (rate limit) e reseta contagem diária automaticamente.
 */
async function getNextKeyFromPool(provider: string): Promise<string | null> {
  const now = new Date();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // Resetar usageToday das keys que foram contadas ontem
  await prisma.aiApiKey.updateMany({
    where: {
      provider,
      lastUsedAt: { lt: todayStart },
      usageToday: { gt: 0 },
    },
    data: { usageToday: 0 },
  });

  // Desbloquear keys cujo bloqueio já expirou
  await prisma.aiApiKey.updateMany({
    where: {
      provider,
      blockedUntil: { lte: now },
    },
    data: { blockedUntil: null },
  });

  // Buscar key ativa, não bloqueada, com menor uso hoje
  const key = await prisma.aiApiKey.findFirst({
    where: {
      provider,
      active: true,
      OR: [
        { blockedUntil: null },
        { blockedUntil: { lte: now } },
      ],
    },
    orderBy: { usageToday: "asc" },
  });

  if (!key) return null;

  // Incrementar uso
  await prisma.aiApiKey.update({
    where: { id: key.id },
    data: {
      usageToday: { increment: 1 },
      lastUsedAt: now,
    },
  });

  return key.apiKey;
}

/**
 * Marca uma key como bloqueada por rate limit (bloqueia por 1h).
 */
async function markKeyAsBlocked(provider: string, usedKey: string) {
  const blockUntil = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
  await prisma.aiApiKey.updateMany({
    where: { provider, apiKey: usedKey },
    data: { blockedUntil: blockUntil },
  });
}

/**
 * Verifica se o erro é de rate limit.
 */
function isRateLimitError(error: Error): boolean {
  const msg = error.message.toLowerCase();
  return msg.includes("429") ||
    msg.includes("rate limit") ||
    msg.includes("quota") ||
    msg.includes("resource_exhausted") ||
    msg.includes("too many requests");
}

export async function generateText(
  options: AIGenerateOptions,
  source: string = "chat",
): Promise<AIResponse> {
  const config = await getConfig();

  const providerName: ProviderName = (config?.provider as ProviderName) || "gemini";
  const model = config?.model || undefined;
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
    // Tentar todas as keys disponíveis no pool deste provider
    const maxRetries = pName === providerName ? 5 : 2;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const adapter = getAdapter(pName);

        // Buscar key: pool → config singleton → variável de ambiente
        let apiKey: string | undefined;

        const poolKey = await getNextKeyFromPool(pName);
        if (poolKey) {
          apiKey = poolKey;
        } else if (pName === providerName && config?.apiKey) {
          apiKey = config.apiKey;
        }
        // Se não tem key, o adapter vai tentar a env var

        const response = await adapter.generateText(finalOptions,
          pName === providerName ? model : undefined,
          apiKey,
        );

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

        // Se é rate limit e usou key do pool, bloquear essa key e tentar próxima
        if (isRateLimitError(lastError)) {
          const poolKey = await getNextKeyFromPool(pName);
          if (poolKey) {
            await markKeyAsBlocked(pName, poolKey);
            console.warn(`[AIManager] Key bloqueada por rate limit (${pName}), tentando próxima...`);
            continue;
          }
        }

        console.warn(`[AIManager] ${pName} falhou: ${lastError.message}`);
        break; // Sai do loop de retries, vai pro próximo provider
      }
    }

    if (!fallbackEnabled) break;
  }

  throw lastError || new Error("Todos os provedores de IA falharam.");
}
