// ══════════════════════════════════════════════════
// Hub RPG — Importação SRD D&D 3.5 (OGL)
// Dados dos Feats do SRD 3.5 (109 feats oficiais)
// ══════════════════════════════════════════════════

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ── Feats SRD 3.5 (109 feats oficiais) ────────────

interface Feat35 {
  index: string;
  name: string;
  namePtBr: string;
  type: string; // General, Fighter, Metamagic, Item Creation
  description: string;
  descriptionPtBr: string;
  prerequisites: string;
}

const FEATS_35: Feat35[] = [
  // === General Feats ===
  { index: "acrobatic-35", name: "Acrobatic", namePtBr: "Acrobático", type: "General", description: "You get a +2 bonus on all Jump checks and Tumble checks.", descriptionPtBr: "+2 em testes de Saltar e Acrobacia.", prerequisites: "None" },
  { index: "agile-35", name: "Agile", namePtBr: "Ágil", type: "General", description: "You get a +2 bonus on all Balance checks and Escape Artist checks.", descriptionPtBr: "+2 em testes de Equilíbrio e Artista do Escape.", prerequisites: "None" },
  { index: "alertness-35", name: "Alertness", namePtBr: "Prontidão", type: "General", description: "You get a +2 bonus on all Listen checks and Spot checks.", descriptionPtBr: "+2 em testes de Ouvir e Observar.", prerequisites: "None" },
  { index: "animal-affinity-35", name: "Animal Affinity", namePtBr: "Afinidade Animal", type: "General", description: "You get a +2 bonus on all Handle Animal checks and Ride checks.", descriptionPtBr: "+2 em testes de Adestrar Animais e Cavalgar.", prerequisites: "None" },
  { index: "armor-proficiency-heavy-35", name: "Armor Proficiency (Heavy)", namePtBr: "Usar Armadura (Pesada)", type: "General", description: "You are proficient with heavy armor.", descriptionPtBr: "Você sabe usar armaduras pesadas.", prerequisites: "Armor Proficiency (Light), Armor Proficiency (Medium)" },
  { index: "armor-proficiency-light-35", name: "Armor Proficiency (Light)", namePtBr: "Usar Armadura (Leve)", type: "General", description: "You are proficient with light armor.", descriptionPtBr: "Você sabe usar armaduras leves.", prerequisites: "None" },
  { index: "armor-proficiency-medium-35", name: "Armor Proficiency (Medium)", namePtBr: "Usar Armadura (Média)", type: "General", description: "You are proficient with medium armor.", descriptionPtBr: "Você sabe usar armaduras médias.", prerequisites: "Armor Proficiency (Light)" },
  { index: "athletic-35", name: "Athletic", namePtBr: "Atlético", type: "General", description: "You get a +2 bonus on all Climb checks and Swim checks.", descriptionPtBr: "+2 em testes de Escalar e Nadar.", prerequisites: "None" },
  { index: "augment-summoning-35", name: "Augment Summoning", namePtBr: "Augmentar Invocação", type: "General", description: "Each creature you conjure with any summon spell gains +4 Str and +4 Con.", descriptionPtBr: "Criaturas invocadas ganham +4 FOR e +4 CON.", prerequisites: "Spell Focus (Conjuration)" },
  { index: "blind-fight-35", name: "Blind-Fight", namePtBr: "Luta às Cegas", type: "General", description: "In melee, every time you miss because of concealment, you can reroll your miss chance percentile.", descriptionPtBr: "Em combate corpo-a-corpo, você pode rolar novamente a chance de falha por camuflagem.", prerequisites: "None" },
  { index: "combat-casting-35", name: "Combat Casting", namePtBr: "Conjuração em Combate", type: "General", description: "You get a +4 bonus on Concentration checks made to cast a spell while on the defensive.", descriptionPtBr: "+4 em testes de Concentração para conjurar na defensiva.", prerequisites: "None" },
  { index: "combat-expertise-35", name: "Combat Expertise", namePtBr: "Expertise em Combate", type: "General", description: "You can take a penalty of up to -5 on attack rolls and add the same number to AC as a dodge bonus.", descriptionPtBr: "Penalidade de até -5 no ataque para ganhar bônus de esquiva na CA.", prerequisites: "Int 13" },
  { index: "combat-reflexes-35", name: "Combat Reflexes", namePtBr: "Reflexos em Combate", type: "General", description: "You may make additional attacks of opportunity equal to your Dex bonus.", descriptionPtBr: "Ataques de oportunidade adicionais iguais ao seu bônus de DES.", prerequisites: "None" },
  { index: "deceitful-35", name: "Deceitful", namePtBr: "Dissimulado", type: "General", description: "You get a +2 bonus on all Disguise checks and Forgery checks.", descriptionPtBr: "+2 em testes de Disfarce e Falsificação.", prerequisites: "None" },
  { index: "deft-hands-35", name: "Deft Hands", namePtBr: "Mãos Hábeis", type: "General", description: "You get a +2 bonus on all Sleight of Hand checks and Use Rope checks.", descriptionPtBr: "+2 em testes de Prestidigitação e Usar Corda.", prerequisites: "None" },
  { index: "diligent-35", name: "Diligent", namePtBr: "Diligente", type: "General", description: "You get a +2 bonus on all Appraise checks and Decipher Script checks.", descriptionPtBr: "+2 em testes de Avaliação e Decifrar Escrita.", prerequisites: "None" },
  { index: "dodge-35", name: "Dodge", namePtBr: "Esquiva", type: "General", description: "You gain a +1 dodge bonus to AC against attacks by a designated opponent.", descriptionPtBr: "+1 bônus de esquiva na CA contra um oponente designado.", prerequisites: "Dex 13" },
  { index: "endurance-35", name: "Endurance", namePtBr: "Resistência", type: "General", description: "You gain a +4 bonus on various checks to resist nonlethal damage.", descriptionPtBr: "+4 em testes de resistência a dano não-letal e efeitos ambientais.", prerequisites: "None" },
  { index: "eschew-materials-35", name: "Eschew Materials", namePtBr: "Dispensar Materiais", type: "General", description: "You can cast spells without needing material components worth 1 gp or less.", descriptionPtBr: "Conjurar sem componentes materiais de até 1 po.", prerequisites: "None" },
  { index: "extra-turning-35", name: "Extra Turning", namePtBr: "Expulsão Extra", type: "General", description: "You can turn or rebuke undead four more times per day.", descriptionPtBr: "+4 tentativas extras de expulsar/fascinar mortos-vivos por dia.", prerequisites: "Ability to turn or rebuke undead" },
  { index: "great-fortitude-35", name: "Great Fortitude", namePtBr: "Fortitude Maior", type: "General", description: "You get a +2 bonus on all Fortitude saving throws.", descriptionPtBr: "+2 em testes de resistência de Fortitude.", prerequisites: "None" },
  { index: "improved-counterspell-35", name: "Improved Counterspell", namePtBr: "Contramagia Aprimorada", type: "General", description: "You can counter a spell with a spell of the same school one or more levels higher.", descriptionPtBr: "Contra-atacar magias com uma magia da mesma escola de nível superior.", prerequisites: "None" },
  { index: "improved-critical-35", name: "Improved Critical", namePtBr: "Crítico Aprimorado", type: "General", description: "When using the chosen weapon, your threat range is doubled.", descriptionPtBr: "Dobra a margem de ameaça da arma escolhida.", prerequisites: "Proficiency with weapon, BAB +8" },
  { index: "improved-initiative-35", name: "Improved Initiative", namePtBr: "Iniciativa Aprimorada", type: "General", description: "You get a +4 bonus on initiative checks.", descriptionPtBr: "+4 em testes de iniciativa.", prerequisites: "None" },
  { index: "improved-turning-35", name: "Improved Turning", namePtBr: "Expulsão Aprimorada", type: "General", description: "You turn or rebuke undead as if you were one level higher.", descriptionPtBr: "Expulsar mortos-vivos como se fosse 1 nível acima.", prerequisites: "Ability to turn or rebuke undead" },
  { index: "improved-unarmed-strike-35", name: "Improved Unarmed Strike", namePtBr: "Ataque Desarmado Aprimorado", type: "General", description: "You are considered armed even when unarmed.", descriptionPtBr: "Você é considerado armado mesmo desarmado. Dano não-letal ou letal.", prerequisites: "None" },
  { index: "investigator-35", name: "Investigator", namePtBr: "Investigador", type: "General", description: "You get a +2 bonus on all Gather Information checks and Search checks.", descriptionPtBr: "+2 em testes de Obter Informação e Procurar.", prerequisites: "None" },
  { index: "iron-will-35", name: "Iron Will", namePtBr: "Vontade de Ferro", type: "General", description: "You get a +2 bonus on all Will saving throws.", descriptionPtBr: "+2 em testes de resistência de Vontade.", prerequisites: "None" },
  { index: "leadership-35", name: "Leadership", namePtBr: "Liderança", type: "General", description: "You attract followers and a cohort.", descriptionPtBr: "Você atrai seguidores e um companheiro leal.", prerequisites: "Character level 6th" },
  { index: "lightning-reflexes-35", name: "Lightning Reflexes", namePtBr: "Reflexos Rápidos", type: "General", description: "You get a +2 bonus on all Reflex saving throws.", descriptionPtBr: "+2 em testes de resistência de Reflexos.", prerequisites: "None" },
  { index: "magical-aptitude-35", name: "Magical Aptitude", namePtBr: "Aptidão Mágica", type: "General", description: "You get a +2 bonus on all Spellcraft checks and Use Magic Device checks.", descriptionPtBr: "+2 em testes de Identificar Magia e Usar Item Mágico.", prerequisites: "None" },
  { index: "martial-weapon-proficiency-35", name: "Martial Weapon Proficiency", namePtBr: "Usar Arma Marcial", type: "General", description: "You make attack rolls with the selected weapon normally.", descriptionPtBr: "Usar normalmente uma arma marcial escolhida.", prerequisites: "None" },
  { index: "mounted-combat-35", name: "Mounted Combat", namePtBr: "Combate Montado", type: "General", description: "Once per round you can negate a hit on your mount with a Ride check.", descriptionPtBr: "1/rodada, negar um ataque na montaria com teste de Cavalgar.", prerequisites: "Ride 1 rank" },
  { index: "natural-spell-35", name: "Natural Spell", namePtBr: "Magia Natural", type: "General", description: "You can complete the verbal and somatic components of spells while in wild shape.", descriptionPtBr: "Conjurar magias enquanto em forma selvagem.", prerequisites: "Wis 13, wild shape" },
  { index: "negotiator-35", name: "Negotiator", namePtBr: "Negociador", type: "General", description: "You get a +2 bonus on all Diplomacy checks and Sense Motive checks.", descriptionPtBr: "+2 em testes de Diplomacia e Intuição.", prerequisites: "None" },
  { index: "nimble-fingers-35", name: "Nimble Fingers", namePtBr: "Dedos Ágeis", type: "General", description: "You get a +2 bonus on all Disable Device checks and Open Lock checks.", descriptionPtBr: "+2 em testes de Desmontar Dispositivo e Abrir Fechadura.", prerequisites: "None" },
  { index: "persuasive-35", name: "Persuasive", namePtBr: "Persuasivo", type: "General", description: "You get a +2 bonus on all Bluff checks and Intimidate checks.", descriptionPtBr: "+2 em testes de Blefar e Intimidar.", prerequisites: "None" },
  { index: "point-blank-shot-35", name: "Point Blank Shot", namePtBr: "Tiro Certeiro", type: "General", description: "+1 to attack and damage with ranged weapons at up to 30 feet.", descriptionPtBr: "+1 no ataque e dano com armas de ataque à distância a até 9 metros.", prerequisites: "None" },
  { index: "power-attack-35", name: "Power Attack", namePtBr: "Ataque Poderoso", type: "General", description: "You can subtract from your melee attack roll and add to your melee damage roll.", descriptionPtBr: "Subtrair do ataque corpo-a-corpo para adicionar ao dano.", prerequisites: "Str 13" },
  { index: "quick-draw-35", name: "Quick Draw", namePtBr: "Sacar Rápido", type: "General", description: "You can draw a weapon as a free action instead of as a move action.", descriptionPtBr: "Sacar arma como ação livre ao invés de ação de movimento.", prerequisites: "BAB +1" },
  { index: "rapid-reload-35", name: "Rapid Reload", namePtBr: "Recarga Rápida", type: "General", description: "The time required to reload your chosen crossbow is reduced.", descriptionPtBr: "Reduz o tempo de recarga da besta escolhida.", prerequisites: "Weapon Proficiency (crossbow)" },
  { index: "run-35", name: "Run", namePtBr: "Corrida", type: "General", description: "You can run five times your normal speed.", descriptionPtBr: "Correr a 5x sua velocidade normal (ao invés de 4x).", prerequisites: "None" },
  { index: "self-sufficient-35", name: "Self-Sufficient", namePtBr: "Autossuficiente", type: "General", description: "You get a +2 bonus on all Heal checks and Survival checks.", descriptionPtBr: "+2 em testes de Cura e Sobrevivência.", prerequisites: "None" },
  { index: "shield-proficiency-35", name: "Shield Proficiency", namePtBr: "Usar Escudo", type: "General", description: "You are proficient with shields.", descriptionPtBr: "Você sabe usar escudos.", prerequisites: "None" },
  { index: "simple-weapon-proficiency-35", name: "Simple Weapon Proficiency", namePtBr: "Usar Arma Simples", type: "General", description: "You make attack rolls with simple weapons normally.", descriptionPtBr: "Usar normalmente armas simples.", prerequisites: "None" },
  { index: "skill-focus-35", name: "Skill Focus", namePtBr: "Foco em Perícia", type: "General", description: "You get a +3 bonus on all checks involving the chosen skill.", descriptionPtBr: "+3 em testes da perícia escolhida.", prerequisites: "None" },
  { index: "spell-focus-35", name: "Spell Focus", namePtBr: "Foco em Magia", type: "General", description: "Add +1 to the DC for all saving throws against spells of the chosen school.", descriptionPtBr: "+1 na CD das magias da escola escolhida.", prerequisites: "None" },
  { index: "spell-mastery-35", name: "Spell Mastery", namePtBr: "Domínio de Magia", type: "General", description: "You can prepare some spells without a spellbook.", descriptionPtBr: "Preparar magias sem grimório (número = bônus de INT).", prerequisites: "Wizard level 1st" },
  { index: "spell-penetration-35", name: "Spell Penetration", namePtBr: "Penetração em Magia", type: "General", description: "You get a +2 bonus on caster level checks to overcome spell resistance.", descriptionPtBr: "+2 em testes de nível de conjurador para superar resistência a magia.", prerequisites: "None" },
  { index: "stealthy-35", name: "Stealthy", namePtBr: "Furtivo", type: "General", description: "You get a +2 bonus on all Hide checks and Move Silently checks.", descriptionPtBr: "+2 em testes de Esconder-se e Mover em Silêncio.", prerequisites: "None" },
  { index: "toughness-35", name: "Toughness", namePtBr: "Durão", type: "General", description: "You gain +3 hit points.", descriptionPtBr: "+3 pontos de vida.", prerequisites: "None" },
  { index: "track-35", name: "Track", namePtBr: "Rastrear", type: "General", description: "You can find and follow tracks and trails.", descriptionPtBr: "Encontrar e seguir rastros usando teste de Sobrevivência.", prerequisites: "None" },
  { index: "two-weapon-fighting-35", name: "Two-Weapon Fighting", namePtBr: "Combate com Duas Armas", type: "General", description: "Your penalties on attack rolls for fighting with two weapons are reduced.", descriptionPtBr: "Reduz penalidades por lutar com duas armas.", prerequisites: "Dex 15" },
  { index: "weapon-finesse-35", name: "Weapon Finesse", namePtBr: "Acuidade com Arma", type: "General", description: "Use Dex instead of Str on attack rolls with light melee weapons.", descriptionPtBr: "Usar DES ao invés de FOR para ataques com armas leves corpo-a-corpo.", prerequisites: "BAB +1" },
  { index: "weapon-focus-35", name: "Weapon Focus", namePtBr: "Foco em Arma", type: "General", description: "You gain +1 bonus on all attack rolls you make using the selected weapon.", descriptionPtBr: "+1 no ataque com a arma escolhida.", prerequisites: "Proficiency with weapon, BAB +1" },

  // === Fighter Bonus Feats ===
  { index: "cleave-35", name: "Cleave", namePtBr: "Golpe Cleave", type: "Fighter", description: "If you deal a creature enough damage to make it drop, you get an immediate extra melee attack.", descriptionPtBr: "Ao derrubar um inimigo, ataque extra corpo-a-corpo imediato.", prerequisites: "Str 13, Power Attack" },
  { index: "deflect-arrows-35", name: "Deflect Arrows", namePtBr: "Desviar Flechas", type: "Fighter", description: "You can deflect one ranged attack per round.", descriptionPtBr: "Desviar 1 ataque à distância por rodada.", prerequisites: "Dex 13, Improved Unarmed Strike" },
  { index: "far-shot-35", name: "Far Shot", namePtBr: "Tiro de Longa Distância", type: "Fighter", description: "Your range increment increases by 50% when using a projectile weapon.", descriptionPtBr: "Incremento de distância +50% com armas de projétil.", prerequisites: "Point Blank Shot" },
  { index: "great-cleave-35", name: "Great Cleave", namePtBr: "Golpe Cleave Maior", type: "Fighter", description: "As Cleave, except there is no limit to the number of times you can use it per round.", descriptionPtBr: "Como Cleave, mas sem limite de vezes por rodada.", prerequisites: "Str 13, Power Attack, Cleave, BAB +4" },
  { index: "greater-spell-focus-35", name: "Greater Spell Focus", namePtBr: "Foco em Magia Maior", type: "General", description: "+1 to DC (stacks with Spell Focus) for chosen school.", descriptionPtBr: "+1 na CD das magias da escola escolhida (acumula com Foco em Magia).", prerequisites: "Spell Focus" },
  { index: "greater-spell-penetration-35", name: "Greater Spell Penetration", namePtBr: "Penetração em Magia Maior", type: "General", description: "+2 to caster level checks (stacks with Spell Penetration).", descriptionPtBr: "+2 nos testes de nível de conjurador (acumula com Penetração em Magia).", prerequisites: "Spell Penetration" },
  { index: "greater-two-weapon-fighting-35", name: "Greater Two-Weapon Fighting", namePtBr: "Combate com Duas Armas Maior", type: "Fighter", description: "You get a third attack with your off-hand weapon at -10.", descriptionPtBr: "Terceiro ataque com a mão inábil com -10.", prerequisites: "Dex 19, Improved Two-Weapon Fighting, Two-Weapon Fighting, BAB +11" },
  { index: "greater-weapon-focus-35", name: "Greater Weapon Focus", namePtBr: "Foco em Arma Maior", type: "Fighter", description: "+1 bonus on attack rolls (stacks with Weapon Focus).", descriptionPtBr: "+1 extra no ataque com a arma (acumula com Foco em Arma).", prerequisites: "Fighter 8th, Weapon Focus" },
  { index: "greater-weapon-specialization-35", name: "Greater Weapon Specialization", namePtBr: "Especialização em Arma Maior", type: "Fighter", description: "+2 bonus on damage rolls (stacks with Weapon Specialization).", descriptionPtBr: "+2 extra no dano (acumula com Especialização em Arma).", prerequisites: "Fighter 12th, Greater Weapon Focus, Weapon Specialization" },
  { index: "improved-bull-rush-35", name: "Improved Bull Rush", namePtBr: "Encontrão Aprimorado", type: "Fighter", description: "You do not provoke an attack of opportunity when performing a bull rush.", descriptionPtBr: "Encontrão não provoca ataque de oportunidade.", prerequisites: "Str 13, Power Attack" },
  { index: "improved-disarm-35", name: "Improved Disarm", namePtBr: "Desarmar Aprimorado", type: "Fighter", description: "You do not provoke an attack of opportunity when attempting to disarm.", descriptionPtBr: "Desarmar não provoca ataque de oportunidade. +4 no teste.", prerequisites: "Int 13, Combat Expertise" },
  { index: "improved-feint-35", name: "Improved Feint", namePtBr: "Fintar Aprimorado", type: "Fighter", description: "You can make a Bluff check to feint as a move action.", descriptionPtBr: "Fintar como ação de movimento (ao invés de ação padrão).", prerequisites: "Int 13, Combat Expertise" },
  { index: "improved-grapple-35", name: "Improved Grapple", namePtBr: "Agarrar Aprimorado", type: "Fighter", description: "You do not provoke an attack of opportunity when attempting to grapple.", descriptionPtBr: "Agarrar não provoca ataque de oportunidade. +4 no teste.", prerequisites: "Dex 13, Improved Unarmed Strike" },
  { index: "improved-overrun-35", name: "Improved Overrun", namePtBr: "Atropelar Aprimorado", type: "Fighter", description: "Target may not choose to avoid you when you attempt to overrun.", descriptionPtBr: "Alvo não pode evitar seu atropelar.", prerequisites: "Str 13, Power Attack" },
  { index: "improved-precise-shot-35", name: "Improved Precise Shot", namePtBr: "Tiro Preciso Aprimorado", type: "Fighter", description: "Your ranged attacks ignore cover and concealment penalties.", descriptionPtBr: "Ataques à distância ignoram penalidades de cobertura e camuflagem.", prerequisites: "Dex 19, Point Blank Shot, Precise Shot, BAB +11" },
  { index: "improved-shield-bash-35", name: "Improved Shield Bash", namePtBr: "Golpe com Escudo Aprimorado", type: "Fighter", description: "You retain your shield bonus to AC when shield bashing.", descriptionPtBr: "Manter bônus de CA ao atacar com escudo.", prerequisites: "Shield Proficiency" },
  { index: "improved-sunder-35", name: "Improved Sunder", namePtBr: "Destruir Aprimorado", type: "Fighter", description: "You do not provoke an attack of opportunity when sundering.", descriptionPtBr: "Destruir item não provoca ataque de oportunidade.", prerequisites: "Str 13, Power Attack" },
  { index: "improved-trip-35", name: "Improved Trip", namePtBr: "Derrubar Aprimorado", type: "Fighter", description: "You do not provoke an attack of opportunity when tripping. +4 bonus.", descriptionPtBr: "Derrubar não provoca ataque de oportunidade. +4 no teste.", prerequisites: "Int 13, Combat Expertise" },
  { index: "improved-two-weapon-fighting-35", name: "Improved Two-Weapon Fighting", namePtBr: "Combate com Duas Armas Aprimorado", type: "Fighter", description: "You get a second attack with your off-hand weapon at -5.", descriptionPtBr: "Segundo ataque com a mão inábil com -5.", prerequisites: "Dex 17, Two-Weapon Fighting, BAB +6" },
  { index: "manyshot-35", name: "Manyshot", namePtBr: "Tiro Múltiplo", type: "Fighter", description: "You can fire multiple arrows at a single target as a standard action.", descriptionPtBr: "Disparar múltiplas flechas como ação padrão.", prerequisites: "Dex 17, Point Blank Shot, Rapid Shot, BAB +6" },
  { index: "mobility-35", name: "Mobility", namePtBr: "Mobilidade", type: "Fighter", description: "You get a +4 dodge bonus to AC against attacks of opportunity.", descriptionPtBr: "+4 bônus de esquiva na CA contra ataques de oportunidade.", prerequisites: "Dex 13, Dodge" },
  { index: "mounted-archery-35", name: "Mounted Archery", namePtBr: "Arquearia Montada", type: "Fighter", description: "The penalty for using ranged weapons while mounted is halved.", descriptionPtBr: "Penalidade para ataques à distância montado é reduzida pela metade.", prerequisites: "Ride 1 rank, Mounted Combat" },
  { index: "precise-shot-35", name: "Precise Shot", namePtBr: "Tiro Preciso", type: "Fighter", description: "You can shoot into melee without the standard -4 penalty.", descriptionPtBr: "Atirar em combate corpo-a-corpo sem penalidade de -4.", prerequisites: "Point Blank Shot" },
  { index: "rapid-shot-35", name: "Rapid Shot", namePtBr: "Tiro Rápido", type: "Fighter", description: "You can get one extra attack per round with a ranged weapon.", descriptionPtBr: "1 ataque extra por rodada com arma de ataque à distância (-2 em todos).", prerequisites: "Dex 13, Point Blank Shot" },
  { index: "ride-by-attack-35", name: "Ride-By Attack", namePtBr: "Ataque Montado de Passagem", type: "Fighter", description: "You can move before and after a mounted charge.", descriptionPtBr: "Mover antes e depois de uma investida montada.", prerequisites: "Ride 1 rank, Mounted Combat" },
  { index: "shot-on-the-run-35", name: "Shot on the Run", namePtBr: "Tiro em Movimento", type: "Fighter", description: "You can move, make a ranged attack, and move again.", descriptionPtBr: "Mover, atacar à distância e mover novamente.", prerequisites: "Dex 13, Dodge, Mobility, Point Blank Shot, BAB +4" },
  { index: "snatch-arrows-35", name: "Snatch Arrows", namePtBr: "Apanhar Flechas", type: "Fighter", description: "You can catch arrows, crossbow bolts, and other projectiles.", descriptionPtBr: "Pegar flechas e projéteis ao invés de apenas defletir.", prerequisites: "Dex 15, Deflect Arrows, Improved Unarmed Strike" },
  { index: "spirited-charge-35", name: "Spirited Charge", namePtBr: "Investida Enérgica", type: "Fighter", description: "When mounted and using the charge action, you deal double damage with a melee weapon.", descriptionPtBr: "Dano dobrado em investida montada (triplo com lança).", prerequisites: "Ride 1 rank, Mounted Combat, Ride-By Attack" },
  { index: "spring-attack-35", name: "Spring Attack", namePtBr: "Ataque Giratório", type: "Fighter", description: "You can move, attack, and move again, provoking no AoO from the target.", descriptionPtBr: "Mover, atacar corpo-a-corpo e mover sem provocar AdO do alvo.", prerequisites: "Dex 13, Dodge, Mobility, BAB +4" },
  { index: "stunning-fist-35", name: "Stunning Fist", namePtBr: "Soco Atordoante", type: "Fighter", description: "You can stun a creature damaged by your unarmed attack.", descriptionPtBr: "Atordoar criatura atingida por ataque desarmado.", prerequisites: "Dex 13, Wis 13, Improved Unarmed Strike, BAB +8" },
  { index: "trample-35", name: "Trample", namePtBr: "Atropelar Montado", type: "Fighter", description: "When you attempt to overrun while mounted, your mount may make an attack.", descriptionPtBr: "Montaria pode atacar ao atropelar.", prerequisites: "Ride 1 rank, Mounted Combat" },
  { index: "two-weapon-defense-35", name: "Two-Weapon Defense", namePtBr: "Defesa com Duas Armas", type: "Fighter", description: "You gain a +1 shield bonus to AC when fighting with two weapons.", descriptionPtBr: "+1 bônus de escudo na CA ao lutar com duas armas.", prerequisites: "Dex 15, Two-Weapon Fighting" },
  { index: "weapon-specialization-35", name: "Weapon Specialization", namePtBr: "Especialização em Arma", type: "Fighter", description: "You gain a +2 bonus on damage rolls with the chosen weapon.", descriptionPtBr: "+2 no dano com a arma escolhida.", prerequisites: "Fighter 4th, Weapon Focus" },
  { index: "whirlwind-attack-35", name: "Whirlwind Attack", namePtBr: "Ataque Giratório Total", type: "Fighter", description: "You can give up your regular attacks to make one melee attack against each opponent within reach.", descriptionPtBr: "1 ataque corpo-a-corpo contra cada inimigo ao alcance.", prerequisites: "Dex 13, Int 13, Combat Expertise, Dodge, Mobility, Spring Attack, BAB +4" },

  // === Item Creation Feats ===
  { index: "brew-potion-35", name: "Brew Potion", namePtBr: "Preparar Poção", type: "Item Creation", description: "You can create magic potions.", descriptionPtBr: "Criar poções mágicas (magias de até 3° nível).", prerequisites: "Caster level 3rd" },
  { index: "craft-magic-arms-and-armor-35", name: "Craft Magic Arms and Armor", namePtBr: "Criar Armas e Armaduras Mágicas", type: "Item Creation", description: "You can create magic weapons, armor, and shields.", descriptionPtBr: "Criar armas, armaduras e escudos mágicos.", prerequisites: "Caster level 5th" },
  { index: "craft-rod-35", name: "Craft Rod", namePtBr: "Criar Bastão", type: "Item Creation", description: "You can create magic rods.", descriptionPtBr: "Criar bastões mágicos.", prerequisites: "Caster level 9th" },
  { index: "craft-staff-35", name: "Craft Staff", namePtBr: "Criar Cajado", type: "Item Creation", description: "You can create magic staffs.", descriptionPtBr: "Criar cajados mágicos.", prerequisites: "Caster level 12th" },
  { index: "craft-wand-35", name: "Craft Wand", namePtBr: "Criar Varinha", type: "Item Creation", description: "You can create magic wands.", descriptionPtBr: "Criar varinhas mágicas.", prerequisites: "Caster level 5th" },
  { index: "craft-wondrous-item-35", name: "Craft Wondrous Item", namePtBr: "Criar Item Maravilhoso", type: "Item Creation", description: "You can create wondrous items.", descriptionPtBr: "Criar itens maravilhosos.", prerequisites: "Caster level 3rd" },
  { index: "forge-ring-35", name: "Forge Ring", namePtBr: "Forjar Anel", type: "Item Creation", description: "You can create magic rings.", descriptionPtBr: "Criar anéis mágicos.", prerequisites: "Caster level 12th" },
  { index: "scribe-scroll-35", name: "Scribe Scroll", namePtBr: "Escribir Pergaminho", type: "Item Creation", description: "You can create magic scrolls.", descriptionPtBr: "Criar pergaminhos mágicos.", prerequisites: "Caster level 1st" },

  // === Metamagic Feats ===
  { index: "empower-spell-35", name: "Empower Spell", namePtBr: "Potencializar Magia", type: "Metamagic", description: "All variable, numeric effects of an empowered spell are increased by one-half.", descriptionPtBr: "Efeitos numéricos da magia aumentam em 50%. Ocupa slot 2 níveis acima.", prerequisites: "None" },
  { index: "enlarge-spell-35", name: "Enlarge Spell", namePtBr: "Ampliar Magia", type: "Metamagic", description: "Double the range of the spell.", descriptionPtBr: "Dobra o alcance da magia. Ocupa slot 1 nível acima.", prerequisites: "None" },
  { index: "extend-spell-35", name: "Extend Spell", namePtBr: "Estender Magia", type: "Metamagic", description: "An extended spell lasts twice as long as normal.", descriptionPtBr: "Dobra a duração da magia. Ocupa slot 1 nível acima.", prerequisites: "None" },
  { index: "heighten-spell-35", name: "Heighten Spell", namePtBr: "Elevar Magia", type: "Metamagic", description: "A heightened spell has a higher spell level than normal.", descriptionPtBr: "Aumenta o nível efetivo da magia.", prerequisites: "None" },
  { index: "maximize-spell-35", name: "Maximize Spell", namePtBr: "Maximizar Magia", type: "Metamagic", description: "All variable, numeric effects are maximized.", descriptionPtBr: "Todos os efeitos numéricos são maximizados. Ocupa slot 3 níveis acima.", prerequisites: "None" },
  { index: "quicken-spell-35", name: "Quicken Spell", namePtBr: "Acelerar Magia", type: "Metamagic", description: "You can cast a quickened spell as a swift action.", descriptionPtBr: "Conjurar como ação rápida. Ocupa slot 4 níveis acima.", prerequisites: "None" },
  { index: "silent-spell-35", name: "Silent Spell", namePtBr: "Magia Silenciosa", type: "Metamagic", description: "A silent spell can be cast with no verbal components.", descriptionPtBr: "Conjurar sem componentes verbais. Ocupa slot 1 nível acima.", prerequisites: "None" },
  { index: "still-spell-35", name: "Still Spell", namePtBr: "Magia Imóvel", type: "Metamagic", description: "A stilled spell can be cast with no somatic components.", descriptionPtBr: "Conjurar sem componentes somáticos. Ocupa slot 1 nível acima.", prerequisites: "None" },
  { index: "widen-spell-35", name: "Widen Spell", namePtBr: "Expandir Magia", type: "Metamagic", description: "Double the area of the spell.", descriptionPtBr: "Dobra a área da magia. Ocupa slot 3 níveis acima.", prerequisites: "None" },
];

