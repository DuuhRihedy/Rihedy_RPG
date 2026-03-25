import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { callGemini } from "@/lib/services/gemini";

// Tipos de ação disponíveis
type AiAction =
  | "extract-npcs"
  | "analyze-sheet"
  | "convert-to-npc"
  | "suggest-encounters"
  | "expand-story"
  | "suggest-items"
  | "suggest-monsters";

// Busca contexto da campanha (NPCs, notas, arcos)
async function getCampaignContext(campaignId: string) {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: {
      npcs: { include: { npc: true } },
      notes: true,
      arcs: true,
    },
  });

  if (!campaign) return "";

  const npcsText = campaign.npcs
    .map(({ npc }) => `- ${npc.name} (${npc.race || "?"} ${npc.class || "?"}, Nível ${npc.level || "?"}, ${npc.alignment || "?"})${npc.description ? ": " + npc.description : ""}`)
    .join("\n");

  const notesText = campaign.notes
    .map((n) => `- ${n.title}: ${n.content.substring(0, 200)}`)
    .join("\n");

  const arcsText = campaign.arcs
    .map((a) => `- ${a.title} [${a.status}]${a.description ? ": " + a.description : ""}`)
    .join("\n");

  return `
=== CONTEXTO DA CAMPANHA: ${campaign.name} (D&D ${campaign.edition}) ===
${campaign.description ? "Descrição: " + campaign.description : ""}

NPCs da campanha:
${npcsText || "Nenhum NPC cadastrado"}

Notas do mestre:
${notesText || "Nenhuma nota"}

Arcos narrativos:
${arcsText || "Nenhum arco"}
`;
}

