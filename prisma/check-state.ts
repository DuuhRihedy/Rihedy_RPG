import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const raw = process.env.DATABASE_URL!;
const url = raw.replace(/^["']|["']$/g, "");
const adapter = new PrismaNeon({ connectionString: url });
const p = new PrismaClient({ adapter });

async function main() {
  const users = await p.user.findMany({
    select: { id: true, name: true, email: true, role: true },
  });
  console.log("=== USUARIOS ===");
  for (const u of users) {
    console.log(`  ${u.role.toUpperCase()}: ${u.name} (${u.email}) — ID: ${u.id}`);
  }
  
  const camps = await p.campaign.findMany({
    select: { id: true, name: true, status: true, createdById: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
  
  console.log("\n=== CAMPANHAS ===");
  for (const c of camps) {
    const owner = c.createdById ? users.find(u => u.id === c.createdById) : null;
    const tag = owner ? `[${owner.role}:${owner.name}]` : "[SEM DONO]";
    console.log(`  ${tag} ${c.name} (${c.status}) — ${c.createdAt.toISOString().split("T")[0]}`);
  }
  console.log(`  Total: ${camps.length}`);

  const npcs = await p.npc.findMany({
    select: { id: true, name: true, createdById: true },
    orderBy: { name: "asc" },
  });

  const adminNpcs = npcs.filter(n => n.createdById && users.find(u => u.id === n.createdById)?.role === "admin");
  const otherNpcs = npcs.filter(n => !n.createdById || users.find(u => u.id === n.createdById)?.role !== "admin");

  console.log(`\n=== NPCs ===`);
  console.log(`  Total: ${npcs.length}`);
  console.log(`  Criados por admin: ${adminNpcs.length}`);
  console.log(`  Outros (legado/user): ${otherNpcs.length}`);

  await p.$disconnect();
}

main().catch(console.error);
