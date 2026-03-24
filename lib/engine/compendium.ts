// ═══════════════════════════════════════════
// VTT Engine — Compendium Service
// Consulta centralizada ao banco SRD
// ═══════════════════════════════════════════

import { prisma } from "@/lib/db";
import { CompendiumCategory, CompendiumEntry } from "./types";

export interface CompendiumSearchParams {
  category?: CompendiumCategory;
  query?: string;
  edition?: "3.5" | "5e";
  level?: number;
  school?: string;
  limit?: number;
}

/**
 * Search across all SRD tables in a unified way.
 */
export async function searchCompendium(params: CompendiumSearchParams): Promise<CompendiumEntry[]> {
  const results: CompendiumEntry[] = [];
  const limit = params.limit || 20;
  const query = params.query?.toLowerCase() || "";
  const now = new Date();

  const categories = params.category ? [params.category] : ["spell", "monster", "class", "feat"];

  for (const cat of categories) {
    switch (cat) {
      case "spell": {
        const spells = await prisma.srdSpell.findMany({
          where: {
            ...(query && { name: { contains: query, mode: "insensitive" } }),
            ...(params.edition && { edition: params.edition }),
            ...(params.level !== undefined && { level: params.level }),
          },
          take: limit,
          orderBy: [{ edition: "asc" }, { level: "asc" }, { name: "asc" }],
        });

        for (const s of spells) {
          results.push({
            id: s.id, category: "spell", name: s.name,
            namePtBr: s.namePtBr || s.name, source: "srd",
            edition: s.edition as "3.5" | "5e",
            data: { level: s.level, school: s.school, castingTime: s.castingTime, range: s.range, duration: s.duration, description: s.description },
            tags: [s.school || "", `level-${s.level}`].filter(Boolean),
            createdAt: now, updatedAt: now,
          });
        }
        break;
      }

      case "monster": {
        const monsters = await prisma.srdMonster.findMany({
          where: {
            ...(query && { name: { contains: query, mode: "insensitive" } }),
            ...(params.edition && { edition: params.edition }),
          },
          take: limit,
          orderBy: [{ edition: "asc" }, { name: "asc" }],
        });

        for (const m of monsters) {
          results.push({
            id: m.id, category: "monster", name: m.name,
            namePtBr: m.namePtBr || m.name, source: "srd",
            edition: m.edition as "3.5" | "5e",
            data: { size: m.size, type: m.type, alignment: m.alignment, ac: m.armorClass, hp: m.hitPoints, cr: m.challengeRating },
            tags: [m.type || "", m.size || ""].filter(Boolean),
            createdAt: now, updatedAt: now,
          });
        }
        break;
      }

      case "class": {
        const classes = await prisma.srdClass.findMany({
          where: {
            ...(query && { name: { contains: query, mode: "insensitive" } }),
            ...(params.edition && { edition: params.edition }),
          },
          take: limit,
          orderBy: [{ edition: "asc" }, { name: "asc" }],
        });

        for (const c of classes) {
          results.push({
            id: c.id, category: "class", name: c.name,
            namePtBr: c.name, source: "srd",
            edition: c.edition as "3.5" | "5e",
            data: { hitDie: c.hitDie, proficiencies: c.proficiencies, spellcasting: c.spellcasting },
            tags: [],
            createdAt: now, updatedAt: now,
          });
        }
        break;
      }

      case "feat": {
        const feats = await prisma.srdFeat.findMany({
          where: {
            ...(query && { name: { contains: query, mode: "insensitive" } }),
            ...(params.edition && { edition: params.edition }),
          },
          take: limit,
          orderBy: [{ edition: "asc" }, { name: "asc" }],
        });

        for (const f of feats) {
          results.push({
            id: f.id, category: "feat", name: f.name,
            namePtBr: f.namePtBr || f.name, source: "srd",
            edition: f.edition as "3.5" | "5e",
            data: { prerequisites: f.prerequisites, description: f.description },
            tags: [],
            createdAt: now, updatedAt: now,
          });
        }
        break;
      }
    }
  }

  return results.slice(0, limit);
}

/**
 * Get compendium statistics.
 */
export async function getCompendiumStats() {
  const [spells, monsters, classes, feats, equipment, magicItems] = await Promise.all([
    prisma.srdSpell.count(),
    prisma.srdMonster.count(),
    prisma.srdClass.count(),
    prisma.srdFeat.count(),
    prisma.srdEquipment.count(),
    prisma.srdMagicItem.count(),
  ]);

  return {
    total: spells + monsters + classes + feats + equipment + magicItems,
    breakdown: { spells, monsters, classes, feats, equipment, magicItems },
  };
}
