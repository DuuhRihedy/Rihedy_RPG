// ══════════════════════════════════════════════════════
// Monstros 3.5 — Tradução por padrão de nome
// Usa dicionários de termos recorrentes do D&D 3.5
// ══════════════════════════════════════════════════════

// Monstros com tradução direta (nome exato → nome PT-BR)
const directNames: Record<string, string> = {
  // Core creatures
  "aboleth": "Aboleth",
  "achaierai": "Achaierai",
  "allip": "Allip",
  "anaxim": "Anaxim",
  "androsphinx": "Androesfinge",
  "ankheg": "Ankheg",
  "annis": "Annis",
  "ape": "Símio",
  "aranea": "Aranea",
  "athach": "Athach",
  "atropal": "Atropal",
  "avoral": "Avoral",
  "azer": "Azer",
  "babau": "Babau",
  "baboon": "Babuíno",
  "badger": "Texugo",
  "balor": "Balor",
  "barghest": "Barghest",
  "bat": "Morcego",
  "bear": "Urso",
  "bebilith": "Bebilith",
  "behir": "Behir",
  "belker": "Belker",
  "bison": "Bisão",
  "blink-dog": "Cão Teleportador",
  "boar": "Javali",
  "bodak": "Bodak",
  "brachyurus": "Braquiúro",
  "bralani": "Bralani",
  "bugbear": "Bugbear",
  "bulette": "Bulette",
  "camel": "Camelo",
  "cat": "Gato",
  "centaur": "Centauro",
  "cerebrilith": "Cerebrilith",
  "cheetah": "Guepardo",
  "chichimec": "Chichimec",
  "chimera": "Quimera",
  "choker": "Estrangulador",
  "chuul": "Chuul",
  "cloaker": "Cloaker",
  "cockatrice": "Cocatriz",
  "couatl": "Couatl",
  "criosphinx": "Crioesfinge",
  "crocodile": "Crocodilo",
  "crysmal": "Crysmal",
  "darkmantle": "Mantoscuro",
  "deinonychus": "Deinonychus",
  "delver": "Escavador",
  "demilich": "Demilich",
  "derro": "Derro",
  "destrachan": "Destrachan",
  "devourer": "Devorador",
  "digester": "Digestor",
  "djinni": "Djinn",
  "dog": "Cão",
  "donkey": "Burro",
  "doppelganger": "Doppelganger",
  "dragonne": "Dragonne",
  "dretch": "Dretch",
  "drider": "Drider",
  "dryad": "Dríade",
  "eagle": "Águia",
  "efreeti": "Efreeti",
  "elasmosaurus": "Elasmossauro",
  "elephant": "Elefante",
  "erinyes": "Erínia",
  "ettercap": "Ettercap",
  "ettin": "Ettin",
  "folugub": "Folugub",
  "gargoyle": "Gárgula",
  "ghaele": "Ghaele",
  "ghast": "Ghast",
  "girallon": "Girallon",
  "glabrezu": "Glabrezu",
  "gloom": "Penumbra",
  "gnoll": "Gnoll",
  "gorgon": "Gorgon",
  "grick": "Grick",
  "griffon": "Grifo",
  "grig": "Grig",
  "grimlock": "Grimlock",
  "gynosphinx": "Ginoesfinge",
  "hagunemnon": "Hagunemnon",
  "harpy": "Harpia",
  "hawk": "Falcão",
  "hecatoncheires": "Hecatônquiro",
  "hellcat": "Gato Infernal",
  "hellhound": "Cão Infernal",
  "hezrou": "Hezrou",
  "hieracosphinx": "Hieracoesfinge",
  "hippogriff": "Hipogrifo",
  "homunculus": "Homúnculo",
  "howler": "Uivador",
  "hydra": "Hidra",
  "imp": "Diabrete",
  "invisible-stalker": "Perseguidor Invisível",
  "janni": "Jann",
  "kobold": "Kobold",
  "kraken": "Kraken",
  "krenshar": "Krenshar",
  "kuo-toa": "Kuo-Toa",
  "lamia": "Lâmia",
  "lammasu": "Lammasu",
  "leonal": "Leonal",
  "leopard": "Leopardo",
  "lich": "Lich",
  "lillend": "Lillend",
  "lion": "Leão",
  "lizard": "Lagarto",
  "lizardfolk": "Homem-Lagarto",
  "locust-swarm": "Enxame de Gafanhotos",
  "magmin": "Magmin",
  "manticore": "Manticora",
  "marilith": "Marilith",
  "marut": "Marut",
  "medusa": "Medusa",
  "megaraptor": "Megaraptor",
  "mimic": "Mímico",
  "mind-flayer": "Devorador de Mentes",
  "minotaur": "Minotauro",
  "mohrg": "Mohrg",
  "monkey": "Macaco",
  "mule": "Mula",
  "mummy": "Múmia",
  "nalfeshnee": "Nalfeshnee",
  "nightmare": "Pesadelo",
  "nightwalker": "Caminhante Noturno",
  "nixie": "Nixie",
  "nymph": "Ninfa",
  "ochre-jelly": "Geleia Ocre",
  "octopus": "Polvo",
  "ogre": "Ogro",
  "orc": "Orc",
  "otyugh": "Otyugh",
  "owl": "Coruja",
  "owlbear": "Corujurso",
  "pegasus": "Pégaso",
  "phaethon": "Phaethon",
  "phane": "Phane",
  "phase-spider": "Aranha de Fase",
  "phoenix": "Fênix",
  "pixie": "Pixie",
  "pony": "Pônei",
  "porpoise": "Golfinho",
  "pseudodragon": "Pseudodragão",
  "purple-worm": "Verme Púrpura",
  "quasit": "Quasit",
  "rakshasa": "Rakshasa",
  "rast": "Rast",
  "rat": "Rato",
  "raven": "Corvo",
  "ravid": "Ravid",
  "retriever": "Retriever",
  "rhinoceros": "Rinoceronte",
  "roc": "Roc",
  "roper": "Roper",
  "rust-monster": "Monstro Enferrujador",
  "sahuagin": "Sahuagin",
  "salamander": "Salamandra",
  "satyr": "Sátiro",
  "scorpion": "Escorpião",
  "sea-hag": "Bruxa Marinha",
  "shadow": "Sombra",
  "shadow-mastiff": "Mastim Sombrio",
  "shield-guardian": "Guardião Escudo",
  "shocker-lizard": "Lagarto Elétrico",
  "skeleton": "Esqueleto",
  "skum": "Skum",
  "spectre": "Espectro",
  "spider": "Aranha",
  "squid": "Lula",
  "stirge": "Estirge",
  "svirfneblin": "Svirfneblin",
  "tarrasque": "Tarrasque",
  "tendriculos": "Tendriculos",
  "thoqqua": "Thoqqua",
  "tiger": "Tigre",
  "titan": "Titã",
  "toad": "Sapo",
  "treant": "Treant",
  "triceratops": "Triceratops",
  "triton": "Tritão",
  "troglodte": "Troglodita",
  "troll": "Troll",
  "trumpet-archon": "Archon Trombeta",
  "tyrannosaurus": "Tiranossauro",
  "unicorn": "Unicórnio",
  "vampire": "Vampiro",
  "vampire-spawn": "Cria de Vampiro",
  "vargouille": "Vargouille",
  "viper": "Víbora",
  "vrock": "Vrock",
  "warhorse": "Cavalo de Guerra",
  "weasel": "Doninha",
  "whale": "Baleia",
  "wight": "Wight",
  "will-o-wisp": "Fogo-Fátuo",
  "winter-wolf": "Lobo do Inverno",
  "wolf": "Lobo",
  "wolverine": "Carcaju",
  "worg": "Worg",
  "wraith": "Wraith",
  "wyvern": "Wyvern",
  "xill": "Xill",
  "xixecal": "Xixecal",
  "xorn": "Xorn",
  "yrthak": "Yrthak",
  "zombie": "Zumbi",
};

