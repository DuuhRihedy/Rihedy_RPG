import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import * as fs from "fs";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const out: string[] = [];

  const conditions = await prisma.srdCondition.findMany({
    select: { index: true, name: true, description: true, descriptionPtBr: true },
    orderBy: { name: "asc" },
  });
  out.push(`=== CONDITIONS (${conditions.length}) ===`);
  for (const c of conditions) {
    out.push("");
    out.push(`--- ${c.index} | ${c.name} ---`);
    out.push(`descPtBr: ${c.descriptionPtBr ? "JA TEM" : "FALTA"}`);
    out.push(`EN: ${(c.description || "").substring(0, 800)}`);
  }

  const skills = await prisma.srdSkill.findMany({
    select: { index: true, name: true, abilityScore: true, description: true, descriptionPtBr: true },
    orderBy: { name: "asc" },
  });
  out.push(`\n=== SKILLS (${skills.length}) ===`);
  for (const s of skills) {
    out.push("");
    out.push(`--- ${s.index} | ${s.name} (${s.abilityScore}) ---`);
    out.push(`descPtBr: ${s.descriptionPtBr ? "JA TEM" : "FALTA"}`);
    out.push(`EN: ${(s.description || "").substring(0, 800)}`);
  }

  const traits = await prisma.srdTrait.findMany({
    select: { index: true, name: true, description: true, descriptionPtBr: true },
    orderBy: { name: "asc" },
  });
  out.push(`\n=== TRAITS (${traits.length}) ===`);
  for (const t of traits) {
    out.push("");
    out.push(`--- ${t.index} | ${t.name} ---`);
    out.push(`descPtBr: ${t.descriptionPtBr ? "JA TEM" : "FALTA"}`);
    out.push(`EN: ${(t.description || "").substring(0, 800)}`);
  }

  const subclasses = await prisma.srdSubclass.findMany({
    select: { index: true, name: true, classIndex: true, description: true, descriptionPtBr: true },
    orderBy: { name: "asc" },
  });
  out.push(`\n=== SUBCLASSES (${subclasses.length}) ===`);
  for (const sc of subclasses) {
    out.push("");
    out.push(`--- ${sc.index} | ${sc.name} (class: ${sc.classIndex}) ---`);
    out.push(`descPtBr: ${sc.descriptionPtBr ? "JA TEM" : "FALTA"}`);
    out.push(`EN: ${(sc.description || "").substring(0, 800)}`);
  }

  fs.writeFileSync("C:/tmp/small-blocks-data.txt", out.join("\n"), "utf8");
  console.log(`Conditions: ${conditions.length}`);
  console.log(`Skills: ${skills.length}`);
  console.log(`Traits: ${traits.length}`);
  console.log(`Subclasses: ${subclasses.length}`);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
