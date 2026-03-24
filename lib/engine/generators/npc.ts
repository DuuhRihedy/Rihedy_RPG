// ═══════════════════════════════════════════
// VTT Engine — NPC Generator (D&D 3.5)
// Gera NPCs completos aleatoriamente
// ═══════════════════════════════════════════

import { AbilityScores, AbilityName, Character } from "../types";
import { rollAbilityScores } from "../dice";
import { createCharacter, levelUp, SRD_CLASSES, SRD_RACES } from "../character";

export interface NpcGeneratorOptions {
  level?: number;
  className?: string;
  raceName?: string;
  type?: "ally" | "enemy" | "neutral";
  alignment?: string;
}

const NPC_NAMES = {
  male: ["Aldric", "Brom", "Cedrik", "Darian", "Eadric", "Faolan", "Gareth", "Hadrian", "Ivar", "Jorik", "Kael", "Loric", "Magnus", "Nolan", "Orin", "Phelan", "Quintus", "Roderic", "Sven", "Torin"],
  female: ["Aelara", "Brienne", "Cordelia", "Dahlia", "Elara", "Freya", "Gwendolyn", "Helena", "Isolde", "Jaina", "Kaelin", "Lyra", "Miriel", "Nadia", "Ophelia", "Petra", "Quinn", "Rhiannon", "Selene", "Thalia"],
  surname: ["Ironforge", "Shadowmere", "Stormwind", "Brightaxe", "Darkhollow", "Frostborn", "Goldleaf", "Hawkstone", "Nightblade", "Oakenshield", "Ravencrest", "Silvervein", "Thornwall", "Wolfbane"],
};

const ALIGNMENTS = [
  "Lawful Good", "Neutral Good", "Chaotic Good",
  "Lawful Neutral", "True Neutral", "Chaotic Neutral",
  "Lawful Evil", "Neutral Evil", "Chaotic Evil",
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate a complete NPC with stats, equipment, etc.
 */
export function generateNpc(options: NpcGeneratorOptions = {}): Character {
  const level = options.level || Math.floor(Math.random() * 5) + 1;
  const raceName = options.raceName || randomFrom(SRD_RACES).name;
  const className = options.className || randomFrom(SRD_CLASSES).name;
  const alignment = options.alignment || randomFrom(ALIGNMENTS);

  // Generate name
  const gender = Math.random() > 0.5 ? "male" : "female";
  const firstName = randomFrom(NPC_NAMES[gender]);
  const surname = randomFrom(NPC_NAMES.surname);
  const name = `${firstName} ${surname}`;

  // Roll abilities
  const rolls = rollAbilityScores();
  rolls.sort((a, b) => b - a);

  // Assign abilities based on class priority
  const classData = SRD_CLASSES.find((c) => c.name === className);
  const priorities = getAbilityPriorities(className);
  const abilities: AbilityScores = { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };
  priorities.forEach((ability, i) => {
    abilities[ability] = rolls[i] || 10;
  });

  // Create character
  let character = createCharacter(name, raceName, className, abilities, alignment);

  // Level up
  for (let i = 1; i < level; i++) {
    character = levelUp(character, className);
  }

  return character;
}

function getAbilityPriorities(className: string): AbilityName[] {
  const priorityMap: Record<string, AbilityName[]> = {
    Fighter: ["str", "con", "dex", "wis", "cha", "int"],
    Wizard: ["int", "dex", "con", "wis", "cha", "str"],
    Rogue: ["dex", "int", "con", "cha", "wis", "str"],
    Cleric: ["wis", "con", "str", "cha", "dex", "int"],
    Barbarian: ["str", "con", "dex", "wis", "cha", "int"],
    Ranger: ["dex", "str", "con", "wis", "cha", "int"],
    Paladin: ["str", "cha", "con", "wis", "dex", "int"],
    Bard: ["cha", "dex", "con", "int", "wis", "str"],
    Druid: ["wis", "con", "dex", "str", "cha", "int"],
    Monk: ["wis", "dex", "str", "con", "cha", "int"],
    Sorcerer: ["cha", "dex", "con", "int", "wis", "str"],
  };
  return priorityMap[className] || ["str", "dex", "con", "int", "wis", "cha"];
}
