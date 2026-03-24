// ═══════════════════════════════════════════
// VTT Engine — Import/Export System
// Importar e exportar dados customizados
// ═══════════════════════════════════════════

import { ClassDefinition, RaceDefinition, FeatDefinition, SpellDefinition, CompendiumCategory } from "./types";

// ── Import Schemas ──────────────────────

export interface ImportPayload {
  type: CompendiumCategory;
  source: "custom" | "imported";
  edition: "3.5" | "5e";
  data: unknown;
}

export interface ImportResult {
  success: boolean;
  imported: number;
  errors: string[];
  warnings: string[];
}

// ── Validation Schemas ──────────────────

const REQUIRED_FIELDS: Record<string, string[]> = {
  class: ["name", "hitDie", "babProgression", "fortSave", "refSave", "willSave"],
  race: ["name", "size", "speed"],
  feat: ["name", "type", "benefit"],
  spell: ["name", "school", "classLevels"],
  weapon: ["name", "category", "type", "damage"],
  armor: ["name", "type", "acBonus"],
  condition: ["name", "effects"],
  monster: ["name"],
  magic_item: ["name"],
};

/**
 * Validate an import payload structure.
 */
export function validateImport(payload: ImportPayload): ImportResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!payload.type) errors.push("Tipo de conteúdo é obrigatório");
  if (!payload.data) errors.push("Dados são obrigatórios");
  if (!["3.5", "5e"].includes(payload.edition)) errors.push("Edição deve ser '3.5' ou '5e'");

  const requiredFields = REQUIRED_FIELDS[payload.type];
  if (!requiredFields) {
    errors.push(`Tipo "${payload.type}" não reconhecido`);
    return { success: false, imported: 0, errors, warnings };
  }

  // Check if data is array or single
  const items = Array.isArray(payload.data) ? payload.data : [payload.data];

  let validCount = 0;
  for (let i = 0; i < items.length; i++) {
    const item = items[i] as Record<string, unknown>;
    const itemErrors: string[] = [];

    for (const field of requiredFields) {
      if (!item[field] && item[field] !== 0) {
        itemErrors.push(`Campo "${field}" ausente no item ${i + 1}`);
      }
    }

    if (itemErrors.length > 0) {
      errors.push(...itemErrors);
    } else {
      validCount++;
    }
  }

  // Warnings
  if (payload.source === "imported") {
    warnings.push("Conteúdo importado: verifique compatibilidade com regras existentes");
  }

  return {
    success: errors.length === 0,
    imported: validCount,
    errors,
    warnings,
  };
}

/**
 * Export character data to JSON.
 */
export function exportCharacter(character: unknown): string {
  return JSON.stringify({
    version: "1.0",
    type: "character",
    exportDate: new Date().toISOString(),
    data: character,
  }, null, 2);
}

/**
 * Export encounter data to JSON.
 */
export function exportEncounter(encounter: unknown): string {
  return JSON.stringify({
    version: "1.0",
    type: "encounter",
    exportDate: new Date().toISOString(),
    data: encounter,
  }, null, 2);
}

/**
 * Parse imported JSON safely.
 */
export function parseImportJson(jsonString: string): ImportPayload | null {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.version && parsed.type && parsed.data) {
      return {
        type: parsed.type,
        source: "imported",
        edition: parsed.edition || "3.5",
        data: parsed.data,
      };
    }
    return null;
  } catch {
    return null;
  }
}