// Monta o system prompt baseado na ação
function buildSystemPrompt(action: AiAction, documentContent: string, campaignContext: string): string {
  const baseRules = `Você é um assistente especializado em D&D 3.5 Edition (Dungeons & Dragons 3ª Edição Revisada).
Sempre responda em Português (PT-BR).
Use terminologia oficial de D&D 3.5 quando possível.
Seja detalhado e preciso com as regras de D&D 3.5.`;

  const prompts: Record<AiAction, string> = {
    "extract-npcs": `${baseRules}

Sua tarefa é analisar o documento fornecido e extrair TODOS os personagens/NPCs mencionados.
Para cada NPC encontrado, retorne um JSON válido com um array de objetos.

IMPORTANTE: Sua resposta DEVE conter APENAS o JSON, sem texto antes ou depois, sem markdown code blocks.

Formato de cada NPC:
{
  "name": "Nome do personagem",
  "race": "Raça (Humano, Elfo, Anão, etc.)",
  "class": "Classe (Guerreiro, Mago, Ladino, etc.)",
  "level": 1,
  "alignment": "Alinhamento (Leal e Bom, Neutro, Caótico e Mau, etc.)",
  "description": "Descrição breve do personagem baseada no texto",
  "type": "ally/enemy/neutral",
  "stats": {
    "str": 10, "dex": 10, "con": 10, "intl": 10, "wis": 10, "cha": 10,
    "hp": 10, "ac": 10
  }
}

Se alguma informação não estiver no texto, faça uma estimativa razoável baseada nas regras de D&D 3.5.
Se o nível não for mencionado, estime baseado no contexto.

DOCUMENTO:
${documentContent}`,

    "analyze-sheet": `${baseRules}

Sua tarefa é analisar a ficha de personagem fornecida e verificar se está correta segundo as regras de D&D 3.5.

Verifique:
1. Atributos base e modificadores estão corretos
2. Bônus de ataque base (BAB) correto para classe/nível
3. Testes de resistência (Fortitude, Reflexos, Vontade) corretos
4. Pontos de vida compatíveis com classe/nível/Constituição
5. Classe de Armadura (CA) calculada corretamente
6. Perícias: pontos gastos dentro do limite, graduações máximas corretas
7. Talentos: pré-requisitos atendidos, quantidade correta para o nível
8. Magias (se aplicável): slots corretos, magias existentes na lista da classe
9. Bônus raciais aplicados corretamente

Para cada problema encontrado, explique:
- O que está errado
- Qual é o valor correto segundo as regras
- A referência da regra (livro do jogador 3.5, página se souber)

Se a ficha estiver correta, elogie e dê sugestões de otimização.

FICHA DO PERSONAGEM:
${documentContent}`,

    "convert-to-npc": `${baseRules}

Sua tarefa é converter o documento (ficha de personagem ou descrição) em um NPC formatado.
Retorne APENAS um JSON válido com o seguinte formato, sem texto antes ou depois, sem markdown code blocks:

{
  "name": "Nome",
  "race": "Raça",
  "class": "Classe",
  "level": 1,
  "alignment": "Alinhamento",
  "description": "Descrição do personagem",
  "backstory": "História de fundo",
  "type": "ally/enemy/neutral",
  "stats": {
    "str": 10, "dex": 10, "con": 10, "intl": 10, "wis": 10, "cha": 10,
    "hp": 10, "ac": 10
  }
}

Extraia o máximo de informação possível do texto. Calcule stats que faltem usando regras de D&D 3.5.

DOCUMENTO:
${documentContent}`,

    "suggest-encounters": `${baseRules}

Sua tarefa é sugerir encontros temáticos para a campanha baseados no documento e contexto fornecidos.

Para cada encontro sugerido, inclua:
1. **Nome do Encontro**: título evocativo
2. **Localização**: onde ocorre (baseado em locais mencionados no documento)
3. **Monstros/Inimigos**: nomes específicos de monstros de D&D 3.5 com CR (Challenge Rating)
4. **Nível de Desafio**: CR total do encontro
5. **Descrição**: como o encontro se desenrola
6. **Conexão com a história**: como se relaciona com o enredo
7. **Recompensas sugeridas**: tesouro e XP

Sugira entre 3 e 5 encontros variados (combate, roleplay, exploração).
Use monstros oficiais de D&D 3.5 (Monster Manual, livros suplementares).
Adapte o CR ao nível dos personagens da campanha.

DOCUMENTO:
${documentContent}

${campaignContext}`,

    "expand-story": `${baseRules}

Sua tarefa é expandir e melhorar a história/documento fornecido.

Faça o seguinte:
1. **Enriqueça descrições**: adicione detalhes sensoriais (sons, cheiros, visuais)
2. **Ganchos de aventura**: insira pelo menos 3 ganchos de plot que o mestre pode usar
3. **NPCs secundários**: sugira personagens coadjuvantes que enriqueçam a cena
4. **Conflitos**: adicione camadas de conflito (político, pessoal, sobrenatural)
5. **Locais de interesse**: detalhe locais mencionados ou sugira novos
6. **Segredos**: adicione mistérios e informações ocultas para o mestre

Mantenha o tom e estilo do texto original.
Destaque as adições com **negrito** ou marcadores claros.
O texto expandido deve ser pelo menos 3x mais longo que o original.

DOCUMENTO ORIGINAL:
${documentContent}

${campaignContext}`,

    "suggest-items": `${baseRules}

Sua tarefa é sugerir itens mágicos e equipamentos temáticos baseados no contexto do documento e da campanha.

Para cada item sugerido, inclua:
1. **Nome**: nome do item (pode ser inventado, mas coerente com D&D 3.5)
2. **Tipo**: arma, armadura, anel, poção, cajado, varinha, item maravilhoso, etc.
3. **Raridade**: menor, médio, maior (com valor em GP estimado)
4. **Descrição**: aparência e história do item
5. **Propriedades mecânicas**: bônus, habilidades especiais, número de cargas
6. **Custo de criação**: se aplicável (XP e GP segundo regras 3.5)
7. **Pré-requisitos de criação**: talentos e magias necessários

Sugira entre 5 e 8 itens variados, adequados ao nível e contexto da campanha.
Inclua tanto itens oficiais do DMG 3.5 quanto itens customizados temáticos.

DOCUMENTO:
${documentContent}

${campaignContext}`,

    "suggest-monsters": `${baseRules}

Sua tarefa é sugerir monstros adequados baseados nos locais e temas do documento.

Para cada monstro sugerido, inclua:
1. **Nome**: nome oficial de D&D 3.5 (e tradução PT-BR se houver)
2. **CR (Challenge Rating)**: nível de desafio
3. **Tipo**: tipo de criatura (Aberração, Morto-vivo, Dragão, etc.)
4. **Fonte**: livro onde aparece (Monster Manual, Fiend Folio, etc.)
5. **Por que se encaixa**: conexão temática com o documento/campanha
6. **Táticas**: como esse monstro lutaria/agiria na cena
7. **Tesouro**: tipo de tesouro padrão
8. **Dificuldade estimada**: para quantos PCs e de qual nível

Sugira entre 5 e 10 monstros variados em CR.
Priorize monstros que se encaixem tematicamente com os locais e enredo.
Inclua pelo menos 1 monstro de CR alto como "chefe" potencial.

DOCUMENTO:
${documentContent}

${campaignContext}`,
  };

  return prompts[action];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentId, action, campaignId } = body as {
      documentId: string;
      action: AiAction;
      campaignId: string;
    };

    if (!documentId || !action || !campaignId) {
      return NextResponse.json(
        { error: "documentId, action e campaignId são obrigatórios" },
        { status: 400 },
      );
    }

    const validActions: AiAction[] = [
      "extract-npcs",
      "analyze-sheet",
      "convert-to-npc",
      "suggest-encounters",
      "expand-story",
      "suggest-items",
      "suggest-monsters",
    ];

    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: `Ação inválida. Ações válidas: ${validActions.join(", ")}` },
        { status: 400 },
      );
    }

    // Busca o documento
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return NextResponse.json({ error: "Documento não encontrado" }, { status: 404 });
    }

    // Busca contexto da campanha para ações que precisam
    const needsContext: AiAction[] = [
      "suggest-encounters",
      "expand-story",
      "suggest-items",
      "suggest-monsters",
    ];
    const campaignContext = needsContext.includes(action)
      ? await getCampaignContext(campaignId)
      : "";

    // Monta prompt e chama Gemini
    const systemPrompt = buildSystemPrompt(action, document.content, campaignContext);
    const userMessage = `Analise o documento "${document.name}" e execute a ação solicitada.`;

    const response = await callGemini(systemPrompt, [], userMessage);

    // Para ações que criam entidades, processa o resultado
    if (action === "extract-npcs") {
      return await handleExtractNpcs(response.text, campaignId, document.id, response.tokensUsed);
    }

    if (action === "convert-to-npc") {
      return await handleConvertToNpc(response.text, campaignId, document.id, response.tokensUsed);
    }

    // Para demais ações, retorna o texto da resposta
    return NextResponse.json({
      action,
      result: response.text,
      tokensUsed: response.tokensUsed,
    });
  } catch (error) {
    console.error("Erro no processamento de IA:", error);
    return NextResponse.json(
      { error: "Erro ao processar com IA: " + (error instanceof Error ? error.message : "desconhecido") },
      { status: 500 },
    );
  }
}

