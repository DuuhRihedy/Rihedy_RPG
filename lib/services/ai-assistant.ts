// ══════════════════════════════════════════
// Hub RPG — Assistente IA (RAG + Prompts)
// ══════════════════════════════════════════

import { prisma } from "@/lib/db";
import { callGemini, type GeminiMessage } from "./gemini";

// ─── Tipos ──────────────────────────────

export type AssistantMode = "chat" | "npc" | "recap" | "adventure";

export interface AssistantRequest {
  message: string;
  mode: AssistantMode;
  campaignId?: string;
  sessionId?: string;
  history?: GeminiMessage[];
}

export interface AssistantResponse {
  text: string;
  tokensUsed: number;
  context?: string;
}

// ─── RAG: Busca Expandida no SRD ────────

// Mapeamento de nomes de classes PT-BR → EN para busca
const CLASS_NAME_MAP: Record<string, string> = {
  "mago": "Wizard", "wizard": "Wizard",
  "guerreiro": "Fighter", "fighter": "Fighter",
  "ladino": "Rogue", "rogue": "Rogue",
  "clérigo": "Cleric", "clerigo": "Cleric", "cleric": "Cleric",
  "bardo": "Bard", "bard": "Bard",
  "druida": "Druid", "druid": "Druid",
  "paladino": "Paladin", "paladin": "Paladin",
  "ranger": "Ranger", "patrulheiro": "Ranger",
  "feiticeiro": "Sorcerer", "sorcerer": "Sorcerer",
  "bruxo": "Warlock", "warlock": "Warlock",
  "monge": "Monk", "monk": "Monk",
  "bárbaro": "Barbarian", "barbaro": "Barbarian", "barbarian": "Barbarian",
};

// Detecta nível de magia na query (ex: "3° nível", "nível 3", "level 3")
function detectSpellLevel(query: string): number | null {
  const patterns = [
    /(\d+)[°º]?\s*n[ií]vel/i,
    /n[ií]vel\s*(\d+)/i,
    /level\s*(\d+)/i,
    /(\d+)(?:st|nd|rd|th)\s*level/i,
  ];
  for (const p of patterns) {
    const match = query.match(p);
    if (match) return parseInt(match[1], 10);
  }
  return null;
}

// Detecta nome de classe na query
function detectClassName(query: string): string | null {
  const lower = query.toLowerCase();
  for (const [key, value] of Object.entries(CLASS_NAME_MAP)) {
    if (lower.includes(key)) return value;
  }
  return null;
}

