import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const API = "https://www.dnd5eapi.co/api/2014";

async function fetchJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.json();
}

async function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── Spells ──────────────────────────

async function importSpells() {
  const list = await fetchJson(`${API}/spells`);
  console.log(`\n📖 Importing ${list.count} spells...`);

  let count = 0;
  for (const item of list.results) {
    const data = await fetchJson(`https://www.dnd5eapi.co${item.url}`);

    await prisma.srdSpell.upsert({
      where: { index: data.index },
      update: {},
      create: {
        index: data.index,
        name: data.name,
        edition: "5e",
        level: data.level,
        school: data.school?.name || "Unknown",
        castingTime: data.casting_time || "1 action",
        range: data.range || "Self",
        components: (data.components || []).join(", "),
        material: data.material || null,
        duration: data.duration || "Instantaneous",
        concentration: data.concentration || false,
        ritual: data.ritual || false,
        description: (data.desc || []).join("\n\n"),
        higherLevel: data.higher_level?.join("\n\n") || null,
        classes: (data.classes || []).map((c: { name: string }) => c.name).join(", "),
        damageType: data.damage?.damage_type?.name || null,
        areaOfEffect: data.area_of_effect ? JSON.stringify(data.area_of_effect) : null,
      },
    });

    count++;
    if (count % 50 === 0) console.log(`  ✓ ${count}/${list.count} spells`);
    await delay(20);
  }
  console.log(`  ✅ ${count} spells imported`);
}

// ── Monsters ────────────────────────

async function importMonsters() {
  const list = await fetchJson(`${API}/monsters`);
  console.log(`\n🐉 Importing ${list.count} monsters...`);

  let count = 0;
  for (const item of list.results) {
    const data = await fetchJson(`https://www.dnd5eapi.co${item.url}`);

    const ac = Array.isArray(data.armor_class) ? data.armor_class[0]?.value : data.armor_class;

    await prisma.srdMonster.upsert({
      where: { index: data.index },
      update: {},
      create: {
        index: data.index,
        name: data.name,
        edition: "5e",
        size: data.size || "Medium",
        type: data.type || "beast",
        alignment: data.alignment || null,
        armorClass: ac || 10,
        hitPoints: data.hit_points || 1,
        hitDice: data.hit_dice || "1d8",
        speed: JSON.stringify(data.speed || {}),
        str: data.strength || 10,
        dex: data.dexterity || 10,
        con: data.constitution || 10,
        intl: data.intelligence || 10,
        wis: data.wisdom || 10,
        cha: data.charisma || 10,
        challengeRating: data.challenge_rating ?? 0,
        xp: data.xp || 0,
        languages: data.languages || null,
        senses: data.senses ? JSON.stringify(data.senses) : null,
        proficiencies: data.proficiencies?.length ? JSON.stringify(data.proficiencies) : null,
        damageImmunities: data.damage_immunities?.length ? data.damage_immunities.join(", ") : null,
        damageResistances: data.damage_resistances?.length ? data.damage_resistances.join(", ") : null,
        damageVulnerabilities: data.damage_vulnerabilities?.length ? data.damage_vulnerabilities.join(", ") : null,
        conditionImmunities: data.condition_immunities?.length
          ? data.condition_immunities.map((c: { name: string }) => c.name).join(", ")
          : null,
        specialAbilities: data.special_abilities?.length ? JSON.stringify(data.special_abilities) : null,
        actions: data.actions?.length ? JSON.stringify(data.actions) : null,
        legendaryActions: data.legendary_actions?.length ? JSON.stringify(data.legendary_actions) : null,
        reactions: data.reactions?.length ? JSON.stringify(data.reactions) : null,
        imageUrl: data.image ? `https://www.dnd5eapi.co${data.image}` : null,
      },
    });

    count++;
    if (count % 50 === 0) console.log(`  ✓ ${count}/${list.count} monsters`);
    await delay(20);
  }
  console.log(`  ✅ ${count} monsters imported`);
}

// ── Classes ─────────────────────────

async function importClasses() {
  const list = await fetchJson(`${API}/classes`);
  console.log(`\n⚔️ Importing ${list.count} classes...`);

  for (const item of list.results) {
    const data = await fetchJson(`https://www.dnd5eapi.co${item.url}`);

    await prisma.srdClass.upsert({
      where: { index: data.index },
      update: {},
      create: {
        index: data.index,
        name: data.name,
        edition: "5e",
        hitDie: data.hit_die || 8,
        proficiencies: data.proficiencies?.length ? JSON.stringify(data.proficiencies) : null,
        savingThrows: (data.saving_throws || []).map((s: { name: string }) => s.name).join(", "),
        spellcasting: data.spellcasting ? JSON.stringify(data.spellcasting) : null,
        subclasses: data.subclasses?.length ? JSON.stringify(data.subclasses) : null,
      },
    });
    await delay(20);
  }
  console.log(`  ✅ ${list.count} classes imported`);
}

