// ══════════════════════════════════════════════════════
// Hub RPG — Importação em massa SRD 3.5
// Fonte: Rughalt/D35E (Foundry VTT, OGL)
// Importa monstros, magias e feats do JSON/DB
// ══════════════════════════════════════════════════════

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import * as fs from "fs";
import * as path from "path";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const DATA_DIR = path.join(__dirname, "srd-35-data");

// ── Helpers ──────────────────────────────────

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-35";
}

function cleanHtml(html: string | undefined | null): string {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

const schoolMap: Record<string, string> = {
  abj: "Abjuration", con: "Conjuration", div: "Divination",
  enc: "Enchantment", evo: "Evocation", ill: "Illusion",
  nec: "Necromancy", trs: "Transmutation", uni: "Universal",
};

// ── 1. IMPORTAR MONSTROS ─────────────────────

function parseAbilities(raw: string | undefined): Record<string, number> {
  const result: Record<string, number> = { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };
  if (!raw) return result;
  const pairs = raw.split(",").map(s => s.trim());
  for (const p of pairs) {
    const match = p.match(/^(Str|Dex|Con|Int|Wis|Cha)\s+(\d+|-)/i);
    if (match) {
      const key = match[1].toLowerCase().replace("int", "int");
      const val = match[2] === "-" ? 0 : parseInt(match[2]) || 10;
      result[key] = val;
    }
  }
  return result;
}

function parseAC(raw: string | undefined): number {
  if (!raw) return 10;
  const match = raw.match(/^(\d+)/);
  return match ? parseInt(match[1]) : 10;
}

async function importMonsters() {
  const filePath = path.join(DATA_DIR, "monsters-parsed.json");
  if (!fs.existsSync(filePath)) {
    console.log("❌ monsters-parsed.json não encontrado");
    return;
  }

  const monsters = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  console.log(`🐉 ${monsters.length} monstros encontrados no JSON`);

  let created = 0, skipped = 0, errors = 0;

  for (const m of monsters) {
    const index = slugify(m.name);
    try {
      const existing = await prisma.srdMonster.findUnique({ where: { index } });
      if (existing) { skipped++; continue; }

      const abilities = parseAbilities(m.abilities);
      const ac = parseAC(m.armor_class);
      const hp = parseInt(m.hp) || 1;
      const cr = parseFloat(m.challenge_rating) || 0;

      const xpTable: Record<number, number> = {
        0: 0, 0.125: 25, 0.25: 50, 0.33: 100, 0.5: 200,
        1: 300, 2: 600, 3: 900, 4: 1200, 5: 1800, 6: 2400,
        7: 3150, 8: 4800, 9: 5400, 10: 6500, 11: 7200,
        12: 8400, 13: 9500, 14: 11500, 15: 13000, 16: 15000,
        17: 18000, 18: 20000, 19: 22000, 20: 25000,
      };

      const speed = JSON.stringify({
        walk: m.basespeed ? `${m.basespeed} ft` : "30 ft",
        fly: m.flyspeed ? `${m.flyspeed} ft` : undefined,
      });

      await prisma.srdMonster.create({
        data: {
          index, name: m.name, edition: "3.5",
          size: m.size || "Medium",
          type: (m.type || "unknown").toLowerCase(),
          alignment: m.alignment || null,
          armorClass: ac, hitPoints: hp,
          hitDice: m.hd ? `${m.hd}d8` : "1d8",
          speed,
          str: abilities.str, dex: abilities.dex,
          con: abilities.con, intl: abilities.int ?? abilities.intl ?? 10,
          wis: abilities.wis, cha: abilities.cha,
          challengeRating: cr,
          xp: xpTable[cr] || Math.round(cr * 1000),
          source: "SRD 3.5",
        },
      });
      created++;
    } catch (e: any) {
      errors++;
      if (errors <= 3) console.log(`   ⚠️ Erro em "${m.name}":`, e.message?.substring(0, 150));
    }
  }

  console.log(`   ✅ ${created} criados, ${skipped} já existiam, ${errors} erros`);
}

// ── 2. IMPORTAR MAGIAS ───────────────────────

async function importSpells() {
  const filePath = path.join(DATA_DIR, "spells.db");
  if (!fs.existsSync(filePath)) {
    console.log("❌ spells.db não encontrado");
    return;
  }

  const lines = fs.readFileSync(filePath, "utf-8").split("\n").filter(l => l.trim());
  console.log(`\n🔮 ${lines.length} magias encontradas no DB`);

  let created = 0, skipped = 0, errors = 0;

  for (const line of lines) {
    try {
      const obj = JSON.parse(line);
      const d = obj.data || obj.system;
      if (!d || !obj.name) continue;

      const index = slugify(obj.name);
      const existing = await prisma.srdSpell.findUnique({ where: { index } });
      if (existing) { skipped++; continue; }

      const descHtml = typeof d.description === "object" ? d.description.value : d.description;
      const description = cleanHtml(descHtml) || obj.name;

      const components: string[] = [];
      if (d.components?.verbal) components.push("V");
      if (d.components?.somatic) components.push("S");
      if (d.components?.material) components.push("M");
      if (d.components?.focus) components.push("F");

      const rangeStr = d.range?.units === "touch" ? "Touch"
        : d.range?.units === "personal" ? "Personal"
        : d.range?.units === "close" ? "Close (25 ft + 5 ft/2 levels)"
        : d.range?.units === "medium" ? "Medium (100 ft + 10 ft/level)"
        : d.range?.units === "long" ? "Long (400 ft + 40 ft/level)"
        : d.range?.value ? `${d.range.value} ft` : "See text";

      await prisma.srdSpell.create({
        data: {
          index, name: obj.name, edition: "3.5",
          level: typeof d.level === "number" ? d.level : parseInt(d.level) || 0,
          school: schoolMap[d.school] || d.school || "Universal",
          castingTime: d.activation?.type || "1 action",
          range: rangeStr,
          duration: d.duration?.value || "See text",
          components: components.join(", ") || "V, S",
          concentration: false,
          description: description.substring(0, 5000),
          classes: "",
          source: "SRD 3.5",
        },
      });
      created++;
    } catch (e) {
      errors++;
    }
  }

  console.log(`   ✅ ${created} criadas, ${skipped} já existiam, ${errors} erros`);
}

// ── 3. IMPORTAR FEATS ────────────────────────

async function importFeats() {
  const filePath = path.join(DATA_DIR, "feats.db");
  if (!fs.existsSync(filePath)) {
    console.log("❌ feats.db não encontrado");
    return;
  }

  const lines = fs.readFileSync(filePath, "utf-8").split("\n").filter(l => l.trim());
  console.log(`\n🎯 ${lines.length} feats encontrados no DB`);

  let created = 0, skipped = 0, errors = 0;

  for (const line of lines) {
    try {
      const obj = JSON.parse(line);
      const d = obj.data || obj.system;
      if (!d || !obj.name) continue;

      const index = slugify(obj.name);
      const existing = await prisma.srdFeat.findUnique({ where: { index } });
      if (existing) { skipped++; continue; }

      const descHtml = typeof d.description === "object" ? d.description.value : d.description;
      const description = cleanHtml(descHtml) || obj.name;

      await prisma.srdFeat.create({
        data: {
          index, name: obj.name, edition: "3.5",
          description: description.substring(0, 5000),
          source: "SRD 3.5",
        },
      });
      created++;
    } catch (e) {
      errors++;
    }
  }

  console.log(`   ✅ ${created} criados, ${skipped} já existiam, ${errors} erros`);
}

// ── MAIN ─────────────────────────────────────

async function main() {
  console.log("⚔️ Hub RPG — Importação em massa SRD D&D 3.5");
  console.log("═".repeat(50));
  console.log(`📁 Fonte: ${DATA_DIR}\n`);

  await importMonsters();
  await importSpells();
  await importFeats();

  // Contagem final
  const stats = {
    monsters35: await prisma.srdMonster.count({ where: { edition: "3.5" } }),
    monsters5e: await prisma.srdMonster.count({ where: { edition: "5e" } }),
    spells35: await prisma.srdSpell.count({ where: { edition: "3.5" } }),
    spells5e: await prisma.srdSpell.count({ where: { edition: "5e" } }),
    feats35: await prisma.srdFeat.count({ where: { edition: "3.5" } }),
    feats5e: await prisma.srdFeat.count({ where: { edition: "5e" } }),
    equipment: await prisma.srdEquipment.count(),
    magicItems: await prisma.srdMagicItem.count(),
    classes: await prisma.srdClass.count(),
  };

  const total = Object.values(stats).reduce((a, b) => a + b, 0);

  console.log("\n" + "═".repeat(50));
  console.log("📊 ACERVO COMPLETO:");
  console.log(`   🐉 Monstros: ${stats.monsters35} (3.5) + ${stats.monsters5e} (5e) = ${stats.monsters35 + stats.monsters5e}`);
  console.log(`   🔮 Magias:   ${stats.spells35} (3.5) + ${stats.spells5e} (5e) = ${stats.spells35 + stats.spells5e}`);
  console.log(`   🎯 Talentos: ${stats.feats35} (3.5) + ${stats.feats5e} (5e) = ${stats.feats35 + stats.feats5e}`);
  console.log(`   ⚔️ Equipamentos: ${stats.equipment}`);
  console.log(`   ✨ Itens Mágicos: ${stats.magicItems}`);
  console.log(`   📖 Classes: ${stats.classes}`);
  console.log(`\n   🏆 TOTAL: ${total} registros`);
  console.log("═".repeat(50));
}

main()
  .catch((e) => { console.error("Erro:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
