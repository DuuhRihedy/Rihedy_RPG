// Monstros SRD 3.5 — Icônicos (PT-BR primeiro)

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

interface Monster35 {
  index: string; name: string; namePtBr: string;
  size: string; type: string; alignment: string;
  ac: number; hp: number; hitDice: string; speed: string;
  str: number; dex: number; con: number; intl: number; wis: number; cha: number;
  cr: number; xp: number;
  specialPtBr?: string; actionsPtBr?: string;
}

const MONSTERS: Monster35[] = [
  // ── Dragões Cromáticos ──────────────────
  { index: "red-dragon-adult-35", name: "Adult Red Dragon", namePtBr: "Dragão Vermelho Adulto", size: "Huge", type: "dragon", alignment: "chaotic evil", ac: 29, hp: 253, hitDice: "22d12+110", speed: '{"walk":"40 ft","fly":"150 ft"}'  , str: 33, dex: 10, con: 21, intl: 16, wis: 17, cha: 16, cr: 15, xp: 13000, specialPtBr: '[{"name":"Sopro de Fogo","desc":"Cone de 15m, 14d10 fogo, Reflexos CD 25 metade"},{"name":"Presença Aterrorizante","desc":"Raio 54m, 5+ DV amedrontados, Vontade CD 24"}]', actionsPtBr: '[{"name":"Ataque Múltiplo","desc":"1 mordida (2d8+11), 2 garras (2d6+5), 2 asas (1d8+5), 1 cauda (2d6+16)"}]' },
  { index: "black-dragon-adult-35", name: "Adult Black Dragon", namePtBr: "Dragão Negro Adulto", size: "Huge", type: "dragon", alignment: "chaotic evil", ac: 26, hp: 199, hitDice: "19d12+76", speed: '{"walk":"60 ft","fly":"150 ft","swim":"60 ft"}', str: 25, dex: 10, con: 19, intl: 12, wis: 13, cha: 12, cr: 11, xp: 7200, specialPtBr: '[{"name":"Sopro Ácido","desc":"Linha de 24m, 12d4 ácido, Reflexos CD 22"}]', actionsPtBr: '[{"name":"Ataque Múltiplo","desc":"1 mordida (2d8+7), 2 garras (2d6+3), 2 asas (1d8+3)"}]' },

  // ── Mortos-Vivos ────────────────────────
  { index: "skeleton-35", name: "Skeleton", namePtBr: "Esqueleto", size: "Medium", type: "undead", alignment: "neutral evil", ac: 13, hp: 6, hitDice: "1d12", speed: '{"walk":"30 ft"}', str: 10, dex: 14, con: 0, intl: 0, wis: 10, cha: 1, cr: 0.33, xp: 100, actionsPtBr: '[{"name":"Garra","desc":"Ataque corpo-a-corpo, +1, 1d4 cortante"},{"name":"Cimitarra","desc":"+1, 1d6 cortante"}]' },
  { index: "zombie-35", name: "Zombie", namePtBr: "Zumbi", size: "Medium", type: "undead", alignment: "neutral evil", ac: 11, hp: 16, hitDice: "2d12+3", speed: '{"walk":"30 ft"}', str: 12, dex: 8, con: 0, intl: 0, wis: 10, cha: 1, cr: 0.5, xp: 200, specialPtBr: '[{"name":"Destruição Única","desc":"Só pode realizar ação parcial (padrão ou movimento)"}]', actionsPtBr: '[{"name":"Pancada","desc":"+2, 1d6+1 contundente"}]' },
  { index: "ghoul-35", name: "Ghoul", namePtBr: "Carniçal", size: "Medium", type: "undead", alignment: "chaotic evil", ac: 14, hp: 13, hitDice: "2d12", speed: '{"walk":"30 ft"}', str: 13, dex: 15, con: 0, intl: 13, wis: 14, cha: 12, cr: 1, xp: 300, specialPtBr: '[{"name":"Paralisia","desc":"Fortitude CD 12 ou paralisado 1d4+1 rodadas. Elfos imunes."}]', actionsPtBr: '[{"name":"Mordida","desc":"+2, 1d6+1 + paralisia"},{"name":"2 Garras","desc":"+0, 1d3 + paralisia"}]' },
  { index: "wight-35", name: "Wight", namePtBr: "Aparição", size: "Medium", type: "undead", alignment: "lawful evil", ac: 15, hp: 26, hitDice: "4d12", speed: '{"walk":"30 ft"}', str: 12, dex: 12, con: 0, intl: 11, wis: 13, cha: 15, cr: 3, xp: 900, specialPtBr: '[{"name":"Drenar Energia","desc":"Ataque com sucesso drena 1 nível. Fortitude CD 14 nega."},{"name":"Criar Prole","desc":"Humanoides mortos pelo aparição se tornam aparições em 1d4 rodadas."}]', actionsPtBr: '[{"name":"Pancada","desc":"+3, 1d4+1 + drenar energia"}]' },
  { index: "vampire-35", name: "Vampire", namePtBr: "Vampiro", size: "Medium", type: "undead", alignment: "any evil", ac: 25, hp: 52, hitDice: "8d12", speed: '{"walk":"30 ft"}', str: 22, dex: 18, con: 0, intl: 17, wis: 16, cha: 20, cr: 7, xp: 3150, specialPtBr: '[{"name":"Drenar Sangue","desc":"Agarra e drenah 1d4 CON por rodada."},{"name":"Dominação","desc":"Olhar nos olhos, Vontade CD 19 ou dominado."},{"name":"Regeneração Rápida","desc":"5 PV/rodada. Só água corrente e luz solar causam dano verdadeiro."}]', actionsPtBr: '[{"name":"Pancada","desc":"+11, 1d6+9 + drenar energia (1 nível negativo)"}]' },
  { index: "lich-35", name: "Lich", namePtBr: "Lich", size: "Medium", type: "undead", alignment: "any evil", ac: 23, hp: 66, hitDice: "11d12", speed: '{"walk":"30 ft"}', str: 10, dex: 14, con: 0, intl: 22, wis: 16, cha: 18, cr: 13, xp: 9500, specialPtBr: '[{"name":"Toque Paralisante","desc":"Fortitude CD 19 ou paralisado permanentemente."},{"name":"Aura de Medo","desc":"Raio 18m, Vontade CD 19 ou amedrontado 5d6 rodadas."},{"name":"Filactério","desc":"Enquanto o filactério existir, o lich se regenera em 1d10 dias."}]', actionsPtBr: '[{"name":"Toque","desc":"+5, 1d8+5 energia negativa + paralisia"}]' },

  // ── Clássicos ───────────────────────────
  { index: "goblin-35", name: "Goblin", namePtBr: "Goblin", size: "Small", type: "humanoid", alignment: "neutral evil", ac: 15, hp: 5, hitDice: "1d8+1", speed: '{"walk":"30 ft"}', str: 8, dex: 13, con: 12, intl: 10, wis: 9, cha: 6, cr: 0.33, xp: 100, actionsPtBr: '[{"name":"Morningstar","desc":"+1, 1d6-1"},{"name":"Javelin","desc":"+3, 1d4-1"}]' },
  { index: "orc-35", name: "Orc", namePtBr: "Orc", size: "Medium", type: "humanoid", alignment: "chaotic evil", ac: 13, hp: 5, hitDice: "1d8+1", speed: '{"walk":"30 ft"}', str: 15, dex: 10, con: 12, intl: 8, wis: 7, cha: 6, cr: 0.5, xp: 200, specialPtBr: '[{"name":"Sensibilidade à Luz","desc":"-1 em ataques e testes sob luz solar direta."}]', actionsPtBr: '[{"name":"Falchion","desc":"+3, 2d4+3"},{"name":"Javelin","desc":"+1, 1d6+2"}]' },
  { index: "ogre-35", name: "Ogre", namePtBr: "Ogro", size: "Large", type: "giant", alignment: "chaotic evil", ac: 16, hp: 29, hitDice: "4d8+11", speed: '{"walk":"30 ft"}', str: 21, dex: 8, con: 15, intl: 6, wis: 10, cha: 7, cr: 3, xp: 900, actionsPtBr: '[{"name":"Greatclub","desc":"+8, 2d8+7"},{"name":"Javelin","desc":"+1, 1d8+5"}]' },
  { index: "troll-35", name: "Troll", namePtBr: "Troll", size: "Large", type: "giant", alignment: "chaotic evil", ac: 16, hp: 63, hitDice: "6d8+36", speed: '{"walk":"30 ft"}', str: 23, dex: 14, con: 23, intl: 6, wis: 9, cha: 6, cr: 5, xp: 1800, specialPtBr: '[{"name":"Regeneração","desc":"Regenera 5 PV/rodada. Fogo e ácido impedem a regeneração."},{"name":"Dilacerar","desc":"Se atingir com ambas as garras, causa 2d6+9 de dano extra."}]', actionsPtBr: '[{"name":"2 Garras","desc":"+9, 1d6+6"},{"name":"Mordida","desc":"+4, 1d6+3"}]' },
  { index: "beholder-35", name: "Beholder", namePtBr: "Observador", size: "Large", type: "aberration", alignment: "lawful evil", ac: 26, hp: 93, hitDice: "11d8+44", speed: '{"fly":"20 ft (good)"}', str: 14, dex: 14, con: 18, intl: 17, wis: 15, cha: 15, cr: 13, xp: 9500, specialPtBr: '[{"name":"Cone Antimagia","desc":"Cone frontal de 45m onde magia não funciona."},{"name":"Raios Oculares","desc":"10 pedúnculos oculares com raios variados: encantar, medo, paralisar, desintegrar, etc."}]', actionsPtBr: '[{"name":"Mordida","desc":"+9, 2d4"},{"name":"Raio Ocular","desc":"Até 4 raios por rodada (ataque de toque à distância)"}]' },
  { index: "minotaur-35", name: "Minotaur", namePtBr: "Minotauro", size: "Large", type: "monstrosity", alignment: "chaotic evil", ac: 14, hp: 39, hitDice: "6d8+12", speed: '{"walk":"30 ft"}', str: 19, dex: 10, con: 15, intl: 7, wis: 10, cha: 8, cr: 4, xp: 1200, specialPtBr: '[{"name":"Imunidade a Labirintos","desc":"Nunca se perde em labirintos."},{"name":"Investida Poderosa","desc":"Investida com chifre causa 4d6+6."}]', actionsPtBr: '[{"name":"Greataxe","desc":"+9, 3d6+6"},{"name":"Chifre","desc":"+4, 1d8+2"}]' },
  { index: "mind-flayer-35", name: "Mind Flayer", namePtBr: "Devorador de Mentes", size: "Medium", type: "aberration", alignment: "lawful evil", ac: 15, hp: 44, hitDice: "8d8+8", speed: '{"walk":"30 ft"}', str: 12, dex: 14, con: 12, intl: 19, wis: 17, cha: 17, cr: 8, xp: 4800, specialPtBr: '[{"name":"Explosão Mental","desc":"Cone de 18m. Atordoa 3d4 rodadas. Vontade CD 17."},{"name":"Extrair Cérebro","desc":"Contra alvo agarrado: mata instantaneamente e devora o cérebro."},{"name":"Telepatia","desc":"Telepatia 30m."}]', actionsPtBr: '[{"name":"4 Tentáculos","desc":"+8 toque corpo-a-corpo, agarra. Após 4 rodadas agarrado: extrai cérebro."}]' },
  { index: "gelatinous-cube-35", name: "Gelatinous Cube", namePtBr: "Cubo Gelatinoso", size: "Large", type: "ooze", alignment: "neutral", ac: 3, hp: 54, hitDice: "4d10+32", speed: '{"walk":"15 ft"}', str: 10, dex: 1, con: 26, intl: 0, wis: 1, cha: 1, cr: 3, xp: 900, specialPtBr: '[{"name":"Transparente","desc":"Quase invisível. Observar CD 15 para notar."},{"name":"Engolfar","desc":"Move sobre criaturas Médias ou menores. Reflexos CD 13 ou engolfado."},{"name":"Ácido","desc":"Engolfados recebem 1d6 ácido/rodada. Paralisia (Fortitude CD 20)."}]', actionsPtBr: '[{"name":"Pancada","desc":"+1, 1d6 + 1d6 ácido"}]' },
  { index: "owlbear-35", name: "Owlbear", namePtBr: "Urso-Coruja", size: "Large", type: "beast", alignment: "neutral", ac: 15, hp: 52, hitDice: "5d10+25", speed: '{"walk":"30 ft"}', str: 21, dex: 12, con: 21, intl: 2, wis: 12, cha: 10, cr: 4, xp: 1200, specialPtBr: '[{"name":"Abraço Melhorado","desc":"Se acertar com ambas as garras, agarra e causa 2d6+7 extra."}]', actionsPtBr: '[{"name":"2 Garras","desc":"+9, 1d6+5"},{"name":"Mordida","desc":"+4, 1d8+2"}]' },
  { index: "basilisk-35", name: "Basilisk", namePtBr: "Basilisco", size: "Medium", type: "beast", alignment: "neutral", ac: 16, hp: 45, hitDice: "6d10+12", speed: '{"walk":"20 ft"}', str: 15, dex: 8, con: 15, intl: 2, wis: 12, cha: 11, cr: 5, xp: 1800, specialPtBr: '[{"name":"Olhar Petrificante","desc":"Raio de 9m. Fortitude CD 13 ou petrificado permanentemente."}]', actionsPtBr: '[{"name":"Mordida","desc":"+8, 1d8+3"}]' },
  { index: "tarrasque-35", name: "Tarrasque", namePtBr: "Tarrasque", size: "Colossal", type: "beast", alignment: "neutral", ac: 35, hp: 858, hitDice: "48d10+594", speed: '{"walk":"20 ft"}', str: 45, dex: 16, con: 35, intl: 3, wis: 14, cha: 14, cr: 20, xp: 175000, specialPtBr: '[{"name":"Regeneração","desc":"40 PV/rodada. Não pode morrer. Apenas Desejo + Milagre mantém morto."},{"name":"Imunidade a Magia","desc":"Reflete todos os raios, linhas e cones de efeito."},{"name":"Medo","desc":"Presença aterrorizante, raio 18m, Vontade CD 36."}]', actionsPtBr: '[{"name":"Mordida","desc":"+57, 4d8+17 (engolir inteiro)"},{"name":"2 Garras","desc":"+52, 1d12+8"},{"name":"2 Chifres","desc":"+52, 1d10+8"},{"name":"Cauda","desc":"+52, 3d8+8"}]' },
];

