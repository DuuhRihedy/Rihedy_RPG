// ═══════════════════════════════════════════════
// Importação SRD 5e Completa — Novos dados
// Fonte: dnd5eapi.co (gratuito, OGL/CC-BY-4.0)
// ═══════════════════════════════════════════════

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const API = "https://www.dnd5eapi.co/api/2014";

async function fetchJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed: ${url} (${res.status})`);
  return res.json();
}

async function fetchAll(endpoint: string) {
  const list = await fetchJson(`${API}/${endpoint}`);
  const items = [];
  for (const item of list.results) {
    const detail = await fetchJson(`https://www.dnd5eapi.co${item.url}`);
    items.push(detail);
  }
  return items;
}

function descFromArray(arr: { desc?: string[] } | undefined): string {
  if (!arr) return "";
  return "";
}

function joinDesc(desc: string[] | undefined): string {
  if (!desc || !Array.isArray(desc)) return "";
  return desc.join("\n\n");
}

// ── Raças ──────────────────────────

async function importRaces() {
  console.log("📦 Importando raças...");
  const races = await fetchAll("races");

  for (const r of races) {
    await prisma.srdRace.upsert({
      where: { index: r.index },
      update: {},
      create: {
        index: r.index,
        name: r.name,
        edition: "5e",
        speed: r.speed || 30,
        abilityBonuses: JSON.stringify(r.ability_bonuses?.map((ab: { ability_score: { name: string }; bonus: number }) => ({
          name: ab.ability_score.name,
          bonus: ab.bonus,
        })) || []),
        alignment: r.alignment || null,
        age: r.age || null,
        size: r.size || null,
        sizeDescription: r.size_description || null,
        languages: JSON.stringify(r.languages?.map((l: { name: string }) => l.name) || []),
        traits: JSON.stringify(r.traits?.map((t: { index: string; name: string }) => ({ index: t.index, name: t.name })) || []),
        subraces: JSON.stringify(r.subraces?.map((s: { index: string; name: string }) => ({ index: s.index, name: s.name })) || []),
        proficiencies: JSON.stringify(r.starting_proficiencies?.map((p: { name: string }) => p.name) || []),
      },
    });
    console.log(`  ✅ ${r.name}`);
  }
  console.log(`  Total: ${races.length} raças\n`);
}

// ── Sub-raças ──────────────────────

async function importSubraces() {
  console.log("📦 Importando sub-raças...");
  const subraces = await fetchAll("subraces");

  for (const sr of subraces) {
    await prisma.srdSubrace.upsert({
      where: { index: sr.index },
      update: {},
      create: {
        index: sr.index,
        name: sr.name,
        edition: "5e",
        raceIndex: sr.race?.index || "",
        description: sr.desc || null,
        abilityBonuses: JSON.stringify(sr.ability_bonuses?.map((ab: { ability_score: { name: string }; bonus: number }) => ({
          name: ab.ability_score.name,
          bonus: ab.bonus,
        })) || []),
        traits: JSON.stringify(sr.racial_traits?.map((t: { index: string; name: string }) => ({ index: t.index, name: t.name })) || []),
        proficiencies: JSON.stringify(sr.starting_proficiencies?.map((p: { name: string }) => p.name) || []),
      },
    });
    console.log(`  ✅ ${sr.name}`);
  }
  console.log(`  Total: ${subraces.length} sub-raças\n`);
}

// ── Subclasses ─────────────────────

async function importSubclasses() {
  console.log("📦 Importando subclasses...");
  const subclasses = await fetchAll("subclasses");

  for (const sc of subclasses) {
    await prisma.srdSubclass.upsert({
      where: { index: sc.index },
      update: {},
      create: {
        index: sc.index,
        name: sc.name,
        edition: "5e",
        classIndex: sc.class?.index || "",
        description: joinDesc(sc.desc),
        features: JSON.stringify(sc.subclass_levels || []),
        spells: JSON.stringify(sc.spells || []),
      },
    });
    console.log(`  ✅ ${sc.name} (${sc.class?.name})`);
  }
  console.log(`  Total: ${subclasses.length} subclasses\n`);
}