async function searchSrdContext(query: string): Promise<string> {
  try {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 2);

  if (terms.length === 0) return "";

  const chunks: string[] = [];
  const searchTerms = terms.slice(0, 4);

  // ── Detecção inteligente de consultas por classe + nível ──
  const detectedLevel = detectSpellLevel(query);
  const detectedClass = detectClassName(query);
  const isSpellByClassQuery = detectedClass !== null &&
    (query.toLowerCase().includes("magia") || query.toLowerCase().includes("spell") ||
     query.toLowerCase().includes("preparar") || query.toLowerCase().includes("conjur") ||
     detectedLevel !== null);

  // Busca direcionada: magias por classe + nível
  if (isSpellByClassQuery) {
    const spells = await prisma.srdSpell.findMany({
      where: {
        classes: { contains: detectedClass!, mode: "insensitive" },
        ...(detectedLevel !== null ? { level: detectedLevel } : {}),
      },
      orderBy: [{ edition: "asc" }, { name: "asc" }], // 3.5 antes de 5e
      take: 40,
    });

    if (spells.length > 0) {
      // Agrupar por edição, 3.5 primeiro
      const spells35 = spells.filter((s) => s.edition === "3.5");
      const spells5e = spells.filter((s) => s.edition === "5e");

      let listing = `[BUSCA DIRECIONADA] Magias de nível ${detectedLevel ?? "todos"} da classe ${detectedClass}: ${spells.length} encontradas\n`;
      if (spells35.length > 0) {
        listing += `\n=== D&D 3.5 (${spells35.length} magias) ===\n` +
          spells35.map((s) => `• ${s.namePtBr || s.name} (${s.name}) — Escola: ${s.school}`).join("\n");
      }
      if (spells5e.length > 0) {
        listing += `\n\n=== D&D 5e (${spells5e.length} magias) ===\n` +
          spells5e.map((s) => `• ${s.namePtBr || s.name} (${s.name}) — Escola: ${s.school}`).join("\n");
      }
      chunks.push(listing);

      // Adicionar detalhes das primeiras 5
      for (const s of spells.slice(0, 5)) {
        chunks.push(
          `[MAGIA] ${s.namePtBr || s.name} (${s.name}) [${s.edition}]` +
            `\nNível: ${s.level} | Escola: ${s.school}` +
            `\nTempo: ${s.castingTime} | Alcance: ${s.range} | Duração: ${s.duration}` +
            `\nComponentes: ${s.components}${s.material ? ` (${s.material})` : ""}` +
            `\nDescrição: ${(s.descriptionPtBr || s.description).substring(0, 300)}` +
            (s.higherLevel ? `\nNíveis superiores: ${(s.higherLevelPtBr || s.higherLevel).substring(0, 150)}` : ""),
        );
      }
    }
  }

  // ── Busca genérica de magias (se não foi busca direcionada ou não achou nada) ──
  if (!isSpellByClassQuery || chunks.length === 0) {
    // Filtrar termos genéricos que poluem a busca
    const stopWords = new Set(["quais", "como", "pode", "preparar", "funciona", "qual", "onde", "usar", "para", "nível", "nivel"]);
    const spellTerms = searchTerms.filter((t) => !stopWords.has(t));

    for (const term of spellTerms) {
      // Traduzir classe PT-BR → EN para busca no campo classes
      const classEN = CLASS_NAME_MAP[term];
      const spells = await prisma.srdSpell.findMany({
        where: {
          OR: [
            { name: { contains: term, mode: "insensitive" as const } },
            { namePtBr: { contains: term, mode: "insensitive" as const } },
            { school: { contains: term, mode: "insensitive" as const } },
            ...(classEN ? [{ classes: { contains: classEN, mode: "insensitive" as const } }] : []),
            { classes: { contains: term, mode: "insensitive" as const } },
          ],
        },
        take: 3,
      });

      for (const s of spells) {
        chunks.push(
          `[MAGIA] ${s.namePtBr || s.name} (${s.name}) [${s.edition}]` +
            `\nNível: ${s.level} | Escola: ${s.school}` +
            `\nTempo: ${s.castingTime} | Alcance: ${s.range} | Duração: ${s.duration}` +
            `\nComponentes: ${s.components}${s.material ? ` (${s.material})` : ""}` +
            `\nDescrição: ${(s.descriptionPtBr || s.description).substring(0, 500)}` +
            (s.higherLevel ? `\nNíveis superiores: ${(s.higherLevelPtBr || s.higherLevel).substring(0, 200)}` : ""),
        );
      }
    }
  }

  // ── Buscar monstros (pular se a query é claramente sobre classe/magias) ──
  if (!isSpellByClassQuery) {
    for (const term of searchTerms) {
      const monsters = await prisma.srdMonster.findMany({
        where: {
          OR: [
            { name: { contains: term, mode: "insensitive" } },
            { namePtBr: { contains: term, mode: "insensitive" } },
            { type: { contains: term, mode: "insensitive" } },
          ],
        },
        take: 2,
      });

      for (const m of monsters) {
        chunks.push(
          `[MONSTRO] ${m.namePtBr || m.name} (${m.name}) [${m.edition}]` +
            `\nTamanho: ${m.size} | Tipo: ${m.type} | ND: ${m.challengeRating} (${m.xp} XP)` +
            `\nCA: ${m.armorClass} | PV: ${m.hitPoints} (${m.hitDice})` +
            `\nFOR ${m.str} DES ${m.dex} CON ${m.con} INT ${m.intl} SAB ${m.wis} CAR ${m.cha}` +
            `\nVelocidade: ${m.speed}` +
            (m.specialAbilities ? `\nHabilidades: ${(m.specialAbilitiesPtBr || m.specialAbilities).substring(0, 400)}` : "") +
            (m.actions ? `\nAções: ${(m.actionsPtBr || m.actions).substring(0, 400)}` : ""),
        );
      }
    }
  }

  // Buscar equipamentos
  for (const term of searchTerms.slice(0, 2)) {
    const equip = await prisma.srdEquipment.findMany({
      where: {
        OR: [
          { name: { contains: term, mode: "insensitive" } },
          { namePtBr: { contains: term, mode: "insensitive" } },
          { category: { contains: term, mode: "insensitive" } },
        ],
      },
      take: 2,
    });

    for (const e of equip) {
      chunks.push(
        `[EQUIPAMENTO] ${e.namePtBr || e.name} (${e.name}) [${e.edition}]` +
          `\nCategoria: ${e.category} | Custo: ${e.cost} | Peso: ${e.weight}` +
          (e.damage ? `\nDano: ${e.damage}` : "") +
          (e.properties ? `\nPropriedades: ${e.properties}` : "") +
          (e.description ? `\nDescrição: ${(e.descriptionPtBr || e.description).substring(0, 300)}` : ""),
      );
    }
  }

  // Buscar itens mágicos
  for (const term of searchTerms.slice(0, 2)) {
    const magicItems = await prisma.srdMagicItem.findMany({
      where: {
        OR: [
          { name: { contains: term, mode: "insensitive" } },
          { namePtBr: { contains: term, mode: "insensitive" } },
          { category: { contains: term, mode: "insensitive" } },
        ],
      },
      take: 2,
    });

    for (const mi of magicItems) {
      chunks.push(
        `[ITEM MÁGICO] ${mi.namePtBr || mi.name} (${mi.name}) [${mi.edition}]` +
          `\nCategoria: ${mi.category} | Raridade: ${mi.rarity}` +
          (mi.requiresAttunement ? " | Requer sintonização" : "") +
          `\nDescrição: ${(mi.descriptionPtBr || mi.description).substring(0, 400)}`,
      );
    }
  }

  // Buscar feats/talentos
  for (const term of searchTerms.slice(0, 2)) {
    const feats = await prisma.srdFeat.findMany({
      where: {
        OR: [
          { name: { contains: term, mode: "insensitive" } },
          { namePtBr: { contains: term, mode: "insensitive" } },
        ],
      },
      take: 2,
    });

    for (const f of feats) {
      chunks.push(
        `[TALENTO] ${f.namePtBr || f.name} (${f.name}) [${f.edition}]` +
          `\nDescrição: ${(f.descriptionPtBr || f.description).substring(0, 400)}` +
          (f.prerequisites ? `\nPré-requisitos: ${f.prerequisites}` : ""),
      );
    }
  }

  // Buscar classes
  const classSearchTerms = searchTerms.map(t => CLASS_NAME_MAP[t] || t);
  for (const term of [...new Set(classSearchTerms)].slice(0, 2)) {
    const classes = await prisma.srdClass.findMany({
      where: {
        OR: [
          { name: { contains: term, mode: "insensitive" } },
        ],
      },
      take: 1,
    });

    for (const c of classes) {
      chunks.push(
        `[CLASSE] ${c.name} [${c.edition}]` +
          `\nDado de Vida: d${c.hitDie}` +
          (c.savingThrows ? `\nSalvaguardas: ${c.savingThrows}` : "") +
          (c.proficiencies ? `\nProficiências: ${c.proficiencies.substring(0, 300)}` : ""),
      );
    }
  }

  // Limitar contexto total para não exceder token limits
  return chunks.slice(0, 15).join("\n\n---\n\n");
  } catch (err) {
    console.error("[searchSrdContext] Erro ao buscar SRD:", err);
    return "";
  }
}

