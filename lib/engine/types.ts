// ═══════════════════════════════════════════
// VTT Engine — Type Definitions (D&D 3.5)
// ═══════════════════════════════════════════

// ── Dice ────────────────────────────────
export type DiceExpression = string; // "2d6+3", "1d20", "4d6kh3"

export interface DiceResult {
  expression: string;
  rolls: number[];
  modifier: number;
  total: number;
}

// ── Ability Scores ──────────────────────
export type AbilityName = "str" | "dex" | "con" | "int" | "wis" | "cha";

export interface AbilityScores {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export function getModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

// ── Size ────────────────────────────────
export type CreatureSize = "Fine" | "Diminutive" | "Tiny" | "Small" | "Medium" | "Large" | "Huge" | "Gargantuan" | "Colossal";

export const SIZE_MODIFIERS: Record<CreatureSize, number> = {
  Fine: 8,
  Diminutive: 4,
  Tiny: 2,
  Small: 1,
  Medium: 0,
  Large: -1,
  Huge: -2,
  Gargantuan: -4,
  Colossal: -8,
};

// ── Skills ──────────────────────────────
export interface Skill {
  name: string;
  keyAbility: AbilityName;
  trained: boolean;
  armorCheckPenalty: boolean;
  ranks: number;
  miscBonus: number;
}

// ── Saves ───────────────────────────────
export interface SavingThrows {
  fortitude: { base: number; ability: number; misc: number };
  reflex: { base: number; ability: number; misc: number };
  will: { base: number; ability: number; misc: number };
}

// ── Attack ──────────────────────────────
export interface AttackBonus {
  baseAttackBonus: number[];
  melee: number;
  ranged: number;
  grapple: number;
}

// ── Class Progression ───────────────────
export type SaveProgression = "good" | "poor";

export interface ClassLevel {
  level: number;
  bab: number;
  fortSave: number;
  refSave: number;
  willSave: number;
  features: string[];
  spellsPerDay?: Record<number, number>; // spell level → slots
}

export interface ClassDefinition {
  name: string;
  namePtBr: string;
  hitDie: number; // d4=4, d6=6, d8=8, d10=10, d12=12
  skillPoints: number; // per level (before INT mod)
  classSkills: string[];
  babProgression: "full" | "3/4" | "1/2";
  fortSave: SaveProgression;
  refSave: SaveProgression;
  willSave: SaveProgression;
  levels: ClassLevel[];
  proficiencies: {
    armor: string[];
    weapons: string[];
    shields: string[];
  };
  spellcasting?: {
    type: "arcane" | "divine";
    ability: AbilityName;
    prepared: boolean;
    spellList: string;
  };
}

// ── Race ────────────────────────────────
export interface RaceDefinition {
  name: string;
  namePtBr: string;
  size: CreatureSize;
  speed: number;
  abilityModifiers: Partial<AbilityScores>;
  racialTraits: string[];
  favoredClass: string;
  languages: string[];
  bonusFeats?: string[];
  skillBonuses?: Record<string, number>;
}

// ── Feat ────────────────────────────────
export interface FeatPrerequisite {
  type: "ability" | "bab" | "feat" | "skill" | "class" | "level" | "casterLevel" | "spellLevel";
  value: string | number;
  parameter?: string; // e.g. skill name
}

export interface FeatDefinition {
  name: string;
  namePtBr: string;
  type: "general" | "fighter" | "metamagic" | "item_creation" | "epic" | "monster";
  prerequisites: FeatPrerequisite[];
  benefit: string;
  benefitPtBr: string;
  special?: string;
  repeatable: boolean;
}

// ── Spell ───────────────────────────────
export type SpellSchool = "Abjuration" | "Conjuration" | "Divination" | "Enchantment" | "Evocation" | "Illusion" | "Necromancy" | "Transmutation" | "Universal";

export interface SpellDefinition {
  name: string;
  namePtBr: string;
  school: SpellSchool;
  subschool?: string;
  descriptors: string[];
  classLevels: Record<string, number>; // className → level
  components: string[]; // V, S, M, F, DF, XP
  castingTime: string;
  range: string;
  target?: string;
  area?: string;
  effect?: string;
  duration: string;
  savingThrow: string;
  spellResistance: boolean;
  description: string;
  descriptionPtBr: string;
}

// ── Condition ───────────────────────────
export interface ConditionEffect {
  type: "modifier" | "restriction" | "special";
  target: string; // "ac", "attack", "saves", "skills", "speed", "actions"
  value?: number;
  description: string;
}

export interface ConditionDefinition {
  name: string;
  namePtBr: string;
  effects: ConditionEffect[];
  description: string;
  descriptionPtBr: string;
}

// ── Equipment ───────────────────────────
export type WeaponCategory = "simple" | "martial" | "exotic";
export type WeaponType = "melee" | "ranged";

export interface WeaponDefinition {
  name: string;
  namePtBr: string;
  category: WeaponCategory;
  type: WeaponType;
  cost: string;
  damage: {
    medium: string;
    small: string;
    critical: string;
  };
  range?: number; // in feet, for ranged
  weight: number;
  properties: string[];
}

export interface ArmorDefinition {
  name: string;
  namePtBr: string;
  type: "light" | "medium" | "heavy" | "shield";
  cost: string;
  acBonus: number;
  maxDex: number | null;
  armorCheckPenalty: number;
  arcaneSpellFailure: number;
  speed30: number;
  speed20: number;
  weight: number;
}

// ── Character ───────────────────────────
export interface CharacterClass {
  className: string;
  level: number;
}

export interface CharacterSpellSlots {
  [spellLevel: number]: { total: number; used: number };
}

export interface Character {
  id: string;
  name: string;
  race: string;
  alignment: string;
  size: CreatureSize;
  classes: CharacterClass[];
  totalLevel: number;

