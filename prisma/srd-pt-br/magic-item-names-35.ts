// ══════════════════════════════════════════════════════
// Itens Mágicos 3.5 — Tradução por padrão de nome
// Usa dicionários de termos base + padrões com +N, Greater/Lesser
// ══════════════════════════════════════════════════════

// Termos base dos itens mágicos
const baseItems: Record<string, string> = {
  "amulet-of-health": "Amuleto de Saúde",
  "amulet-of-mighty-fists": "Amuleto de Punhos Poderosos",
  "amulet-of-natural-armor": "Amuleto de Armadura Natural",
  "amulet-of-proof-against-detection-and-location": "Amuleto de Proteção contra Detecção",
  "bag-of-holding": "Bolsa de Acondicionamento",
  "bag-of-tricks": "Bolsa de Truques",
  "belt-of-giant-strength": "Cinto de Força de Gigante",
  "boots-of-speed": "Botas de Velocidade",
  "boots-of-elvenkind": "Botas Élficas",
  "boots-of-striding-and-springing": "Botas de Passada e Salto",
  "boots-of-teleportation": "Botas de Teletransporte",
  "boots-of-the-winterlands": "Botas das Terras Invernais",
  "bracers-of-archery": "Braceletes de Arquearia",
  "bracers-of-armor": "Braceletes de Armadura",
  "bracers-of-epic-armor": "Braceletes de Armadura Épica",
  "brooch-of-shielding": "Broche de Proteção",
  "cape-of-the-mountebank": "Capa do Charlatão",
  "carpet-of-flying": "Tapete Voador",
  "circlet-of-blasting": "Diadema de Explosão",
  "cloak-of-arachnida": "Capa de Aracnídeo",
  "cloak-of-charisma": "Manto de Carisma",
  "cloak-of-displacement": "Manto de Deslocamento",
  "cloak-of-elvenkind": "Manto Élfico",
  "cloak-of-etherealness": "Manto de Eterealidade",
  "cloak-of-resistance": "Manto de Resistência",
  "cloak-of-the-bat": "Manto do Morcego",
  "crystal-ball": "Bola de Cristal",
  "crystal-masks": "Máscaras de Cristal",
  "cube-of-force": "Cubo de Força",
  "decanter-of-endless-water": "Decantador de Água Infinita",
  "deck-of-illusions": "Baralho de Ilusões",
  "deck-of-many-things": "Baralho de Muitas Coisas",
  "dimensional-shackles": "Grilhões Dimensionais",
  "eversmoking-bottle": "Garrafa de Fumaça Eterna",
  "eyes-of-doom": "Olhos da Perdição",
  "eyes-of-the-eagle": "Olhos da Águia",
  "figurine-of-wondrous-power": "Estatueta de Poder Maravilhoso",
  "gauntlets-of-ogre-power": "Manoplas de Poder de Ogro",
  "gem-of-brightness": "Gema de Brilho",
  "gem-of-seeing": "Gema de Visão",
  "gloves-of-arrow-snaring": "Luvas de Captura de Flechas",
  "gloves-of-dexterity": "Luvas de Destreza",
  "gloves-of-swimming-and-climbing": "Luvas de Natação e Escalada",
  "goggles-of-night": "Óculos da Noite",
  "hand-of-glory": "Mão da Glória",
  "handy-haversack": "Mochila Prática",
  "hat-of-disguise": "Chapéu de Disfarce",
  "headband-of-intellect": "Tiara de Intelecto",
  "helm-of-brilliance": "Elmo do Brilho",
  "helm-of-telepathy": "Elmo de Telepatia",
  "helm-of-teleportation": "Elmo de Teletransporte",
  "horn-of-blasting": "Corneta de Explosão",
  "horseshoes-of-speed": "Ferraduras de Velocidade",
  "horseshoes-of-a-zephyr": "Ferraduras do Zéfiro",
  "instant-fortress": "Fortaleza Instantânea",
  "ioun-stone": "Pedra Ioun",
  "iron-flask": "Frasco de Ferro",
  "lantern-of-revealing": "Lanterna Reveladora",
  "lens-of-detection": "Lente de Detecção",
  "mantle-of-spell-resistance": "Manto de Resistência a Magia",
  "manual-of-bodily-health": "Manual de Saúde Corporal",
  "manual-of-gainful-exercise": "Manual de Exercício Proveitoso",
  "manual-of-quickness-of-action": "Manual de Agilidade em Ação",
  "medallion-of-thoughts": "Medalhão dos Pensamentos",
  "mirror-of-life-trapping": "Espelho de Aprisionar Vida",
  "mirror-of-opposition": "Espelho de Oposição",
  "necklace-of-adaptation": "Colar de Adaptação",
  "necklace-of-fireballs": "Colar de Bolas de Fogo",
  "pearl-of-power": "Pérola de Poder",
  "pearl-of-the-sirines": "Pérola das Sereias",
  "periapt-of-health": "Pendente de Saúde",
  "periapt-of-proof-against-poison": "Pendente de Proteção contra Veneno",
  "periapt-of-wisdom": "Pendente de Sabedoria",
  "phylactery-of-faithfulness": "Filactério da Fé",
  "phylactery-of-undead-turning": "Filactério de Expulsar Mortos-Vivos",
  "portable-hole": "Buraco Portátil",
  "ring-of-animal-friendship": "Anel de Amizade Animal",
  "ring-of-chameleon-power": "Anel de Poder do Camaleão",
  "ring-of-climbing": "Anel de Escalada",
  "ring-of-counterspells": "Anel de Contramágica",
  "ring-of-djinni-calling": "Anel de Conjurar Djinn",
  "ring-of-elemental-command": "Anel de Comando Elemental",
  "ring-of-energy-resistance": "Anel de Resistência a Energia",
  "ring-of-evasion": "Anel de Evasão",
  "ring-of-feather-falling": "Anel de Queda Suave",
  "ring-of-force-shield": "Anel de Escudo de Força",
  "ring-of-freedom-of-movement": "Anel de Liberdade de Movimento",
  "ring-of-friend-shield": "Anel de Escudo Amigo",
  "ring-of-invisibility": "Anel de Invisibilidade",
  "ring-of-jumping": "Anel de Salto",
  "ring-of-mind-shielding": "Anel de Proteção Mental",
  "ring-of-protection": "Anel de Proteção",
  "ring-of-ram": "Anel do Carneiro",
  "ring-of-regeneration": "Anel de Regeneração",
  "ring-of-shooting-stars": "Anel de Estrelas Cadentes",
  "ring-of-spell-storing": "Anel de Armazenar Magias",
  "ring-of-spell-turning": "Anel de Desviar Magias",
  "ring-of-sustenance": "Anel de Sustento",
  "ring-of-swimming": "Anel de Natação",
  "ring-of-telekinesis": "Anel de Telecinese",
  "ring-of-three-wishes": "Anel de Três Desejos",
  "ring-of-water-walking": "Anel de Caminhar na Água",
  "ring-of-wizardry": "Anel de Magia",
  "ring-of-x-ray-vision": "Anel de Visão de Raio-X",
  "ring-gates": "Portões de Anel",
  "robe-of-blending": "Manto de Mimetismo",
  "robe-of-bones": "Manto de Ossos",
  "robe-of-eyes": "Manto de Olhos",
  "robe-of-scintillating-colors": "Manto de Cores Cintilantes",
  "robe-of-stars": "Manto de Estrelas",
  "robe-of-the-archmagi": "Manto do Arquimago",
  "robe-of-useful-items": "Manto de Itens Úteis",
  "rod-of-absorption": "Bastão de Absorção",
  "rod-of-alertness": "Bastão de Vigilância",
  "rod-of-cancellation": "Bastão de Cancelamento",
  "rod-of-epic-might": "Bastão de Poder Épico",
  "rod-of-epic-splendor": "Bastão de Esplendor Épico",
  "rod-of-enemy-detection": "Bastão de Detecção de Inimigos",
  "rod-of-flailing": "Bastão de Flagelação",
  "rod-of-lordly-might": "Bastão de Poder Soberano",
  "rod-of-metal-and-mineral-detection": "Bastão de Detecção de Metal e Mineral",
  "rod-of-negation": "Bastão de Negação",
  "rod-of-rulership": "Bastão de Soberania",
  "rod-of-security": "Bastão de Segurança",
  "rod-of-splendor": "Bastão de Esplendor",
  "rod-of-thunder-and-lightning": "Bastão de Trovão e Relâmpago",
  "rod-of-withering": "Bastão de Definhamento",
  "rod-of-wonder": "Bastão de Maravilha",
  "rod-of-metamagic": "Bastão de Metamagia",
  "sphere-of-annihilation": "Esfera de Aniquilação",
  "staff-of-abjuration": "Cajado de Abjuração",
  "staff-of-charming": "Cajado de Encantamento",
  "staff-of-conjuration": "Cajado de Conjuração",
  "staff-of-defense": "Cajado de Defesa",
  "staff-of-divination": "Cajado de Adivinhação",
  "staff-of-earth-and-stone": "Cajado de Terra e Pedra",
  "staff-of-enchantment": "Cajado de Encantamento",
  "staff-of-evocation": "Cajado de Evocação",
  "staff-of-fire": "Cajado de Fogo",
  "staff-of-frost": "Cajado de Gelo",
  "staff-of-healing": "Cajado de Cura",
  "staff-of-illumination": "Cajado de Iluminação",
  "staff-of-illusion": "Cajado de Ilusão",
  "staff-of-life": "Cajado de Vida",
  "staff-of-necromancy": "Cajado de Necromancia",
  "staff-of-passage": "Cajado de Passagem",
  "staff-of-planar-might": "Cajado de Poder Planar",
  "staff-of-power": "Cajado de Poder",
  "staff-of-size-alteration": "Cajado de Alteração de Tamanho",
  "staff-of-swarming-insects": "Cajado de Enxame de Insetos",
  "staff-of-the-cosmos": "Cajado do Cosmos",
  "staff-of-the-magi": "Cajado do Mago",
  "staff-of-the-woodlands": "Cajado das Florestas",
  "staff-of-transmutation": "Cajado de Transmutação",
  "stone-of-good-luck": "Pedra de Boa Sorte",
  "sustaining-spoon": "Colher de Sustento",
  "well-of-many-worlds": "Poço de Muitos Mundos",
  "wind-fan": "Leque de Vento",
  "wings-of-flying": "Asas Voadoras",
};