// ── Features de Classe ─────────────

async function importFeatures() {
  console.log("📦 Importando features de classe (407)...");
  const features = await fetchAll("features");

  let count = 0;
  for (const f of features) {
    await prisma.srdFeature.upsert({
      where: { index: f.index },
      update: {},
      create: {
        index: f.index,
        name: f.name,
        edition: "5e",
        classIndex: f.class?.index || null,
        subclassIndex: f.subclass?.index || null,
        level: f.level || 0,
        description: joinDesc(f.desc),
        prerequisites: JSON.stringify(f.prerequisites || []),
      },
    });
    count++;
    if (count % 50 === 0) console.log(`  ... ${count}/${features.length}`);
  }
  console.log(`  ✅ Total: ${features.length} features\n`);
}

// ── Condições ──────────────────────

async function importConditions() {
  console.log("📦 Importando condições...");
  const conditions = await fetchAll("conditions");

  for (const c of conditions) {
    await prisma.srdCondition.upsert({
      where: { index: c.index },
      update: {},
      create: {
        index: c.index,
        name: c.name,
        edition: "5e",
        description: joinDesc(c.desc),
      },
    });
    console.log(`  ✅ ${c.name}`);
  }
  console.log(`  Total: ${conditions.length} condições\n`);
}

// ── Skills ─────────────────────────

async function importSkills() {
  console.log("📦 Importando skills...");
  const skills = await fetchAll("skills");

  for (const s of skills) {
    await prisma.srdSkill.upsert({
      where: { index: s.index },
      update: {},
      create: {
        index: s.index,
        name: s.name,
        edition: "5e",
        abilityScore: s.ability_score?.name || "",
        description: joinDesc(s.desc),
      },
    });
    console.log(`  ✅ ${s.name} (${s.ability_score?.name})`);
  }
  console.log(`  Total: ${skills.length} skills\n`);
}

// ── Traits ─────────────────────────

async function importTraits() {
  console.log("📦 Importando traits raciais...");
  const traits = await fetchAll("traits");

  for (const t of traits) {
    await prisma.srdTrait.upsert({
      where: { index: t.index },
      update: {},
      create: {
        index: t.index,
        name: t.name,
        edition: "5e",
        races: JSON.stringify(t.races?.map((r: { index: string; name: string }) => ({ index: r.index, name: r.name })) || []),
        subraces: JSON.stringify(t.subraces?.map((s: { index: string; name: string }) => ({ index: s.index, name: s.name })) || []),
        description: joinDesc(t.desc),
        proficiencies: JSON.stringify(t.proficiencies?.map((p: { name: string }) => p.name) || []),
      },
    });
    console.log(`  ✅ ${t.name}`);
  }
  console.log(`  Total: ${traits.length} traits\n`);
}

// ── Idiomas ────────────────────────

async function importLanguages() {
  console.log("📦 Importando idiomas...");
  const languages = await fetchAll("languages");

  for (const l of languages) {
    await prisma.srdLanguage.upsert({
      where: { index: l.index },
      update: {},
      create: {
        index: l.index,
        name: l.name,
        edition: "5e",
        type: l.type || "Standard",
        typicalSpeakers: l.typical_speakers?.join(", ") || null,
        script: l.script || null,
      },
    });
    console.log(`  ✅ ${l.name}`);
  }
  console.log(`  Total: ${languages.length} idiomas\n`);
}

// ── Main ───────────────────────────

async function main() {
  console.log("═══════════════════════════════════════════");
  console.log(" Importação SRD 5e Completa — Novos Dados");
  console.log("═══════════════════════════════════════════\n");

  await importRaces();
  await importSubraces();
  await importSubclasses();
  await importFeatures();
  await importConditions();
  await importSkills();
  await importTraits();
  await importLanguages();

  console.log("═══════════════════════════════════════════");
  console.log(" ✅ Importação completa!");
  console.log("═══════════════════════════════════════════");
}

main().catch(console.error);