// ─── Contexto de Campanha ───────────────

async function getCampaignContext(campaignId: string): Promise<string> {
  try {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: {
      npcs: { include: { npc: true }, take: 10 },
      sessions: { orderBy: { number: "desc" }, take: 3 },
      arcs: true,
    },
  });

  if (!campaign) return "";

  let ctx = `[CAMPANHA ATIVA] ${campaign.name}`;
  ctx += `\nEdição: ${campaign.edition} | Status: ${campaign.status}`;
  if (campaign.description) ctx += `\nDescrição: ${campaign.description}`;

  if (campaign.npcs.length > 0) {
    ctx += "\n\nNPCs da campanha:";
    for (const cn of campaign.npcs) {
      const n = cn.npc;
      ctx += `\n- ${n.name} (${n.race} ${n.class || ""} Nv${n.level || "?"}) — ${n.type === "ally" ? "Aliado" : n.type === "enemy" ? "Inimigo" : "Neutro"}`;
    }
  }

  if (campaign.arcs.length > 0) {
    ctx += "\n\nArcos narrativos:";
    for (const arc of campaign.arcs) {
      ctx += `\n- ${arc.title} (${arc.status})`;
    }
  }

  if (campaign.sessions.length > 0) {
    ctx += "\n\nÚltimas sessões:";
    for (const s of campaign.sessions) {
      ctx += `\n- Sessão ${s.number}: ${s.title}`;
      if (s.aiRecap) ctx += ` — ${s.aiRecap.substring(0, 200)}`;
    }
  }

  return ctx;
  } catch (err) {
    console.error("[getCampaignContext] Erro:", err);
    return "";
  }
}

