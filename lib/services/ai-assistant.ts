// ══════════════════════════════════════════
// Hub RPG — Assistente IA (RAG + Prompts)
// ══════════════════════════════════════════

import { prisma } from "@/lib/db";
import { callGemini, type GeminiMessage } from "./gemini";

// ─── Tipos ──────────────────────────────

export type AssistantMode = "chat" | "npc" | "recap";

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

// ─── RAG: Busca no SRD ──────────────────

async function searchSrdContext(query: string): Promise<string> {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 2);

  if (terms.length === 0) return "";

  const chunks: string[] = [];

  // Buscar magias
  for (const term of terms.slice(0, 3)) {
    const spells = await prisma.srdSpell.findMany({
      where: {
        OR: [
          { name: { contains: term } },
          { namePtBr: { contains: term } },
          { school: { contains: term } },
        ],
      },
      take: 3,
    });

    for (const s of spells) {
      chunks.push(
        `[MAGIA] ${s.namePtBr || s.name} (${s.name})` +
          `\nNível: ${s.level} | Escola: ${s.school}` +
          `\nTempo: ${s.castingTime} | Alcance: ${s.range} | Duração: ${s.duration}` +
          `\nComponentes: ${s.components}${s.material ? ` (${s.material})` : ""}` +
          `\nDescrição: ${s.descriptionPtBr || s.description}` +
          (s.higherLevel ? `\nNíveis superiores: ${s.higherLevelPtBr || s.higherLevel}` : ""),
      );
    }
  }

  // Buscar monstros
  for (const term of terms.slice(0, 3)) {
    const monsters = await prisma.srdMonster.findMany({
      where: {
        OR: [
          { name: { contains: term } },
          { namePtBr: { contains: term } },
          { type: { contains: term } },
        ],
      },
      take: 2,
    });

    for (const m of monsters) {
      chunks.push(
        `[MONSTRO] ${m.namePtBr || m.name} (${m.name})` +
          `\nTamanho: ${m.size} | Tipo: ${m.type} | ND: ${m.challengeRating} (${m.xp} XP)` +
          `\nCA: ${m.armorClass} | PV: ${m.hitPoints} (${m.hitDice})` +
          `\nFOR ${m.str} DES ${m.dex} CON ${m.con} INT ${m.intl} SAB ${m.wis} CAR ${m.cha}` +
          `\nVelocidade: ${m.speed}` +
          (m.specialAbilities ? `\nHabilidades: ${m.specialAbilitiesPtBr || m.specialAbilities}` : "") +
          (m.actions ? `\nAções: ${m.actionsPtBr || m.actions}` : ""),
      );
    }
  }

  // Buscar equipamentos
  for (const term of terms.slice(0, 2)) {
    const equip = await prisma.srdEquipment.findMany({
      where: {
        OR: [
          { name: { contains: term } },
          { namePtBr: { contains: term } },
        ],
      },
      take: 2,
    });

    for (const e of equip) {
      chunks.push(
        `[EQUIPAMENTO] ${e.namePtBr || e.name} (${e.name})` +
          `\nCategoria: ${e.category} | Custo: ${e.cost} | Peso: ${e.weight}` +
          (e.damage ? `\nDano: ${e.damage}` : "") +
          (e.description ? `\nDescrição: ${e.descriptionPtBr || e.description}` : ""),
      );
    }
  }

  return chunks.slice(0, 8).join("\n\n---\n\n");
}

// ─── Contexto de Campanha ───────────────

async function getCampaignContext(campaignId: string): Promise<string> {
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
}

// ─── Prompts do Sistema ─────────────────

const SYSTEM_PROMPTS: Record<AssistantMode, string> = {
  chat: `Você é o Assistente do Hub RPG, um especialista em D&D 3.5 e 5e.

REGRAS:
- SEMPRE responda em português brasileiro (PT-BR)
- Use terminologia oficial brasileira de D&D (Classe de Armadura = CA, Pontos de Vida = PV, Nível de Desafio = ND, etc.)
- Quando o contexto SRD for fornecido, CITE as regras com precisão
- Se não tiver certeza, diga "não encontrei no SRD" ao invés de inventar
- Formate a resposta com markdown (negrito, listas, tabelas quando útil)
- Converta pés para metros (1 pé ≈ 0,3m, 5 pés = 1,5m, 30 pés = 9m)
- Se houver uma campanha ativa, contextualize as respostas nela
- Seja conciso mas completo`,

  npc: `Você é um gerador de NPCs para D&D. 

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

  // RAG: buscar no SRD (só para modo chat)
  if (req.mode === "chat") {
    const srdCtx = await searchSrdContext(req.message);
    if (srdCtx) {
      systemPrompt += `\n\n--- DADOS DO SRD (use para responder) ---\n${srdCtx}`;
      contextInfo += srdCtx;
    }
  }

  const response = await callGemini(
    systemPrompt,
    req.history || [],
    req.message,
  );

  // Salvar no histórico
  await prisma.chatHistory.create({
    data: {
      question: req.message,
      answer: response.text,
      context: contextInfo.substring(0, 2000) || null,
      tokensUsed: response.tokensUsed,
    },
  });

  return {
    text: response.text,
    tokensUsed: response.tokensUsed,
    context: contextInfo || undefined,
  };
}
