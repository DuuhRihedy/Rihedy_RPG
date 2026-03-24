// ═══════════════════════════════════════════
// VTT Engine — Conditions System (D&D 3.5)
// Condições do SRD com efeitos mecânicos
// ═══════════════════════════════════════════

import { ConditionDefinition } from "./types";

export const CONDITIONS_35: ConditionDefinition[] = [
  {
    name: "Blinded",
    namePtBr: "Cego",
    effects: [
      { type: "modifier", target: "ac", value: -2, description: "Perde bônus de Destreza na AC" },
      { type: "modifier", target: "attack", value: -2, description: "-2 em rolagens de ataque" },
      { type: "restriction", target: "skills", description: "Falha automática em testes que dependem de visão" },
      { type: "special", target: "movement", description: "Metade da velocidade de movimento" },
      { type: "modifier", target: "attack", value: -4, description: "Oponentes têm 50% de chance de acerto errado" },
    ],
    description: "The character cannot see. Takes -2 AC, loses Dex bonus to AC, moves at half speed.",
    descriptionPtBr: "O personagem não pode ver. -2 na CA, perde bônus de DES na CA, move-se com metade da velocidade.",
  },
  {
    name: "Confused",
    namePtBr: "Confuso",
    effects: [
      { type: "restriction", target: "actions", description: "Ações determinadas aleatoriamente a cada turno" },
    ],
    description: "Actions determined randomly each round.",
    descriptionPtBr: "Ações determinadas aleatoriamente a cada rodada.",
  },
  {
    name: "Cowering",
    namePtBr: "Encolhido",
    effects: [
      { type: "modifier", target: "ac", value: -2, description: "-2 na CA" },
      { type: "restriction", target: "ac", description: "Perde bônus de Destreza na CA" },
    ],
    description: "Frozen in fear, loses Dex bonus to AC, -2 AC.",
    descriptionPtBr: "Paralisado de medo, perde bônus de DES na CA, -2 na CA.",
  },
  {
    name: "Dazed",
    namePtBr: "Atordoado",
    effects: [
      { type: "restriction", target: "actions", description: "Não pode agir normalmente" },
    ],
    description: "Can take no actions.",
    descriptionPtBr: "Não pode realizar ações.",
  },
  {
    name: "Dazzled",
    namePtBr: "Ofuscado",
    effects: [
      { type: "modifier", target: "attack", value: -1, description: "-1 em ataques" },
      { type: "modifier", target: "skills", value: -1, description: "-1 em testes baseados em visão" },
    ],
    description: "-1 on attack rolls, Search checks, and Spot checks.",
    descriptionPtBr: "-1 em ataques, testes de Procurar e Observar.",
  },
  {
    name: "Deafened",
    namePtBr: "Surdo",
    effects: [
      { type: "modifier", target: "initiative", value: -4, description: "-4 na iniciativa" },
      { type: "special", target: "spells", description: "20% de chance de falha em magias com componente verbal" },
    ],
    description: "-4 initiative, 20% spell failure for spells with verbal components.",
    descriptionPtBr: "-4 na iniciativa, 20% de chance de falha em magias com componente verbal.",
  },
  {
    name: "Entangled",
    namePtBr: "Enredado",
    effects: [
      { type: "modifier", target: "attack", value: -2, description: "-2 em ataques" },
      { type: "modifier", target: "dex", value: -4, description: "-4 em Destreza" },
      { type: "special", target: "movement", description: "Metade da velocidade" },
      { type: "special", target: "spells", description: "Teste de Concentração para conjurar" },
    ],
    description: "-2 attack, -4 Dex, half speed, Concentration check to cast spells.",
    descriptionPtBr: "-2 em ataques, -4 em DES, metade da velocidade, teste de Concentração para conjurar.",
  },
  {
    name: "Exhausted",
    namePtBr: "Exausto",
    effects: [
      { type: "modifier", target: "str", value: -6, description: "-6 em Força" },
      { type: "modifier", target: "dex", value: -6, description: "-6 em Destreza" },
      { type: "special", target: "movement", description: "Metade da velocidade" },
    ],
    description: "-6 Str, -6 Dex, half speed. 1 hour rest → Fatigued.",
    descriptionPtBr: "-6 em FOR, -6 em DES, metade da velocidade. 1 hora de descanso → Fatigado.",
  },
  {
    name: "Fascinated",
    namePtBr: "Fascinado",
    effects: [
      { type: "modifier", target: "skills", value: -4, description: "-4 em testes de reação (como Observar)" },
      { type: "restriction", target: "actions", description: "Fica parado observando a fonte" },
    ],
    description: "Stands or sits quietly, -4 on skill checks made as reactions.",
    descriptionPtBr: "Fica parado observando a fonte, -4 em testes de reação.",
  },
  {
    name: "Fatigued",
    namePtBr: "Fatigado",
    effects: [
      { type: "modifier", target: "str", value: -2, description: "-2 em Força" },
      { type: "modifier", target: "dex", value: -2, description: "-2 em Destreza" },
      { type: "restriction", target: "actions", description: "Não pode correr nem carregar" },
    ],
    description: "-2 Str, -2 Dex, can't run or charge.",
    descriptionPtBr: "-2 em FOR, -2 em DES, não pode correr ou carregar.",
  },
  {
    name: "Flat-Footed",
    namePtBr: "Surpreendido",
    effects: [
      { type: "restriction", target: "ac", description: "Perde bônus de Destreza na CA" },
    ],
    description: "Loses Dex bonus to AC. Cannot make attacks of opportunity.",
    descriptionPtBr: "Perde bônus de DES na CA. Não pode fazer ataques de oportunidade.",
  },
  {
    name: "Frightened",
    namePtBr: "Amedrontado",
    effects: [
      { type: "modifier", target: "attack", value: -2, description: "-2 em ataques" },
      { type: "modifier", target: "saves", value: -2, description: "-2 em salvaguardas" },
      { type: "modifier", target: "skills", value: -2, description: "-2 em testes de perícia" },
      { type: "special", target: "movement", description: "Deve fugir da fonte do medo" },
    ],
    description: "-2 attacks, saves, skill checks. Must flee from source.",
    descriptionPtBr: "-2 em ataques, salvaguardas e perícias. Deve fugir da fonte.",
  },
  {
    name: "Grappling",
    namePtBr: "Agarrado",
    effects: [
      { type: "restriction", target: "ac", description: "Perde bônus de Destreza na CA (exceto contra quem agarra)" },
      { type: "modifier", target: "attack", value: -4, description: "-4 em ataques contra outros alvos" },
    ],
    description: "Loses Dex bonus to AC except vs grappler. -4 on attacks vs others.",
    descriptionPtBr: "Perde bônus de DES na CA. -4 em ataques contra outros que não o agarrador.",
  },
  {
    name: "Helpless",
    namePtBr: "Indefeso",
    effects: [
      { type: "special", target: "ac", description: "Destreza efetiva de 0 (-5 mod)" },
      { type: "special", target: "combat", description: "Ataques corpo-a-corpo têm +4 e podem dar golpe de misericórdia" },
    ],
    description: "Dex = 0. Melee attacks get +4. Can be coup de graced.",
    descriptionPtBr: "DES = 0. Ataques corpo-a-corpo recebem +4. Pode sofrer golpe de misericórdia.",
  },
  {
    name: "Invisible",
    namePtBr: "Invisível",
    effects: [
      { type: "modifier", target: "attack", value: 2, description: "+2 em ataques (alvo perde DES na CA)" },
      { type: "special", target: "stealth", description: "+20 em testes de Furtividade se parado, +40 se imóvel" },
    ],
    description: "+2 attack, +20 Hide (moving) or +40 (stationary).",
    descriptionPtBr: "+2 em ataques, +20 em Furtividade (movendo) ou +40 (parado).",
  },
  {
    name: "Nauseated",
    namePtBr: "Nauseado",
    effects: [
      { type: "restriction", target: "actions", description: "Só pode fazer uma ação de movimento por turno" },
    ],
    description: "Can only take a single move action per turn.",
    descriptionPtBr: "Pode apenas realizar uma ação de movimento por turno.",
  },
  {
    name: "Panicked",
    namePtBr: "Em Pânico",
    effects: [
      { type: "modifier", target: "saves", value: -2, description: "-2 em salvaguardas" },
      { type: "modifier", target: "skills", value: -2, description: "-2 em perícias" },
      { type: "special", target: "movement", description: "Deve fugir; se encurralado, se encolhe" },
      { type: "restriction", target: "equipment", description: "Larga o que estiver segurando" },
    ],
    description: "-2 saves, -2 skills, drops held items, flees.",
    descriptionPtBr: "-2 em salvaguardas e perícias, larga itens, foge.",
  },
  {
    name: "Paralyzed",
    namePtBr: "Paralisado",
    effects: [
      { type: "special", target: "ac", description: "Destreza e Força efetivas de 0" },
      { type: "restriction", target: "actions", description: "Não pode se mover nem agir" },
      { type: "special", target: "combat", description: "Indefeso" },
    ],
    description: "Str and Dex = 0. Helpless. Cannot move or act.",
    descriptionPtBr: "FOR e DES = 0. Indefeso. Não pode mover nem agir.",
  },
  {
    name: "Prone",
    namePtBr: "Caído",
    effects: [
      { type: "modifier", target: "attack_melee", value: -4, description: "-4 em ataques corpo-a-corpo" },
      { type: "modifier", target: "ac_melee", value: -4, description: "-4 na CA contra ataques corpo-a-corpo" },
      { type: "modifier", target: "ac_ranged", value: 4, description: "+4 na CA contra ataques à distância" },
    ],
    description: "-4 melee attacks, -4 AC vs melee, +4 AC vs ranged.",
    descriptionPtBr: "-4 em ataques corpo-a-corpo, -4 CA vs corpo-a-corpo, +4 CA vs distância.",
  },
  {
    name: "Shaken",
    namePtBr: "Abalado",
    effects: [
      { type: "modifier", target: "attack", value: -2, description: "-2 em ataques" },
      { type: "modifier", target: "saves", value: -2, description: "-2 em salvaguardas" },
      { type: "modifier", target: "skills", value: -2, description: "-2 em testes de perícia" },
    ],
    description: "-2 attacks, saves, skill checks.",
    descriptionPtBr: "-2 em ataques, salvaguardas e perícias.",
  },
  {
    name: "Sickened",
    namePtBr: "Enjoado",
    effects: [
      { type: "modifier", target: "attack", value: -2, description: "-2 em ataques" },
      { type: "modifier", target: "damage", value: -2, description: "-2 no dano" },
      { type: "modifier", target: "saves", value: -2, description: "-2 em salvaguardas" },
      { type: "modifier", target: "skills", value: -2, description: "-2 em perícias" },
    ],
    description: "-2 attacks, damage, saves, skill checks, ability checks.",
    descriptionPtBr: "-2 em ataques, dano, salvaguardas, perícias e testes de habilidade.",
  },
  {
    name: "Stunned",
    namePtBr: "Aturdido",
    effects: [
      { type: "restriction", target: "ac", description: "Perde bônus de Destreza na CA" },
      { type: "modifier", target: "ac", value: -2, description: "-2 na CA adicional" },
      { type: "restriction", target: "actions", description: "Larga tudo, não pode agir" },
    ],
    description: "Drops everything, can't act, -2 AC, loses Dex bonus to AC.",
    descriptionPtBr: "Larga tudo, não pode agir, -2 na CA, perde bônus de DES na CA.",
  },
];

// ── Helper Functions ──────────────────

export function getCondition(name: string): ConditionDefinition | undefined {
  return CONDITIONS_35.find(
    (c) => c.name.toLowerCase() === name.toLowerCase() || c.namePtBr.toLowerCase() === name.toLowerCase()
  );
}

export function getConditionModifiers(conditionName: string): { target: string; value: number }[] {
  const condition = getCondition(conditionName);
  if (!condition) return [];

  return condition.effects
    .filter((e) => e.type === "modifier" && e.value !== undefined)
    .map((e) => ({ target: e.target, value: e.value! }));
}

export function getAllConditions(): ConditionDefinition[] {
  return CONDITIONS_35;
}
