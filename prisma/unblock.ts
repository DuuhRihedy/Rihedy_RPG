import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function unblock() {
  await prisma.aiApiKey.updateMany({ data: { blockedUntil: null } });
  console.log("Todas as chaves desbloqueadas com sucesso!");
}
unblock().finally(() => prisma.$disconnect());
