// ═══════════════════════════════════════════
// VTT Engine — Character System (D&D 3.5)
// Criação e progressão de personagem
// ═══════════════════════════════════════════

import {
  Character,
  AbilityScores,
  AbilityName,
  CreatureSize,
  ClassDefinition,
  RaceDefinition,
  getModifier,
  SIZE_MODIFIERS,
} from "./types";
import { rollAbilityScores, rollDice } from "./dice";
import { calculateBAB, calculateBaseSave } from "./rules-engine";

// ── D&D 3.5 SRD Races ──────────────────

export const SRD_RACES: RaceDefinition[] = [
  {
    name: "Human",
    namePtBr: "Humano",
    size: "Medium",
    speed: 30,
    abilityModifiers: {},
    racialTraits: ["Extra feat at 1st level", "Extra skill points (4 + 1/level)"],
    favoredClass: "Any",
    languages: ["Common"],
    bonusFeats: ["bonus_feat_1st"],
  },
  {
    name: "Elf",
    namePtBr: "Elfo",
    size: "Medium",
    speed: 30,
    abilityModifiers: { dex: 2, con: -2 },
    racialTraits: ["Immunity to sleep", "Low-light vision", "+2 Search/Spot/Listen"],
    favoredClass: "Wizard",
    languages: ["Common", "Elven"],
    skillBonuses: { Search: 2, Spot: 2, Listen: 2 },
  },
  {
    name: "Dwarf",
    namePtBr: "Anão",
    size: "Medium",
    speed: 20,
    abilityModifiers: { con: 2, cha: -2 },
    racialTraits: ["Darkvision 60ft", "Stonecunning", "+2 saves vs poison/spells"],
    favoredClass: "Fighter",
    languages: ["Common", "Dwarven"],
  },
  {
    name: "Halfling",
    namePtBr: "Halfling",
    size: "Small",
    speed: 20,
    abilityModifiers: { dex: 2, str: -2 },
    racialTraits: ["+1 attack with thrown/slings", "+2 saves vs fear", "+1 all saves"],
    favoredClass: "Rogue",
    languages: ["Common", "Halfling"],
    skillBonuses: { Climb: 2, Jump: 2, "Move Silently": 2, Listen: 2 },
  },
  {
    name: "Gnome",
    namePtBr: "Gnomo",
    size: "Small",
    speed: 20,
    abilityModifiers: { con: 2, str: -2 },
    racialTraits: ["Low-light vision", "+1 DC illusion spells", "+2 saves vs illusions"],
    favoredClass: "Bard",
    languages: ["Common", "Gnome"],
    skillBonuses: { Listen: 2, "Craft (Alchemy)": 2 },
  },
  {
    name: "Half-Elf",
    namePtBr: "Meio-Elfo",
    size: "Medium",
    speed: 30,
    abilityModifiers: {},
    racialTraits: ["Immunity to sleep", "Low-light vision", "+2 Diplomacy/Gather Info"],
    favoredClass: "Any",
    languages: ["Common", "Elven"],
    skillBonuses: { Diplomacy: 2, "Gather Information": 2 },
  },
  {
    name: "Half-Orc",
    namePtBr: "Meio-Orc",
    size: "Medium",
    speed: 30,
    abilityModifiers: { str: 2, int: -2, cha: -2 },
    racialTraits: ["Darkvision 60ft", "Orc blood"],
    favoredClass: "Barbarian",
    languages: ["Common", "Orc"],
  },
];

// ── D&D 3.5 SRD Base Classes ─────────────