// ── Feats ───────────────────────────

async function importFeats() {
  const list = await fetchJson(`${API}/feats`);
  console.log(`\n🎯 Importing ${list.count} feats...`);

  for (const item of list.results) {
    const data = await fetchJson(`https://www.dnd5eapi.co${item.url}`);

    await prisma.srdFeat.upsert({
      where: { index: data.index },
      update: {},
      create: {
        index: data.index,
        name: data.name,
        edition: "5e",
        description: (data.desc || []).join("\n\n"),
        prerequisites: data.prerequisites?.length ? JSON.stringify(data.prerequisites) : null,
      },
    });
    await delay(20);
  }
  console.log(`  ✅ ${list.count} feats imported`);
}

// ── Equipment ───────────────────────

async function importEquipment() {
  const list = await fetchJson(`${API}/equipment`);
  console.log(`\n🛡️ Importing ${list.count} equipment...`);

  let count = 0;
  for (const item of list.results) {
    const data = await fetchJson(`https://www.dnd5eapi.co${item.url}`);

    const cost = data.cost ? `${data.cost.quantity} ${data.cost.unit}` : null;

    await prisma.srdEquipment.upsert({
      where: { index: data.index },
      update: {},
      create: {
        index: data.index,
        name: data.name,
        edition: "5e",
        category: data.equipment_category?.name || "Other",
        cost,
        weight: data.weight || null,
        description: (data.desc || []).join("\n\n") || null,
        damage: data.damage ? JSON.stringify(data.damage) : null,
        armorClass: data.armor_class ? JSON.stringify(data.armor_class) : null,
        properties: data.properties?.length
          ? JSON.stringify(data.properties.map((p: { name: string }) => p.name))
          : null,
      },
    });

    count++;
    if (count % 50 === 0) console.log(`  ✓ ${count}/${list.count} equipment`);
    await delay(20);
  }
  console.log(`  ✅ ${count} equipment imported`);
}

// ── Magic Items ─────────────────────

async function importMagicItems() {
  const list = await fetchJson(`${API}/magic-items`);
  console.log(`\n✨ Importing ${list.count} magic items...`);

  let count = 0;
  for (const item of list.results) {
    const data = await fetchJson(`https://www.dnd5eapi.co${item.url}`);

    await prisma.srdMagicItem.upsert({
      where: { index: data.index },
      update: {},
      create: {
        index: data.index,
        name: data.name,
        edition: "5e",
        category: data.equipment_category?.name || "Wondrous item",
        rarity: data.rarity?.name || "Common",
        description: (data.desc || []).join("\n\n"),
        requiresAttunement: data.desc?.some((d: string) => d.toLowerCase().includes("requires attunement")) || false,
      },
    });

    count++;
    if (count % 50 === 0) console.log(`  ✓ ${count}/${list.count} magic items`);
    await delay(20);
  }
  console.log(`  ✅ ${count} magic items imported`);
}

// ── Main ────────────────────────────

async function main() {
  console.log("🎲 Hub RPG — Importação SRD 5e");
  console.log("================================");
  console.log("Fonte: dnd5eapi.co (OGL + CC-BY-4.0)\n");

  const start = Date.now();

  await importSpells();
  await importMonsters();
  await importClasses();
  await importFeats();
  await importEquipment();
  await importMagicItems();

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n🏁 Importação completa em ${elapsed}s`);

  const [spells, monsters, classes, feats, equipment, magicItems] = await Promise.all([
    prisma.srdSpell.count(),
    prisma.srdMonster.count(),
    prisma.srdClass.count(),
    prisma.srdFeat.count(),
    prisma.srdEquipment.count(),
    prisma.srdMagicItem.count(),
  ]);

  console.log(`\n📊 Totais no banco:`);
  console.log(`  📖 ${spells} spells`);
  console.log(`  🐉 ${monsters} monsters`);
  console.log(`  ⚔️ ${classes} classes`);
  console.log(`  🎯 ${feats} feats`);
  console.log(`  🛡️ ${equipment} equipment`);
  console.log(`  ✨ ${magicItems} magic items`);
}

main()
  .catch((e) => {
    console.error("❌ Erro na importação:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
