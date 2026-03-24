// ═══════════════════════════════════════════
// VTT Engine — Encounter Generator (D&D 3.5)
// Monta encontros equilibrados por CR
// ═══════════════════════════════════════════

import { Encounter, EncounterCreature, EncounterDifficulty } from "../types";

// ── CR XP Values (D&D 3.5 SRD) ─────────

const CR_XP: Record<number, number> = {
  0.125: 50, 0.25: 75, 0.5: 100,
  1: 300, 2: 600, 3: 900, 4: 1200, 5: 1600,
  6: 2400, 7: 3200, 8: 4800, 9: 6400, 10: 9600,
  11: 12800, 12: 19200, 13: 25600, 14: 38400, 15: 51200,
  16: 76800, 17: 102400, 18: 153600, 19: 204800, 20: 307200,
};

// ── Difficulty Multipliers ──────────────

const DIFFICULTY_MULTIPLIER: Record<EncounterDifficulty, number> = {
  easy: 0.5,
  average: 1.0,
  challenging: 1.5,
  hard: 2.0,
  overpowering: 3.0,
};

// ── Common Monsters by CR ───────────────

const MONSTERS_BY_CR: Record<number, Array<{ name: string; hp: number }>> = {
  0.25: [
    { name: "Kobold", hp: 4 },
    { name: "Goblin", hp: 5 },
  ],
  0.5: [
    { name: "Orc", hp: 5 },
    { name: "Skeleton", hp: 6 },
    { name: "Zombie", hp: 16 },
  ],
  1: [
    { name: "Gnoll", hp: 11 },
    { name: "Bugbear", hp: 16 },
    { name: "Troglodyte", hp: 13 },
    { name: "Dire Rat", hp: 5 },
  ],
  2: [
    { name: "Ogre", hp: 29 },
    { name: "Ghoul", hp: 13 },
    { name: "Lizardfolk", hp: 11 },
  ],
  3: [
    { name: "Wight", hp: 26 },
    { name: "Dire Wolf", hp: 45 },
    { name: "Owlbear", hp: 52 },
  ],
  4: [
    { name: "Gargoyle", hp: 37 },
    { name: "Minotaur", hp: 39 },
    { name: "Shadow", hp: 19 },
  ],
  5: [
    { name: "Troll", hp: 63 },
    { name: "Wraith", hp: 32 },
    { name: "Basilisk", hp: 45 },
  ],
  6: [
    { name: "Wyvern", hp: 59 },
    { name: "Medusa", hp: 33 },
  ],
  7: [
    { name: "Mind Flayer", hp: 44 },
    { name: "Stone Giant", hp: 119 },
  ],
  8: [
    { name: "Frost Giant", hp: 133 },
    { name: "Young Adult Red Dragon", hp: 161 },
  ],
  10: [
    { name: "Adult Red Dragon", hp: 253 },
    { name: "Beholder", hp: 93 },
  ],
};

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate a balanced encounter for a party.
 */
export function generateEncounter(
  partyLevel: number,
  partySize: number = 4,
  difficulty: EncounterDifficulty = "average",
  name: string = "Encontro",
): Encounter {
  const targetCR = Math.max(1, Math.floor(partyLevel * DIFFICULTY_MULTIPLIER[difficulty]));
  const targetXP = (CR_XP[targetCR] || targetCR * 300) * partySize;

  const creatures: EncounterCreature[] = [];
  let currentXP = 0;

  // Fill encounter with creatures
  let attempts = 0;
  while (currentXP < targetXP * 0.8 && attempts < 20) {
    attempts++;

    // Pick a CR that makes sense
    const maxCreatureCR = Math.min(targetCR + 2, 20);
    const minCreatureCR = Math.max(0.25, targetCR - 3);

    // Find available CRs
    const availableCRs = Object.keys(MONSTERS_BY_CR)
      .map(Number)
      .filter((cr) => cr >= minCreatureCR && cr <= maxCreatureCR);

    if (availableCRs.length === 0) break;

    const cr = randomFrom(availableCRs);
    const monstersAtCR = MONSTERS_BY_CR[cr];
    if (!monstersAtCR || monstersAtCR.length === 0) continue;

    const monster = randomFrom(monstersAtCR);
    const xp = CR_XP[cr] || cr * 300;

    if (currentXP + xp > targetXP * 1.5) continue;

    // Check if we already have this monster
    const existing = creatures.find((c) => c.name === monster.name);
    if (existing) {
      existing.count++;
    } else {
      creatures.push({
        name: monster.name,
        cr,
        count: 1,
        hp: monster.hp,
        initiative: Math.floor(Math.random() * 20) + 1,
      });
    }

    currentXP += xp;
  }

  // Calculate total CR (simplified)
  const totalCR = calculateEncounterCR(creatures);

  return {
    name,
    partyLevel,
    partySize,
    difficulty,
    creatures,
    totalCR,
    xpReward: currentXP,
  };
}

function calculateEncounterCR(creatures: EncounterCreature[]): number {
  if (creatures.length === 0) return 0;
  if (creatures.length === 1 && creatures[0].count === 1) return creatures[0].cr;

  // Simplified: highest CR + bonus for numbers
  const highestCR = Math.max(...creatures.map((c) => c.cr));
  const totalCount = creatures.reduce((sum, c) => sum + c.count, 0);
  const bonus = Math.floor(Math.log2(totalCount));
  return highestCR + bonus;
}