// ── Execução ──────────────────────────────────

async function importFeats35() {
  console.log("⚔️ Hub RPG — Importação SRD D&D 3.5");
  console.log("═".repeat(40));

  let created = 0;
  let skipped = 0;

  for (const feat of FEATS_35) {
    const existing = await prisma.srdFeat.findUnique({ where: { index: feat.index } });
    if (existing) {
      skipped++;
      continue;
    }

    await prisma.srdFeat.create({
      data: {
        index: feat.index,
        name: feat.name,
        namePtBr: feat.namePtBr,
        edition: "3.5",
        description: `${feat.description}\n\nType: ${feat.type}\nPrerequisites: ${feat.prerequisites}`,
        descriptionPtBr: `${feat.descriptionPtBr}\n\nTipo: ${feat.type === "General" ? "Geral" : feat.type === "Fighter" ? "Guerreiro" : feat.type === "Metamagic" ? "Metamagia" : feat.type === "Item Creation" ? "Criação de Item" : feat.type}\nPré-requisitos: ${feat.prerequisites}`,
        prerequisites: JSON.stringify({ raw: feat.prerequisites, type: feat.type }),
        source: "SRD 3.5",
      },
    });
    created++;
  }

  console.log(`\n🎯 Talentos 3.5: ${created} criados, ${skipped} já existiam`);
  console.log(`   Total: ${FEATS_35.length} feats do SRD 3.5`);
}

async function main() {
  await importFeats35();

  // Contagem final
  const total35 = await prisma.srdFeat.count({ where: { edition: "3.5" } });
  const total5e = await prisma.srdFeat.count({ where: { edition: "5e" } });
  console.log(`\n📊 Feats no banco: ${total35} (3.5) + ${total5e} (5e) = ${total35 + total5e} total`);
  console.log("✅ Importação 3.5 concluída!");
}

main()
  .catch((e) => { console.error("Erro:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
