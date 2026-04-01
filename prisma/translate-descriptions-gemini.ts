// ══════════════════════════════════════════════════════
// Hub RPG — Script ONE-TIME de tradução via IA (multi-key)
// Traduz descriptionPtBr de TODOS os modelos restantes
// Usa pool de keys do banco: Gemini (4 keys) + Groq fallback
// Salva direto no banco Neon PostgreSQL → resultado fixo
// ══════════════════════════════════════════════════════

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const BATCH_SIZE = 3;        // registros por request (reduzido p/ TPM limit)
const DELAY_MS = 60000;      // 1min entre requests (rotação de keys cuida do rate limit)
const MAX_REQUESTS = 900;    // 4 keys × 250 RPD = 1000, reserva 100
const MAX_RETRIES = 4;       // retries por batch com backoff

// Providers permitidos na rotação (ordem de prioridade)
const ALLOWED_PROVIDERS = ["gemini", "groq"] as const; // Todas as keys disponíveis

// URLs base por provider
const API_URLS: Record<string, (key: string, model: string) => string> = {
  gemini: (key, model) =>
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
  groq: (key, _model) =>
    `https://api.groq.com/openai/v1/chat/completions`,
};

const DEFAULT_MODELS: Record<string, string> = {
  gemini: "gemini-2.5-flash",
  groq: "llama-3.3-70b-versatile",
};

// ── Key Pool Manager (standalone, não depende do manager.ts) ──

interface PoolKey {
  id: string;
  provider: string;
  label: string;
  apiKey: string;
}

let blockedKeys = new Set<string>(); // IDs bloqueados temporariamente nesta sessão

async function getNextKey(): Promise<PoolKey | null> {
  const now = new Date();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // Resetar uso de ontem
  await prisma.aiApiKey.updateMany({
    where: { lastUsedAt: { lt: todayStart }, usageToday: { gt: 0 } },
    data: { usageToday: 0 },
  });

  // Desbloquear keys expiradas
  await prisma.aiApiKey.updateMany({
    where: { blockedUntil: { lte: now } },
    data: { blockedUntil: null },
  });

  // Buscar por cada provider na ordem de prioridade
  for (const provider of ALLOWED_PROVIDERS) {
    const key = await prisma.aiApiKey.findFirst({
      where: {
        provider,
        active: true,
        id: { notIn: [...blockedKeys] },
        OR: [{ blockedUntil: null }, { blockedUntil: { lte: now } }],
      },
      orderBy: { usageToday: "asc" },
      select: { id: true, provider: true, label: true, apiKey: true },
    });

    if (key) {
      // Incrementar uso
      await prisma.aiApiKey.update({
        where: { id: key.id },
        data: { usageToday: { increment: 1 }, lastUsedAt: now },
      });
      return key;
    }
  }

  return null;
}

async function blockKey(keyId: string, label: string) {
  blockedKeys.add(keyId);
  const blockUntil = new Date(Date.now() + 40 * 60 * 1000); // 40m
  await prisma.aiApiKey.updateMany({
    where: { id: keyId },
    data: { blockedUntil: blockUntil },
  });
  console.log(`    🔒 Key "${label}" bloqueada por 40m (rate limit)`);
}

