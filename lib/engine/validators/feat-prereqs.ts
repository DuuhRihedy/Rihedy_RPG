// ═══════════════════════════════════════════
// VTT Engine — Feat Prerequisites Validator
// Valida pré-requisitos de talentos D&D 3.5
// ═══════════════════════════════════════════

import { Character, FeatDefinition, FeatPrerequisite, getModifier } from "../types";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Check if a character meets all prerequisites for a feat.
 */
export function validateFeatPrereqs(character: Character, feat: FeatDefinition): ValidationResult {
  const errors: string[] = [];

  for (const prereq of feat.prerequisites) {
    switch (prereq.type) {
      case "ability": {
        const abilityName = prereq.parameter as keyof typeof character.abilities;
        const required = prereq.value as number;
        const current = character.abilities[abilityName];
        if (!current || current < required) {
          errors.push(`${abilityName.toUpperCase()} ${required} necessário (atual: ${current || 0})`);
        }
        break;
      }

      case "bab": {
        const required = prereq.value as number;
        const bab = character.attack.baseAttackBonus[0] || 0;
        if (bab < required) {
          errors.push(`BBA +${required} necessário (atual: +${bab})`);
        }
        break;
      }

      case "feat": {
        const requiredFeat = prereq.value as string;
        if (!character.feats.includes(requiredFeat)) {
          errors.push(`Talento "${requiredFeat}" necessário`);
        }
        break;
      }

      case "skill": {
        const skillName = prereq.parameter || "";
        const requiredRanks = prereq.value as number;
        const skill = character.skills.find((s) => s.name === skillName);
        if (!skill || skill.ranks < requiredRanks) {
          errors.push(`${skillName} ${requiredRanks} graduações necessárias (atual: ${skill?.ranks || 0})`);
        }
        break;
      }

      case "class": {
        const requiredClass = prereq.value as string;
        const hasClass = character.classes.some((c) => c.className === requiredClass);
        if (!hasClass) {
          errors.push(`Classe "${requiredClass}" necessária`);
        }
        break;
      }

      case "level": {
        const required = prereq.value as number;
        if (character.totalLevel < required) {
          errors.push(`Nível ${required} necessário (atual: ${character.totalLevel})`);
        }
        break;
      }

      case "casterLevel": {
        const required = prereq.value as number;
        // Simplified: total levels in casting classes
        const casterLevel = character.totalLevel; // should be more precise
        if (casterLevel < required) {
          errors.push(`Nível de conjurador ${required} necessário`);
        }
        break;
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

// ── Common D&D 3.5 Feats with Prerequisites ──

export const COMMON_FEATS: FeatDefinition[] = [
  {
    name: "Power Attack",
    namePtBr: "Ataque Poderoso",
    type: "general",
    prerequisites: [{ type: "ability", value: 13, parameter: "str" }],
    benefit: "Trade attack bonus for damage on melee attacks.",
    benefitPtBr: "Trocar bônus de ataque por dano em ataques corpo-a-corpo.",
    repeatable: false,
  },
  {
    name: "Cleave",
    namePtBr: "Golpe Demolidor",
    type: "general",
    prerequisites: [
      { type: "ability", value: 13, parameter: "str" },
      { type: "feat", value: "Power Attack" },
    ],
    benefit: "Extra melee attack after dropping a foe.",
    benefitPtBr: "Ataque corpo-a-corpo extra após derrubar um inimigo.",
    repeatable: false,
  },
  {
    name: "Great Cleave",
    namePtBr: "Golpe Demolidor Aprimorado",
    type: "fighter",
    prerequisites: [
      { type: "ability", value: 13, parameter: "str" },
      { type: "feat", value: "Cleave" },
      { type: "feat", value: "Power Attack" },
      { type: "bab", value: 4 },
    ],
    benefit: "Unlimited Cleave attacks per round.",
    benefitPtBr: "Ataques de Golpe Demolidor ilimitados por rodada.",
    repeatable: false,
  },
  {
    name: "Dodge",
    namePtBr: "Esquiva",
    type: "general",
    prerequisites: [{ type: "ability", value: 13, parameter: "dex" }],
    benefit: "+1 AC against designated opponent.",
    benefitPtBr: "+1 na CA contra um oponente designado.",
    repeatable: false,
  },
  {
    name: "Mobility",
    namePtBr: "Mobilidade",
    type: "general",
    prerequisites: [
      { type: "ability", value: 13, parameter: "dex" },
      { type: "feat", value: "Dodge" },
    ],
    benefit: "+4 AC against attacks of opportunity from movement.",
    benefitPtBr: "+4 na CA contra ataques de oportunidade por movimento.",
    repeatable: false,
  },
  {
    name: "Spring Attack",
    namePtBr: "Ataque Saltitante",
    type: "general",
    prerequisites: [
      { type: "ability", value: 13, parameter: "dex" },
      { type: "feat", value: "Dodge" },
      { type: "feat", value: "Mobility" },
      { type: "bab", value: 4 },
    ],
    benefit: "Move before and after melee attack.",
    benefitPtBr: "Mover antes e depois de um ataque corpo-a-corpo.",
    repeatable: false,
  },
  {
    name: "Weapon Focus",
    namePtBr: "Foco em Arma",
    type: "fighter",
    prerequisites: [{ type: "bab", value: 1 }],
    benefit: "+1 attack with chosen weapon.",
    benefitPtBr: "+1 em ataques com a arma escolhida.",
    repeatable: true,
  },
  {
    name: "Weapon Specialization",
    namePtBr: "Especialização em Arma",
    type: "fighter",
    prerequisites: [
      { type: "feat", value: "Weapon Focus" },
      { type: "class", value: "Fighter" },
      { type: "bab", value: 4 },
    ],
    benefit: "+2 damage with chosen weapon.",
    benefitPtBr: "+2 no dano com a arma escolhida.",
    repeatable: true,
  },
  {
    name: "Improved Initiative",
    namePtBr: "Iniciativa Aprimorada",
    type: "general",
    prerequisites: [],
    benefit: "+4 bonus on initiative checks.",
    benefitPtBr: "+4 na iniciativa.",
    repeatable: false,
  },
  {
    name: "Toughness",
    namePtBr: "Robustez",
    type: "general",
    prerequisites: [],
    benefit: "+3 hit points.",
    benefitPtBr: "+3 pontos de vida.",
    repeatable: true,
  },
  {
    name: "Two-Weapon Fighting",
    namePtBr: "Combate com Duas Armas",
    type: "general",
    prerequisites: [{ type: "ability", value: 15, parameter: "dex" }],
    benefit: "Reduce two-weapon fighting penalties.",
    benefitPtBr: "Reduz penalidades de combate com duas armas.",
    repeatable: false,
  },
  {
    name: "Point Blank Shot",
    namePtBr: "Tiro Certeiro",
    type: "general",
    prerequisites: [],
    benefit: "+1 attack and damage within 30 feet.",
    benefitPtBr: "+1 em ataque e dano até 9 metros.",
    repeatable: false,
  },
  {
    name: "Precise Shot",
    namePtBr: "Tiro Preciso",
    type: "general",
    prerequisites: [{ type: "feat", value: "Point Blank Shot" }],
    benefit: "No penalty for shooting into melee.",
    benefitPtBr: "Sem penalidade por atirar em combate corpo-a-corpo.",
    repeatable: false,
  },
  {
    name: "Spell Focus",
    namePtBr: "Foco em Magia",
    type: "general",
    prerequisites: [],
    benefit: "+1 to save DC for chosen school of magic.",
    benefitPtBr: "+1 na CD de salvaguarda da escola de magia escolhida.",
    repeatable: true,
  },
  {
    name: "Brew Potion",
    namePtBr: "Preparar Poção",
    type: "item_creation",
    prerequisites: [{ type: "casterLevel", value: 3 }],
    benefit: "Create potions of spells of 3rd level or lower.",
    benefitPtBr: "Criar poções de magias de 3° nível ou inferior.",
    repeatable: false,
  },
  {
    name: "Scribe Scroll",
    namePtBr: "Escrever Pergaminho",
    type: "item_creation",
    prerequisites: [{ type: "casterLevel", value: 1 }],
    benefit: "Create scrolls of any spell you know.",
    benefitPtBr: "Criar pergaminhos de qualquer magia que conheça.",
    repeatable: false,
  },
  {
    name: "Craft Wondrous Item",
    namePtBr: "Criar Item Maravilhoso",
    type: "item_creation",
    prerequisites: [{ type: "casterLevel", value: 3 }],
    benefit: "Create wondrous items.",
    benefitPtBr: "Criar itens maravilhosos.",
    repeatable: false,
  },
  {
    name: "Empower Spell",
    namePtBr: "Maximizar Magia",
    type: "metamagic",
    prerequisites: [],
    benefit: "Increase variable numeric effects by 50%.",
    benefitPtBr: "Aumentar efeitos numéricos variáveis em 50%.",
    repeatable: false,
  },
];
