import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const rawUrl = process.env.DATABASE_URL;
if (!rawUrl) {
  console.error("DATABASE_URL nao encontrada no .env");
  process.exit(1);
}

const connectionString = rawUrl.replace(/^["']|["']$/g, "");
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

const heroSkills = {
  base: {
    "Conhecimento Planar": 20,
    "Conhecimento Religiao": 20,
    Cavalgar: 20,
    "Tratar Ferimentos": 20,
  },
  outras: {
    "Arte da Fuga": 5,
    Blefar: 5,
    Concentracao: 15,
    Diplomacia: 15,
    Equilibrio: 5,
    Escalar: 10,
    Esconder: 5,
    "Mover em Silencio": 5,
    Intimidar: 5,
    Natacao: 10,
    "Obter Informacao": 5,
    Roubar: 5,
    Procurar: 4,
    Saltar: 50,
  },
  automaticas: {
    Ouvir: 20,
    Observar: 20,
    "Sentir Motivacao": 30,
  },
};

const heroWeapons = [
  {
    name: "Espada Luminosa",
    attackBonus: 30,
    damage: "4d6+10",
    type: "Corpo a corpo",
    properties: "Alcance 3m",
  },
  {
    name: "Arco Luminoso",
    attackBonus: 25,
    damage: "2d10+5",
    type: "Longo alcance",
    properties: "Alcance 33m",
  },
];

const heroFeatures = [
  {
    name: "Aspecto da Divindade",
    description:
      "Hero possui resistencia incrivel e nao precisa comer, dormir ou respirar. So pode ser ferido por armas especiais, como prata amaldicoada, ferro frio, poder de Elmet e armas forjadas no Vacuo.",
  },
  {
    name: "Maos Curativas",
    description:
      "Pode curar ate 50 pontos de dano por dia, dividindo essa cura como quiser.",
  },
  {
    name: "Aura da Coragem",
    description:
      "Aliados em ate 18m ficam inspirados, tornam-se imunes a medo e recebem +3 em testes de Vontade.",
  },
  {
    name: "Montaria de Luz",
    description:
      "Possui um pegasu como montaria. Se morrer, ressuscita no dia seguinte.",
  },
  {
    name: "Arma Magica",
    description:
      "Pode encantar sua arma 3 vezes por dia, recebendo +5 de acerto e +5 de dano.",
  },
  {
    name: "Curar Montaria",
    description:
      "Pode conjurar cura completa na propria montaria 1 vez por dia.",
  },
  {
    name: "Missao",
    description:
      "Encontrar e confrontar Sicandar, uma arma senciente de Luz que corrompeu a ultima Elmet da Luz, Amethiyst.",
  },
  {
    name: "Segredo",
    description:
      "Voce e Tratio, a vontade do deus da luz: uma arma com inteligencia e forma humana enviada a Elmeria em busca de um novo campeao.",
  },
  {
    name: "Lore: Tratio",
    description:
      "Tratio viveu entre mortais por tanto tempo que se apegou a eles, adotou contos heroicos como identidade e passou a combater a morte de forma equivocada, enquanto negligenciava sua missao original de enfrentar Sicandar.",
  },
  {
    name: "Relacao: Dr. Liu Sato",
    description:
      "Hero sabe que ela e a nova campea escolhida pelo deus da luz e faz de tudo para protege-la enquanto Amethyist ainda vive.",
  },
  {
    name: "Relacao: PsyWave",
    description:
      "A rivalidade com PsyWave virou uma amizade estranha depois de varias batalhas em que Hero sempre saiu vencedor.",
  },
  {
    name: "Relacao: Alina Indrakzuz",
    description:
      "Hero conhece o risco do sangue dos Indrakzuz e observa Alina com cuidado, apesar de reconhece-la como uma pessoa boa.",
  },
];

const heroEquipment = [
  { name: "Espada Luminosa", quantity: 1, equipped: true, description: "Arma principal de luz." },
  { name: "Arco Luminoso", quantity: 1, equipped: true, description: "Arma de longo alcance de luz." },
  { name: "Montaria de Luz", quantity: 1, equipped: true, description: "Pegasu que retorna no dia seguinte se cair." },
];

const heroNotes = [
  "THE HERO",
  "Conhecido por todos apenas como Hero, uma figura lendaria sem nome verdadeiro.",
  "Sua roupa inadequada e vocabulario estranho deixam claro que ele nao pertence a este mundo.",
  "Lendas dizem que ele parou a guerra sozinho, matou um deus e pode voar mais rapido que o som.",
  "Outros acreditam que ele seja apenas o simbolo da S.A., ou o ultimo Heroi Elmet vivo.",
  "",
  "Alinhamento: Bom Leal.",
  "Hero sempre ajuda os mais fracos, acredita na redencao e se recusa a matar inocentes.",
  "Odeia tortura, maldade gratuita e injustica.",
].join("\n");

async function main() {
  console.log("Criando ou atualizando THE HERO...");

  const campaign =
    (await prisma.campaign.findFirst({
      where: { name: { contains: "Hub RPG", mode: "insensitive" } },
    })) ?? (await prisma.campaign.findFirst());

  const campaignId = campaign?.id ?? null;

  const existing = await prisma.character.findUnique({
    where: { id: "the-hero-id" },
    select: { createdById: true },
  });
  const fallbackUser = await prisma.user.findFirst({ select: { id: true } });
  const createdById = existing?.createdById ?? fallbackUser?.id ?? null;

  const theHero = await prisma.character.upsert({
    where: { id: "the-hero-id" },
    update: {
      name: "THE HERO",
      edition: "3.5",
      race: "Illumian",
      class: "Paladino",
      level: 20,
      alignment: "Bom Leal",
      background: "Heroi lendario de Elmeria",
      deity: "Deus da Luz",
      str: 30,
      dex: 20,
      con: 30,
      intl: 18,
      wis: 18,
      cha: 20,
      maxHp: 300,
      currentHp: 300,
      ac: 20,
      initiative: 6,
      speed: 12,
      bab: 20,
      grapple: 0,
      fortSave: 12,
      refSave: 12,
      willSave: 12,
      damageReduction: "15",
      skills: JSON.stringify(heroSkills),
      features: JSON.stringify(heroFeatures),
      equipment: JSON.stringify(heroEquipment),
      weapons: JSON.stringify(heroWeapons),
      currency: JSON.stringify({ cp: 0, sp: 0, gp: 0, pp: 0 }),
      notes: heroNotes,
      campaignId,
    },
    create: {
      id: "the-hero-id",
      name: "THE HERO",
      edition: "3.5",
      race: "Illumian",
      class: "Paladino",
      level: 20,
      alignment: "Bom Leal",
      background: "Heroi lendario de Elmeria",
      deity: "Deus da Luz",
      str: 30,
      dex: 20,
      con: 30,
      intl: 18,
      wis: 18,
      cha: 20,
      maxHp: 300,
      currentHp: 300,
      ac: 20,
      initiative: 6,
      speed: 12,
      bab: 20,
      grapple: 0,
      fortSave: 12,
      refSave: 12,
      willSave: 12,
      damageReduction: "15",
      notes: heroNotes,
      weapons: JSON.stringify(heroWeapons),
      skills: JSON.stringify(heroSkills),
      features: JSON.stringify(heroFeatures),
      equipment: JSON.stringify(heroEquipment),
      currency: JSON.stringify({ cp: 0, sp: 0, gp: 0, pp: 0 }),
      campaignId,
      createdById,
    },
  });

  console.log(`THE HERO pronto: ${theHero.name}`);
  if (campaign?.name) {
    console.log(`Vinculado a campanha: ${campaign.name}`);
  }
}

main()
  .catch((error) => {
    console.error("Erro ao criar THE HERO:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
