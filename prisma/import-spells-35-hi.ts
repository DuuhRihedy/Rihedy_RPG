// Magias SRD 3.5 — Níveis 4-9 (PT-BR primeiro)

import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

interface Spell35 {
  index: string; name: string; namePtBr: string; level: number;
  school: string; castingTime: string; range: string; duration: string;
  components: string; description: string; descriptionPtBr: string; classes: string;
}

const SPELLS_HI: Spell35[] = [
  // ── Nível 4 ────────────────────────────
  { index: "cure-critical-wounds-35", name: "Cure Critical Wounds", namePtBr: "Curar Ferimentos Críticos", level: 4, school: "Conjuration", castingTime: "1 action", range: "Touch", duration: "Instantaneous", components: "V, S", description: "Cures 4d8 +1/level damage (max +20).", descriptionPtBr: "Cura 4d8 +1/nível (máx +20) de dano.", classes: "Bard, Cleric, Druid" },
  { index: "dimension-door-35", name: "Dimension Door", namePtBr: "Porta Dimensional", level: 4, school: "Conjuration", castingTime: "1 action", range: "Long", duration: "Instantaneous", components: "V", description: "Teleports you a short distance (up to 400 ft + 40 ft/level).", descriptionPtBr: "Teletransporte instantâneo a curta distância (até 120m + 12m/nível).", classes: "Bard, Sorcerer, Wizard" },
  { index: "divine-power-35", name: "Divine Power", namePtBr: "Poder Divino", level: 4, school: "Evocation", castingTime: "1 action", range: "Personal", duration: "1 round/level", components: "V, S, DF", description: "You gain BAB equal to character level, +6 Str, +1 HP/level.", descriptionPtBr: "BBA igual ao nível de personagem, +6 FOR, +1 PV/nível.", classes: "Cleric" },
  { index: "fire-shield-35", name: "Fire Shield", namePtBr: "Escudo de Fogo", level: 4, school: "Evocation", castingTime: "1 action", range: "Personal", duration: "1 round/level", components: "V, S, M", description: "Creatures attacking you take fire/cold damage; you resist cold/fire.", descriptionPtBr: "Atacantes corpo-a-corpo recebem 1d6+1/nível de dano. Resistência ao tipo oposto.", classes: "Sorcerer, Wizard" },
  { index: "freedom-of-movement-35", name: "Freedom of Movement", namePtBr: "Liberdade de Movimento", level: 4, school: "Abjuration", castingTime: "1 action", range: "Touch", duration: "10 min/level", components: "V, S, M, DF", description: "Subject moves normally despite impediments.", descriptionPtBr: "Alvo move-se normalmente apesar de impedimentos (agarrar, magia, terreno).", classes: "Bard, Cleric, Druid, Ranger" },
  { index: "greater-invisibility-35", name: "Greater Invisibility", namePtBr: "Invisibilidade Maior", level: 4, school: "Illusion", castingTime: "1 action", range: "Touch", duration: "1 round/level", components: "V, S", description: "As invisibility, but subject can attack and remain invisible.", descriptionPtBr: "Como Invisibilidade, mas o alvo permanece invisível mesmo ao atacar.", classes: "Bard, Sorcerer, Wizard" },
  { index: "ice-storm-35", name: "Ice Storm", namePtBr: "Tempestade de Gelo", level: 4, school: "Evocation", castingTime: "1 action", range: "Long", duration: "1 round", components: "V, S, M/DF", description: "Hail deals 3d6 bludgeoning + 2d6 cold damage in a cylinder.", descriptionPtBr: "Granizo causa 3d6 contundente + 2d6 frio. Sem salvaguarda. Terreno difícil.", classes: "Druid, Sorcerer, Wizard" },
  { index: "phantasmal-killer-35", name: "Phantasmal Killer", namePtBr: "Assassino Fantasmagórico", level: 4, school: "Illusion", castingTime: "1 action", range: "Medium", duration: "Instantaneous", components: "V, S", description: "A nightmare creature attacks the subject. Will disbelief, then Fort or die.", descriptionPtBr: "Pesadelo ataca o alvo. Vontade para desacreditar, depois Fortitude ou morre.", classes: "Sorcerer, Wizard" },
  { index: "polymorph-35", name: "Polymorph", namePtBr: "Polimorfar", level: 4, school: "Transmutation", castingTime: "1 action", range: "Touch", duration: "1 min/level", components: "V, S, M", description: "Gives one willing subject a new form.", descriptionPtBr: "Transforma um alvo voluntário em outra criatura (até 15 DV).", classes: "Sorcerer, Wizard" },
  { index: "stoneskin-35", name: "Stoneskin", namePtBr: "Pele de Pedra", level: 4, school: "Abjuration", castingTime: "1 action", range: "Touch", duration: "10 min/level", components: "V, S, M (250 gp)", description: "Grants DR 10/adamantine (max 10/level or 150 points).", descriptionPtBr: "RD 10/adamantino (máx 10/nível ou 150 pontos). Componente: 250 po.", classes: "Druid, Sorcerer, Wizard" },
  { index: "wall-of-fire-35", name: "Wall of Fire", namePtBr: "Muralha de Fogo", level: 4, school: "Evocation", castingTime: "1 action", range: "Medium", duration: "Concentration + 1 round/level", components: "V, S, M/DF", description: "Deals 2d4 fire damage out to 10 ft and 1d4 out to 20 ft. Passing through deals 2d6+1/level.", descriptionPtBr: "2d4 fogo até 3m, 1d4 até 6m. Atravessar: 2d6+1/nível de dano de fogo.", classes: "Druid, Sorcerer, Wizard" },

  // ── Nível 5 ────────────────────────────
  { index: "baleful-polymorph-35", name: "Baleful Polymorph", namePtBr: "Polimorfar Maligno", level: 5, school: "Transmutation", castingTime: "1 action", range: "Close", duration: "Permanent", components: "V, S", description: "Turns subject into a harmless creature. Fort negates, Will to retain mind.", descriptionPtBr: "Transforma alvo em criatura inofensiva. Fortitude nega, Vontade mantém mente.", classes: "Druid, Sorcerer, Wizard" },
  { index: "break-enchantment-35", name: "Break Enchantment", namePtBr: "Quebrar Encantamento", level: 5, school: "Abjuration", castingTime: "1 minute", range: "Close", duration: "Instantaneous", components: "V, S", description: "Frees subjects from enchantments, transmutations, and curses.", descriptionPtBr: "Liberta alvos de encantamentos, transmutações e maldições.", classes: "Bard, Cleric, Paladin, Sorcerer, Wizard" },
  { index: "cloudkill-35", name: "Cloudkill", namePtBr: "Nuvem Mortal", level: 5, school: "Conjuration", castingTime: "1 action", range: "Medium", duration: "1 min/level", components: "V, S", description: "Kills 3 HD or less; 4-6 HD save or die; 6+ HD 1d4 Con damage.", descriptionPtBr: "Mata 3 DV ou menos; 4-6 DV Fortitude ou morre; 6+ DV: 1d4 dano CON/rodada.", classes: "Sorcerer, Wizard" },
  { index: "cone-of-cold-35", name: "Cone of Cold", namePtBr: "Cone de Frio", level: 5, school: "Evocation", castingTime: "1 action", range: "60 ft cone", duration: "Instantaneous", components: "V, S, M", description: "1d6/level cold damage (max 15d6). Reflex half.", descriptionPtBr: "1d6/nível de dano de frio (máx 15d6). Reflexos metade.", classes: "Sorcerer, Wizard" },
  { index: "flame-strike-35", name: "Flame Strike", namePtBr: "Coluna de Chamas", level: 5, school: "Evocation", castingTime: "1 action", range: "Medium", duration: "Instantaneous", components: "V, S, DF", description: "A vertical column of divine fire. 1d6/level damage (max 15d6), half fire half divine.", descriptionPtBr: "Coluna de fogo divino. 1d6/nível (máx 15d6), metade fogo metade divino. Reflexos metade.", classes: "Cleric, Druid" },
  { index: "hold-monster-35", name: "Hold Monster", namePtBr: "Imobilizar Monstro", level: 5, school: "Enchantment", castingTime: "1 action", range: "Medium", duration: "1 round/level", components: "V, S, M/DF", description: "As hold person, but any creature. Will negates.", descriptionPtBr: "Como Imobilizar Pessoa, mas funciona em qualquer criatura. Vontade nega.", classes: "Bard, Sorcerer, Wizard" },
  { index: "raise-dead-35", name: "Raise Dead", namePtBr: "Ressuscitar Mortos", level: 5, school: "Conjuration", castingTime: "1 minute", range: "Touch", duration: "Instantaneous", components: "V, S, M, DF (5000 gp diamond)", description: "Restores life to a subject who died up to 1 day/level ago.", descriptionPtBr: "Restaura vida de criatura morta há até 1 dia/nível. Componente: diamante 5.000 po.", classes: "Cleric" },
  { index: "teleport-35", name: "Teleport", namePtBr: "Teletransporte", level: 5, school: "Conjuration", castingTime: "1 action", range: "Touch", duration: "Instantaneous", components: "V", description: "Instantly transports you to a designated destination.", descriptionPtBr: "Transporte instantâneo para destino. Chance de erro conforme familiaridade.", classes: "Sorcerer, Wizard" },
  { index: "wall-of-force-35", name: "Wall of Force", namePtBr: "Muralha de Força", level: 5, school: "Evocation", castingTime: "1 action", range: "Close", duration: "1 round/level", components: "V, S, M", description: "An invisible wall of force. Immune to damage, spell resistant.", descriptionPtBr: "Parede invisível de força. Imune a dano. Apenas Dissipar pode removê-la.", classes: "Sorcerer, Wizard" },
  { index: "wall-of-stone-35", name: "Wall of Stone", namePtBr: "Muralha de Pedra", level: 5, school: "Conjuration", castingTime: "1 action", range: "Medium", duration: "Instantaneous", components: "V, S, M/DF", description: "Creates a stone wall that can be shaped.", descriptionPtBr: "Cria parede de pedra permanente. 1 painel de 1,5m²/nível, 2,5cm de espessura.", classes: "Cleric, Druid, Sorcerer, Wizard" },

  // ── Nível 6 ────────────────────────────
  { index: "blade-barrier-35", name: "Blade Barrier", namePtBr: "Barreira de Lâminas", level: 6, school: "Evocation", castingTime: "1 action", range: "Medium", duration: "1 min/level", components: "V, S", description: "Wall of whirling blades deals 1d6/level damage (max 15d6).", descriptionPtBr: "Parede de lâminas giratórias. 1d6/nível de dano (máx 15d6). Reflexos metade.", classes: "Cleric" },
  { index: "chain-lightning-35", name: "Chain Lightning", namePtBr: "Relâmpago em Cadeia", level: 6, school: "Evocation", castingTime: "1 action", range: "Long", duration: "Instantaneous", components: "V, S, F", description: "1d6/level damage to primary target, then arcs to secondary targets.", descriptionPtBr: "1d6/nível no alvo primário (máx 20d6), depois arcos para alvos secundários (metade).", classes: "Sorcerer, Wizard" },
  { index: "disintegrate-35", name: "Disintegrate", namePtBr: "Desintegrar", level: 6, school: "Transmutation", castingTime: "1 action", range: "Medium", duration: "Instantaneous", components: "V, S, M/DF", description: "A thin green ray. 2d6/level damage (max 40d6). Fort save for 5d6.", descriptionPtBr: "Raio verde fino. 2d6/nível (máx 40d6). Fortitude reduz para 5d6.", classes: "Sorcerer, Wizard" },
  { index: "greater-dispel-magic-35", name: "Greater Dispel Magic", namePtBr: "Dissipar Magia Maior", level: 6, school: "Abjuration", castingTime: "1 action", range: "Medium", duration: "Instantaneous", components: "V, S", description: "As dispel magic, but up to +20 on check.", descriptionPtBr: "Como Dissipar Magia, mas bônus máximo de +20 no teste.", classes: "Bard, Cleric, Druid, Sorcerer, Wizard" },
  { index: "heal-35", name: "Heal", namePtBr: "Curar", level: 6, school: "Conjuration", castingTime: "1 action", range: "Touch", duration: "Instantaneous", components: "V, S", description: "Cures 10 HP/level, removes many conditions.", descriptionPtBr: "Cura 10 PV/nível (máx 150). Remove cegueira, confusão, doença, exaustão, veneno.", classes: "Cleric, Druid" },
  { index: "true-seeing-35", name: "True Seeing", namePtBr: "Visão Verdadeira", level: 6, school: "Divination", castingTime: "1 action", range: "Touch", duration: "1 min/level", components: "V, S, M (250 gp ointment)", description: "Lets you see all things as they actually are (invisibility, illusions, etc.).", descriptionPtBr: "Ver todas as coisas como realmente são: invisibilidade, ilusões, polimorfismo. M: 250 po.", classes: "Cleric, Druid, Sorcerer, Wizard" },

  // ── Nível 7 ────────────────────────────
  { index: "delayed-blast-fireball-35", name: "Delayed Blast Fireball", namePtBr: "Bola de Fogo Retardada", level: 7, school: "Evocation", castingTime: "1 action", range: "Long", duration: "5 rounds or less", components: "V, S, M", description: "As fireball, but more powerful (1d6/level, max 20d6) and can be delayed.", descriptionPtBr: "Como Bola de Fogo, mas 1d6/nível (máx 20d6) e pode ser retardada por até 5 rodadas.", classes: "Sorcerer, Wizard" },
  { index: "finger-of-death-35", name: "Finger of Death", namePtBr: "Dedo da Morte", level: 7, school: "Necromancy", castingTime: "1 action", range: "Close", duration: "Instantaneous", components: "V, S", description: "Kills one subject. Fort save for 3d6+1/level damage instead.", descriptionPtBr: "Mata um alvo. Fortitude: recebe 3d6+1/nível de dano ao invés de morrer.", classes: "Druid, Sorcerer, Wizard" },
  { index: "greater-teleport-35", name: "Greater Teleport", namePtBr: "Teletransporte Maior", level: 7, school: "Conjuration", castingTime: "1 action", range: "Touch", duration: "Instantaneous", components: "V", description: "As teleport, but no range limit and no chance of error.", descriptionPtBr: "Como Teletransporte, mas sem limite de distância e sem chance de erro.", classes: "Sorcerer, Wizard" },
  { index: "resurrection-35", name: "Resurrection", namePtBr: "Ressurreição", level: 7, school: "Conjuration", castingTime: "10 minutes", range: "Touch", duration: "Instantaneous", components: "V, S, M, DF (10000 gp diamond)", description: "Fully restores dead subject. Can resurrect those dead up to 10 years/level.", descriptionPtBr: "Restaura completamente criatura morta há até 10 anos/nível. Diamante 10.000 po.", classes: "Cleric" },
  { index: "spell-turning-35", name: "Spell Turning", namePtBr: "Devolver Magia", level: 7, school: "Abjuration", castingTime: "1 action", range: "Personal", duration: "Until expended or 10 min/level", components: "V, S, M/DF", description: "Reflects 1d4+6 spell levels back at caster.", descriptionPtBr: "Reflete 1d4+6 níveis de magia de volta para o conjurador.", classes: "Sorcerer, Wizard" },

  // ── Nível 8 ────────────────────────────
  { index: "antimagic-field-35", name: "Antimagic Field", namePtBr: "Campo Antimagia", level: 8, school: "Abjuration", castingTime: "1 action", range: "10 ft emanation", duration: "10 min/level", components: "V, S, M/DF", description: "10-ft radius area where magic does not function.", descriptionPtBr: "Emanação de 3m onde magia não funciona. Suprime itens mágicos e magias.", classes: "Cleric, Sorcerer, Wizard" },
  { index: "earthquake-35", name: "Earthquake", namePtBr: "Terremoto", level: 8, school: "Evocation", castingTime: "1 action", range: "Long", duration: "1 round", components: "V, S, DF", description: "Intense tremor shakes terrain, collapsing structures.", descriptionPtBr: "Tremor intenso. Derruba estruturas, abre fendas, causa deslizamentos.", classes: "Cleric, Druid" },
  { index: "horrid-wilting-35", name: "Horrid Wilting", namePtBr: "Murchamento Horrível", level: 8, school: "Necromancy", castingTime: "1 action", range: "Long", duration: "Instantaneous", components: "V, S, M/DF", description: "Deals 1d6/level damage (max 20d6) to living creatures. Fort half.", descriptionPtBr: "1d6/nível (máx 20d6) a criaturas vivas por desidratação. Fortitude metade.", classes: "Sorcerer, Wizard" },
  { index: "power-word-stun-35", name: "Power Word Stun", namePtBr: "Palavra de Poder Atordoar", level: 8, school: "Enchantment", castingTime: "1 action", range: "Close", duration: "See text", components: "V", description: "Stuns one creature with 150 HP or less. No save.", descriptionPtBr: "Atordoa criatura com 150 PV ou menos. Sem salvaguarda.", classes: "Sorcerer, Wizard" },
  { index: "sunburst-35", name: "Sunburst", namePtBr: "Explosão Solar", level: 8, school: "Evocation", castingTime: "1 action", range: "Long", duration: "Instantaneous", components: "V, S, M/DF", description: "Blinds all within 80 ft, deals 6d6 damage to undead.", descriptionPtBr: "Cega todos em 24m. 6d6 a mortos-vivos (destruídos se vulneráveis à luz).", classes: "Druid, Sorcerer, Wizard" },

  // ── Nível 9 ────────────────────────────
  { index: "gate-35", name: "Gate", namePtBr: "Portal", level: 9, school: "Conjuration", castingTime: "1 action", range: "Medium", duration: "Instantaneous or Concentration", components: "V, S, XP", description: "Connects two planes for travel or calls a creature.", descriptionPtBr: "Conecta dois planos para viagem ou invoca criatura de outro plano.", classes: "Cleric, Sorcerer, Wizard" },
  { index: "meteor-swarm-35", name: "Meteor Swarm", namePtBr: "Enxame de Meteoros", level: 9, school: "Evocation", castingTime: "1 action", range: "Long", duration: "Instantaneous", components: "V, S", description: "Four 40-ft radius spheres, each dealing 2d6 bludgeoning + 6d6 fire. Reflex half.", descriptionPtBr: "4 esferas de 12m. 2d6 contundente + 6d6 fogo cada. Reflexos metade.", classes: "Sorcerer, Wizard" },
  { index: "power-word-kill-35", name: "Power Word Kill", namePtBr: "Palavra de Poder Matar", level: 9, school: "Enchantment", castingTime: "1 action", range: "Close", duration: "Instantaneous", components: "V", description: "Kills one creature with 100 HP or less. No save.", descriptionPtBr: "Mata criatura com 100 PV ou menos. Sem salvaguarda.", classes: "Sorcerer, Wizard" },
  { index: "time-stop-35", name: "Time Stop", namePtBr: "Parar o Tempo", level: 9, school: "Transmutation", castingTime: "1 action", range: "Personal", duration: "1d4+1 rounds (apparent)", components: "V", description: "You act freely for 1d4+1 rounds while time is stopped for everyone else.", descriptionPtBr: "Você age livremente por 1d4+1 rodadas enquanto o tempo para para todos.", classes: "Sorcerer, Wizard" },
  { index: "true-resurrection-35", name: "True Resurrection", namePtBr: "Ressurreição Verdadeira", level: 9, school: "Conjuration", castingTime: "10 minutes", range: "Touch", duration: "Instantaneous", components: "V, S, M, DF (25000 gp)", description: "As resurrection, plus remains are not required.", descriptionPtBr: "Como Ressurreição, mas não precisa do corpo. 25.000 po em diamantes.", classes: "Cleric" },
  { index: "wish-35", name: "Wish", namePtBr: "Desejo", level: 9, school: "Universal", castingTime: "1 action", range: "See text", duration: "See text", components: "V, XP", description: "The mightiest spell. Can duplicate almost any spell, or grant other wishes.", descriptionPtBr: "A magia mais poderosa. Duplica quase qualquer magia ou realiza desejos. Custo XP.", classes: "Sorcerer, Wizard" },
];

async function main() {
  console.log("🔮 Importando magias SRD 3.5 nível 4-9...\n");
  let created = 0, skipped = 0;

  for (const s of SPELLS_HI) {
    const existing = await prisma.srdSpell.findUnique({ where: { index: s.index } });
    if (existing) { skipped++; continue; }
    await prisma.srdSpell.create({
      data: {
        index: s.index, name: s.name, namePtBr: s.namePtBr,
        edition: "3.5", level: s.level, school: s.school,
        castingTime: s.castingTime, range: s.range, duration: s.duration,
        components: s.components, concentration: s.duration.includes("Concentration"),
        description: s.description, descriptionPtBr: s.descriptionPtBr,
        classes: s.classes, source: "SRD 3.5",
      },
    });
    created++;
  }

  const t35 = await prisma.srdSpell.count({ where: { edition: "3.5" } });
  const t5e = await prisma.srdSpell.count({ where: { edition: "5e" } });
  console.log(`📖 Nível 4-9: ${created} criadas, ${skipped} já existiam`);
  console.log(`📊 Magias no banco: ${t35} (3.5) + ${t5e} (5e) = ${t35 + t5e} total`);
  console.log("✅ Concluído!");
}

main()
  .catch((e) => { console.error("Erro:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
