import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
  });
  console.log(JSON.stringify(users, null, 2));

  const rules = await prisma.houseRule.findMany({
    select: { id: true, title: true, slug: true, category: true, pinned: true },
  });
  console.log("\nRegras da Casa:", JSON.stringify(rules, null, 2));
}

main().finally(() => prisma.$disconnect());
