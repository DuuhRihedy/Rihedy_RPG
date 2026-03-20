// ══════════════════════════════════════════════════════
// Hub RPG — Tradução SRD (sem API, traduções hardcoded)
// Aplica todas as traduções PT-BR diretamente no banco
// ══════════════════════════════════════════════════════

import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { spellNames } from "./srd-pt-br/spell-names";
import { monsterNames } from "./srd-pt-br/monster-names";
import { equipmentNames, magicItemNames, featNames } from "./srd-pt-br/item-names";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function translateModel(
  modelName: string,
  emoji: string,
  translations: Record<string, string>,
  findMany: () => Promise<{ index: string }[]>,
  update: (index: string, namePtBr: string) => Promise<unknown>,
) {
  const records = await findMany();
  let translated = 0;
  let skipped = 0;

  for (const record of records) {
    const ptBr = translations[record.index];
    if (ptBr) {
      await update(record.index, ptBr);
      translated++;
    } else {
      skipped++;
    }
  }

  console.log(`${emoji} ${modelName}: ${translated} traduzidos, ${skipped} sem tradução de ${records.length} total`);

  if (skipped > 0) {
    const missing = records
      .filter((r) => !translations[r.index])
      .map((r) => r.index);
    if (missing.length <= 20) {
      console.log(`   Faltando: ${missing.join(", ")}`);
    } else {
      console.log(`   Faltando (primeiros 20): ${missing.slice(0, 20).join(", ")}...`);
    }
  }

  return { translated, skipped };
}

async function main() {
  console.log("🌐 Hub RPG — Tradução SRD (EN → PT-BR)");
  console.log("═══════════════════════════════════════");
  console.log("Traduções hardcoded — sem API externa\n");

  const start = Date.now();

  // Magias
  await translateModel(
    "Magias", "📖", spellNames,
    () => prisma.srdSpell.findMany({ select: { index: true } }),
    (index, namePtBr) => prisma.srdSpell.update({ where: { index }, data: { namePtBr } }),
  );

  // Monstros
  await translateModel(
    "Monstros", "🐉", monsterNames,
    () => prisma.srdMonster.findMany({ select: { index: true } }),
    (index, namePtBr) => prisma.srdMonster.update({ where: { index }, data: { namePtBr } }),
  );

  // Equipamentos
  await translateModel(
    "Equipamentos", "🛡️", equipmentNames,
    () => prisma.srdEquipment.findMany({ select: { index: true } }),
    (index, namePtBr) => prisma.srdEquipment.update({ where: { index }, data: { namePtBr } }),
  );

  // Itens Mágicos
  await translateModel(
    "Itens Mágicos", "✨", magicItemNames,
    () => prisma.srdMagicItem.findMany({ select: { index: true } }),
    (index, namePtBr) => prisma.srdMagicItem.update({ where: { index }, data: { namePtBr } }),
  );

  // Talentos
  await translateModel(
    "Talentos", "🎯", featNames,
    () => prisma.srdFeat.findMany({ select: { index: true } }),
    (index, namePtBr) => prisma.srdFeat.update({ where: { index }, data: { namePtBr } }),
  );

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n🏁 Tradução completa em ${elapsed}s`);
}

main()
  .catch((e) => {
    console.error("❌ Erro:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
