import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Buscar magias nível 3 do Wizard
  const spells = await prisma.srdSpell.findMany({
    where: { level: 3, classes: { contains: "Wizard", mode: "insensitive" } },
    select: { name: true, namePtBr: true, classes: true, level: true, edition: true },
    orderBy: { name: "asc" },
  });
  console.log(`\n=== Magias nível 3 do Wizard: ${spells.length} ===`);
  for (const s of spells) {
    console.log(`  ${s.namePtBr || s.name} (${s.name}) [${s.edition}] — Classes: ${s.classes}`);
  }

  // Verificar como "Mago" aparece nos dados
  const mago = await prisma.srdSpell.findMany({
    where: { classes: { contains: "Mago", mode: "insensitive" } },
    take: 3,
    select: { name: true, classes: true },
  });
  console.log(`\n=== Magias com classe "Mago": ${mago.length} ===`);
  for (const s of mago) console.log(`  ${s.name} — ${s.classes}`);

  // Verificar classes no banco
  const classes35 = await prisma.srdSpell.findMany({
    where: { edition: "3.5" },
    take: 3,  
    select: { name: true, classes: true },
  });
  console.log(`\n=== Exemplo classes 3.5 ===`);
  for (const s of classes35) console.log(`  ${s.name} — ${s.classes}`);

  await prisma.$disconnect();
}
main();