// ─── Buscar Histórico do Chat ───────────

async function getRecentHistory(limit: number = 4): Promise<GeminiMessage[]> {
  try {
    const recent = await prisma.chatHistory.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    const messages: GeminiMessage[] = [];
    for (const msg of recent.reverse()) {
      messages.push({ role: "user", parts: [{ text: msg.question }] });
      messages.push({ role: "model", parts: [{ text: msg.answer }] });
    }
    return messages;
  } catch (err) {
    console.error("[getRecentHistory] Erro:", err);
    return [];
  }
}

// ─── Prompts do Sistema ─────────────────

const SYSTEM_PROMPTS: Record<AssistantMode, string> = {
  chat: `Você é o Assistente do Hub RPG, um especialista em D&D 3.5 e 5e.

PRIORIDADE DE EDIÇÃO:
- D&D 3.5 é o SISTEMA PRINCIPAL do mestre. SEMPRE priorize regras e dados do 3.5.
- Quando houver dados de AMBAS as edições, liste D&D 3.5 PRIMEIRO.
- Se o usuário não especificar a edição, ASSUMA que é D&D 3.5.
- Só responda exclusivamente com 5e se o usuário pedir explicitamente.
- Quando listar magias, monstros ou itens de ambas as edições, SEPARE claramente com cabeçalhos "D&D 3.5" e "D&D 5e".

REGRAS:
- SEMPRE responda em português brasileiro (PT-BR)
- Use terminologia oficial brasileira de D&D (Classe de Armadura = CA, Pontos de Vida = PV, Nível de Desafio = ND, etc.)
- Quando o contexto do acervo D&D for fornecido, CITE as regras com precisão
- Se não tiver certeza, diga "não encontrei no acervo" ao invés de inventar
- Formate a resposta com markdown (negrito, listas, tabelas quando útil)
- Converta pés para metros (1 pé ≈ 0,3m, 5 pés = 1,5m, 30 pés = 9m)
- Se houver uma campanha ativa, contextualize as respostas nela
- Diferencie entre edições (3.5 e 5e) quando relevante
- Seja conciso mas completo`,

  npc: `Você é um gerador de NPCs para D&D. 

PRIORIDADE: D&D 3.5 é o sistema principal. Gere NPCs usando regras do 3.5 por padrão (atributos 3d6, classes do 3.5, feats do 3.5). Só use 5e se o usuário pedir.

REGRAS:
- SEMPRE responda em PT-BR
- Gere NPCs completos com o formato abaixo
- Use terminologia oficial brasileira
- Seja criativo com personalidade, motivações e aparência
- Se houver campanha ativa, contextualize o NPC nela

FORMATO OBRIGATÓRIO (use exatamente assim):
**Nome:** [nome]
**Raça:** [raça]
**Classe:** [classe e nível]
**Alinhamento:** [alinhamento em PT-BR]
**Tipo:** [aliado/inimigo/neutro]

**Atributos:**
| FOR | DES | CON | INT | SAB | CAR |
|-----|-----|-----|-----|-----|-----|
| [X] | [X] | [X] | [X] | [X] | [X] |

**PV:** [pontos de vida] | **CA:** [classe de armadura]

**Aparência:** [descrição física]
**Personalidade:** [traços, ideais, vínculos, falhas]
**Background:** [história resumida]
**Motivação:** [o que move o NPC]
**Itens notáveis:** [equipamento importante]
**Gancho de aventura:** [como os jogadores podem interagir]`,

  recap: `Você é um cronista de sessões de RPG.
O sistema principal é D&D 3.5. Use terminologia e mecânicas do 3.5 nas referências.

REGRAS:
- SEMPRE responda em PT-BR
- Transforme notas brutas em um resumo narrativo envolvente
- Use tom épico/fantástico mas sem exagerar
- Mantenha os fatos das notas — NÃO invente acontecimentos
- Organize cronologicamente
- Destaque momentos-chave, decisões importantes e NPCs envolvidos
- Use formatação markdown com cabeçalhos e listas
- Se houver campanha ativa, use os nomes corretos dos NPCs e locais

FORMATO:
## 📜 Recap — Sessão [número]
### Resumo
[1-2 parágrafos narrativos]
### Momentos-chave
- [lista dos momentos importantes]
### Decisões dos jogadores
- [escolhas significativas]
### Ganchos para próxima sessão
- [fios soltos, ameaças pendentes]`,

  adventure: `Você é um gerador de aventuras e side-quests para D&D.

PRIORIDADE: D&D 3.5 é o sistema principal. Use monstros, encontros e regras do 3.5 por padrão.

REGRAS:
- SEMPRE responda em PT-BR
- Se houver campanha ativa, contextualize a aventura nela (use NPCs, arcos, locais existentes)
- Inclua encontros com CR/ND balanceado para o grupo
- Seja criativo mas mantenha a consistência com o mundo da campanha
- Use terminologia oficial brasileira

FORMATO OBRIGATÓRIO:
## ⚔️ [Nome da Aventura]
### 📋 Sinopse
[1-2 parágrafos com o conceito]

### 🎯 Ganho de Aventura (como apresentar aos jogadores)
[como os PJs entram na aventura]

### 📍 Atos
#### Ato 1 — [Título]
[descrição do primeiro ato, locais, NPCs]
#### Ato 2 — [Título]
[descrição]
#### Ato 3 — [Título / Clímax]
[descrição do confronto final]

### ⚔️ Encontros
| # | Encontro | Monstros | CR/ND |
|---|----------|----------|-------|
| 1 | [Local]  | [Monstros] | [CR] |

### 👥 NPCs Importantes
- **[Nome]:** [raça, classe, papel na aventura]

### 💰 Recompensas
- [tesouros, itens mágicos, aliados]

### 🧵 Ganchos Futuros
- [conexões com a campanha maior]`,
};