// Padrões de tradução por tipo
const typePatterns: Record<string, string> = {
  "air-elemental": "Elemental do Ar",
  "earth-elemental": "Elemental da Terra",
  "fire-elemental": "Elemental do Fogo",
  "water-elemental": "Elemental da Água",
  "air-mephit": "Mefita do Ar",
  "dust-mephit": "Mefita do Pó",
  "earth-mephit": "Mefita da Terra",
  "fire-mephit": "Mefita do Fogo",
  "ice-mephit": "Mefita do Gelo",
  "magma-mephit": "Mefita do Magma",
  "ooze-mephit": "Mefita do Lodo",
  "salt-mephit": "Mefita do Sal",
  "steam-mephit": "Mefita do Vapor",
  "water-mephit": "Mefita da Água",
  "astral-construct": "Construto Astral",
  "formian-worker": "Formiano Operário",
  "formian-warrior": "Formiano Guerreiro",
  "formian-taskmaster": "Formiano Mestre de Tarefas",
  "formian-myrmarch": "Formiano Mirmarca",
  "formian-queen": "Formiano Rainha",
  "black-dragon": "Dragão Negro",
  "blue-dragon": "Dragão Azul",
  "brass-dragon": "Dragão de Latão",
  "bronze-dragon": "Dragão de Bronze",
  "copper-dragon": "Dragão de Cobre",
  "gold-dragon": "Dragão de Ouro",
  "green-dragon": "Dragão Verde",
  "red-dragon": "Dragão Vermelho",
  "silver-dragon": "Dragão de Prata",
  "white-dragon": "Dragão Branco",
  "force-dragon": "Dragão de Força",
  "prismatic-dragon": "Dragão Prismático",
  "giant-ant": "Formiga Gigante",
  "constrictor-snake": "Cobra Constritora",
  "monstrous-spider": "Aranha Monstruosa",
  "monstrous-scorpion": "Escorpião Monstruoso",
  "monstrous-centipede": "Centopeia Monstruosa",
  "dire-ape": "Símio Atroz",
  "dire-badger": "Texugo Atroz",
  "dire-bat": "Morcego Atroz",
  "dire-bear": "Urso Atroz",
  "dire-boar": "Javali Atroz",
  "dire-lion": "Leão Atroz",
  "dire-rat": "Rato Atroz",
  "dire-shark": "Tubarão Atroz",
  "dire-tiger": "Tigre Atroz",
  "dire-weasel": "Doninha Atroz",
  "dire-wolf": "Lobo Atroz",
  "dire-wolverine": "Carcaju Atroz",
  "cloud-giant": "Gigante das Nuvens",
  "fire-giant": "Gigante do Fogo",
  "frost-giant": "Gigante do Gelo",
  "hill-giant": "Gigante da Colina",
  "stone-giant": "Gigante de Pedra",
  "storm-giant": "Gigante da Tempestade",
  "clay-golem": "Golem de Argila",
  "flesh-golem": "Golem de Carne",
  "iron-golem": "Golem de Ferro",
  "stone-golem": "Golem de Pedra",
  "adamantine-golem": "Golem de Adamantino",
  "mithral-golem": "Golem de Mithral",
  "stone-colossus": "Colosso de Pedra",
  "flesh-colossus": "Colosso de Carne",
  "iron-colossus": "Colosso de Ferro",
  "devastation-beetle": "Besouro Devastador",
  "devastation-centipede": "Centopeia Devastadora",
  "devastation-scorpion": "Escorpião Devastador",
  "devastation-spider": "Aranha Devastadora",
  "behemoth-eagle": "Águia Behemoth",
  "behemoth-gorilla": "Gorila Behemoth",
  "brain-mole": "Toupeira Cerebral",
  "caller-in-darkness": "Chamador nas Trevas",
  "dark-naga": "Naga Sombria",
  "guardian-naga": "Naga Guardiã",
  "ha-naga": "Ha-Naga",
  "spirit-naga": "Naga Espiritual",
  "water-naga": "Naga Aquática",
  "barbed-devil": "Diabo Espinhoso",
  "bearded-devil": "Diabo Barbado",
  "bone-devil": "Diabo Ósseo",
  "chain-devil": "Diabo Acorrentado",
  "horned-devil": "Diabo Chifrudo",
  "ice-devil": "Diabo do Gelo",
  "pit-fiend": "Demônio do Poço",
  "gray-ooze": "Gosma Cinza",
  "gelatinous-cube": "Cubo Gelatinoso",
  "black-pudding": "Pudim Negro",
  "gray-render": "Renderizador Cinza",
  "chaos-beast": "Besta do Caos",
  "dragon-turtle": "Tartaruga-Dragão",
  "dread-wraith": "Wraith Temível",
  "dream-larva": "Larva Onírica",
  "green-hag": "Bruxa Verde",
  "night-hag": "Bruxa Noturna",
  "bat-swarm": "Enxame de Morcegos",
  "centipede-swarm": "Enxame de Centopeias",
  "hellwasp-swarm": "Enxame de Vespas Infernais",
  "rat-swarm": "Enxame de Ratos",
  "spider-swarm": "Enxame de Aranhas",
  "hound-archon": "Archon Canino",
  "lantern-archon": "Archon Lanterna",
  "celestial-charger": "Investidor Celestial",
  "shadow-mastiff": "Mastim das Sombras",
  "winter-wolf": "Lobo do Inverno",
  "phase-spider": "Aranha de Fase",
  "rust-monster": "Monstro Enferrujador",
  "mind-flayer": "Devorador de Mentes",
  "gibbering-mouther": "Boca Balbuciante",
  "gibbering-orb": "Orbe Balbuciante",
  "invisible-stalker": "Perseguidor Invisível",
  "purple-worm": "Verme Púrpura",
  "frost-worm": "Verme Gélido",
  "genius-loci": "Genius Loci",
  "golden-protector": "Protetor Dourado",
  "hoary-hunter": "Caçador Grisalho",
  "hoary-steed": "Corcel Grisalho",
  "greater-barghest": "Barghest Superior",
  "greater-shadow": "Sombra Superior",
  "greater-stone-golem": "Golem de Pedra Superior",
  "elder-arrowhawk": "Arrowhawk Ancião",
  "elder-black-pudding": "Pudim Negro Ancião",
  "elder-tojanida": "Tojanida Ancião",
  "elder-xorn": "Xorn Ancião",
  "adult-arrowhawk": "Arrowhawk Adulto",
  "adult-tojanida": "Tojanida Adulto",
  "average-salamander": "Salamandra Comum",
  "average-xorn": "Xorn Comum",
  "gray-glutton": "Glutão Cinza",
};