async function main() {
  console.log("🐉 Importando monstros SRD 3.5 (PT-BR primeiro)...\n");
  let created = 0, skipped = 0;

  for (const m of MONSTERS) {
    const existing = await prisma.srdMonster.findUnique({ where: { index: m.index } });
    if (existing) { skipped++; continue; }
    await prisma.srdMonster.create({
      data: {
        index: m.index, name: m.name, namePtBr: m.namePtBr,
        edition: "3.5", size: m.size, type: m.type, alignment: m.alignment,
        armorClass: m.ac, hitPoints: m.hp, hitDice: m.hitDice, speed: m.speed,
        str: m.str, dex: m.dex, con: m.con, intl: m.intl, wis: m.wis, cha: m.cha,
        challengeRating: m.cr, xp: m.xp,
        specialAbilitiesPtBr: m.specialPtBr || null,
        actionsPtBr: m.actionsPtBr || null,
        source: "SRD 3.5",
      },
    });
    created++;
  }

  const t35 = await prisma.srdMonster.count({ where: { edition: "3.5" } });
  const t5e = await prisma.srdMonster.count({ where: { edition: "5e" } });
  console.log(`🐉 Monstros 3.5: ${created} criados, ${skipped} já existiam`);
  console.log(`📊 Monstros no banco: ${t35} (3.5) + ${t5e} (5e) = ${t35 + t5e} total`);
  console.log("✅ Concluído!");
}

main()
  .catch((e) => { console.error("Erro:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