// Processa extração de NPCs — cria no banco e vincula à campanha
async function handleExtractNpcs(
  aiText: string,
  campaignId: string,
  documentId: string,
  tokensUsed: number,
) {
  try {
    // Tenta extrair JSON da resposta (pode ter texto antes/depois)
    const jsonMatch = aiText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json({
        action: "extract-npcs",
        result: aiText,
        tokensUsed,
        npcsCreated: 0,
        error: "Não foi possível extrair JSON da resposta. Mostrando texto bruto.",
      });
    }

    const npcs = JSON.parse(jsonMatch[0]);

    if (!Array.isArray(npcs) || npcs.length === 0) {
      return NextResponse.json({
        action: "extract-npcs",
        result: aiText,
        tokensUsed,
        npcsCreated: 0,
      });
    }

    const created = [];

    for (const npcData of npcs) {
      // Cria o NPC
      const npc = await prisma.npc.create({
        data: {
          name: npcData.name || "NPC Sem Nome",
          race: npcData.race || null,
          class: npcData.class || null,
          level: npcData.level || null,
          alignment: npcData.alignment || null,
          description: npcData.description || null,
          type: npcData.type || "neutral",
          edition: "3.5",
        },
      });

      // Cria atributos se disponíveis
      if (npcData.stats) {
        await prisma.npcAttributes.create({
          data: {
            npcId: npc.id,
            str: npcData.stats.str || 10,
            dex: npcData.stats.dex || 10,
            con: npcData.stats.con || 10,
            intl: npcData.stats.intl || 10,
            wis: npcData.stats.wis || 10,
            cha: npcData.stats.cha || 10,
            hp: npcData.stats.hp || 10,
            ac: npcData.stats.ac || 10,
          },
        });
      }

      // Vincula à campanha
      await prisma.campaignNpc.create({
        data: { npcId: npc.id, campaignId },
      });

      // Cria link documento → NPC
      await prisma.link.create({
        data: {
          fromType: "document",
          fromId: documentId,
          toType: "npc",
          toId: npc.id,
          label: "Extraído de documento",
          campaignId,
        },
      });

      created.push(npc);
    }

    return NextResponse.json({
      action: "extract-npcs",
      result: `${created.length} NPC(s) extraído(s) e criado(s) com sucesso!`,
      npcsCreated: created.length,
      npcs: created,
      tokensUsed,
    });
  } catch (parseError) {
    console.error("Erro ao processar NPCs:", parseError);
    return NextResponse.json({
      action: "extract-npcs",
      result: aiText,
      tokensUsed,
      npcsCreated: 0,
      error: "Erro ao criar NPCs no banco. Mostrando resultado bruto da IA.",
    });
  }
}

