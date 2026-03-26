import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🧹 Limpando conteúdo legado (sem createdById)...\n");

  // Campanhas sem dono (cascade deleta sessions, notes, arcs, chapters, documents, links)
  const campaigns = await prisma.campaign.findMany({
    where: { createdById: null },
    select: { id: true, name: true },
  });
  console.log(`📦 Campanhas legado: ${campaigns.length}`);
  for (const c of campaigns) {
    console.log(`   ❌ ${c.name}`);
    await prisma.campaign.delete({ where: { id: c.id } });
  }

  // NPCs sem dono (cascade deleta attributes, items, relations)
  const npcs = await prisma.npc.findMany({
    where: { createdById: null },
    select: { id: true, name: true },
  });
  console.log(`\n👤 NPCs legado: ${npcs.length}`);
  for (const n of npcs) {
    console.log(`   ❌ ${n.name}`);
    await prisma.npc.delete({ where: { id: n.id } });
  }

  // Chat history antigo
  const chats = await prisma.chatHistory.deleteMany();
  console.log(`\n💬 Chat history removido: ${chats.count}`);

  // API usage antigo
  const usage = await prisma.apiUsage.deleteMany();
  console.log(`📊 API usage removido: ${usage.count}`);

  // Mapas sem campanha
  const maps = await prisma.map.deleteMany({ where: { campaignId: null } });
  console.log(`🗺️ Mapas órfãos removidos: ${maps.count}`);

  // Verificar o que sobrou
  const [campCount, npcCount, srdSpells, srdMonsters] = await Promise.all([
    prisma.campaign.count(),
    prisma.npc.count(),
    prisma.srdSpell.count(),
    prisma.srdMonster.count(),
  ]);

  console.log("\n✅ Limpeza concluída!");
  console.log(`   Campanhas restantes: ${campCount}`);
  console.log(`   NPCs restantes: ${npcCount}`);
  console.log(`   Acervo SRD: ${srdSpells} magias, ${srdMonsters} monstros (preservado)`);

  await prisma.$disconnect();
}

main().catch(console.error);
