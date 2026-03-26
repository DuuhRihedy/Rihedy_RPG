// ══════════════════════════════════════════════════════
// Hub RPG — Script ONE-TIME de tradução via Gemini
// Traduz descriptionPtBr de TODOS os modelos restantes
// Usa Gemini Flash 2.5 Free em batch (15 registros/req)
// Salva direto no banco Neon PostgreSQL → resultado fixo
// ══════════════════════════════════════════════════════

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const API_KEY = process.env.GEMINI_API_KEY!;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

const BATCH_SIZE = 10;       // registros por request
const DELAY_MS = 15000;      // 15s entre requests (conservador p/ Gemini Free)
const MAX_REQUESTS = 240;    // reserva 10 do limite diário de 250
const MAX_RETRIES = 3;       // retries por batch com backoff

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

// ── Chamada API Gemini ─────────────────────────────
async function callGeminiTranslate(items: TranslateItem[]): Promise<TranslateResult> {
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

  const body = {
    contents: [
      { role: "user", parts: [{ text: userPrompt }] },
    ],
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    generationConfig: {
      temperature: 0.3,
      topP: 0.8,
      responseMimeType: "application/json",
    },
  };

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API ${res.status}: ${errText.substring(0, 500)}`);
  }

  const data = await res.json() as any;
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Resposta vazia do Gemini");

  try {
    return JSON.parse(text) as TranslateResult;
  } catch {
    // Tenta extrair JSON de dentro de markdown code block
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
  console.log("🌐 Hub RPG — Tradução de Descrições via Gemini");
  console.log("══════════════════════════════════════════════════════");
  console.log(`Batch size: ${BATCH_SIZE} | Delay: ${DELAY_MS}ms | Max requests: ${MAX_REQUESTS}\n`);

  const models = buildModels();
  let totalRequests = 0;
  let totalTranslated = 0;
  let totalErrors = 0;
  const start = Date.now();

  for (const model of models) {
    const missing = await model.findMissing();
    if (missing.length === 0) {
      console.log(`${model.emoji} ${model.name}: ✅ Já está 100% traduzido`);
      continue;
    }

    console.log(`\n${model.emoji} ${model.name}: ${missing.length} descrições faltando`);

    // Processar em batches
    for (let i = 0; i < missing.length; i += BATCH_SIZE) {
      if (totalRequests >= MAX_REQUESTS) {
        console.log(`\n⚠️ Limite de ${MAX_REQUESTS} requests atingido! Pare e continue amanhã.`);
        console.log(`   Restam: ${missing.length - i} de ${model.name}`);
        break;
      }

      const batch = missing.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(missing.length / BATCH_SIZE);

      process.stdout.write(`  [${batchNum}/${totalBatches}] Traduzindo ${batch.length} registros... `);

      let success = false;
      for (let retry = 0; retry < MAX_RETRIES; retry++) {
        try {
          const result = await callGeminiTranslate(batch);
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
          console.log(`✅ ${batchTranslated}/${batch.length} salvos (req ${totalRequests}/${MAX_REQUESTS})`);
          success = true;
          break;

        } catch (error: any) {
          if (error.message?.includes("429")) {
            const waitTime = 30_000 * Math.pow(2, retry); // 30s, 60s, 120s
            console.log(`⏳ Rate limit (tentativa ${retry + 1}/${MAX_RETRIES}). Esperando ${waitTime / 1000}s...`);
            await sleep(waitTime);
          } else {
            totalErrors++;
            totalRequests++;
            console.log(`❌ Erro: ${error.message?.substring(0, 100)}`);
            break;
          }
        }
      }
      if (!success) totalErrors++;

      // Respeitar rate limit
      if (i + BATCH_SIZE < missing.length) {
        await sleep(DELAY_MS);
      }
    }

    if (totalRequests >= MAX_REQUESTS) break;
  }

  // ── Resumo ──
  const elapsed = ((Date.now() - start) / 1000).toFixed(0);
  console.log(`\n══════════════════════════════════════════════════════`);
  console.log(`🏁 Tradução concluída em ${elapsed}s`);
  console.log(`📊 ${totalTranslated} descrições traduzidas`);
  console.log(`📡 ${totalRequests} requests usados (de ${MAX_REQUESTS} max)`);
  console.log(`❌ ${totalErrors} erros`);
  console.log(`💰 Custo: $0 (Gemini Free)`);
}

main()
  .catch((e) => {
    console.error("❌ Erro fatal:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
