// ══════════════════════════════════════════════════════
// Hub RPG — Tradução SRD COMPLETA v2 (sem API, hardcoded)
// Aplica TODAS as traduções PT-BR em TODOS os modelos
// Corrige bug de match do sufixo -35
// Inclui dicionários 3.5 massivos + padrões de nome
// ══════════════════════════════════════════════════════

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

// Dicionários existentes (5e)
import { spellNames } from "./srd-pt-br/spell-names";
import { monsterNames } from "./srd-pt-br/monster-names";
import { equipmentNames, magicItemNames, featNames } from "./srd-pt-br/item-names";

// Dicionários de sistema (classes, condições, etc.)
import {
  classNames, conditionNames, skillNames, languageNames,
  traitNames, subclassNames, subraceNames, raceNames,
} from "./srd-pt-br/system-names";
import { featureNames } from "./srd-pt-br/feature-names";

// Dicionários 3.5 massivos
import { spellNames35 } from "./srd-pt-br/spell-names-35";
import { equipmentNames35 } from "./srd-pt-br/equipment-names-35";
import { featNames35 } from "./srd-pt-br/feat-names-35";

// Tradução por padrão (monstros e itens mágicos)
import { translateMonsterName } from "./srd-pt-br/monster-names-35";
import { translateMagicItemName } from "./srd-pt-br/magic-item-names-35";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ── Função de match inteligente ────────────────────
// Tenta dicionários na ordem + fallback sem -35
function findInDicts(dicts: Record<string, string>[], index: string): string | null {
  for (const dict of dicts) {
    if (dict[index]) return dict[index];
  }
  // Se termina em -35, tenta sem o sufixo
  if (index.endsWith("-35")) {
    const base = index.replace(/-35$/, "");
    for (const dict of dicts) {
      if (dict[base]) return dict[base];
    }
  }
  return null;
}

// ── Tradução por dicionários ───────────────────────
async function translateByDicts(
  modelName: string,
  emoji: string,
  dicts: Record<string, string>[],
  findMany: () => Promise<{ index: string; name: string; namePtBr?: string | null }[]>,
  update: (index: string, namePtBr: string) => Promise<unknown>,
  patternFn?: (index: string, name: string) => string | null,
) {
  const records = await findMany();
  let translated = 0;
  let skipped = 0;
  let alreadyDone = 0;

  for (const record of records) {
    // Prioridade: 1) dicionário, 2) padrão, 3) skip
    const ptBr = findInDicts(dicts, record.index)
      || (patternFn ? patternFn(record.index, record.name) : null);

    if (ptBr) {
      await update(record.index, ptBr);
      translated++;
    } else if (record.namePtBr) {
      alreadyDone++;
    } else {
      skipped++;
    }
  }

  const total = translated + skipped + alreadyDone;
  console.log(`${emoji} ${modelName}: ${translated + alreadyDone}/${total} traduzidos (${skipped} sem tradução)`);
  return { translated: translated + alreadyDone, skipped };
}

// ── Tradução de features por NOME ──────────────────
async function translateFeatures() {
  const features = await prisma.srdFeature.findMany({
    select: { id: true, name: true, namePtBr: true },
  });

  let translated = 0;
  for (const feat of features) {
    const ptBr = featureNames[feat.name];
    if (ptBr && feat.namePtBr !== ptBr) {
      await prisma.srdFeature.update({
        where: { id: feat.id },
        data: { namePtBr: ptBr },
      });
      translated++;
    } else if (feat.namePtBr) {
      translated++; // already done
    }
  }

  const skipped = features.length - translated;
  console.log(`📋 Features: ${translated}/${features.length} traduzidas (${skipped} sem tradução)`);
  return { translated, skipped };
}