// ── Glossário D&D 3.5/5e PT-BR ─────────────────────
const GLOSSARY = `
## Glossário de Termos D&D (USE OBRIGATORIAMENTE):
- AC / Armor Class = CA (Classe de Armadura)
- HP / Hit Points = PV (Pontos de Vida) 
- HD / Hit Dice = DV (Dados de Vida)
- DC / Difficulty Class = CD (Classe de Dificuldade)
- Saving Throw (5e) = Teste de Resistência (TR)
- Save / Saving Throw (3.5) = Jogada de Proteção (JP)
  - Fortitude Save = JP de Fortitude
  - Reflex Save = JP de Reflexos  
  - Will Save = JP de Vontade
- Spell Resistance = RM (Resistência à Magia)
- BAB / Base Attack Bonus = BA / BBA (Bônus Base de Ataque)
- Attack Roll = Jogada de Ataque
- Damage Roll = Jogada de Dano
- Ability Check = Teste de Habilidade
- Skill Check = Teste de Perícia
- Proficiency Bonus = Bônus de Proficiência
- Challenge Rating / CR = ND (Nível de Desafio)
- Experience Points / XP = XP (Pontos de Experiência)
- Caster Level = Nível de Conjurador
- Spell Level = Nível da Magia
- Cantrip = Truque
- Components: V = V (Verbal), S = S (Somática/Gestual), M = M (Material)
- Concentration = Concentração
- Range = Alcance
- Duration = Duração
- Casting Time = Tempo de Conjuração
- Area of Effect = Área de Efeito
- feet / ft = pés (1 pé ≈ 30cm, manter em pés)
- Short Rest = Descanso Curto
- Long Rest = Descanso Longo
- Advantage = Vantagem
- Disadvantage = Desvantagem
- Strength (STR) = Força (FOR)
- Dexterity (DEX) = Destreza (DES)
- Constitution (CON) = Constituição (CON)
- Intelligence (INT) = Inteligência (INT)
- Wisdom (WIS) = Sabedoria (SAB)
- Charisma (CHA) = Carisma (CAR)
- Bonus / Penalty = Bônus / Penalidade
- Round = Rodada
- Turn = Turno
- Action = Ação
- Bonus Action = Ação Bônus
- Reaction = Reação
- Movement = Deslocamento
- Speed = Deslocamento
- Melee = Corpo-a-corpo
- Ranged = À distância
- Damage Types: fire=fogo, cold=frio, lightning=relâmpago, thunder=trovão, acid=ácido, poison=veneno, necrotic=necrótico, radiant=radiante, psychic=psíquico, force=energia, bludgeoning=contundente, piercing=perfurante, slashing=cortante
- Undead = Morto-vivo
- Aberration = Aberração
- Construct = Construto
- Elemental = Elemental
- Fiend = Corruptor
- Celestial = Celestial
- Fey = Feérico
- Dragon = Dragão
- Giant = Gigante
- Humanoid = Humanoide
- Monstrosity = Monstruosidade
- Ooze = Lodo
- Plant = Planta
- Beast = Besta
- Prone = Caído
- Grappled = Agarrado
- Restrained = Contido
- Blinded = Cego
- Charmed = Enfeitiçado
- Frightened = Amedrontado
- Invisible = Invisível
- Paralyzed = Paralisado
- Petrified = Petrificado
- Poisoned = Envenenado
- Stunned = Atordoado
- Unconscious = Inconsciente
- Incapacitated = Incapacitado
- Deafened = Surdo
- Exhaustion = Exaustão
`;

const SYSTEM_PROMPT = `Você é um tradutor especializado em Dungeons & Dragons.
Traduza EXCLUSIVAMENTE as descrições de D&D do inglês para o português brasileiro.

REGRAS OBRIGATÓRIAS:
1. Use SEMPRE os termos do glossário abaixo — NUNCA invente traduções para termos técnicos
2. Mantenha a formatação original (listas com -, parágrafos, etc.)
3. Mantenha números, dados (2d6, 1d8+3), distâncias em pés e medidas exatas
4. NÃO adicione explicações, comentários ou notas pessoais
5. NÃO traduza nomes próprios de magias, monstros ou itens — use o namePtBr fornecido
6. Responda APENAS com o JSON válido solicitado, nada mais
7. Se a descrição for apenas o nome da entrada repetido (ex: "Fireball"), retorne uma string vazia ""

${GLOSSARY}`;

interface TranslateItem {
  index: string;
  name: string;
  namePtBr: string | null;
  text: string;
}

interface TranslateResult {
  [index: string]: string;
}

// ── Chamada API com rotação de keys ─────────────────
async function callTranslateAPI(
  items: TranslateItem[],
  poolKey: PoolKey,
): Promise<TranslateResult> {
  const itemsText = items.map((item, i) => {
    return `[${i + 1}] index: "${item.index}"
nome EN: "${item.name}"
nome PT-BR: "${item.namePtBr || item.name}"
descrição EN:
${item.text}`;
  }).join("\n\n---\n\n");

  const userPrompt = `Traduza as ${items.length} descrições abaixo para PT-BR.

Retorne APENAS um JSON válido no formato:
{
  "${items[0].index}": "tradução aqui",
  ...
}

${itemsText}`;

  const model = DEFAULT_MODELS[poolKey.provider];
  let res: Response;

  if (poolKey.provider === "groq") {
    // Groq usa formato OpenAI
    const url = API_URLS.groq(poolKey.apiKey, model);
    res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${poolKey.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    });
  } else {
    // Gemini
    const url = API_URLS.gemini(poolKey.apiKey, model);
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        generationConfig: {
          temperature: 0.3,
          topP: 0.8,
          responseMimeType: "application/json",
        },
      }),
    });
  }

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`${poolKey.provider} API ${res.status}: ${errText.substring(0, 500)}`);
  }

  const data = await res.json() as any;

  // Extrair texto da resposta (formato Gemini vs OpenAI)
  let text: string;
  if (poolKey.provider === "groq") {
    text = data.choices?.[0]?.message?.content;
  } else {
    text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  }
  if (!text) throw new Error(`Resposta vazia do ${poolKey.provider}`);

  try {
    return JSON.parse(text) as TranslateResult;
  } catch {
    const match = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (match) return JSON.parse(match[1]) as TranslateResult;
    throw new Error(`JSON inválido: ${text.substring(0, 200)}`);
  }
}

