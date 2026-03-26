import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = "admin@hubrpg.com";
  const adminPass = "admin123"; // Trocar em produção!

  const hash = await bcrypt.hash(adminPass, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: hash, role: "admin" },
    create: {
      name: "Mestre",
      email: adminEmail,
      password: hash,
      role: "admin",
    },
  });

  console.log(`✅ Admin criado/atualizado: ${admin.email} (role: ${admin.role})`);

  // Criar user de exemplo
  const userEmail = "jogador@hubrpg.com";
  const userHash = await bcrypt.hash("user123", 12);

  const user = await prisma.user.upsert({
    where: { email: userEmail },
    update: { password: userHash, role: "user" },
    create: {
      name: "Jogador",
      email: userEmail,
      password: userHash,
      role: "user",
    },
  });

  console.log(`✅ User criado/atualizado: ${user.email} (role: ${user.role})`);
  console.log("\n🔑 Credenciais:");
  console.log(`   Admin: ${adminEmail} / ${adminPass}`);
  console.log(`   User:  ${userEmail} / user123`);

  await prisma.$disconnect();
}

main().catch(console.error);
