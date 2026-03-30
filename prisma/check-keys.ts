import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function checkKeys() {
  const keys = await prisma.aiApiKey.findMany({
    select: {
      id: true,
      provider: true,
      label: true,
      active: true,
      blockedUntil: true,
      usageToday: true,
      lastUsedAt: true,
    },
    orderBy: { provider: "asc" },
  });

  console.log("🔑 Keys configuradas no banco:");
  console.log("═══════════════════════════════════════");
  for (const key of keys) {
    const blocked = key.blockedUntil && new Date(key.blockedUntil) > new Date() ? "🔒 BLOQUEADA" : "✅ OK";
    const status = key.active ? blocked : "❌ INATIVA";
    console.log(`  ${key.provider.padEnd(12)} | ${key.label.padEnd(20)} | uso: ${key.usageToday} | ${status}`);
  }
  console.log(`\nTotal: ${keys.length} keys`);
}

checkKeys()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