// ── Sleep helper ───────────────────────────────────
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ── Modelo genérico de tradução de descrições ──────
interface ModelConfig {
  name: string;
  emoji: string;
  field: string; // "descriptionPtBr" ou campo específico
  findMissing: () => Promise<TranslateItem[]>;
  update: (index: string, translated: string) => Promise<unknown>;
}

function buildModels(): ModelConfig[] {
  return [
    // ── Features (407) ──
    {
      name: "Features",
      emoji: "📋",
      field: "descriptionPtBr",
      findMissing: async () => {
        const records = await prisma.srdFeature.findMany({
          where: { descriptionPtBr: null },
          select: { index: true, name: true, namePtBr: true, description: true },
        });
        return records.map(r => ({ index: r.index, name: r.name, namePtBr: r.namePtBr, text: r.description }));
      },
      update: (index, translated) =>
        prisma.srdFeature.update({ where: { index }, data: { descriptionPtBr: translated } }),
    },
    // ── Talentos (293) ──
    {
      name: "Talentos",
      emoji: "🎯",
      field: "descriptionPtBr",
      findMissing: async () => {
        const records = await prisma.srdFeat.findMany({
          where: { descriptionPtBr: null },
          select: { index: true, name: true, namePtBr: true, description: true },
        });
        return records.map(r => ({ index: r.index, name: r.name, namePtBr: r.namePtBr, text: r.description }));
      },
      update: (index, translated) =>
        prisma.srdFeat.update({ where: { index }, data: { descriptionPtBr: translated } }),
    },
    // ── Equipamentos (342) ──
    {
      name: "Equipamentos",
      emoji: "🛡️",
      field: "descriptionPtBr",
      findMissing: async () => {
        const records = await prisma.srdEquipment.findMany({
          where: { descriptionPtBr: null, description: { not: null } },
          select: { index: true, name: true, namePtBr: true, description: true },
        });
        return records.filter(r => r.description && r.description.trim().length > 0)
          .map(r => ({ index: r.index, name: r.name, namePtBr: r.namePtBr, text: r.description! }));
      },
      update: (index, translated) =>
        prisma.srdEquipment.update({ where: { index }, data: { descriptionPtBr: translated } }),
    },
    // ── Magias (893) ──
    {
      name: "Magias",
      emoji: "📖",
      field: "descriptionPtBr",
      findMissing: async () => {
        const records = await prisma.srdSpell.findMany({
          where: { descriptionPtBr: null },
          select: { index: true, name: true, namePtBr: true, description: true },
        });
        return records.map(r => ({ index: r.index, name: r.name, namePtBr: r.namePtBr, text: r.description }));
      },
      update: (index, translated) =>
        prisma.srdSpell.update({ where: { index }, data: { descriptionPtBr: translated } }),
    },
    // ── Itens Mágicos (997) ──
    {
      name: "Itens Mágicos",
      emoji: "✨",
      field: "descriptionPtBr",
      findMissing: async () => {
        const records = await prisma.srdMagicItem.findMany({
          where: { descriptionPtBr: null },
          select: { index: true, name: true, namePtBr: true, description: true },
        });
        return records.map(r => ({ index: r.index, name: r.name, namePtBr: r.namePtBr, text: r.description }));
      },
      update: (index, translated) =>
        prisma.srdMagicItem.update({ where: { index }, data: { descriptionPtBr: translated } }),
    },
  ];
}