// Traduz variantes com +N, types, etc.
const modifiers: Record<string, string> = {
  "minor": "Menor",
  "major": "Maior",
  "greater": "Superior",
  "normal": "Normal",
  "lesser": "Menor",
  "empower": "Potencializar",
  "extend": "Estender",
  "maximize": "Maximizar",
  "quicken": "Acelerar",
  "silent": "Silenciar",
  "still": "Imobilizar",
  "enlarge": "Ampliar",
  "widen": "Alargar",
  "heighten": "Elevar",
  "persistent": "Persistente",
  "reach": "Alcance",
  "repeat": "Repetir",
  "sculpt": "Esculpir",
  "chain": "Encadear",
  "twin": "Gêmeo",
  "intensified": "Intensificado",
};

// Armas especiais nomeadas
const namedWeapons: Record<string, string> = {
  "luck-blade": "Lâmina da Sorte",
  "holy-avenger": "Vingador Sagrado",
  "flame-tongue": "Língua de Fogo",
  "frost-brand": "Marca do Gelo",
  "sun-blade": "Lâmina Solar",
  "nine-lives-stealer": "Ladrão de Nove Vidas",
  "sword-of-life-stealing": "Espada de Roubo de Vida",
  "sword-of-subtlety": "Espada da Sutileza",
  "sword-of-the-planes": "Espada dos Planos",
  "berserking-sword": "Espada da Fúria",
  "cursed-backbiter-spear": "Lança Traiçoeira Amaldiçoada",
  "dagger-of-venom": "Adaga de Veneno",
  "dancing-sword": "Espada Dançante",
  "defending-sword": "Espada Defensora",
  "mace-of-terror": "Maça do Terror",
  "mace-of-smiting": "Maça da Destruição",
  "javelin-of-lightning": "Dardo de Relâmpago",
  "trident-of-fish-command": "Tridente de Comando de Peixes",
  "trident-of-warning": "Tridente de Alerta",
  "sleep-arrow": "Flecha do Sono",
  "screaming-bolt": "Virote Gritante",
  "slaying-arrow": "Flecha Assassina",
  "oathbow": "Arco do Juramento",
  "lion-s-shield": "Escudo do Leão",
  "winged-shield": "Escudo Alado",
  "spellguard-shield": "Escudo Antimágico",
  "armor-of-arrow-attraction": "Armadura de Atração de Flechas",
  "demon-armor": "Armadura Demoníaca",
  "celestial-armor": "Armadura Celestial",
  "plate-armor-of-the-deep": "Armadura de Placas das Profundezas",
  "rhino-hide": "Couro de Rinoceronte",
  "elven-chain": "Cota de Malha Élfica",
  "dwarven-plate": "Placa Anã",
  "banded-mail-of-luck": "Cota de Talas da Sorte",
  "breastplate-of-command": "Peitoral de Comando",
  "caster-s-shield": "Escudo do Conjurador",
  "absorbing-shield": "Escudo Absorvente",
};