  abilities: AbilityScores;
  hp: { current: number; max: number; temp: number };
  ac: { total: number; touch: number; flatFooted: number };
  initiative: number;
  speed: number;

  attack: AttackBonus;
  saves: SavingThrows;
  skills: Skill[];
  feats: string[];
  classFeatures: string[];

  spellSlots?: CharacterSpellSlots;
  spellsPrepared?: string[];
  spellsKnown?: string[];

  equipment: {
    weapons: string[];
    armor?: string;
    shield?: string;
    gear: string[];
  };

  conditions: string[];
  notes: string;
  experience: number;
}

// ── Rules Engine ────────────────────────
export type RuleType =
  | "combat_attack"
  | "combat_damage"
  | "combat_initiative"
  | "saving_throw"
  | "skill_check"
  | "craft_item"
  | "craft_potion"
  | "craft_scroll"
  | "xp_calculation"
  | "encounter_cr"
  | "wealth_by_level"
  | "custom";

export interface RuleDefinition {
  id: string;
  type: RuleType;
  name: string;
  formula: string;
  constraints: string[];
  variables: string[];
  description: string;
  edition: "3.5" | "5e";
}

// ── Encounter ───────────────────────────
export interface EncounterCreature {
  name: string;
  cr: number;
  count: number;
  hp: number;
  initiative: number;
}

export type EncounterDifficulty = "easy" | "average" | "challenging" | "hard" | "overpowering";

export interface Encounter {
  name: string;
  partyLevel: number;
  partySize: number;
  difficulty: EncounterDifficulty;
  creatures: EncounterCreature[];
  totalCR: number;
  xpReward: number;
}

// ── Loot ────────────────────────────────
export interface LootEntry {
  name: string;
  type: "coins" | "gem" | "art" | "mundane" | "magic_item";
  value: string;
  quantity: number;
}

export interface LootTable {
  encounterLevel: number;
  entries: LootEntry[];
  totalValue: string;
}

// ── Compendium ──────────────────────────
export type CompendiumCategory = "class" | "race" | "feat" | "spell" | "condition" | "weapon" | "armor" | "magic_item" | "monster";

export interface CompendiumEntry<T = unknown> {
  id: string;
  category: CompendiumCategory;
  name: string;
  namePtBr: string;
  source: "srd" | "custom" | "imported";
  edition: "3.5" | "5e";
  data: T;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
