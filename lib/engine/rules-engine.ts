// ═══════════════════════════════════════════
// VTT Engine — Rules Engine (D&D 3.5)
// Interpretador de regras dinâmicas
// ═══════════════════════════════════════════

import { RuleDefinition, RuleType, AbilityScores, DiceResult, getModifier } from "./types";
import { rollDice, rollD20 } from "./dice";

// ── Built-in Rules (D&D 3.5 SRD) ──────

const BUILTIN_RULES: RuleDefinition[] = [
  {
    id: "attack_melee",
    type: "combat_attack",
    name: "Melee Attack Roll",
    formula: "d20 + bab + str_mod + size_mod",
    constraints: [],
    variables: ["bab", "str_mod", "size_mod"],
    description: "Roll d20 + BAB + STR modifier + size modifier vs target AC",
    edition: "3.5",
  },
  {
    id: "attack_ranged",
    type: "combat_attack",
    name: "Ranged Attack Roll",
    formula: "d20 + bab + dex_mod + size_mod + range_penalty",
    constraints: [],
    variables: ["bab", "dex_mod", "size_mod", "range_penalty"],
    description: "Roll d20 + BAB + DEX modifier + size + range penalty vs target AC",
    edition: "3.5",
  },
  {
    id: "initiative",
    type: "combat_initiative",
    name: "Initiative",
    formula: "d20 + dex_mod + misc",
    constraints: [],
    variables: ["dex_mod", "misc"],
    description: "Roll d20 + DEX modifier + miscellaneous bonuses",
    edition: "3.5",
  },
  {
    id: "saving_throw",
    type: "saving_throw",
    name: "Saving Throw",
    formula: "d20 + base_save + ability_mod + misc",
    constraints: [],
    variables: ["base_save", "ability_mod", "misc"],
    description: "Roll d20 + base save + ability modifier + misc vs DC",
    edition: "3.5",
  },
  {
    id: "skill_check",
    type: "skill_check",
    name: "Skill Check",
    formula: "d20 + ranks + ability_mod + misc",
    constraints: ["ranks <= level + 3"],
    variables: ["ranks", "ability_mod", "misc"],
    description: "Roll d20 + skill ranks + ability mod + misc vs DC",
    edition: "3.5",
  },
  {
    id: "craft_potion",
    type: "craft_potion",
    name: "Craft Potion Cost",
    formula: "spell_level * caster_level * 50",
    constraints: ["spell_level <= 3", "caster_level >= 3"],
    variables: ["spell_level", "caster_level"],
    description: "Base price for crafting a potion (gp). Requires Brew Potion feat.",
    edition: "3.5",
  },
  {
    id: "craft_scroll",
    type: "craft_scroll",
    name: "Craft Scroll Cost",
    formula: "spell_level * caster_level * 25",
    constraints: ["caster_level >= 1"],
    variables: ["spell_level", "caster_level"],
    description: "Base price for scribing a scroll (gp). Requires Scribe Scroll feat.",
    edition: "3.5",
  },
  {
    id: "craft_wondrous",
    type: "craft_item",
    name: "Craft Wondrous Item Cost",
    formula: "base_price / 2",
    constraints: ["caster_level >= 3"],
    variables: ["base_price", "caster_level"],
    description: "Crafting cost is half the market price. Requires Craft Wondrous Item feat.",
    edition: "3.5",
  },
  {
    id: "xp_by_cr",
    type: "xp_calculation",
    name: "XP Reward by CR",
    formula: "xp_table[cr][party_level]",
    constraints: [],
    variables: ["cr", "party_level"],
    description: "XP reward based on CR and party level from SRD table",
    edition: "3.5",
  },
  {
    id: "wealth_by_level",
    type: "wealth_by_level",
    name: "Wealth by Level (gp)",
    formula: "wealth_table[level]",
    constraints: [],
    variables: ["level"],
    description: "Expected character wealth at a given level",
    edition: "3.5",
  },
];

