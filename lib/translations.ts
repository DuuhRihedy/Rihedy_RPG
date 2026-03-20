// ══════════════════════════════════════════════════
// Hub RPG — Dicionários de Tradução EN → PT-BR
// Português é o idioma principal, inglês é referência
// ══════════════════════════════════════════════════

// ── Escolas de Magia ───────────────────────────────

export const schoolsMap: Record<string, string> = {
  "Abjuration": "Abjuração",
  "Conjuration": "Conjuração",
  "Divination": "Adivinhação",
  "Enchantment": "Encantamento",
  "Evocation": "Evocação",
  "Illusion": "Ilusão",
  "Necromancy": "Necromancia",
  "Transmutation": "Transmutação",
};

// ── Classes ────────────────────────────────────────

export const classesMap: Record<string, string> = {
  "Barbarian": "Bárbaro",
  "Bard": "Bardo",
  "Cleric": "Clérigo",
  "Druid": "Druida",
  "Fighter": "Guerreiro",
  "Monk": "Monge",
  "Paladin": "Paladino",
  "Ranger": "Patrulheiro",
  "Rogue": "Ladino",
  "Sorcerer": "Feiticeiro",
  "Warlock": "Bruxo",
  "Wizard": "Mago",
};

// ── Tamanhos de Criatura ───────────────────────────

export const sizesMap: Record<string, string> = {
  "Tiny": "Miúdo",
  "Small": "Pequeno",
  "Medium": "Médio",
  "Large": "Grande",
  "Huge": "Enorme",
  "Gargantuan": "Colossal",
};

// ── Tipos de Criatura ──────────────────────────────

export const creatureTypesMap: Record<string, string> = {
  "aberration": "Aberração",
  "beast": "Besta",
  "celestial": "Celestial",
  "construct": "Constructo",
  "dragon": "Dragão",
  "elemental": "Elemental",
  "fey": "Fada",
  "fiend": "Diabo",
  "giant": "Gigante",
  "humanoid": "Humanoide",
  "monstrosity": "Monstruosidade",
  "ooze": "Gosma",
  "plant": "Planta",
  "undead": "Morto-vivo",
  "swarm of Tiny beasts": "Enxame de bestas Miúdas",
};

// ── Alinhamentos ───────────────────────────────────

const alignmentParts: Record<string, string> = {
  "lawful": "leal",
  "neutral": "neutro",
  "chaotic": "caótico",
  "good": "bom",
  "evil": "mau",
  "any": "qualquer",
  "unaligned": "sem alinhamento",
};

export function translateAlignment(alignment: string | null): string | null {
  if (!alignment) return null;
  const lower = alignment.toLowerCase().trim();

  if (lower === "unaligned") return "Sem alinhamento";
  if (lower === "any alignment") return "Qualquer alinhamento";
  if (lower === "any non-good alignment") return "Qualquer alinhamento não bom";
  if (lower === "any non-lawful alignment") return "Qualquer alinhamento não leal";
  if (lower === "any evil alignment") return "Qualquer alinhamento mau";
  if (lower === "any chaotic alignment") return "Qualquer alinhamento caótico";
  if (lower === "neutral") return "Neutro";
  if (lower === "neutral good") return "Neutro e bom";
  if (lower === "neutral evil") return "Neutro e mau";
  if (lower === "true neutral") return "Neutro";

  const parts = lower.split(/\s+/);
  const translated = parts.map((p) => alignmentParts[p] || p);
  const result = translated.join(" e ");
  return result.charAt(0).toUpperCase() + result.slice(1);
}

// ── Tipos de Dano ──────────────────────────────────

export const damageTypesMap: Record<string, string> = {
  "Acid": "Ácido",
  "Bludgeoning": "Contundente",
  "Cold": "Frio",
  "Fire": "Fogo",
  "Force": "Energia",
  "Lightning": "Elétrico",
  "Necrotic": "Necrótico",
  "Piercing": "Perfurante",
  "Poison": "Veneno",
  "Psychic": "Psíquico",
  "Radiant": "Radiante",
  "Slashing": "Cortante",
  "Thunder": "Trovão",
  // lowercase variants
  "acid": "ácido",
  "bludgeoning": "contundente",
  "cold": "frio",
  "fire": "fogo",
  "force": "energia",
  "lightning": "elétrico",
  "necrotic": "necrótico",
  "piercing": "perfurante",
  "poison": "veneno",
  "psychic": "psíquico",
  "radiant": "radiante",
  "slashing": "cortante",
  "thunder": "trovão",
};

// ── Condições ──────────────────────────────────────