// Itens especiais nomeados
const namedItems: Record<string, string> = {
  "the-moaning-diamond": "O Diamante Lamentante",
  "stormsong": "Canção da Tempestade",
  "blackstar": "Estrela Negra",
  "chicane-s-covetous-amulet": "Amuleto Cobiçoso de Chicane",
  "cloak-of-epic-resistance": "Manto de Resistência Épica",
  "mantle-of-great-stealth": "Manto de Grande Furtividade",
  "robe-of-epic-resistance": "Manto de Resistência Épica",
  "amulet-of-epic-natural-armor": "Amuleto de Armadura Natural Épica",
  "ring-of-epic-protection": "Anel de Proteção Épica",
  "ring-of-epic-wizardry": "Anel de Magia Épica",
  "ring-of-universal-energy-resistance": "Anel de Resistência Universal a Energia",
};

/**
 * Traduz o nome de um item mágico 3.5 usando dicionários de termos.
 * Retorna null se não encontrar tradução.
 */
export function translateMagicItemName(index: string, name: string): string | null {
  const base = index.replace(/-35$/, "");

  // 1. Itens nomeados especiais
  if (namedWeapons[base]) return namedWeapons[base];
  if (namedItems[base]) return namedItems[base];

  // 2. Itens base diretos
  if (baseItems[base]) return baseItems[base];

  // 3. Itens com +N (ex: ring-of-protection-4 → Anel de Proteção +4)
  const plusMatch = base.match(/^(.+?)-(\d+)$/);
  if (plusMatch) {
    const itemKey = plusMatch[1];
    const bonus = plusMatch[2];
    if (baseItems[itemKey]) return `${baseItems[itemKey]} +${bonus}`;
  }

  // 4. Itens com tipo ordinal (pearl-of-power-4th → Pérola de Poder (4º))
  const ordMatch = base.match(/^(.+?)-(\d+)(?:st|nd|rd|th)$/);
  if (ordMatch) {
    const itemKey = ordMatch[1];
    const level = ordMatch[2];
    if (baseItems[itemKey]) return `${baseItems[itemKey]} (${level}º)`;
  }

  // 5. Rod of Metamagic variants (rod-of-metamagic-empower-greater → Bastão de Metamagia, Potencializar, Superior)
  const rodMatch = base.match(/^rod-of-metamagic-(.+?)-(.+)$/);
  if (rodMatch) {
    const spellType = modifiers[rodMatch[1]] || rodMatch[1];
    const quality = modifiers[rodMatch[2]] || rodMatch[2];
    return `Bastão de Metamagia, ${spellType}, ${quality.charAt(0).toUpperCase() + quality.slice(1)}`;
  }

  // 6. Ring of Energy Resistance with type
  const resistMatch = base.match(/^ring-of-energy-resistance-(.+)$/);
  if (resistMatch) {
    const type = modifiers[resistMatch[1]] || resistMatch[1];
    return `Anel de Resistência a Energia, ${type.charAt(0).toUpperCase() + type.slice(1)}`;
  }

  // 7. Ring of Wizardry with level
  const wizMatch = base.match(/^ring-of-wizardry-(.+)$/);
  if (wizMatch) {
    const roman = wizMatch[1].toUpperCase();
    return `Anel de Magia ${roman}`;
  }

  // 8. Bag of holding with type
  const bagMatch = base.match(/^bag-of-holding-type-(.+)$/);
  if (bagMatch) {
    return `Bolsa de Acondicionamento Tipo ${bagMatch[1].toUpperCase()}`;
  }

  // 9. Items with greater/lesser/minor/major
  for (const [mod, modPt] of Object.entries(modifiers)) {
    if (base.endsWith(`-${mod}`)) {
      const itemKey = base.replace(new RegExp(`-${mod}$`), "");
      if (baseItems[itemKey]) return `${baseItems[itemKey]}, ${modPt.charAt(0).toUpperCase() + modPt.slice(1)}`;
    }
  }

  // Fallback
  return null;
}
