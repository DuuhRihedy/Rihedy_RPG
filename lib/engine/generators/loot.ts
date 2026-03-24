// ═══════════════════════════════════════════
// VTT Engine — Loot Generator (D&D 3.5)
// Gera tesouro por nível de encontro
// ═══════════════════════════════════════════

import { LootEntry, LootTable } from "../types";

// ── Treasure by Encounter Level (D&D 3.5 SRD) ───

const TREASURE_VALUE_GP: Record<number, number> = {
  1: 300, 2: 600, 3: 900, 4: 1200, 5: 1600,
  6: 2000, 7: 2600, 8: 3400, 9: 4500, 10: 5800,
  11: 7500, 12: 9800, 13: 13000, 14: 17000, 15: 22000,
  16: 28000, 17: 36000, 18: 47000, 19: 61000, 20: 80000,
};

// ── Gem Tables ────────────────────────────

const GEMS: Array<{ name: string; value: number }> = [
  { name: "Ágata", value: 10 },
  { name: "Turquesa", value: 10 },
  { name: "Ônix", value: 50 },
  { name: "Jaspe", value: 50 },
  { name: "Ametista", value: 100 },
  { name: "Jade", value: 100 },
  { name: "Pérola", value: 100 },
  { name: "Topázio", value: 500 },
  { name: "Safira Estrela Negra", value: 1000 },
  { name: "Esmeralda", value: 1000 },
  { name: "Rubi", value: 5000 },
  { name: "Diamante", value: 5000 },
];

const ART_OBJECTS: Array<{ name: string; value: number }> = [
  { name: "Estatueta de prata", value: 25 },
  { name: "Bracelete de osso esculpido", value: 25 },
  { name: "Cálice de ouro", value: 100 },
  { name: "Tapete de seda", value: 100 },
  { name: "Anel de ouro com safira", value: 250 },
  { name: "Adaga cerimonial", value: 250 },
  { name: "Colar de pérolas", value: 500 },
  { name: "Pintura rara", value: 500 },
  { name: "Coroa de platina", value: 1000 },
  { name: "Cetro com gemas", value: 2500 },
  { name: "Harpa de ouro", value: 5000 },
];

const MUNDANE_ITEMS: string[] = [
  "Corda de seda (15m)", "Mochila", "Cantil de prata",
  "Manto de viagem", "Baú de ferro", "Espelho de prata",
  "Luneta", "Kit de escalada", "Tochas (10)",
  "Algemas de ferro", "Tinta e pena", "Tenda",
];

const MAGIC_ITEMS: Array<{ name: string; value: number; minLevel: number }> = [
  { name: "Poção de Curar Ferimentos Leves", value: 50, minLevel: 1 },
  { name: "Pergaminho de Mísseis Mágicos", value: 25, minLevel: 1 },
  { name: "Poção de Escudo de Fé +2", value: 50, minLevel: 2 },
  { name: "Varinha de Detectar Magia (50 cargas)", value: 750, minLevel: 3 },
  { name: "Poção de Invisibilidade", value: 300, minLevel: 4 },
  { name: "Anel de Proteção +1", value: 2000, minLevel: 5 },
  { name: "Arma +1", value: 2000, minLevel: 5 },
  { name: "Armadura +1", value: 1000, minLevel: 5 },
  { name: "Capa da Resistência +1", value: 1000, minLevel: 5 },
  { name: "Botas de Velocidade", value: 12000, minLevel: 8 },
  { name: "Arma +2", value: 8000, minLevel: 8 },
  { name: "Anel de Proteção +2", value: 8000, minLevel: 8 },
  { name: "Capa da Resistência +2", value: 4000, minLevel: 7 },
  { name: "Pérola do Poder (1° nível)", value: 1000, minLevel: 5 },
  { name: "Amuleto de Saúde Natural +1", value: 2000, minLevel: 5 },
  { name: "Luvas de Destreza +2", value: 4000, minLevel: 6 },
  { name: "Cinturão de Força de Gigante +2", value: 4000, minLevel: 6 },
  { name: "Coroa de Carisma +2", value: 4000, minLevel: 6 },
  { name: "Amuleto de Armadura Natural +2", value: 8000, minLevel: 8 },
  { name: "Arma +3", value: 18000, minLevel: 10 },
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate loot for an encounter level.
 */
export function generateLoot(encounterLevel: number): LootTable {
  const totalBudget = TREASURE_VALUE_GP[encounterLevel] || encounterLevel * 300;
  const entries: LootEntry[] = [];
  let remaining = totalBudget;

  // 1. Coins (30-50% of total)
  const coinBudget = Math.floor(remaining * (0.3 + Math.random() * 0.2));
  if (coinBudget > 0) {
    if (encounterLevel <= 4) {
      entries.push({ name: "Moedas de ouro (gp)", type: "coins", value: `${coinBudget} gp`, quantity: coinBudget });
    } else if (encounterLevel <= 10) {
      const pp = Math.floor(coinBudget / 10);
      const gp = coinBudget - pp * 10;
      if (pp > 0) entries.push({ name: "Moedas de platina (pp)", type: "coins", value: `${pp} pp`, quantity: pp });
      if (gp > 0) entries.push({ name: "Moedas de ouro (gp)", type: "coins", value: `${gp} gp`, quantity: gp });
    } else {
      entries.push({ name: "Moedas de platina (pp)", type: "coins", value: `${Math.floor(coinBudget / 10)} pp`, quantity: Math.floor(coinBudget / 10) });
    }
    remaining -= coinBudget;
  }

  // 2. Gems (10-20%)
  const gemBudget = Math.floor(remaining * (0.1 + Math.random() * 0.1));
  if (gemBudget > 50) {
    const affordableGems = GEMS.filter((g) => g.value <= gemBudget);
    if (affordableGems.length > 0) {
      const gem = randomFrom(affordableGems);
      const count = Math.min(Math.floor(gemBudget / gem.value), 5);
      if (count > 0) {
        entries.push({ name: gem.name, type: "gem", value: `${gem.value} gp`, quantity: count });
        remaining -= gem.value * count;
      }
    }
  }

  // 3. Art objects (10-15%)
  const artBudget = Math.floor(remaining * (0.1 + Math.random() * 0.05));
  if (artBudget > 25) {
    const affordableArt = ART_OBJECTS.filter((a) => a.value <= artBudget);
    if (affordableArt.length > 0) {
      const art = randomFrom(affordableArt);
      entries.push({ name: art.name, type: "art", value: `${art.value} gp`, quantity: 1 });
      remaining -= art.value;
    }
  }

  // 4. Mundane items (5-10%)
  if (Math.random() > 0.5) {
    const mundane = randomFrom(MUNDANE_ITEMS);
    entries.push({ name: mundane, type: "mundane", value: "—", quantity: 1 });
  }

  // 5. Magic items (remaining budget, if level >= 3)
  if (encounterLevel >= 3 && remaining > 50) {
    const affordableMagic = MAGIC_ITEMS.filter((m) => m.value <= remaining && m.minLevel <= encounterLevel);
    if (affordableMagic.length > 0) {
      const item = randomFrom(affordableMagic);
      entries.push({ name: item.name, type: "magic_item", value: `${item.value} gp`, quantity: 1 });
      remaining -= item.value;
    }
  }

  return {
    encounterLevel,
    entries,
    totalValue: `${totalBudget} gp`,
  };
}
