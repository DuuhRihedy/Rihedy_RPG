// ═══════════════════════════════════════════
// VTT Engine — Dice Roller (D&D 3.5)
// ═══════════════════════════════════════════

import { DiceResult } from "./types";

/**
 * Parse and roll a dice expression.
 * Supports: "2d6", "1d20+5", "4d6kh3" (keep highest 3), "2d8+1d6+3"
 */
export function rollDice(expression: string): DiceResult {
  const normalized = expression.replace(/\s/g, "").toLowerCase();
  const parts = normalized.split(/(?=[+-])/);

  let allRolls: number[] = [];
  let totalModifier = 0;
  let total = 0;

  for (const part of parts) {
    const diceMatch = part.match(/^([+-]?)(\d+)d(\d+)(?:kh(\d+))?(?:kl(\d+))?$/);

    if (diceMatch) {
      const sign = diceMatch[1] === "-" ? -1 : 1;
      const count = parseInt(diceMatch[2]);
      const sides = parseInt(diceMatch[3]);
      const keepHighest = diceMatch[4] ? parseInt(diceMatch[4]) : undefined;
      const keepLowest = diceMatch[5] ? parseInt(diceMatch[5]) : undefined;

      let rolls: number[] = [];
      for (let i = 0; i < count; i++) {
        rolls.push(Math.floor(Math.random() * sides) + 1);
      }

      if (keepHighest) {
        rolls.sort((a, b) => b - a);
        rolls = rolls.slice(0, keepHighest);
      } else if (keepLowest) {
        rolls.sort((a, b) => a - b);
        rolls = rolls.slice(0, keepLowest);
      }

      allRolls.push(...rolls);
      total += sign * rolls.reduce((sum, r) => sum + r, 0);
    } else {
      const num = parseInt(part);
      if (!isNaN(num)) {
        totalModifier += num;
        total += num;
      }
    }
  }

  return {
    expression,
    rolls: allRolls,
    modifier: totalModifier,
    total,
  };
}

/**
 * Roll a d20 ability check / attack / save.
 */
export function rollD20(modifier: number = 0): DiceResult {
  const roll = Math.floor(Math.random() * 20) + 1;
  return {
    expression: `1d20${modifier >= 0 ? "+" : ""}${modifier}`,
    rolls: [roll],
    modifier,
    total: roll + modifier,
  };
}

/**
 * Roll ability scores (4d6 drop lowest).
 */
export function rollAbilityScores(): number[] {
  const scores: number[] = [];
  for (let i = 0; i < 6; i++) {
    const rolls: number[] = [];
    for (let j = 0; j < 4; j++) {
      rolls.push(Math.floor(Math.random() * 6) + 1);
    }
    rolls.sort((a, b) => b - a);
    scores.push(rolls[0] + rolls[1] + rolls[2]); // drop lowest
  }
  return scores;
}

/**
 * Calculate average damage for a dice expression.
 */
export function averageDamage(expression: string): number {
  const normalized = expression.replace(/\s/g, "").toLowerCase();
  const parts = normalized.split(/(?=[+-])/);
  let total = 0;

  for (const part of parts) {
    const diceMatch = part.match(/^([+-]?)(\d+)d(\d+)$/);
    if (diceMatch) {
      const sign = diceMatch[1] === "-" ? -1 : 1;
      const count = parseInt(diceMatch[2]);
      const sides = parseInt(diceMatch[3]);
      total += sign * count * ((sides + 1) / 2);
    } else {
      const num = parseInt(part);
      if (!isNaN(num)) total += num;
    }
  }

  return total;
}

/**
 * Parse a dice expression and return min/max/average.
 */
export function diceStats(expression: string): { min: number; max: number; avg: number } {
  const normalized = expression.replace(/\s/g, "").toLowerCase();
  const parts = normalized.split(/(?=[+-])/);
  let min = 0, max = 0, avg = 0;

  for (const part of parts) {
    const diceMatch = part.match(/^([+-]?)(\d+)d(\d+)$/);
    if (diceMatch) {
      const sign = diceMatch[1] === "-" ? -1 : 1;
      const count = parseInt(diceMatch[2]);
      const sides = parseInt(diceMatch[3]);
      min += sign * count * (sign > 0 ? 1 : sides);
      max += sign * count * (sign > 0 ? sides : 1);
      avg += sign * count * ((sides + 1) / 2);
    } else {
      const num = parseInt(part);
      if (!isNaN(num)) {
        min += num;
        max += num;
        avg += num;
      }
    }
  }

  return { min, max, avg: Math.round(avg * 10) / 10 };
}