// ── XP Table (D&D 3.5 SRD) ────────────

const XP_TABLE: Record<number, Record<number, number>> = {
  // CR: { partyLevel: xp }
  1: { 1: 300, 2: 300, 3: 225, 4: 150, 5: 75 },
  2: { 1: 600, 2: 300, 3: 300, 4: 225, 5: 150, 6: 75 },
  3: { 1: 900, 2: 600, 3: 300, 4: 300, 5: 225, 6: 150, 7: 75 },
  4: { 2: 900, 3: 600, 4: 300, 5: 300, 6: 225, 7: 150, 8: 75 },
  5: { 3: 900, 4: 600, 5: 300, 6: 300, 7: 225, 8: 150, 9: 75 },
  6: { 4: 900, 5: 600, 6: 300, 7: 300, 8: 225, 9: 150, 10: 75 },
  7: { 5: 900, 6: 600, 7: 300, 8: 300, 9: 225, 10: 150, 11: 75 },
  8: { 6: 900, 7: 600, 8: 300, 9: 300, 10: 225, 11: 150, 12: 75 },
  9: { 7: 900, 8: 600, 9: 300, 10: 300, 11: 225, 12: 150, 13: 75 },
  10: { 8: 900, 9: 600, 10: 300, 11: 300, 12: 225, 13: 150, 14: 75 },
};

// ── Wealth by Level (D&D 3.5 SRD) ─────

const WEALTH_BY_LEVEL: Record<number, number> = {
  1: 0,
  2: 900,
  3: 2700,
  4: 5400,
  5: 9000,
  6: 13000,
  7: 19000,
  8: 27000,
  9: 36000,
  10: 49000,
  11: 66000,
  12: 88000,
  13: 110000,
  14: 150000,
  15: 200000,
  16: 260000,
  17: 340000,
  18: 440000,
  19: 580000,
  20: 760000,
};

// ── BAB Progressions ──────────────────

export function calculateBAB(progression: "full" | "3/4" | "1/2", level: number): number {
  switch (progression) {
    case "full": return level;
    case "3/4": return Math.floor(level * 3 / 4);
    case "1/2": return Math.floor(level / 2);
  }
}

// ── Save Progressions ─────────────────

export function calculateBaseSave(progression: "good" | "poor", level: number): number {
  if (progression === "good") return 2 + Math.floor(level / 2);
  return Math.floor(level / 3);
}

// ── Rules Engine Class ────────────────

export class RulesEngine {
  private rules: Map<string, RuleDefinition> = new Map();
  private customRules: Map<string, RuleDefinition> = new Map();

  constructor() {
    for (const rule of BUILTIN_RULES) {
      this.rules.set(rule.id, rule);
    }
  }

  addRule(rule: RuleDefinition): void {
    this.customRules.set(rule.id, rule);
  }

  getRule(id: string): RuleDefinition | undefined {
    return this.customRules.get(id) || this.rules.get(id);
  }

  getAllRules(): RuleDefinition[] {
    const all = new Map([...this.rules, ...this.customRules]);
    return Array.from(all.values());
  }

  getRulesByType(type: RuleType): RuleDefinition[] {
    return this.getAllRules().filter((r) => r.type === type);
  }

  // ── Combat Rolls ──────────────────

  rollAttack(bab: number, abilityMod: number, sizeMod: number = 0, miscMod: number = 0): DiceResult & { isCriticalThreat: boolean } {
    const result = rollD20(bab + abilityMod + sizeMod + miscMod);
    const naturalRoll = result.rolls[0];
    return {
      ...result,
      isCriticalThreat: naturalRoll === 20,
    };
  }

  rollDamage(expression: string, bonusDamage: number = 0): DiceResult {
    const damageExpr = bonusDamage !== 0
      ? `${expression}${bonusDamage >= 0 ? "+" : ""}${bonusDamage}`
      : expression;
    return rollDice(damageExpr);
  }

