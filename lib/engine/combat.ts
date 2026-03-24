// ═══════════════════════════════════════════
// VTT Engine — Combat System (D&D 3.5)
// Gerencia turnos, iniciativa, ataques e dano
// ═══════════════════════════════════════════

import { AbilityScores, CreatureSize, SIZE_MODIFIERS, getModifier } from "./types";
import { rollDice, rollD20 } from "./dice";
import { rulesEngine } from "./rules-engine";
import { getConditionModifiers } from "./conditions";

// ── Combat Types ────────────────────────

export interface Combatant {
  id: string;
  name: string;
  isPC: boolean;

  hp: { current: number; max: number; temp: number };
  ac: { total: number; touch: number; flatFooted: number };
  abilities: AbilityScores;
  size: CreatureSize;

  bab: number;
  saves: { fort: number; ref: number; will: number };

  initiative: number;
  initiativeRoll?: number;

  conditions: string[];
  isActive: boolean;
}

export interface CombatAction {
  type: "attack" | "damage" | "save" | "skill" | "heal" | "condition_add" | "condition_remove" | "move" | "end_turn";
  actorId: string;
  targetId?: string;
  data: Record<string, unknown>;
}

export interface CombatLogEntry {
  round: number;
  turn: number;
  actorName: string;
  action: string;
  result: string;
  timestamp: Date;
}

// ── Combat Manager ──────────────────────

export class CombatManager {
  combatants: Combatant[] = [];
  round: number = 0;
  currentTurn: number = 0;
  log: CombatLogEntry[] = [];
  isActive: boolean = false;

  // ── Setup ───────────────────────────

  addCombatant(combatant: Combatant): void {
    this.combatants.push(combatant);
  }

  removeCombatant(id: string): void {
    this.combatants = this.combatants.filter((c) => c.id !== id);
  }

  getCombatant(id: string): Combatant | undefined {
    return this.combatants.find((c) => c.id === id);
  }

  // ── Initiative ──────────────────────

  rollInitiative(): void {
    for (const combatant of this.combatants) {
      const dexMod = getModifier(combatant.abilities.dex);
      const condMods = this.getConditionModifier(combatant, "initiative");
      const result = rulesEngine.rollInitiative(dexMod, condMods);
      combatant.initiativeRoll = result.total;
      combatant.initiative = result.total;
    }

    // Sort by initiative (highest first), break ties by DEX
    this.combatants.sort((a, b) => {
      if (b.initiative !== a.initiative) return b.initiative - a.initiative;
      return getModifier(b.abilities.dex) - getModifier(a.abilities.dex);
    });
  }

  startCombat(): void {
    this.rollInitiative();
    this.round = 1;
    this.currentTurn = 0;
    this.isActive = true;
    this.addLog("Sistema", "⚔️ Combate iniciado!", `Rodada ${this.round}`);
  }

  // ── Turn Management ─────────────────

  getCurrentCombatant(): Combatant | undefined {
    const active = this.combatants.filter((c) => c.isActive);
    return active[this.currentTurn % active.length];
  }

  nextTurn(): void {
    const activeCombatants = this.combatants.filter((c) => c.isActive);
    this.currentTurn++;

    if (this.currentTurn >= activeCombatants.length) {
      this.currentTurn = 0;
      this.round++;
      this.addLog("Sistema", "📜 Nova rodada", `Rodada ${this.round}`);
    }
  }

  endCombat(): void {
    this.isActive = false;
    this.addLog("Sistema", "🏁 Combate encerrado", `${this.round} rodadas`);
  }

  // ── Attack Resolution ───────────────

  resolveAttack(
    attackerId: string,
    targetId: string,
    weaponDamage: string = "1d8",
    isMelee: boolean = true,
    extraAttackBonus: number = 0,
    extraDamage: number = 0,
  ): { hit: boolean; critical: boolean; damage: number; naturalRoll: number; totalAttack: number } {
    const attacker = this.getCombatant(attackerId);
    const target = this.getCombatant(targetId);
    if (!attacker || !target) throw new Error("Combatente não encontrado");

    // Calculate attack bonus
    const abilityMod = isMelee
      ? getModifier(attacker.abilities.str)
      : getModifier(attacker.abilities.dex);
    const sizeMod = SIZE_MODIFIERS[attacker.size] || 0;
    const condAttackMod = this.getConditionModifier(attacker, "attack");

    const totalBonus = attacker.bab + abilityMod + sizeMod + extraAttackBonus + condAttackMod;
    const attackRoll = rollD20(totalBonus);
    const naturalRoll = attackRoll.rolls[0];

    // Determine target AC
    const targetAC = target.ac.total + this.getConditionModifier(target, "ac");

    // Check hit
    const hit = naturalRoll === 20 || (naturalRoll !== 1 && attackRoll.total >= targetAC);

    // Critical confirmation
    let critical = false;
    if (hit && naturalRoll === 20) {
      const confirmRoll = rollD20(totalBonus);
      critical = confirmRoll.total >= targetAC;
    }

    // Damage
    let damage = 0;
    if (hit) {
      const strDamage = isMelee ? getModifier(attacker.abilities.str) : 0;
      const damageResult = rollDice(weaponDamage);
      damage = Math.max(1, damageResult.total + strDamage + extraDamage);

      if (critical) damage *= 2; // simplified; should use weapon crit multiplier

      this.applyDamage(targetId, damage);
    }

    // Log
    const hitText = hit
      ? `⚔️ ACERTOU! ${naturalRoll} + ${totalBonus - naturalRoll + attacker.bab} = ${attackRoll.total} vs CA ${targetAC}${critical ? " 💥 CRÍTICO!" : ""} → ${damage} de dano`
      : `❌ Errou. ${naturalRoll} + ${totalBonus - naturalRoll + attacker.bab} = ${attackRoll.total} vs CA ${targetAC}`;

    this.addLog(attacker.name, `Ataque ${isMelee ? "corpo-a-corpo" : "à distância"} contra ${target.name}`, hitText);

    return { hit, critical, damage, naturalRoll, totalAttack: attackRoll.total };
  }