// Sufixos de idade de dragão
const dragonAges: Record<string, string> = {
  "wyrmling": "Filhote",
  "very-young": "Muito Jovem",
  "young": "Jovem",
  "juvenile": "Juvenil",
  "young-adult": "Adulto Jovem",
  "adult": "Adulto",
  "mature-adult": "Adulto Maduro",
  "old": "Velho",
  "very-old": "Muito Velho",
  "ancient": "Ancião",
  "wyrm": "Wyrm",
  "great-wyrm": "Grande Wyrm",
};

// Tamanhos de elementais/criaturas
const sizeNames: Record<string, string> = {
  "tiny": "Minúsculo",
  "small": "Pequeno",
  "medium": "Médio",
  "large": "Grande",
  "huge": "Enorme",
  "gargantuan": "Imenso",
  "colossal": "Colossal",
  "greater": "Superior",
  "elder": "Ancião",
  "primal": "Primordial",
};

// Números ordinais para construtos
const ordinals: Record<string, string> = {
  "1st": "1º",
  "2nd": "2º",
  "3rd": "3º",
  "4th": "4º",
  "5th": "5º",
  "6th": "6º",
  "7th": "7º",
  "8th": "8º",
  "9th": "9º",
  "10th": "10º",
  "11th": "11º",
  "12th": "12º",
};