export const SRD_CLASSES: ClassDefinition[] = [
  {
    name: "Fighter",
    namePtBr: "Guerreiro",
    hitDie: 10,
    skillPoints: 2,
    classSkills: ["Climb", "Craft", "Handle Animal", "Intimidate", "Jump", "Ride", "Swim"],
    babProgression: "full",
    fortSave: "good",
    refSave: "poor",
    willSave: "poor",
    levels: [],
    proficiencies: {
      armor: ["light", "medium", "heavy"],
      weapons: ["simple", "martial"],
      shields: ["all", "tower"],
    },
  },
  {
    name: "Wizard",
    namePtBr: "Mago",
    hitDie: 4,
    skillPoints: 2,
    classSkills: ["Concentration", "Craft", "Decipher Script", "Knowledge (all)", "Profession", "Spellcraft"],
    babProgression: "1/2",
    fortSave: "poor",
    refSave: "poor",
    willSave: "good",
    levels: [],
    proficiencies: {
      armor: [],
      weapons: ["club", "dagger", "crossbow (heavy/light)", "quarterstaff"],
      shields: [],
    },
    spellcasting: { type: "arcane", ability: "int", prepared: true, spellList: "wizard" },
  },
  {
    name: "Rogue",
    namePtBr: "Ladino",
    hitDie: 6,
    skillPoints: 8,
    classSkills: [
      "Appraise", "Balance", "Bluff", "Climb", "Craft", "Decipher Script",
      "Diplomacy", "Disable Device", "Disguise", "Escape Artist", "Forgery",
      "Gather Information", "Hide", "Intimidate", "Jump", "Knowledge (Local)",
      "Listen", "Move Silently", "Open Lock", "Perform", "Profession",
      "Search", "Sense Motive", "Sleight of Hand", "Spot", "Swim",
      "Tumble", "Use Magic Device", "Use Rope",
    ],
    babProgression: "3/4",
    fortSave: "poor",
    refSave: "good",
    willSave: "poor",
    levels: [],
    proficiencies: {
      armor: ["light"],
      weapons: ["simple", "hand crossbow", "rapier", "shortbow", "short sword"],
      shields: [],
    },
  },
  {
    name: "Cleric",
    namePtBr: "Clérigo",
    hitDie: 8,
    skillPoints: 2,
    classSkills: ["Concentration", "Craft", "Diplomacy", "Heal", "Knowledge (Arcana)", "Knowledge (History)", "Knowledge (Religion)", "Knowledge (The Planes)", "Profession", "Spellcraft"],
    babProgression: "3/4",
    fortSave: "good",
    refSave: "poor",
    willSave: "good",
    levels: [],
    proficiencies: {
      armor: ["light", "medium", "heavy"],
      weapons: ["simple"],
      shields: ["all"],
    },
    spellcasting: { type: "divine", ability: "wis", prepared: true, spellList: "cleric" },
  },
  {
    name: "Barbarian",
    namePtBr: "Bárbaro",
    hitDie: 12,
    skillPoints: 4,
    classSkills: ["Climb", "Craft", "Handle Animal", "Intimidate", "Jump", "Listen", "Ride", "Survival", "Swim"],
    babProgression: "full",
    fortSave: "good",
    refSave: "poor",
    willSave: "poor",
    levels: [],
    proficiencies: {
      armor: ["light", "medium"],
      weapons: ["simple", "martial"],
      shields: ["all"],
    },
  },
  {
    name: "Ranger",
    namePtBr: "Patrulheiro",
    hitDie: 8,
    skillPoints: 6,
    classSkills: ["Climb", "Concentration", "Craft", "Handle Animal", "Heal", "Hide", "Jump", "Knowledge (Dungeoneering)", "Knowledge (Geography)", "Knowledge (Nature)", "Listen", "Move Silently", "Profession", "Ride", "Search", "Spot", "Survival", "Swim", "Use Rope"],
    babProgression: "full",
    fortSave: "good",
    refSave: "good",
    willSave: "poor",
    levels: [],
    proficiencies: {
      armor: ["light"],
      weapons: ["simple", "martial"],
      shields: ["all"],
    },
    spellcasting: { type: "divine", ability: "wis", prepared: true, spellList: "ranger" },
  },
  {
    name: "Paladin",
    namePtBr: "Paladino",
    hitDie: 10,
    skillPoints: 2,
    classSkills: ["Concentration", "Craft", "Diplomacy", "Handle Animal", "Heal", "Knowledge (Nobility)", "Knowledge (Religion)", "Profession", "Ride", "Sense Motive"],
    babProgression: "full",
    fortSave: "good",
    refSave: "poor",
    willSave: "poor",
    levels: [],
    proficiencies: {
      armor: ["light", "medium", "heavy"],
      weapons: ["simple", "martial"],
      shields: ["all"],
    },
    spellcasting: { type: "divine", ability: "cha", prepared: true, spellList: "paladin" },
  },
  {
    name: "Bard",
    namePtBr: "Bardo",
    hitDie: 6,
    skillPoints: 6,
    classSkills: ["Appraise", "Balance", "Bluff", "Climb", "Concentration", "Craft", "Decipher Script", "Diplomacy", "Disguise", "Escape Artist", "Gather Information", "Hide", "Jump", "Knowledge (all)", "Listen", "Move Silently", "Perform", "Profession", "Sense Motive", "Sleight of Hand", "Speak Language", "Spellcraft", "Swim", "Tumble", "Use Magic Device"],
    babProgression: "3/4",
    fortSave: "poor",
    refSave: "good",
    willSave: "good",
    levels: [],
    proficiencies: {
      armor: ["light"],
      weapons: ["simple", "longsword", "rapier", "shortbow", "short sword", "whip"],
      shields: ["buckler"],
    },
    spellcasting: { type: "arcane", ability: "cha", prepared: false, spellList: "bard" },
  },
  {
    name: "Druid",
    namePtBr: "Druida",
    hitDie: 8,
    skillPoints: 4,
    classSkills: ["Concentration", "Craft", "Diplomacy", "Handle Animal", "Heal", "Knowledge (Nature)", "Listen", "Profession", "Ride", "Spellcraft", "Spot", "Survival", "Swim"],
    babProgression: "3/4",
    fortSave: "good",
    refSave: "poor",
    willSave: "good",
    levels: [],
    proficiencies: {
      armor: ["light", "medium (non-metal)"],
      weapons: ["club", "dagger", "dart", "quarterstaff", "scimitar", "sickle", "shortspear", "sling", "spear"],
      shields: ["wooden"],
    },
    spellcasting: { type: "divine", ability: "wis", prepared: true, spellList: "druid" },
  },
  {
    name: "Monk",
    namePtBr: "Monge",
    hitDie: 8,
    skillPoints: 4,
    classSkills: ["Balance", "Climb", "Concentration", "Craft", "Diplomacy", "Escape Artist", "Hide", "Jump", "Knowledge (Arcana)", "Knowledge (Religion)", "Listen", "Move Silently", "Perform", "Profession", "Sense Motive", "Spot", "Swim", "Tumble"],
    babProgression: "3/4",
    fortSave: "good",
    refSave: "good",
    willSave: "good",
    levels: [],
    proficiencies: {
      armor: [],
      weapons: ["club", "crossbow (light)", "dagger", "handaxe", "javelin", "kama", "nunchaku", "quarterstaff", "sai", "shuriken", "siangham", "sling"],
      shields: [],
    },
  },
  {
    name: "Sorcerer",
    namePtBr: "Feiticeiro",
    hitDie: 4,
    skillPoints: 2,
    classSkills: ["Bluff", "Concentration", "Craft", "Knowledge (Arcana)", "Profession", "Spellcraft"],
    babProgression: "1/2",
    fortSave: "poor",
    refSave: "poor",
    willSave: "good",
    levels: [],
    proficiencies: {
      armor: [],
      weapons: ["simple"],
      shields: [],
    },
    spellcasting: { type: "arcane", ability: "cha", prepared: false, spellList: "sorcerer" },
  },
];

