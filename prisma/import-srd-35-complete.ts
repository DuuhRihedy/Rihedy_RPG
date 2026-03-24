// ══════════════════════════════════════════════════════
// Hub RPG — Importacao SRD 3.5 COMPLETA
// Fonte: Rughalt/D35E (Foundry VTT, OGL)
// Imports: Equipment, Weapons, Armor, Magic Items, Classes, Races, Conditions
// ══════════════════════════════════════════════════════

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import * as fs from "fs";
import * as path from "path";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const DATA_DIR = path.join(__dirname, "srd-35-data");

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

function readDbFile(filename: string): any[] {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${filename} nao encontrado`);
    return [];
  }
  const lines = fs.readFileSync(filePath, "utf-8").split("\n").filter(l => l.trim());
  const items: any[] = [];
  for (const line of lines) {
    try {
      items.push(JSON.parse(line));
    } catch {}
  }
  return items;
}

function getDesc(obj: any): string {
  const d = obj.data || obj.system;
  if (!d) return "";
  const raw = typeof d.description === "object" ? d.description.value : d.description;
  return cleanHtml(raw);
}

function getCost(obj: any): string {
  const d = obj.data || obj.system;
  if (!d?.price) return "";
  const p = d.price;
  if (typeof p === "number") return `${p} gp`;
  if (typeof p === "string") return p;
  return "";
}

function getWeight(obj: any): number | null {
  const d = obj.data || obj.system;
  if (!d?.weight) return null;
  const w = parseFloat(d.weight);
  return isNaN(w) ? null : w;
}

// ── 1. EQUIPAMENTOS (items.db) ───────────────

async function importEquipment() {
  const items = readDbFile("items.db");
  console.log(`\n[EQUIP] ${items.length} itens em items.db`);

  let created = 0, skipped = 0, errors = 0;
  for (const obj of items) {
    if (!obj.name) continue;
    const index = slugify(obj.name);
    try {
      const existing = await prisma.srdEquipment.findUnique({ where: { index } });
      if (existing) { skipped++; continue; }

      const desc = getDesc(obj) || obj.name;

      await prisma.srdEquipment.create({
        data: {
          index,
          name: obj.name,
          edition: "3.5",
          category: "Adventuring Gear",
          cost: getCost(obj),
          weight: getWeight(obj) ?? undefined,
          description: desc.substring(0, 5000),
          properties: "{}",
          source: "SRD 3.5",
        },
      });
      created++;
    } catch { errors++; }
  }
  console.log(`  -> ${created} criados, ${skipped} existiam, ${errors} erros`);
}

// ── 2. ARMAS (weapons-and-ammo.db) ──────────

async function importWeapons() {
  const items = readDbFile("weapons-and-ammo.db");
  console.log(`\n[ARMAS] ${items.length} itens em weapons-and-ammo.db`);

  let created = 0, skipped = 0, errors = 0;
  for (const obj of items) {
    if (!obj.name) continue;
    const index = slugify(obj.name);
    try {
      const existing = await prisma.srdEquipment.findUnique({ where: { index } });
      if (existing) { skipped++; continue; }

      const d = obj.data || obj.system;
      const desc = getDesc(obj) || obj.name;

      const damage = d?.damage?.parts?.[0]?.[0] || d?.damage?.value || "";
      const properties: Record<string, any> = {};
      if (damage) properties.damage = damage;
      if (d?.range?.value) properties.range = `${d.range.value} ft`;
      if (d?.weaponType) properties.weaponType = d.weaponType;

      await prisma.srdEquipment.create({
        data: {
          index,
          name: obj.name,
          edition: "3.5",
          category: "Weapon",
          cost: getCost(obj),
          weight: getWeight(obj),
          description: desc.substring(0, 5000),
          properties: JSON.stringify(properties),
          source: "SRD 3.5",
        },
      });
      created++;
    } catch { errors++; }
  }
  console.log(`  -> ${created} criados, ${skipped} existiam, ${errors} erros`);
}

// ── 3. ARMADURAS (armors-and-shields.db) ─────

async function importArmor() {
  const items = readDbFile("armors-and-shields.db");
  console.log(`\n[ARMOR] ${items.length} itens em armors-and-shields.db`);

  let created = 0, skipped = 0, errors = 0;
  for (const obj of items) {
    if (!obj.name) continue;
    const index = slugify(obj.name);
    try {
      const existing = await prisma.srdEquipment.findUnique({ where: { index } });
      if (existing) { skipped++; continue; }

      const d = obj.data || obj.system;
      const desc = getDesc(obj) || obj.name;

      const properties: Record<string, any> = {};
      if (d?.armor?.value) properties.acBonus = d.armor.value;
      if (d?.armor?.dex) properties.maxDex = d.armor.dex;
      if (d?.armor?.acp) properties.armorCheckPenalty = d.armor.acp;
      if (d?.armor?.type) properties.armorType = d.armor.type;

      await prisma.srdEquipment.create({
        data: {
          index,
          name: obj.name,
          edition: "3.5",
          category: "Armor",
          cost: getCost(obj),
          weight: getWeight(obj),
          description: desc.substring(0, 5000),
          properties: JSON.stringify(properties),
          source: "SRD 3.5",
        },
      });
      created++;
    } catch { errors++; }
  }
  console.log(`  -> ${created} criados, ${skipped} existiam, ${errors} erros`);
}

// ── 4. ITENS MAGICOS (magic-items.db) ────────

async function importMagicItems() {
  const items = readDbFile("magic-items.db");
  console.log(`\n[MAGIC] ${items.length} itens em magic-items.db`);

  let created = 0, skipped = 0, errors = 0;
  for (const obj of items) {
    if (!obj.name) continue;
    const index = slugify(obj.name);
    try {
      const existing = await prisma.srdMagicItem.findUnique({ where: { index } });
      if (existing) { skipped++; continue; }

      const d = obj.data || obj.system;
      const desc = getDesc(obj) || obj.name;

      const subType = d?.subType || d?.weaponSubtype || "";
      let category = "Wondrous Item";
      if (obj.type === "weapon") category = "Weapon";
      else if (obj.type === "equipment" && subType?.includes("shield")) category = "Shield";
      else if (obj.type === "equipment") category = "Armor";
      else if (subType?.includes("ring")) category = "Ring";
      else if (subType?.includes("rod")) category = "Rod";
      else if (subType?.includes("staff")) category = "Staff";
      else if (subType?.includes("wand")) category = "Wand";
      else if (subType?.includes("scroll")) category = "Scroll";
      else if (subType?.includes("potion")) category = "Potion";

      const rarity = d?.cl ? (d.cl > 15 ? "Legendary" : d.cl > 10 ? "Very Rare" : d.cl > 5 ? "Rare" : "Uncommon") : "Uncommon";

      await prisma.srdMagicItem.create({
        data: {
          index,
          name: obj.name,
          edition: "3.5",
          category,
          rarity: rarity,
          description: desc.substring(0, 5000),
          source: "SRD 3.5",
        },
      });
      created++;
    } catch { errors++; }
  }
  console.log(`  -> ${created} criados, ${skipped} existiam, ${errors} erros`);
}

// ── 5. CLASSES (classes.db) ──────────────────

async function importClasses() {
  const items = readDbFile("classes.db");
  console.log(`\n[CLASS] ${items.length} classes em classes.db`);

  let created = 0, skipped = 0, errors = 0;
  for (const obj of items) {
    if (!obj.name) continue;
    const index = slugify(obj.name);
    try {
      const existing = await prisma.srdClass.findUnique({ where: { index } });
      if (existing) { skipped++; continue; }

      const d = obj.data || obj.system;
      const desc = getDesc(obj) || obj.name;

      const classData: Record<string, any> = {};
      if (d?.hd) classData.hitDie = `d${d.hd}`;
      if (d?.bab) classData.bab = d.bab;
      if (d?.savingThrows) classData.saves = d.savingThrows;
      if (d?.skillsPerLevel) classData.skillsPerLevel = d.skillsPerLevel;

      await prisma.srdClass.create({
        data: {
          index,
          name: obj.name,
          edition: "3.5",
          hitDie: parseInt(d?.hd) || 8,
          proficiencies: JSON.stringify(classData),
          spellcasting: d?.spellcastingType || null,
          subclasses: null,
          classLevels: null,
          source: "SRD 3.5",
        },
      });
      created++;
    } catch { errors++; }
  }
  console.log(`  -> ${created} criados, ${skipped} existiam, ${errors} erros`);
}

// ── 6. CONDITIONS (conditions.db) ────────────

async function importConditions() {
  const items = readDbFile("conditions.db");
  console.log(`\n[COND] ${items.length} conditions em conditions.db`);

  let created = 0, skipped = 0, errors = 0;
  for (const obj of items) {
    if (!obj.name) continue;
    const index = slugify(obj.name);
    try {
      const existing = await prisma.srdCondition.findUnique({ where: { index } });
      if (existing) { skipped++; continue; }

      const desc = getDesc(obj) || obj.name;

      await prisma.srdCondition.create({
        data: {
          index,
          name: obj.name,
          edition: "3.5",
          description: desc.substring(0, 5000),
          source: "SRD 3.5",
        },
      });
      created++;
    } catch { errors++; }
  }
  console.log(`  -> ${created} criados, ${skipped} existiam, ${errors} erros`);
}

// ── 7. RACAS 3.5 (hardcoded SRD) ────────────

async function importRaces35() {
  console.log(`\n[RACAS] Importando racas base D&D 3.5...`);

  const races = [
    { index: "human-35", name: "Human", namePtBr: "Humano", speed: 30, size: "Medium", abilityBonuses: JSON.stringify([{ name: "Any", bonus: 2 }]), alignment: "Any", age: "Adulthood at 15, middle age at 35", languages: JSON.stringify(["Common"]), traits: JSON.stringify(["Bonus feat", "Extra skill points"]) },
    { index: "elf-35", name: "Elf", namePtBr: "Elfo", speed: 30, size: "Medium", abilityBonuses: JSON.stringify([{ name: "DEX", bonus: 2 }, { name: "CON", bonus: -2 }]), alignment: "Chaotic Good", age: "Adulthood at 110, middle age at 175", languages: JSON.stringify(["Common", "Elven"]), traits: JSON.stringify(["Immunity to sleep", "Low-light vision", "+2 Search/Spot/Listen"]) },
    { index: "dwarf-35", name: "Dwarf", namePtBr: "Anao", speed: 20, size: "Medium", abilityBonuses: JSON.stringify([{ name: "CON", bonus: 2 }, { name: "CHA", bonus: -2 }]), alignment: "Lawful Good", age: "Adulthood at 40, middle age at 125", languages: JSON.stringify(["Common", "Dwarven"]), traits: JSON.stringify(["Darkvision 60ft", "Stonecunning", "+2 vs poison/spells"]) },
    { index: "halfling-35", name: "Halfling", namePtBr: "Halfling", speed: 20, size: "Small", abilityBonuses: JSON.stringify([{ name: "DEX", bonus: 2 }, { name: "STR", bonus: -2 }]), alignment: "Neutral Good", age: "Adulthood at 20, middle age at 50", languages: JSON.stringify(["Common", "Halfling"]), traits: JSON.stringify(["+1 attack with thrown weapons", "+2 Climb/Jump/Move Silently", "+1 all saves", "+2 vs fear"]) },
    { index: "gnome-35", name: "Gnome", namePtBr: "Gnomo", speed: 20, size: "Small", abilityBonuses: JSON.stringify([{ name: "CON", bonus: 2 }, { name: "STR", bonus: -2 }]), alignment: "Neutral Good", age: "Adulthood at 40, middle age at 100", languages: JSON.stringify(["Common", "Gnome"]), traits: JSON.stringify(["Low-light vision", "+2 vs illusions", "Speak with burrowing animals", "+1 DC illusion spells"]) },
    { index: "half-elf-35", name: "Half-Elf", namePtBr: "Meio-Elfo", speed: 30, size: "Medium", abilityBonuses: JSON.stringify([]), alignment: "Any", age: "Adulthood at 20, middle age at 62", languages: JSON.stringify(["Common", "Elven"]), traits: JSON.stringify(["Immunity to sleep", "Low-light vision", "+1 Search/Spot/Listen", "+2 Diplomacy/Gather Information"]) },
    { index: "half-orc-35", name: "Half-Orc", namePtBr: "Meio-Orc", speed: 30, size: "Medium", abilityBonuses: JSON.stringify([{ name: "STR", bonus: 2 }, { name: "INT", bonus: -2 }, { name: "CHA", bonus: -2 }]), alignment: "Chaotic Neutral", age: "Adulthood at 14, middle age at 30", languages: JSON.stringify(["Common", "Orc"]), traits: JSON.stringify(["Darkvision 60ft", "Orc Blood"]) },
  ];

  let created = 0, skipped = 0;
  for (const r of races) {
    const existing = await prisma.srdRace.findUnique({ where: { index: r.index } });
    if (existing) { skipped++; continue; }

    await prisma.srdRace.create({
      data: { ...r, edition: "3.5", source: "SRD 3.5" },
    });
    created++;
  }
  console.log(`  -> ${created} criadas, ${skipped} existiam`);
}

// ── MAIN ─────────────────────────────────────

async function main() {
  console.log("=== Importacao SRD 3.5 COMPLETA ===");
  console.log(`Fonte: ${DATA_DIR}\n`);

  await importEquipment();
  await importWeapons();
  await importArmor();
  await importMagicItems();
  await importClasses();
  await importConditions();
  await importRaces35();

  // Contagem final 3.5
  console.log("\n=== CONTAGEM FINAL 3.5 ===");
  const equip = await prisma.srdEquipment.count({ where: { edition: "3.5" } });
  const magic = await prisma.srdMagicItem.count({ where: { edition: "3.5" } });
  const cls = await prisma.srdClass.count({ where: { edition: "3.5" } });
  const cond = await prisma.srdCondition.count({ where: { edition: "3.5" } });
  const race = await prisma.srdRace.count({ where: { edition: "3.5" } });
  const spell = await prisma.srdSpell.count({ where: { edition: "3.5" } });
  const mon = await prisma.srdMonster.count({ where: { edition: "3.5" } });
  const feat = await prisma.srdFeat.count({ where: { edition: "3.5" } });

  console.log(`Magias: ${spell}`);
  console.log(`Monstros: ${mon}`);
  console.log(`Feats: ${feat}`);
  console.log(`Equipamentos: ${equip}`);
  console.log(`Itens Magicos: ${magic}`);
  console.log(`Classes: ${cls}`);
  console.log(`Condicoes: ${cond}`);
  console.log(`Racas: ${race}`);
  console.log(`TOTAL 3.5: ${spell + mon + feat + equip + magic + cls + cond + race}`);
  console.log("=== DONE ===");
}

main()
  .catch((e) => { console.error("Erro:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