export const conditionsMap: Record<string, string> = {
  "blinded": "cego",
  "charmed": "enfeitiçado",
  "deafened": "surdo",
  "exhaustion": "exausto",
  "frightened": "amedrontado",
  "grappled": "agarrado",
  "incapacitated": "incapacitado",
  "invisible": "invisível",
  "paralyzed": "paralisado",
  "petrified": "petrificado",
  "poisoned": "envenenado",
  "prone": "caído",
  "restrained": "contido",
  "stunned": "atordoado",
  "unconscious": "inconsciente",
  // Capitalized
  "Blinded": "Cego",
  "Charmed": "Enfeitiçado",
  "Deafened": "Surdo",
  "Exhaustion": "Exausto",
  "Frightened": "Amedrontado",
  "Grappled": "Agarrado",
  "Incapacitated": "Incapacitado",
  "Invisible": "Invisível",
  "Paralyzed": "Paralisado",
  "Petrified": "Petrificado",
  "Poisoned": "Envenenado",
  "Prone": "Caído",
  "Restrained": "Contido",
  "Stunned": "Atordoado",
  "Unconscious": "Inconsciente",
};

// ── Categorias de Equipamento ──────────────────────

export const equipCategoriesMap: Record<string, string> = {
  "Weapon": "Arma",
  "Armor": "Armadura",
  "Adventuring Gear": "Equipamento de Aventura",
  "Tools": "Ferramentas",
  "Mounts and Vehicles": "Montarias e Veículos",
  "Other": "Outro",
};

// ── Raridades ──────────────────────────────────────

export const raritiesMap: Record<string, string> = {
  "Common": "Comum",
  "Uncommon": "Incomum",
  "Rare": "Raro",
  "Very Rare": "Muito Raro",
  "Very rare": "Muito Raro",
  "Legendary": "Lendário",
  "Artifact": "Artefato",
  "Varies": "Variável",
};

// ── Velocidades ────────────────────────────────────

export const speedKeysMap: Record<string, string> = {
  "walk": "deslocamento",
  "fly": "voo",
  "swim": "natação",
  "burrow": "escavação",
  "climb": "escalada",
  "hover": "pairar",
};

// ── Sentidos ───────────────────────────────────────

export const sensesKeysMap: Record<string, string> = {
  "darkvision": "visão no escuro",
  "blindsight": "sentido cego",
  "tremorsense": "sentido sísmico",
  "truesight": "visão verdadeira",
  "passive_perception": "percepção passiva",
};

// ── Tempo de Conjuração ────────────────────────────

const castingTimeMap: Record<string, string> = {
  "1 action": "1 ação",
  "1 bonus action": "1 ação bônus",
  "1 reaction": "1 reação",
  "1 minute": "1 minuto",
  "10 minutes": "10 minutos",
  "1 hour": "1 hora",
  "8 hours": "8 horas",
  "12 hours": "12 horas",
  "24 hours": "24 horas",
};

export function translateCastingTime(ct: string): string {
  if (castingTimeMap[ct]) return castingTimeMap[ct];

  // "1 reaction, which you take when..." pattern
  if (ct.startsWith("1 reaction")) {
    const rest = ct.replace("1 reaction", "").trim();
    if (rest) return `1 reação${rest.startsWith(",") ? rest.replace(",", ",") : `, ${rest}`}`;
    return "1 reação";
  }

  return ct;
}

// ── Alcance (Range) ────────────────────────────────

const rangeDirectMap: Record<string, string> = {
  "Self": "Pessoal",
  "Touch": "Toque",
  "Sight": "Visão",
  "Unlimited": "Ilimitado",
  "Special": "Especial",
};

const shapeMap: Record<string, string> = {
  "radius": "raio",
  "sphere": "esfera",
  "cone": "cone",
  "cube": "cubo",
  "cylinder": "cilindro",
  "line": "linha",
  "hemisphere": "hemisfério",
  "radius sphere": "esfera de raio",
};

function feetToMeters(feet: number): number {
  return Math.round(feet * 0.3 * 10) / 10;
}

export function translateRange(range: string): string {
  if (rangeDirectMap[range]) return rangeDirectMap[range];

  // "X feet" pattern
  const feetMatch = range.match(/^(\d+)\s*feet?$/i);
  if (feetMatch) {
    const meters = feetToMeters(parseInt(feetMatch[1]));
    return `${meters} metros`;
  }

  // "X mile(s)" pattern
  const mileMatch = range.match(/^(\d+)\s*miles?$/i);
  if (mileMatch) {
    const km = parseFloat(mileMatch[1]) * 1.5;
    return `${km} km`;
  }

  // "Self (X-foot ...)" pattern
  const selfAreaMatch = range.match(/^Self\s*\((\d+)-foot[- ](.+)\)$/i);
  if (selfAreaMatch) {
    const meters = feetToMeters(parseInt(selfAreaMatch[1]));
    const shape = selfAreaMatch[2].toLowerCase().trim();
    const shapePtBr = shapeMap[shape] || shape;
    return `Pessoal (${shapePtBr} de ${meters} m)`;
  }

  return range;
}

// ── Duração ────────────────────────────────────────