// ── Character Builder ───────────────────

export function createCharacter(
  name: string,
  raceName: string,
  className: string,
  abilities: AbilityScores,
  alignment: string = "True Neutral",
): Character {
  const race = SRD_RACES.find((r) => r.name === raceName);
  const classData = SRD_CLASSES.find((c) => c.name === className);

  if (!race || !classData) throw new Error(`Raça "${raceName}" ou classe "${className}" não encontrada`);

  // Apply racial modifiers
  const finalAbilities: AbilityScores = { ...abilities };
  for (const [ability, mod] of Object.entries(race.abilityModifiers)) {
    finalAbilities[ability as AbilityName] += mod;
  }

  // Calculate derived stats
  const level = 1;
  const conMod = getModifier(finalAbilities.con);
  const dexMod = getModifier(finalAbilities.dex);
  const bab = calculateBAB(classData.babProgression, level);
  const sizeMod = SIZE_MODIFIERS[race.size];

  const hp = Math.max(classData.hitDie + conMod, 1);

  const character: Character = {
    id: crypto.randomUUID(),
    name,
    race: raceName,
    alignment,
    size: race.size,
    classes: [{ className, level }],
    totalLevel: level,

    abilities: finalAbilities,
    hp: { current: hp, max: hp, temp: 0 },
    ac: {
      total: 10 + dexMod + sizeMod,
      touch: 10 + dexMod + sizeMod,
      flatFooted: 10 + sizeMod,
    },
    initiative: dexMod,
    speed: race.speed,

    attack: {
      baseAttackBonus: [bab],
      melee: bab + getModifier(finalAbilities.str) + sizeMod,
      ranged: bab + dexMod + sizeMod,
      grapple: bab + getModifier(finalAbilities.str) - sizeMod,
    },

    saves: {
      fortitude: {
        base: calculateBaseSave(classData.fortSave, level),
        ability: conMod,
        misc: 0,
      },
      reflex: {
        base: calculateBaseSave(classData.refSave, level),
        ability: dexMod,
        misc: 0,
      },
      will: {
        base: calculateBaseSave(classData.willSave, level),
        ability: getModifier(finalAbilities.wis),
        misc: 0,
      },
    },

    skills: [],
    feats: [],
    classFeatures: [],

    equipment: {
      weapons: [],
      gear: [],
    },

    conditions: [],
    notes: "",
    experience: 0,
  };

  return character;
}