  rollInitiative(dexMod: number, miscBonus: number = 0): DiceResult {
    return rollD20(dexMod + miscBonus);
  }

  // ── Saving Throws ─────────────────

  rollSave(baseSave: number, abilityMod: number, miscMod: number = 0): DiceResult {
    return rollD20(baseSave + abilityMod + miscMod);
  }

  // ── Skill Checks ──────────────────

  rollSkillCheck(ranks: number, abilityMod: number, miscMod: number = 0): DiceResult {
    return rollD20(ranks + abilityMod + miscMod);
  }

  // ── Crafting ──────────────────────

  calculateCraftCost(type: "potion" | "scroll" | "wondrous", spellLevel: number, casterLevel: number, basePrice?: number): number {
    switch (type) {
      case "potion":
        return Math.max(spellLevel, 0.5) * casterLevel * 50;
      case "scroll":
        return Math.max(spellLevel, 0.5) * casterLevel * 25;
      case "wondrous":
        return (basePrice || 0) / 2;
    }
  }

  // ── XP ────────────────────────────

  getXpReward(cr: number, partyLevel: number): number {
    const crTable = XP_TABLE[cr];
    if (!crTable) return 0;
    return crTable[partyLevel] || 0;
  }

  getXpForLevel(level: number): number {
    return (level - 1) * 1000 * level / 2;
  }

  // ── Wealth ────────────────────────

  getWealthByLevel(level: number): number {
    return WEALTH_BY_LEVEL[level] || 0;
  }

  // ── AC Calculation ────────────────

  calculateAC(
    baseAC: number = 10,
    armorBonus: number = 0,
    shieldBonus: number = 0,
    dexMod: number = 0,
    sizeMod: number = 0,
    naturalArmor: number = 0,
    deflection: number = 0,
    miscMod: number = 0,
    maxDex: number | null = null,
  ) {
    const effectiveDex = maxDex !== null ? Math.min(dexMod, maxDex) : dexMod;

    return {
      total: baseAC + armorBonus + shieldBonus + effectiveDex + sizeMod + naturalArmor + deflection + miscMod,
      touch: baseAC + effectiveDex + sizeMod + deflection + miscMod,
      flatFooted: baseAC + armorBonus + shieldBonus + sizeMod + naturalArmor + deflection + miscMod,
    };
  }

  // ── Evaluate Formula ──────────────

  evaluateFormula(formula: string, variables: Record<string, number>): number {
    let expr = formula;
    for (const [key, value] of Object.entries(variables)) {
      expr = expr.replace(new RegExp(`\\b${key}\\b`, "g"), String(value));
    }

    // Safe math evaluation (no eval)
    expr = expr.replace(/\s/g, "");
    return this.safeMathEval(expr);
  }

  private safeMathEval(expr: string): number {
    const tokens = expr.match(/(\d+\.?\d*|[+\-*/()])/g);
    if (!tokens) return 0;

    let pos = 0;

    const parseNumber = (): number => {
      if (tokens[pos] === "(") {
        pos++; // skip (
        const val = parseExpression();
        pos++; // skip )
        return val;
      }
      return parseFloat(tokens[pos++]);
    };

    const parseFactor = (): number => {
      let val = parseNumber();
      while (pos < tokens.length && (tokens[pos] === "*" || tokens[pos] === "/")) {
        const op = tokens[pos++];
        const right = parseNumber();
        val = op === "*" ? val * right : val / right;
      }
      return val;
    };

    const parseExpression = (): number => {
      let val = parseFactor();
      while (pos < tokens.length && (tokens[pos] === "+" || tokens[pos] === "-")) {
        const op = tokens[pos++];
        const right = parseFactor();
        val = op === "+" ? val + right : val - right;
      }
      return val;
    };

    return parseExpression();
  }
}

// ── Singleton ──────────────────────────
export const rulesEngine = new RulesEngine();