// ─── Função Principal ───────────────────

export async function askAssistant(req: AssistantRequest): Promise<AssistantResponse> {
  let systemPrompt = SYSTEM_PROMPTS[req.mode];
  let contextInfo = "";

  // Adicionar contexto de campanha
  if (req.campaignId) {
    const campaignCtx = await getCampaignContext(req.campaignId);
    if (campaignCtx) {
      systemPrompt += `\n\n--- CONTEXTO DA CAMPANHA ---\n${campaignCtx}`;
      contextInfo += campaignCtx;
    }
  }

  // RAG: buscar no SRD (para chat e npc)
  if (req.mode === "chat" || req.mode === "npc" || req.mode === "adventure") {
    const srdCtx = await searchSrdContext(req.message);
    if (srdCtx) {
      systemPrompt += `\n\n--- DADOS DO SRD (use para responder) ---\n${srdCtx}`;
      contextInfo += srdCtx;
    }
  }

  // Carregar histórico persistente se não houver history no request
  const history = req.history && req.history.length > 0
    ? req.history
    : await getRecentHistory(4);

  const response = await callGemini(
    systemPrompt,
    history,
    req.message,
  );

  // Salvar no histórico (não impede resposta se falhar)
  try {
    await prisma.chatHistory.create({
      data: {
        question: req.message,
        answer: response.text,
        context: contextInfo.substring(0, 2000) || null,
        tokensUsed: response.tokensUsed,
      },
    });
  } catch (err) {
    console.error("[askAssistant] Erro ao salvar histórico:", err);
  }

  return {
    text: response.text,
    tokensUsed: response.tokensUsed,
    context: contextInfo || undefined,
  };
}
