import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function audit() {
  console.log("╔══════════════════════════════════════════════════════════════════╗");
  console.log("║           AUDITORIA DE TRADUÇÕES SRD — PT-BR                   ║");
  console.log("╠══════════════════╦═══════╦═══════════════╦══════════════════════╣");
  console.log("║ Modelo           ║ Total ║ namePtBr      ║ descriptionPtBr      ║");
  console.log("╠══════════════════╬═══════╬═══════════════╬══════════════════════╣");

  let totalRec = 0, totalName = 0, totalDesc = 0, totalDescApplicable = 0;

  // Models WITH descriptionPtBr
  const modelsWithDesc = [
    { name: "Magias", find: prisma.srdSpell },
    { name: "Talentos", find: prisma.srdFeat },
    { name: "Equipamentos", find: prisma.srdEquipment },
    { name: "Itens Mágicos", find: prisma.srdMagicItem },
    { name: "Features", find: prisma.srdFeature },
    { name: "Condições", find: prisma.srdCondition },
    { name: "Skills", find: prisma.srdSkill },
    { name: "Traits", find: prisma.srdTrait },
    { name: "Subclasses", find: prisma.srdSubclass },
  ];

  for (const { name, find } of modelsWithDesc) {
    const total = await (find as any).count();
    const nameOk = await (find as any).count({ where: { namePtBr: { not: null } } });
    const descOk = await (find as any).count({ where: { descriptionPtBr: { not: null } } });

    totalRec += total;
    totalName += nameOk;
    totalDesc += descOk;
    totalDescApplicable += total;

    const namePct = total > 0 ? Math.round(nameOk / total * 100) : 0;
    const descPct = total > 0 ? Math.round(descOk / total * 100) : 0;
    console.log(
      `║ ${name.padEnd(16)} ║ ${String(total).padStart(5)} ║ ${String(nameOk).padStart(5)}/${String(total).padStart(5)} ${String(namePct + "%").padStart(4)} ║ ${String(descOk).padStart(5)}/${String(total).padStart(5)} ${String(descPct + "%").padStart(4)} ║`
    );
  }

  // Models WITHOUT descriptionPtBr
  const modelsNoDesc = [
    { name: "Monstros", find: prisma.srdMonster },
    { name: "Classes", find: prisma.srdClass },
    { name: "Raças", find: prisma.srdRace },
    { name: "Idiomas", find: prisma.srdLanguage },
    { name: "Sub-raças", find: prisma.srdSubrace },
  ];

  for (const { name, find } of modelsNoDesc) {
    const total = await (find as any).count();
    const nameOk = await (find as any).count({ where: { namePtBr: { not: null } } });

    totalRec += total;
    totalName += nameOk;

    const namePct = total > 0 ? Math.round(nameOk / total * 100) : 0;
    console.log(
      `║ ${name.padEnd(16)} ║ ${String(total).padStart(5)} ║ ${String(nameOk).padStart(5)}/${String(total).padStart(5)} ${String(namePct + "%").padStart(4)} ║        N/A       ║`
    );
  }

  const namePctTotal = Math.round(totalName / totalRec * 100);
  const descPctTotal = totalDescApplicable > 0 ? Math.round(totalDesc / totalDescApplicable * 100) : 0;
  console.log("╠══════════════════╬═══════╬═══════════════╬══════════════════════╣");
  console.log(
    `║ TOTAL            ║ ${String(totalRec).padStart(5)} ║ ${String(totalName).padStart(5)}/${String(totalRec).padStart(5)} ${String(namePctTotal + "%").padStart(4)} ║ ${String(totalDesc).padStart(5)}/${String(totalDescApplicable).padStart(5)} ${String(descPctTotal + "%").padStart(4)} ║`
  );
  console.log("╚══════════════════╩═══════╩═══════════════╩══════════════════════╝");

  // Missing details
  console.log("\n── Modelos com descriptionPtBr faltando: ──");
  for (const { name, find } of modelsWithDesc) {
    const missing = await (find as any).count({ where: { descriptionPtBr: null } });
    if (missing > 0) {
      const total = await (find as any).count();
      console.log(`  ❌ ${name}: ${missing}/${total} sem descriptionPtBr`);
    } else {
      console.log(`  ✅ ${name}: 100% traduzido`);
    }
  }

  // Monstros têm campos especiais
  console.log("\n── Monstros (campos especiais PT-BR): ──");
  const monsterTotal = await prisma.srdMonster.count();
  const monsterName = await prisma.srdMonster.count({ where: { namePtBr: { not: null } } });
  const monsterSpecial = await prisma.srdMonster.count({ where: { specialAbilitiesPtBr: { not: null } } });
  const monsterActions = await prisma.srdMonster.count({ where: { actionsPtBr: { not: null } } });
  const monsterLegendary = await prisma.srdMonster.count({ where: { legendaryActionsPtBr: { not: null } } });
  const monsterReactions = await prisma.srdMonster.count({ where: { reactionsPtBr: { not: null } } });
  console.log(`  namePtBr: ${monsterName}/${monsterTotal}`);
  console.log(`  specialAbilitiesPtBr: ${monsterSpecial}/${monsterTotal}`);
  console.log(`  actionsPtBr: ${monsterActions}/${monsterTotal}`);
  console.log(`  legendaryActionsPtBr: ${monsterLegendary}/${monsterTotal}`);
  console.log(`  reactionsPtBr: ${monsterReactions}/${monsterTotal}`);

  // Magias com higherLevel
  console.log("\n── Magias (higherLevelPtBr): ──");
  const spellsWithHL = await prisma.srdSpell.count({ where: { higherLevel: { not: null } } });
  const spellsWithHLPtBr = await prisma.srdSpell.count({ where: { higherLevelPtBr: { not: null } } });
  console.log(`  Com higherLevel: ${spellsWithHL}`);
  console.log(`  Com higherLevelPtBr: ${spellsWithHLPtBr}/${spellsWithHL}`);

  // Magias materialPtBr
  const spellsWithMat = await prisma.srdSpell.count({ where: { material: { not: null } } });
  const spellsWithMatPtBr = await prisma.srdSpell.count({ where: { materialPtBr: { not: null } } });
  console.log(`  Com material: ${spellsWithMat}`);
  console.log(`  Com materialPtBr: ${spellsWithMatPtBr}/${spellsWithMat}`);

  // Nomes faltando (namePtBr = null)
  console.log("\n── Nomes faltando (namePtBr = null): ──");
  for (const { name, find } of [...modelsWithDesc, ...modelsNoDesc]) {
    const missing = await (find as any).count({ where: { namePtBr: null } });
    if (missing > 0) {
      console.log(`  ❌ ${name}: ${missing} sem namePtBr`);
      // Show sample
      const sample = await (find as any).findMany({
        where: { namePtBr: null },
        take: 5,
        select: { index: true, name: true },
      });
      for (const s of sample) {
        console.log(`      - ${s.index} (${s.name})`);
      }
    }
  }
}

audit()
  .catch((e) => {
    console.error("Erro:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