const durationDirectMap: Record<string, string> = {
  "Instantaneous": "Instantâneo",
  "1 round": "1 rodada",
  "1 minute": "1 minuto",
  "10 minutes": "10 minutos",
  "1 hour": "1 hora",
  "2 hours": "2 horas",
  "8 hours": "8 horas",
  "24 hours": "24 horas",
  "Until dispelled": "Até ser dissipada",
  "Until dispelled or triggered": "Até ser dissipada ou ativada",
  "Special": "Especial",
  "Up to 1 round": "Até 1 rodada",
  "Up to 1 minute": "Até 1 minuto",
  "Up to 10 minutes": "Até 10 minutos",
  "Up to 1 hour": "Até 1 hora",
  "Up to 2 hours": "Até 2 horas",
  "Up to 8 hours": "Até 8 horas",
  "Up to 24 hours": "Até 24 horas",
};

export function translateDuration(dur: string): string {
  if (durationDirectMap[dur]) return durationDirectMap[dur];

  // "Up to X days" etc.
  if (dur.startsWith("Up to ")) {
    return `Até ${dur.replace("Up to ", "")}`;
  }

  return dur;
}

// ── Nível de Magia ─────────────────────────────────

export function translateSpellLevel(level: number): string {
  if (level === 0) return "Truque";
  return `${level}º nível`;
}

// ── Funções Utilitárias ────────────────────────────

export function t(map: Record<string, string>, key: string): string {
  return map[key] || key;
}

export function translateSchool(school: string): string {
  return schoolsMap[school] || school;
}

export function translateSize(size: string): string {
  return sizesMap[size] || size;
}

export function translateCreatureType(type: string): string {
  return creatureTypesMap[type] || creatureTypesMap[type.toLowerCase()] || type;
}

export function translateDamageType(dt: string | null): string | null {
  if (!dt) return null;
  return damageTypesMap[dt] || dt;
}

export function translateCondition(cond: string): string {
  return conditionsMap[cond] || cond;
}

export function translateClassList(classesStr: string): string {
  return classesStr
    .split(", ")
    .map((cls) => classesMap[cls.trim()] || cls.trim())
    .join(", ");
}

export function translateEquipCategory(cat: string): string {
  return equipCategoriesMap[cat] || cat;
}

export function translateRarity(rarity: string): string {
  return raritiesMap[rarity] || rarity;
}

export function translateCategory(cat: string): string {
  return equipCategoriesMap[cat] || cat;
}

export function translateClassName(name: string): string {
  return classesMap[name] || name;
}

export function translateDamageList(dmgStr: string | null): string | null {
  if (!dmgStr) return null;
  return dmgStr
    .split(", ")
    .map((d) => damageTypesMap[d.trim()] || d.trim())
    .join(", ");
}

export function translateConditionList(condStr: string | null): string | null {
  if (!condStr) return null;
  return condStr
    .split(", ")
    .map((c) => conditionsMap[c.trim()] || c.trim())
    .join(", ");
}

export function translateSpeed(speedJson: string): string {
  try {
    const speed = JSON.parse(speedJson);
    return Object.entries(speed)
      .map(([key, val]) => {
        const keyPtBr = speedKeysMap[key] || key;
        if (typeof val === "string") {
          const ftMatch = (val as string).match(/^(\d+)\s*ft/);
          if (ftMatch) return `${keyPtBr} ${feetToMeters(parseInt(ftMatch[1]))} m`;
          return `${keyPtBr} ${val}`;
        }
        return `${keyPtBr} ${val}`;
      })
      .join(", ");
  } catch {
    return speedJson;
  }
}

export function translateSenses(sensesJson: string | null): string {
  if (!sensesJson) return "";
  try {
    const senses = JSON.parse(sensesJson);
    return Object.entries(senses)
      .map(([key, val]) => {
        const keyPtBr = sensesKeysMap[key] || key.replace(/_/g, " ");
        if (typeof val === "string") {
          const ftMatch = (val as string).match(/^(\d+)\s*ft/);
          if (ftMatch) return `${keyPtBr} ${feetToMeters(parseInt(ftMatch[1]))} m`;
          return `${keyPtBr} ${val}`;
        }
        return `${keyPtBr} ${val}`;
      })
      .join(", ");
  } catch {
    return sensesJson;
  }
}

// ── Labels da UI ───────────────────────────────────

export const uiLabels = {
  castingTime: "Tempo de Conjuração",
  range: "Alcance",
  components: "Componentes",
  duration: "Duração",
  damage: "Dano",
  description: "Descrição",
  higherLevel: "Em Níveis Superiores",
  material: "Material",
  classes: "Classes",
  senses: "Sentidos",
  languages: "Idiomas",
  damageImmunities: "Imunidades a Dano",
  damageResistances: "Resistências a Dano",
  damageVulnerabilities: "Vulnerabilidades a Dano",
  conditionImmunities: "Imunidades a Condição",
  speed: "Deslocamento",
  specialAbilities: "Habilidades Especiais",
  actions: "Ações",
  legendaryActions: "Ações Lendárias",
  reactions: "Reações",
  armorClass: "Classe de Armadura",
  hitPoints: "Pontos de Vida",
  challengeRating: "Nível de Desafio",
  concentration: "Concentração",
};
