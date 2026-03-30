import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function unblock() {
  const result = await prisma.aiApiKey.updateMany({
    data: { blockedUntil: null, usageToday: 0 },
  });
  console.log(`✅ ${result.count} keys desbloqueadas e uso resetado`);
}

unblock()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