// Processa conversão para NPC único
async function handleConvertToNpc(
  aiText: string,
  campaignId: string,
  documentId: string,
  tokensUsed: number,
) {
  try {
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({
        action: "convert-to-npc",
        result: aiText,
        tokensUsed,
        npcCreated: false,
        error: "Não foi possível extrair JSON da resposta.",
      });
    }

    const npcData = JSON.parse(jsonMatch[0]);

    const npc = await prisma.npc.create({
      data: {
        name: npcData.name || "NPC Convertido",
        race: npcData.race || null,
        class: npcData.class || null,
        level: npcData.level || null,
        alignment: npcData.alignment || null,
        description: npcData.description || null,
        backstory: npcData.backstory || null,
        type: npcData.type || "neutral",
        edition: "3.5",
      },
    });

    if (npcData.stats) {
      await prisma.npcAttributes.create({
        data: {
          npcId: npc.id,
          str: npcData.stats.str || 10,
          dex: npcData.stats.dex || 10,
          con: npcData.stats.con || 10,
          intl: npcData.stats.intl || 10,
          wis: npcData.stats.wis || 10,
          cha: npcData.stats.cha || 10,
          hp: npcData.stats.hp || 10,
          ac: npcData.stats.ac || 10,
        },
      });
    }

    await prisma.campaignNpc.create({
      data: { npcId: npc.id, campaignId },
    });

    await prisma.link.create({
      data: {
        fromType: "document",
        fromId: documentId,
        toType: "npc",
        toId: npc.id,
        label: "Convertido de documento",
        campaignId,
      },
    });

    return NextResponse.json({
      action: "convert-to-npc",
      result: `NPC "${npc.name}" criado com sucesso!`,
      npcCreated: true,
      npc,
      tokensUsed,
    });
  } catch (parseError) {
    console.error("Erro ao converter NPC:", parseError);
    return NextResponse.json({
      action: "convert-to-npc",
      result: aiText,
      tokensUsed,
      npcCreated: false,
      error: "Erro ao criar NPC. Mostrando resultado bruto.",
    });
  }
}
