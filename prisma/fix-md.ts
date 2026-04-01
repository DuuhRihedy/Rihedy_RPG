import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { marked } from "marked";

const rawUrl = process.env.DATABASE_URL!;
const dbUrl = rawUrl.replace(/^["']|["']$/g, "");
const adapter = new PrismaNeon({ connectionString: dbUrl });
const prisma = new PrismaClient({ adapter });

function stripFrontmatter(content: string): string {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  return match ? match[2].trim() : content.trim();
}

async function main() {
  console.log("Fixing markdown in Chapters...");
  const chapters = await prisma.chapter.findMany();
  for (const ch of chapters) {
    if (ch.content && (ch.content.includes("---") || ch.content.includes("# "))) {
      const cleanMd = stripFrontmatter(ch.content);
      const html = await marked(cleanMd);
      await prisma.chapter.update({
        where: { id: ch.id },
        data: { content: html },
      });
      console.log(`Updated Chapter: ${ch.title}`);
    }
  }

  console.log("Fixing markdown in Documents...");
  const docs = await prisma.document.findMany();
  for (const doc of docs) {
    if (doc.content && (doc.content.includes("---") || doc.content.includes("# "))) {
      const cleanMd = stripFrontmatter(doc.content);
      const html = await marked(cleanMd);
      await prisma.document.update({
        where: { id: doc.id },
        data: { content: html },
      });
      console.log(`Updated Document: ${doc.name}`);
    }
  }

  console.log("Fixing markdown in NPCs backstory and gmNotes...");
  const npcs = await prisma.npc.findMany();
  for (const npc of npcs) {
    let updated = false;
    let newBackstory = npc.backstory;
    let newGmNotes = npc.gmNotes;

    if (npc.backstory && (npc.backstory.includes("---") || npc.backstory.includes("# "))) {
      newBackstory = await marked(stripFrontmatter(npc.backstory));
      updated = true;
    }
    if (npc.gmNotes && (npc.gmNotes.includes("---") || npc.gmNotes.includes("# "))) {
      newGmNotes = await marked(stripFrontmatter(npc.gmNotes));
      updated = true;
    }

    if (updated) {
      await prisma.npc.update({
        where: { id: npc.id },
        data: { backstory: newBackstory, gmNotes: newGmNotes },
      });
      console.log(`Updated NPC: ${npc.name}`);
    }
  }

  console.log("Done!");
  await prisma.$disconnect();
}

main().catch(console.error);
