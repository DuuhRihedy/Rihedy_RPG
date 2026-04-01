import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const raw = process.env.DATABASE_URL!;
const url = raw.replace(/^["']|["']$/g, "");
const adapter = new PrismaNeon({ connectionString: url });
const p = new PrismaClient({ adapter });

async function main() {
  // Delete ALL campaigns (cascade removes sessions, notes, arcs, chapters, documents, links, maps, campaignNpc)
  const camps = await p.campaign.findMany({ select: { id: true, name: true } });
  
  for (const c of camps) {
    await p.campaign.delete({ where: { id: c.id } });
    console.log(`  Deletada: ${c.name}`);
  }
  
  console.log(`\nTotal deletadas: ${camps.length}`);
  console.log("Campanhas limpas. NPCs mantidos.");
  
  await p.$disconnect();
}

main().catch(console.error);