// Hydra heads
const hydraHeads: Record<string, string> = {
  "five-headed": "Cinco Cabeças",
  "six-headed": "Seis Cabeças",
  "seven-headed": "Sete Cabeças",
  "eight-headed": "Oito Cabeças",
  "nine-headed": "Nove Cabeças",
  "ten-headed": "Dez Cabeças",
  "eleven-headed": "Onze Cabeças",
  "twelve-headed": "Doze Cabeças",
};

/**
 * Traduz o nome de um monstro 3.5 usando padrões de nomenclatura D&D.
 * Retorna null se não encontrar tradução.
 */
export function translateMonsterName(index: string, name: string): string | null {
  // Remove o sufixo -35 pra análise
  const base = index.replace(/-35$/, "");

  // 1. Tradução direta no dicionário
  if (directNames[base]) return directNames[base];

  // 2. Padrão exato no typePatterns
  if (typePatterns[base]) return typePatterns[base];

  // 3. Construto Astral (1st-level, 2nd-level, etc.)
  const constructMatch = base.match(/^(\d+)(?:st|nd|rd|th)-level-astral-construct$/);
  if (constructMatch) {
    return `Construto Astral de ${constructMatch[1]}º Nível`;
  }

  // 4. Dragão com idade
  for (const [dragonKey, dragonPt] of Object.entries(typePatterns)) {
    if (dragonKey.includes("dragon") && base.startsWith(dragonKey + "-")) {
      const suffix = base.replace(dragonKey + "-", "");
      if (dragonAges[suffix]) {
        return `${dragonPt}, ${dragonAges[suffix]}`;
      }
    }
  }

  // 5. Elementais com tamanho
  for (const [elemKey, elemPt] of Object.entries(typePatterns)) {
    if (elemKey.includes("elemental") && base.startsWith(elemKey + "-")) {
      const size = base.replace(elemKey + "-", "");
      if (sizeNames[size]) {
        return `${elemPt}, ${sizeNames[size]}`;
      }
    }
  }

  // 6. Hidra com número de cabeças
  const hydraMatch = base.match(/^([\w-]+)-headed-hydra$/);
  if (hydraMatch) {
    const headKey = hydraMatch[1] + "-headed";
    if (hydraHeads[headKey]) {
      return `Hidra de ${hydraHeads[headKey]}`;
    }
  }

  // 7. Variantes com tamanho (Giant Ant, Queen, etc.)
  for (const [typeKey, typePt] of Object.entries(typePatterns)) {
    if (base.startsWith(typeKey + "-")) {
      const suffix = base.replace(typeKey + "-", "");
      const suffixPt = sizeNames[suffix];
      if (suffixPt) return `${typePt}, ${suffixPt}`;
      // Variantes como queen, soldier, worker
      const variantMap: Record<string, string> = {
        "queen": "Rainha",
        "soldier": "Soldado",
        "worker": "Operária",
        "giant": "Gigante",
      };
      if (variantMap[suffix]) return `${typePt}, ${variantMap[suffix]}`;
    }
  }

  // 8. Mortos-vivos especiais
  if (base.endsWith("-skeleton")) {
    const creature = base.replace(/-skeleton$/, "");
    const creaturePt = directNames[creature] || typePatterns[creature];
    if (creaturePt) return `Esqueleto de ${creaturePt}`;
  }
  if (base.endsWith("-zombie")) {
    const creature = base.replace(/-zombie$/, "");
    const creaturePt = directNames[creature] || typePatterns[creature];
    if (creaturePt) return `Zumbi de ${creaturePt}`;
  }

  // 9. Variantes com ", " no nome (Bear, Black → Urso Negro)
  const commaMatch = name.match(/^(.+?),\s*(.+)$/);
  if (commaMatch) {
    const baseName = commaMatch[1].trim();
    const variant = commaMatch[2].trim();

    // Cores de bears, dragons, etc.
    const colorMap: Record<string, string> = {
      "Black": "Negro",
      "Brown": "Marrom",
      "Polar": "Polar",
      "White": "Branco",
      "Red": "Vermelho",
      "Blue": "Azul",
      "Green": "Verde",
      "Gold": "Dourado",
      "Silver": "Prateado",
      "Giant": "Gigante",
      "Heavy": "Pesado",
      "Light": "Leve",
      "Riding": "de Montaria",
      "Psionic": "Psiônico",
    };

    // Traduz o nome base
    const baseKey = baseName.toLowerCase().replace(/\s+/g, "-");
    const basePt = directNames[baseKey];
    const variantPt = colorMap[variant] || dragonAges[variant.toLowerCase().replace(/\s+/g, "-")];

    if (basePt && variantPt) return `${basePt} ${variantPt}`;
    if (basePt) return `${basePt}, ${variant}`;
  }

  // 10. Criatura com nível (1st-Level Warrior, etc.)
  const levelMatch = name.match(/^(.+?),\s*(\d+)(?:st|nd|rd|th)-Level\s+(.+)$/);
  if (levelMatch) {
    const creatureName = levelMatch[1].trim();
    const level = levelMatch[2];
    const className = levelMatch[3].trim();

    const creatureKey = creatureName.toLowerCase().replace(/\s+/g, "-");
    const creaturePt = directNames[creatureKey] || creatureName;

    const classMap: Record<string, string> = {
      "Warrior": "Guerreiro",
      "Wizard": "Mago",
      "Cleric": "Clérigo",
      "Fighter": "Guerreiro",
      "Rogue": "Ladino",
      "Blackguard": "Cavaleiro Negro",
    };
    const classPt = classMap[className] || className;

    return `${creaturePt}, ${classPt} de ${level}º Nível`;
  }

  // Fallback: sem tradução
  return null;
}
