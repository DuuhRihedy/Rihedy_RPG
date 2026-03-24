// ═══════════════════════════════════════════
// VTT Engine — Barrel Export
// Ponto de entrada único para todo o engine
// ═══════════════════════════════════════════

// Types
export * from "./types";

// Core Systems
export * from "./dice";
export { RulesEngine, rulesEngine, calculateBAB, calculateBaseSave } from "./rules-engine";
export * from "./conditions";
export { CombatManager } from "./combat";
export type { Combatant, CombatAction, CombatLogEntry } from "./combat";

// Character System
export { createCharacter, levelUp, SRD_CLASSES, SRD_RACES, getSkillPoints, getClassByName, getRaceByName } from "./character";

// Generators
export { generateNpc } from "./generators/npc";
export { generateEncounter } from "./generators/encounter";
export { generateLoot } from "./generators/loot";

// Validators
export { validateFeatPrereqs, COMMON_FEATS } from "./validators/feat-prereqs";
export { validateClassChoice, validateMulticlass, calculateXpPenalty } from "./validators/class-rules";

// Compendium (server-only, uses Prisma)
// Import directly: import { searchCompendium } from "@/lib/engine/compendium"
