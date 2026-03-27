import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter }) as any;

async function check() {
  const checks = [
    { name: "SrdSpell", model: "srdSpell" },
    { name: "SrdMonster", model: "srdMonster" },
    { name: "SrdEquipment", model: "srdEquipment" },
    { name: "SrdMagicItem", model: "srdMagicItem" },
    { name: "SrdFeat", model: "srdFeat" },
    { name: "SrdClass", model: "srdClass" },
    { name: "SrdRace", model: "srdRace" },
    { name: "SrdCondition", model: "srdCondition" },
    { name: "SrdFeature", model: "srdFeature" },
  ];

  console.log("\n📊 Status das Traduções PT-BR:");
  console.log("=".repeat(55));

  let totalAll = 0, translatedAll = 0;

  for (const { name, model } of checks) {
    const t = await prisma[model].count();
    const tr = await prisma[model].count({ where: { descriptionPtBr: { not: "" } } }).catch(() => 0);
    const pct = t > 0 ? Math.round((tr / t) * 100) : 0;
    const barLen = Math.round(pct / 5);
    const bar = "█".repeat(barLen) + "░".repeat(20 - barLen);
    const status = t - tr > 0 ? `← ${t - tr} faltando` : "✅";
    console.log(`${name.padEnd(15)} ${bar} ${String(tr).padStart(4)}/${String(t).padStart(4)} (${String(pct).padStart(3)}%) ${status}`);
    totalAll += t;
    translatedAll += tr;
  }

  const pctAll = Math.round((translatedAll / totalAll) * 100);
  console.log("=".repeat(55));
  console.log(`${"TOTAL".padEnd(15)} ${translatedAll}/${totalAll} (${pctAll}%)`);

  await prisma.$disconnect();
}

check();