// ── Main ───────────────────────────────────────────
async function main() {
  console.log("🌐 Hub RPG — Tradução de Descrições (multi-key rotation)");
  console.log("══════════════════════════════════════════════════════");
  console.log(`Batch: ${BATCH_SIZE} | Delay: ${DELAY_MS}ms | Max req: ${MAX_REQUESTS}`);
  console.log(`Providers: ${ALLOWED_PROVIDERS.join(" → ")} (OpenRouter excluído)\n`);

  const models = buildModels();
  let totalRequests = 0;
  let totalTranslated = 0;
  let totalErrors = 0;
  const keyUsage: Record<string, number> = {};
  const start = Date.now();

  for (const model of models) {
    const missing = await model.findMissing();
    if (missing.length === 0) {
      console.log(`${model.emoji} ${model.name}: ✅ Já está 100% traduzido`);
      continue;
    }

    console.log(`\n${model.emoji} ${model.name}: ${missing.length} descrições faltando`);

    for (let i = 0; i < missing.length; i += BATCH_SIZE) {
      if (totalRequests >= MAX_REQUESTS) {
        console.log(`\n⚠️ Limite de ${MAX_REQUESTS} requests atingido!`);
        console.log(`   Restam: ${missing.length - i} de ${model.name}`);
        break;
      }

      const batch = missing.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(missing.length / BATCH_SIZE);

      let success = false;
      for (let retry = 0; retry < MAX_RETRIES; retry++) {
        // Pegar próxima key disponível
        const poolKey = await getNextKey();
        if (!poolKey) {
          console.log(`\n🚫 Nenhuma key disponível! Todas bloqueadas ou esgotadas.`);
          console.log(`   Tente novamente mais tarde (keys desbloqueiam em 40m).`);
          // Aguardar 5min e tentar de novo
          console.log(`   ⏳ Aguardando 5 min...`);
          await sleep(5 * 60 * 1000);
          blockedKeys.clear();
          continue;
        }

        const keyTag = `${poolKey.provider}/${poolKey.label}`;
        process.stdout.write(`  [${batchNum}/${totalBatches}] ${batch.length} reg via ${keyTag}... `);

        try {
          const result = await callTranslateAPI(batch, poolKey);
          let batchTranslated = 0;

          for (const item of batch) {
            const translated = result[item.index];
            if (translated && translated.trim().length > 0) {
              await model.update(item.index, translated);
              batchTranslated++;
            }
          }

          totalTranslated += batchTranslated;
          totalRequests++;
          keyUsage[keyTag] = (keyUsage[keyTag] || 0) + 1;
          console.log(`✅ ${batchTranslated}/${batch.length} (req ${totalRequests}/${MAX_REQUESTS})`);
          success = true;
          break;

        } catch (error: any) {
          const msg = error.message || "";
          if (msg.includes("429") || msg.includes("rate") || msg.includes("quota") || msg.includes("RESOURCE_EXHAUSTED")) {
            await blockKey(poolKey.id, poolKey.label);
            console.log(`    ↻ Tentando próxima key (retry ${retry + 1}/${MAX_RETRIES})...`);
            // Não esperar entre retries com keys diferentes
          } else {
            totalErrors++;
            totalRequests++;
            console.log(`❌ Erro: ${msg.substring(0, 120)}`);
            break;
          }
        }
      }
      if (!success) totalErrors++;

      // Delay entre batches
      if (i + BATCH_SIZE < missing.length) {
        await sleep(DELAY_MS);
      }
    }

    if (totalRequests >= MAX_REQUESTS) break;
  }

  // ── Resumo ──
  const elapsed = ((Date.now() - start) / 1000).toFixed(0);
  const elapsedMin = (parseFloat(elapsed) / 60).toFixed(1);
  console.log(`\n══════════════════════════════════════════════════════`);
  console.log(`🏁 Tradução concluída em ${elapsedMin} min (${elapsed}s)`);
  console.log(`📊 ${totalTranslated} descrições traduzidas`);
  console.log(`📡 ${totalRequests} requests usados (de ${MAX_REQUESTS} max)`);
  console.log(`❌ ${totalErrors} erros`);
  console.log(`🔑 Uso por key:`);
  for (const [key, count] of Object.entries(keyUsage).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${key}: ${count} requests`);
  }
  console.log(`💰 Custo: $0`);
}

main()
  .catch((e) => {
    console.error("❌ Erro fatal:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