// ── Level Up ────────────────────────────

export function levelUp(character: Character, className: string): Character {
  const classData = SRD_CLASSES.find((c) => c.name === className);
  if (!classData) throw new Error(`Classe "${className}" não encontrada`);

  const updated = { ...character };
  const existingClass = updated.classes.find((c) => c.className === className);

  if (existingClass) {
    existingClass.level++;
  } else {
    updated.classes.push({ className, level: 1 });
  }

  updated.totalLevel++;

  // Roll HP
  const hpRoll = rollDice(`1d${classData.hitDie}`);
  const conMod = getModifier(updated.abilities.con);
  const hpGain = Math.max(hpRoll.total + conMod, 1);
  updated.hp.max += hpGain;
  updated.hp.current += hpGain;

  // Recalculate BAB (sum across all classes)
  let totalBAB = 0;
  for (const cc of updated.classes) {
    const cd = SRD_CLASSES.find((c) => c.name === cc.className);
    if (cd) totalBAB += calculateBAB(cd.babProgression, cc.level);
  }

  const sizeMod = SIZE_MODIFIERS[updated.size];
  updated.attack.baseAttackBonus = getIterativeAttacks(totalBAB);
  updated.attack.melee = totalBAB + getModifier(updated.abilities.str) + sizeMod;
  updated.attack.ranged = totalBAB + getModifier(updated.abilities.dex) + sizeMod;
  updated.attack.grapple = totalBAB + getModifier(updated.abilities.str) - sizeMod;

  // Recalculate saves (take best from each class)
  let bestFort = 0, bestRef = 0, bestWill = 0;
  for (const cc of updated.classes) {
    const cd = SRD_CLASSES.find((c) => c.name === cc.className);
    if (!cd) continue;
    bestFort = Math.max(bestFort, calculateBaseSave(cd.fortSave, cc.level));
    bestRef = Math.max(bestRef, calculateBaseSave(cd.refSave, cc.level));
    bestWill = Math.max(bestWill, calculateBaseSave(cd.willSave, cc.level));
  }

  updated.saves.fortitude.base = bestFort;
  updated.saves.reflex.base = bestRef;
  updated.saves.will.base = bestWill;

  return updated;
}

// ── Iterative Attacks (BAB +6/+1, +11/+6/+1, etc.) ──

function getIterativeAttacks(bab: number): number[] {
  const attacks: number[] = [];
  let current = bab;
  while (current > 0) {
    attacks.push(current);
    current -= 5;
  }
  return attacks;
}

// ── Helpers ─────────────────────────────

export function getSkillPoints(character: Character): number {
  let total = 0;
  const intMod = getModifier(character.abilities.int);

  for (const cc of character.classes) {
    const cd = SRD_CLASSES.find((c) => c.name === cc.className);
    if (!cd) continue;

    if (cc.level === 1) {
      total += (cd.skillPoints + intMod) * 4; // 4x at level 1
    } else {
      total += (cd.skillPoints + intMod) * (cc.level - 1);
    }
  }

  // Human bonus
  if (character.race === "Human") {
    total += character.totalLevel;
  }

  return Math.max(total, character.totalLevel); // minimum 1 per level
}

export function getClassByName(name: string): ClassDefinition | undefined {
  return SRD_CLASSES.find((c) =>
    c.name.toLowerCase() === name.toLowerCase() ||
    c.namePtBr.toLowerCase() === name.toLowerCase()
  );
}

export function getRaceByName(name: string): RaceDefinition | undefined {
  return SRD_RACES.find((r) =>
    r.name.toLowerCase() === name.toLowerCase() ||
    r.namePtBr.toLowerCase() === name.toLowerCase()
  );
}
