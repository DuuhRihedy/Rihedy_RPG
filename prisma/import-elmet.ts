/**
 * import-elmet.ts
 * 
 * Importa TODO o conteúdo da pasta the_elmet para o banco de dados do Hub RPG.
 * Tudo é criado com createdById do admin para que users normais NÃO vejam.
 * 
 * Uso: npx tsx prisma/import-elmet.ts
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import * as fs from "fs";
import * as path from "path";

const rawUrl = process.env.DATABASE_URL!;
const dbUrl = rawUrl.replace(/^["']|["']$/g, "");
const adapter = new PrismaNeon({ connectionString: dbUrl });
const prisma = new PrismaClient({ adapter });

const BASE = path.resolve(__dirname, "..", "the_elmet");

// ─── Helpers ────────────────────────────

function readMd(filePath: string): string {
  return fs.readFileSync(filePath, "utf-8");
}

function extractFrontmatter(content: string): { meta: Record<string, string>; body: string } {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };

  const metaLines = match[1].split("\n");
  const meta: Record<string, string> = {};
  for (const line of metaLines) {
    const kv = line.match(/^(\w+):\s*(.+)$/);
    if (kv) meta[kv[1]] = kv[2].replace(/^["']|["']$/g, "");
  }
  return { meta, body: match[2] };
}

function extractTitle(body: string): string {
  const match = body.match(/^#\s+.*?—?\s*(.+)$/m);
  return match ? match[1].trim() : "Sem título";
}

function readAllMdFiles(dir: string): Array<{ name: string; path: string; content: string; meta: Record<string, string>; body: string }> {
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".md"));
  return files.map(f => {
    const filePath = path.join(dir, f);
    const content = readMd(filePath);
    const { meta, body } = extractFrontmatter(content);
    return { name: f, path: filePath, content, meta, body };
  });
}

// ─── Parse NPC from markdown ────────────

interface NpcData {
  name: string;
  race: string | null;
  alignment: string | null;
  description: string;
  backstory: string;
  gmNotes: string;
  type: string;
  sourceFile: string;
}

function parseNpcMd(body: string, fileName: string): NpcData {
  const titleMatch = body.match(/^#\s+(.+?)(?:\s*—\s*(.+))?$/m);
  const name = titleMatch ? titleMatch[1].replace(/[🔥💧⚡🌑✨🪨🔩🌿💨❄️⚔️👤🏥🛸🚨]/g, "").trim() : fileName.replace(/\.md$/, "");

  // Extract race/species
  const raceMatch = body.match(/\*\*Raça\/Espécie:\*\*\s*(.+)/i) || body.match(/\*\*Tipo:\*\*\s*(.+)/i);
  const race = raceMatch ? raceMatch[1].trim() : null;

  // Extract alignment
  const alignMatch = body.match(/\*\*Alinhamento:\*\*\s*(.+)/i);
  const alignment = alignMatch ? alignMatch[1].replace(/[*()]/g, "").trim() : null;

  // Extract description (first paragraph after ## Visão Geral or ## Identidade)
  const descMatch = body.match(/##\s+(?:Visão Geral|Identidade)\s*\n([\s\S]*?)(?=\n##|\n---)/);
  const description = descMatch ? descMatch[1].trim().substring(0, 2000) : "";

  // Extract backstory (## História section)
  const histMatch = body.match(/##\s+História\s*\n([\s\S]*?)(?=\n##|\n---)/);
  const backstory = histMatch ? histMatch[1].trim() : "";

  // Extract GM notes (## Notas do Mestre section)
  const gmMatch = body.match(/##\s+Notas do Mestre\s*\n([\s\S]*?)(?=\n##|\n---|$)/);
  const gmNotes = gmMatch ? gmMatch[1].trim() : "";

  // Determine type
  const isEnemy = body.toLowerCase().includes("vilão") || body.toLowerCase().includes("corrupto") || body.toLowerCase().includes("inimigo") || body.toLowerCase().includes("lado negro");
  const isAlly = body.toLowerCase().includes("herói") || body.toLowerCase().includes("aliado") || body.toLowerCase().includes("protetor") || body.toLowerCase().includes("guardião");
  const type = isEnemy ? "enemy" : isAlly ? "ally" : "neutral";

  return { name, race, alignment, description, backstory, gmNotes, type, sourceFile: fileName };
}

// ─── Main Import ────────────────────────

async function main() {
  console.log("═══════════════════════════════════════════");
  console.log("  📦 Importação The Elmet → Hub RPG");
  console.log("═══════════════════════════════════════════\n");

  // 1. Find admin user (must already exist — run seed-users.ts first)
  const admin = await prisma.user.findFirst({ where: { role: "admin" } });
  if (!admin) {
    console.error("❌ Nenhum admin encontrado! Execute primeiro: npx tsx prisma/seed-users.ts");
    process.exit(1);
  }
  console.log(`✅ Admin: ${admin.name} (${admin.id})\n`);

  const adminId = admin.id;

  // ═══════════════════════════════════════
  // 2. Create campaigns
  // ═══════════════════════════════════════
  console.log("📋 Criando campanhas...\n");

  // --- Campaign 1: The Elmet Returns (SSA Seymorth) ---
  const ssaModule = readMd(path.join(BASE, "CAMPANHAS", "3.5-ssa-seymorth", "modulo-narrativo-ssa.md"));
  const ssaChars = readMd(path.join(BASE, "CAMPANHAS", "3.5-ssa-seymorth", "personagens-selecionados.md"));

  const campaignSSA = await prisma.campaign.create({
    data: {
      name: "The Elmet Returns — Operação Seymorth",
      description: `<h2>🌏 Operação Seymorth</h2>
<p>O mundo vive sob a <strong>S.S.A. (Sword and Shield Alliance)</strong>. A era da "Paz Armada". O projeto final: unificação total através da <strong>REDE (The Grid)</strong>. Quase todos os continentes aceitaram. Exceto <strong>Seymorth</strong>.</p>
<p>Seymorth é o Continente do Fogo. Poluição industrial, fanatismo religioso e resistência feroz. Os 8 Convocados são enviados para "integrar" Seymorth. Porque na visão da SSA, quem não está na rede, não existe.</p>
<h3>🎯 Missão</h3>
<p>Instalar a REDE em <strong>16 pontos de ancoragem</strong> (4 por cidade): Plazamorth, Magnamorth, Mandamorth e Gargamorth.</p>`,
      edition: "3.5",
      status: "active",
      createdById: adminId,
    },
  });
  console.log(`  ✅ Campanha: ${campaignSSA.name}`);

  // Story arcs for SSA
  const ssaArcs = [
    { title: "Arco I — O Submundo de Plazamorth", description: "Infiltração nos servidores do Cassino Royal, negociação com Jaina e os androides Project X/23, desvendar a Irmandade dos Metamorfos, recuperar dados do culto a Natzurune.", status: "active" },
    { title: "Arco II — A Honra de Magnamorth", description: "Provar valor no Coliseu, desbloquear tecnologias do Quartel Lunar, obter o código do Star's Hunter, superar testes extremos de sobrevivência.", status: "planned" },
    { title: "Arco III — As Engrenagens de Mandamorth", description: "Hackear o cibermisticismo dos Santuários de Zuz, navegar pela Cidade das Máquinas, instalar na Torre Zuz, libertar o processamento quântico.", status: "planned" },
    { title: "Arco IV — A Sincronização de Gargamorth", description: "Coordenação com Lucia e Vania Firaga, integrar escrituras sagradas de Rufus, enfrentar Shadow e Paradoxal, ato político final com Rainha Amelia.", status: "planned" },
  ];

  for (const arc of ssaArcs) {
    await prisma.storyArc.create({
      data: { ...arc, campaignId: campaignSSA.id },
    });
  }
  console.log(`  ✅ ${ssaArcs.length} arcos narrativos criados`);

  // Chapters with the module content
  await prisma.chapter.create({
    data: {
      title: "Módulo Narrativo — Operação Seymorth",
      content: ssaModule,
      sortOrder: 0,
      campaignId: campaignSSA.id,
    },
  });

  await prisma.chapter.create({
    data: {
      title: "Os 21 Convocados — Hierarquia SSA",
      content: ssaChars,
      sortOrder: 1,
      campaignId: campaignSSA.id,
    },
  });
  console.log(`  ✅ 2 capítulos criados`);

  // --- Campaign 2: A New World (Elmetra) ---
  const anwSummary = readMd(path.join(BASE, "CAMPANHAS", "a-new-world", "campanha-resumo.md"));
  const { body: anwBody } = extractFrontmatter(anwSummary);

  const campaignANW = await prisma.campaign.create({
    data: {
      name: "A New World — Campanha Elmetra",
      description: `<h2>🌌 A New World</h2>
<p><strong>Era:</strong> 4ª Guerra — Pós-extinção Elmet</p>
<p>Após a 3ª Guerra, o mundo foi devastado e a humanidade vive em <strong>ilhas flutuantes (Elmetra)</strong>. O imperador, atormentado por rumores e lendas, convoca indivíduos especiais. <strong>Meta Hunter</strong> os seleciona para descobrir a verdade sobre o passado Elmet e a profecia do "novo dono das chamas".</p>
<h3>Mecânica Especial</h3>
<p><strong>Sistema de Raças por Portal:</strong> Raça do personagem determinada pelo número do portão (aleatoriedade controlada), sem classe pré-definida.</p>`,
      edition: "3.5",
      status: "planning",
      createdById: adminId,
    },
  });
  console.log(`  ✅ Campanha: ${campaignANW.name}`);

  await prisma.chapter.create({
    data: {
      title: "Resumo da Campanha",
      content: anwBody,
      sortOrder: 0,
      campaignId: campaignANW.id,
    },
  });

  // --- Campaign 3: The Elmet Ascension ---
  const ascSummary = readMd(path.join(BASE, "CAMPANHAS", "the-elmet-ascension", "campanha-resumo.md"));
  const { body: ascBody } = extractFrontmatter(ascSummary);

  const campaignASC = await prisma.campaign.create({
    data: {
      name: "The Elmet Ascension — SSA em Seymorth",
      description: `<h2>🗡️ The Elmet Ascension</h2>
<p><strong>Era:</strong> 5ª Guerra — Era SSA (Ano 2XXX)</p>
<p><strong>Tom:</strong> Político, cyberpunk, espionagem, moral ambígua</p>
<p>Milênios após a última guerra mundial, o mundo está "em paz" — mas dividido. Os jogadores são <strong>Convocados da SSA</strong>, enviados ao continente sem lei de <strong>Seymorth</strong> para convencer as 4 facções a aceitar a unificação.</p>
<h3>Os 4 Alvos</h3>
<ul>
<li><strong>Skymorth:</strong> Político — negociar com a Rainha Firaga</li>
<li><strong>Plazamorth:</strong> Criminal — navegar entre organizações ocultas</li>
<li><strong>Magnamorth:</strong> Marcial — provar valor pelo combate</li>
<li><strong>Mandamorth:</strong> Distópico — libertar da opressão das máquinas</li>
</ul>`,
      edition: "3.5",
      status: "planning",
      createdById: adminId,
    },
  });
  console.log(`  ✅ Campanha: ${campaignASC.name}`);

  await prisma.chapter.create({
    data: {
      title: "Resumo da Campanha",
      content: ascBody,
      sortOrder: 0,
      campaignId: campaignASC.id,
    },
  });

  // ═══════════════════════════════════════
  // 3. Create NPCs (26 fichas)
  // ═══════════════════════════════════════
  console.log("\n👥 Importando NPCs...\n");

  const npcFiles = readAllMdFiles(path.join(BASE, "MUNDO-PRINCIPAL", "npcs"));
  const npcMap = new Map<string, string>(); // fileName -> npcId

  for (const file of npcFiles) {
    const data = parseNpcMd(file.body, file.name);
    
    // Check for existing NPC with same name
    const existing = await prisma.npc.findFirst({ where: { name: data.name } });
    if (existing) {
      console.log(`  ⏭️  NPC já existe: ${data.name}`);
      npcMap.set(file.name, existing.id);
      continue;
    }

    const npc = await prisma.npc.create({
      data: {
        name: data.name,
        race: data.race,
        alignment: data.alignment,
        description: data.description || null,
        backstory: data.backstory || null,
        gmNotes: data.gmNotes || null,
        type: data.type,
        edition: "3.5",
        createdById: adminId,
      },
    });

    npcMap.set(file.name, npc.id);
    console.log(`  ✅ NPC: ${data.name} (${data.type})`);
  }

  // Link relevant NPCs to campaigns
  const ssaNpcKeywords = ["ia-diuh", "indrakzuz", "jaina", "shadow", "paradoxal", "rufus", "amelia", "lucia", "vania", "murdok", "zuz", "elmer", "mako", "dagoness", "mindra", "reverendo", "vacoon", "irmandade"];
  
  for (const [fileName, npcId] of npcMap) {
    const shouldLink = ssaNpcKeywords.some(kw => fileName.includes(kw));
    if (shouldLink) {
      try {
        await prisma.campaignNpc.create({
          data: { npcId, campaignId: campaignSSA.id },
        });
        await prisma.campaignNpc.create({
          data: { npcId, campaignId: campaignASC.id },
        });
      } catch { /* already linked */ }
    }
    // Meta Hunter and Akashigate -> A New World
    if (fileName.includes("meta-hunter") || fileName.includes("akashigate") || fileName.includes("ancient")) {
      try {
        await prisma.campaignNpc.create({
          data: { npcId, campaignId: campaignANW.id },
        });
      } catch { /* already linked */ }
    }
  }
  console.log(`  ✅ NPCs vinculados às campanhas`);

  // ═══════════════════════════════════════
  // 4. Create Documents for AI Context
  // ═══════════════════════════════════════
  console.log("\n📚 Criando documentos para contexto IA...\n");

  // World lore (for ALL campaigns)
  const loreFiles = [
    ...readAllMdFiles(path.join(BASE, "MUNDO-PRINCIPAL", "lore")),
    ...readAllMdFiles(path.join(BASE, "MUNDO-PRINCIPAL", "historia")),
    ...readAllMdFiles(path.join(BASE, "_CONTEXTO")),
    ...readAllMdFiles(path.join(BASE, "_SISTEMA")),
  ];

  for (const file of loreFiles) {
    // Create document for SSA campaign (the main one)
    await prisma.document.create({
      data: {
        name: file.meta.nome || file.name.replace(/\.md$/, "").replace(/-/g, " "),
        type: file.name.includes("regras") ? "notas" : "historia",
        content: file.body,
        sourceFile: file.name,
        campaignId: campaignSSA.id,
      },
    });
    console.log(`  ✅ Doc (SSA): ${file.name}`);
  }

  // Factions
  const factionFiles = readAllMdFiles(path.join(BASE, "MUNDO-PRINCIPAL", "faccoes"));
  for (const file of factionFiles) {
    await prisma.document.create({
      data: {
        name: file.meta.nome || file.name.replace(/\.md$/, "").replace(/-/g, " "),
        type: "notas",
        content: file.body,
        sourceFile: file.name,
        campaignId: campaignSSA.id,
      },
    });
    console.log(`  ✅ Doc (SSA): ${file.name}`);
  }

  // Locations as documents
  const locationFiles = readAllMdFiles(path.join(BASE, "MUNDO-PRINCIPAL", "locais"));
  for (const file of locationFiles) {
    await prisma.document.create({
      data: {
        name: file.meta.nome || file.name.replace(/\.md$/, "").replace(/-/g, " "),
        type: "aventura",
        content: file.body,
        sourceFile: file.name,
        campaignId: campaignSSA.id,
      },
    });

    // Also create for Ascension campaign
    await prisma.document.create({
      data: {
        name: file.meta.nome || file.name.replace(/\.md$/, "").replace(/-/g, " "),
        type: "aventura",
        content: file.body,
        sourceFile: file.name,
        campaignId: campaignASC.id,
      },
    });
    console.log(`  ✅ Doc (SSA+ASC): ${file.name}`);
  }

  // Items as documents
  const itemFiles = readAllMdFiles(path.join(BASE, "MUNDO-PRINCIPAL", "itens"));
  for (const file of itemFiles) {
    await prisma.document.create({
      data: {
        name: file.meta.nome || file.name.replace(/\.md$/, "").replace(/-/g, " "),
        type: "notas",
        content: file.body,
        sourceFile: file.name,
        campaignId: campaignSSA.id,
      },
    });
    console.log(`  ✅ Doc (SSA): ${file.name}`);
  }

  // Races / Irmãos as documents
  const raceFiles = readAllMdFiles(path.join(BASE, "MUNDO-PRINCIPAL", "racas"));
  for (const file of raceFiles) {
    await prisma.document.create({
      data: {
        name: file.meta.nome || file.name.replace(/\.md$/, "").replace(/-/g, " "),
        type: "historia",
        content: file.body,
        sourceFile: file.name,
        campaignId: campaignSSA.id,
      },
    });
    console.log(`  ✅ Doc (SSA): ${file.name}`);
  }

  // ═══════════════════════════════════════
  // 5. Create Notes (campaign-specific)
  // ═══════════════════════════════════════
  console.log("\n📝 Criando notas de campanha...\n");

  // SSA campaign notes from module dungeons
  const ssaNotes = [
    { title: "[DNG-01] Cassino Royal", content: "Infiltração nos servidores centrais de apostas para garantir energia à rede subterrânea de Plazamorth." },
    { title: "[DNG-02] Sede da Guilda dos Ladrões", content: "Negociação ou confronto direto com Jaina e os androides Project X/23." },
    { title: "[DNG-03] Irmandade dos Metamorfos", content: "Desvendar a conspiração milenar que opera à margem da sociedade." },
    { title: "[DNG-04] Ruína da História Esquecida", content: "Recuperar os dados do antigo culto a Natzurune para integração de lore." },
    { title: "[DNG-05] O Coliseu", content: "Provar o valor da SSA em batalhas rituais públicas em Magnamorth." },
    { title: "[DNG-06] Quartel Lunar", content: "Desbloquear as tecnologias de treinamento da elite militar de Magnamorth." },
    { title: "[DNG-07] Base do Caçador", content: "Obter o código original do Star's Hunter." },
    { title: "[DNG-08] Local da Provação", content: "Superar os testes extremos de sobrevivência física impostos pela honra local." },
    { title: "[DNG-09] Santuários de Zuz", content: "Hackear o cibermisticismo que escraviza a mente dos fiéis metálicos em Mandamorth." },
    { title: "[DNG-10] Cidade das Máquinas", content: "Navegar pela infraestrutura 100% automatizada e proibida para orgânicos." },
    { title: "[DNG-11] O Cume da Torre", content: "A instalação estratégica no topo da monumental Torre Zuz." },
    { title: "[DNG-12] Laboratório de Matriz Neural", content: "Libertar o processamento quântico e místico que mantém a rede maligna ativa." },
    { title: "[DNG-13] QG Elmet", content: "Coordenação de logística com as irmãs Lucia e Vania Firaga em Gargamorth." },
    { title: "[DNG-14] Catedral do Fogo", content: "Integrar as escrituras sagradas de Rufus ao sinal da REDE global." },
    { title: "[DNG-15] Guilda das Sombras", content: "Enfrentar as interferências de Shadow e Paradoxal." },
    { title: "[DNG-16] Palácio Elmeriano", content: "O ato político final junto à Rainha Amelia para selar a paz em Gargamorth." },
    { title: "Status da REDE", content: "Status da REDE: 0/16 Sub-nós Instalados.\n\nPlazamorth: 0/4\nMagnamorth: 0/4\nMandamorth: 0/4\nGargamorth: 0/4" },
  ];

  for (const note of ssaNotes) {
    await prisma.note.create({
      data: { ...note, private: true, campaignId: campaignSSA.id },
    });
  }
  console.log(`  ✅ ${ssaNotes.length} notas criadas para SSA`);

  // Ascension campaign notes (plots)
  const ascNotes = [
    { title: "Plot: A SSA é realmente boa?", content: "A SSA é realmente 'boa'? Ou é controle disfarçado de paz? Explorar a ambiguidade moral da organização e suas verdadeiras intenções." },
    { title: "Plot: Conexão entre Grids", content: "Conexão entre a Grid de Skymorth e The Grid de Mandamorth — pode haver uma ligação oculta entre essas duas redes." },
    { title: "Plot: Culto de Natzurune", content: "O culto negro de Natzurune em Plazamorth — reaparecimento? O símbolo desapareceu misteriosamente. Quem o tomou?" },
    { title: "Plot: Star's Hunter", content: "Star's Hunter em Magnamorth — seria um Elmet sobrevivente? O símbolo que Magnamorth segue poderia ter origem Elmet." },
    { title: "Plot: Torre de Zuz", content: "A Torre de Zuz — pode realmente reconectar Zuz ao mundo? Implicações para a campanha se isso acontecer." },
  ];

  for (const note of ascNotes) {
    await prisma.note.create({
      data: { ...note, private: true, campaignId: campaignASC.id },
    });
  }
  console.log(`  ✅ ${ascNotes.length} notas criadas para Ascension`);

  // ═══════════════════════════════════════
  // 6. Summary
  // ═══════════════════════════════════════
  
  const totalDocs = await prisma.document.count({ where: { campaignId: { in: [campaignSSA.id, campaignANW.id, campaignASC.id] } } });
  const totalNpcs = npcMap.size;
  const totalNotes = ssaNotes.length + ascNotes.length;
  const totalArcs = ssaArcs.length;

  console.log("\n═══════════════════════════════════════════");
  console.log("  ✅ IMPORTAÇÃO CONCLUÍDA!");
  console.log("═══════════════════════════════════════════");
  console.log(`  📋 Campanhas:        3`);
  console.log(`  👥 NPCs:             ${totalNpcs}`);
  console.log(`  ⚔️  Arcos Narrativos: ${totalArcs}`);
  console.log(`  📝 Notas:            ${totalNotes}`);
  console.log(`  📚 Documentos (IA):  ${totalDocs}`);
  console.log(`  📖 Capítulos:        4`);
  console.log(`  🔒 Tudo com createdById admin (${adminId})`);
  console.log(`     → Users normais NÃO verão este conteúdo`);
  console.log("═══════════════════════════════════════════\n");

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("❌ Erro na importação:", e);
  prisma.$disconnect();
  process.exit(1);
});
