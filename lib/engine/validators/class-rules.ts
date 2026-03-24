// ═══════════════════════════════════════════
// VTT Engine — Class Rules Validator
// Valida regras de classe D&D 3.5
// ═══════════════════════════════════════════

import { Character, AbilityScores, getModifier } from "../types";
import { SRD_CLASSES } from "../character";

export interface ClassValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// ── Alignment Restrictions (D&D 3.5) ────

const CLASS_ALIGNMENT_RESTRICTIONS: Record<string, string[]> = {
  Barbarian: ["Lawful Good", "Lawful Neutral", "Lawful Evil"],  // Cannot be Lawful
  Bard: ["Lawful Good", "Lawful Neutral", "Lawful Evil"],       // Cannot be Lawful
  Monk: ["Neutral Good", "Chaotic Good", "True Neutral", "Chaotic Neutral", "Neutral Evil", "Chaotic Evil"], // Must be Lawful
  Paladin: ["Neutral Good", "Chaotic Good", "Lawful Neutral", "True Neutral", "Chaotic Neutral", "Lawful Evil", "Neutral Evil", "Chaotic Evil"], // Must be Lawful Good
  Druid: ["Lawful Good", "Chaotic Good", "Lawful Evil", "Chaotic Evil"], // Must have at least one Neutral component
};

// ── Multiclass XP Penalty Rules ─────────

/**
 * Calculate if a character has an XP penalty for unbalanced multiclassing.
 * D&D 3.5: If any two classes differ by more than 1 level, -20% XP per pair.
 */
export function calculateXpPenalty(character: Character): { penalty: number; reason: string | null } {
  if (character.classes.length <= 1) return { penalty: 0, reason: null };

  // Filter out favored class (highest level class for most races)
  const classes = [...character.classes];

  // Sort by level
  classes.sort((a, b) => b.level - a.level);

  let penaltyCount = 0;
  for (let i = 0; i < classes.length - 1; i++) {
    for (let j = i + 1; j < classes.length; j++) {
      if (Math.abs(classes[i].level - classes[j].level) > 1) {
        penaltyCount++;
      }
    }
  }

  if (penaltyCount === 0) return { penalty: 0, reason: null };

  return {
    penalty: penaltyCount * 20,
    reason: `Penalidade de ${penaltyCount * 20}% XP por classes desbalanceadas`,
  };
}

/**
 * Validate if a character can take a level in a given class.
 */
export function validateClassChoice(character: Character, className: string): ClassValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  const classData = SRD_CLASSES.find((c) => c.name === className);
  if (!classData) {
    return { valid: false, errors: [`Classe "${className}" não encontrada`], warnings: [] };
  }

  // Check alignment restrictions
  const forbidden = CLASS_ALIGNMENT_RESTRICTIONS[className];
  if (forbidden && forbidden.includes(character.alignment)) {
    errors.push(`${className} não pode ter alinhamento "${character.alignment}"`);
  }

  // Paladin special: ex-paladin rules
  if (className === "Paladin") {
    if (character.alignment !== "Lawful Good") {
      errors.push("Paladino deve ser Leal e Bom");
    }
  }

  // Monk special
  if (className === "Monk") {
    const isLawful = character.alignment.startsWith("Lawful");
    if (!isLawful) {
      errors.push("Monge deve ter alinhamento Leal");
    }
  }

  // Check XP penalty warning for multiclass
  if (character.classes.length > 0 && !character.classes.some((c) => c.className === className)) {
    const simulated = {
      ...character,
      classes: [...character.classes, { className, level: 1 }],
    };
    const xpPenalty = calculateXpPenalty(simulated);
    if (xpPenalty.penalty > 0) {
      warnings.push(xpPenalty.reason!);
    }
  }

  // Minimum ability score recommendations (not restrictions, just warnings)
  if (classData.spellcasting) {
    const castingAbility = classData.spellcasting.ability;
    const score = character.abilities[castingAbility];
    if (score < 11) {
      warnings.push(`${castingAbility.toUpperCase()} ${score} é baixo para conjuração. Recomendado: 11+`);
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Validate that a character's current multiclass setup is legal.
 */
export function validateMulticlass(character: Character): ClassValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check each class alignment
  for (const cc of character.classes) {
    const validation = validateClassChoice(character, cc.className);
    errors.push(...validation.errors);
    warnings.push(...validation.warnings);
  }

  // Check for conflicting classes
  const hasBarb = character.classes.some((c) => c.className === "Barbarian");
  const hasMonk = character.classes.some((c) => c.className === "Monk");
  const hasPaladin = character.classes.some((c) => c.className === "Paladin");

  if (hasBarb && hasMonk) {
    warnings.push("Bárbaro + Monge: alinhamentos incompatíveis na maioria dos casos");
  }
  if (hasPaladin && hasBarb) {
    warnings.push("Paladino + Bárbaro: alinhamentos incompatíveis");
  }

  // XP penalty
  const xpPenalty = calculateXpPenalty(character);
  if (xpPenalty.penalty > 0) {
    warnings.push(xpPenalty.reason!);
  }

  return { valid: errors.length === 0, errors, warnings };
}