  // ── Damage & Healing ────────────────

  applyDamage(targetId: string, damage: number): void {
    const target = this.getCombatant(targetId);
    if (!target) return;

    // Absorb temp HP first
    if (target.hp.temp > 0) {
      const absorbed = Math.min(target.hp.temp, damage);
      target.hp.temp -= absorbed;
      damage -= absorbed;
    }

    target.hp.current = Math.max(target.hp.current - damage, -10);

    // Check death
    if (target.hp.current <= -10) {
      target.isActive = false;
      this.addLog("Sistema", `💀 ${target.name} morreu!`, `HP: ${target.hp.current}`);
    } else if (target.hp.current < 0) {
      this.addLog("Sistema", `🩸 ${target.name} caiu inconsciente`, `HP: ${target.hp.current}`);
    }
  }

  healDamage(targetId: string, healing: number): void {
    const target = this.getCombatant(targetId);
    if (!target) return;

    target.hp.current = Math.min(target.hp.current + healing, target.hp.max);
    this.addLog("Sistema", `💚 ${target.name} curado`, `+${healing} HP (${target.hp.current}/${target.hp.max})`);
  }

  // ── Saving Throws ───────────────────

  rollSavingThrow(
    combatantId: string,
    saveType: "fort" | "ref" | "will",
    dc: number,
  ): { success: boolean; total: number; naturalRoll: number } {
    const combatant = this.getCombatant(combatantId);
    if (!combatant) throw new Error("Combatente não encontrado");

    const abilityMap = { fort: "con", ref: "dex", will: "wis" } as const;
    const ability = abilityMap[saveType];
    const abilityMod = getModifier(combatant.abilities[ability]);
    const baseSave = combatant.saves[saveType];
    const condMod = this.getConditionModifier(combatant, "saves");

    const result = rollD20(baseSave + abilityMod + condMod);
    const naturalRoll = result.rolls[0];
    const success = naturalRoll === 20 || (naturalRoll !== 1 && result.total >= dc);

    const saveName = { fort: "Fortitude", ref: "Reflexo", will: "Vontade" }[saveType];
    const text = success
      ? `✅ ${saveName} passou! ${result.total} vs CD ${dc}`
      : `❌ ${saveName} falhou. ${result.total} vs CD ${dc}`;

    this.addLog(combatant.name, `Salvaguarda de ${saveName}`, text);

    return { success, total: result.total, naturalRoll };
  }

  // ── Conditions ──────────────────────

  addCondition(combatantId: string, condition: string): void {
    const combatant = this.getCombatant(combatantId);
    if (!combatant) return;
    if (!combatant.conditions.includes(condition)) {
      combatant.conditions.push(condition);
      this.addLog("Sistema", `⚠️ ${combatant.name} agora está ${condition}`, "");
    }
  }

  removeCondition(combatantId: string, condition: string): void {
    const combatant = this.getCombatant(combatantId);
    if (!combatant) return;
    combatant.conditions = combatant.conditions.filter((c) => c !== condition);
    this.addLog("Sistema", `✨ ${combatant.name} não está mais ${condition}`, "");
  }

  private getConditionModifier(combatant: Combatant, target: string): number {
    let total = 0;
    for (const cond of combatant.conditions) {
      const mods = getConditionModifiers(cond);
      for (const mod of mods) {
        if (mod.target === target) total += mod.value;
      }
    }
    return total;
  }

  // ── Combat Log ──────────────────────

  private addLog(actorName: string, action: string, result: string): void {
    this.log.push({
      round: this.round,
      turn: this.currentTurn,
      actorName,
      action,
      result,
      timestamp: new Date(),
    });
  }

  getLog(): CombatLogEntry[] {
    return this.log;
  }

  getLogByRound(round: number): CombatLogEntry[] {
    return this.log.filter((l) => l.round === round);
  }

  // ── State ───────────────────────────

  getCombatState() {
    return {
      round: this.round,
      currentTurn: this.currentTurn,
      currentCombatant: this.getCurrentCombatant()?.name || null,
      combatants: this.combatants.map((c) => ({
        name: c.name,
        initiative: c.initiative,
        hp: `${c.hp.current}/${c.hp.max}`,
        ac: c.ac.total,
        conditions: c.conditions,
        isActive: c.isActive,
        isPC: c.isPC,
      })),
      isActive: this.isActive,
    };
  }
}