async function main() {
  console.log("🌐 Hub RPG — Tradução SRD COMPLETA v2 (EN → PT-BR)");
  console.log("═════════════════════════════════════════════════════");
  console.log("Dicionários: 5e + 3.5 + padrões de nome\n");

  const start = Date.now();
  let totalTranslated = 0;
  let totalSkipped = 0;

  const addResult = (r: { translated: number; skipped: number }) => {
    totalTranslated += r.translated;
    totalSkipped += r.skipped;
  };

  // ── Magias (5e dict + 3.5 dict + fallback) ──
  addResult(await translateByDicts("Magias", "📖",
    [spellNames, spellNames35],
    () => prisma.srdSpell.findMany({ select: { index: true, name: true, namePtBr: true } }),
    (index, namePtBr) => prisma.srdSpell.update({ where: { index }, data: { namePtBr } }),
  ));

  // ── Monstros (5e dict + padrão 3.5) ──
  addResult(await translateByDicts("Monstros", "🐉",
    [monsterNames],
    () => prisma.srdMonster.findMany({ select: { index: true, name: true, namePtBr: true } }),
    (index, namePtBr) => prisma.srdMonster.update({ where: { index }, data: { namePtBr } }),
    translateMonsterName,
  ));

  // ── Equipamentos (5e dict + 3.5 dict + fallback) ──
  addResult(await translateByDicts("Equipamentos", "🛡️",
    [equipmentNames, equipmentNames35],
    () => prisma.srdEquipment.findMany({ select: { index: true, name: true, namePtBr: true } }),
    (index, namePtBr) => prisma.srdEquipment.update({ where: { index }, data: { namePtBr } }),
  ));

  // ── Itens Mágicos (5e dict + padrão 3.5) ──
  addResult(await translateByDicts("Itens Mágicos", "✨",
    [magicItemNames],
    () => prisma.srdMagicItem.findMany({ select: { index: true, name: true, namePtBr: true } }),
    (index, namePtBr) => prisma.srdMagicItem.update({ where: { index }, data: { namePtBr } }),
    translateMagicItemName,
  ));

  // ── Talentos (5e dict + 3.5 dict + fallback) ──
  addResult(await translateByDicts("Talentos", "🎯",
    [featNames, featNames35],
    () => prisma.srdFeat.findMany({ select: { index: true, name: true, namePtBr: true } }),
    (index, namePtBr) => prisma.srdFeat.update({ where: { index }, data: { namePtBr } }),
  ));

  // ── Modelos menores (100% no dicionário) ──
  const simpleModels = [
    { name: "Classes", emoji: "⚔️", dict: classNames,
      find: () => prisma.srdClass.findMany({ select: { index: true, name: true, namePtBr: true } }),
      upd: (i: string, n: string) => prisma.srdClass.update({ where: { index: i }, data: { namePtBr: n } }) },
    { name: "Condições", emoji: "⚡", dict: conditionNames,
      find: () => prisma.srdCondition.findMany({ select: { index: true, name: true, namePtBr: true } }),
      upd: (i: string, n: string) => prisma.srdCondition.update({ where: { index: i }, data: { namePtBr: n } }) },
    { name: "Skills", emoji: "🎲", dict: skillNames,
      find: () => prisma.srdSkill.findMany({ select: { index: true, name: true, namePtBr: true } }),
      upd: (i: string, n: string) => prisma.srdSkill.update({ where: { index: i }, data: { namePtBr: n } }) },
    { name: "Idiomas", emoji: "🗣️", dict: languageNames,
      find: () => prisma.srdLanguage.findMany({ select: { index: true, name: true, namePtBr: true } }),
      upd: (i: string, n: string) => prisma.srdLanguage.update({ where: { index: i }, data: { namePtBr: n } }) },
    { name: "Traits", emoji: "🧬", dict: traitNames,
      find: () => prisma.srdTrait.findMany({ select: { index: true, name: true, namePtBr: true } }),
      upd: (i: string, n: string) => prisma.srdTrait.update({ where: { index: i }, data: { namePtBr: n } }) },
    { name: "Subclasses", emoji: "🏹", dict: subclassNames,
      find: () => prisma.srdSubclass.findMany({ select: { index: true, name: true, namePtBr: true } }),
      upd: (i: string, n: string) => prisma.srdSubclass.update({ where: { index: i }, data: { namePtBr: n } }) },
    { name: "Sub-raças", emoji: "👥", dict: subraceNames,
      find: () => prisma.srdSubrace.findMany({ select: { index: true, name: true, namePtBr: true } }),
      upd: (i: string, n: string) => prisma.srdSubrace.update({ where: { index: i }, data: { namePtBr: n } }) },
    { name: "Raças", emoji: "👤", dict: raceNames,
      find: () => prisma.srdRace.findMany({ select: { index: true, name: true, namePtBr: true } }),
      upd: (i: string, n: string) => prisma.srdRace.update({ where: { index: i }, data: { namePtBr: n } }) },
  ];

  for (const m of simpleModels) {
    addResult(await translateByDicts(m.name, m.emoji,
      [m.dict], m.find as any, m.upd as any));
  }

  // ── Features (match por nome) ──
  addResult(await translateFeatures());

  // ── Resumo ──
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  const total = totalTranslated + totalSkipped;
  const pct = Math.round((totalTranslated / total) * 100);
  console.log(`\n═════════════════════════════════════════════════════`);
  console.log(`🏁 Tradução completa em ${elapsed}s`);
  console.log(`📊 ${totalTranslated}/${total} traduzidos (${pct}%)`);
  console.log(`❓ ${totalSkipped} sem tradução disponível`);
}

main()
  .catch((e) => {
    console.error("❌ Erro:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
