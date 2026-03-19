import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🎲 Seeding Hub RPG database...\n");

  // Clean existing data
  await prisma.sessionNpc.deleteMany();
  await prisma.campaignNpc.deleteMany();
  await prisma.event.deleteMany();
  await prisma.session.deleteMany();
  await prisma.note.deleteMany();
  await prisma.storyArc.deleteMany();
  await prisma.relation.deleteMany();
  await prisma.item.deleteMany();
  await prisma.npcAttributes.deleteMany();
  await prisma.npc.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.chatHistory.deleteMany();

  // ── Campaigns ──────────────────
  const waterdeep = await prisma.campaign.create({
    data: {
      name: "A Queda de Waterdeep",
      description: "Os heróis descobriram a conspiração dos Zhentarim e agora precisam infiltrar a fortaleza subterrânea antes que o ritual seja concluído.",
      edition: "3.5",
      status: "active",
    },
  });

  const strahd = await prisma.campaign.create({
    data: {
      name: "Maldição de Strahd",
      description: "Uma campanha sombria em Barovia, onde os jogadores enfrentam o vampiro mais temido de todos os planos.",
      edition: "5e",
      status: "active",
    },
  });

  const tomb = await prisma.campaign.create({
    data: {
      name: "Tumba da Aniquilação",
      description: "Uma corrida contra o tempo nas selvas de Chult para encontrar a causa de uma maldição mortal.",
      edition: "5e",
      status: "paused",
    },
  });

  console.log("📜 3 campanhas criadas");

  // ── NPCs ───────────────────────
  const thaldrin = await prisma.npc.create({
    data: {
      name: "Thaldrin Blackwood",
      race: "Human",
      class: "Rogue",
      level: 12,
      alignment: "Neutral Evil",
      description: "Um homem de meia-idade com cicatriz no olho esquerdo. Usa roupas finas mas discretas. Sempre carrega um punhal envenenado.",
      backstory: "Ex-membro da guilda de ladrões de Waterdeep, agora agente duplo dos Zhentarim. Busca poder e riqueza acima de tudo.",
      gmNotes: "Vai trair o grupo na sessão 25. Tem uma filha secreta em Baldur's Gate.",
      type: "enemy",
      edition: "3.5",
      attributes: {
        create: { str: 12, dex: 18, con: 14, intl: 16, wis: 10, cha: 15, hp: 78, ac: 18 },
      },
    },
  });

  const elara = await prisma.npc.create({
    data: {
      name: "Elara Moonwhisper",
      race: "Half-Elf",
      class: "Cleric",
      level: 9,
      alignment: "Neutral Good",
      description: "Sacerdotisa de Selûne com cabelos prateados e olhos que brilham sob a luz da lua. Voz suave mas firme.",
      backstory: "Criada no templo de Selûne em Silverymoon. Veio a Waterdeep seguindo visões sobre uma grande escuridão.",
      type: "ally",
      edition: "3.5",
      attributes: {
        create: { str: 10, dex: 12, con: 14, intl: 13, wis: 18, cha: 16, hp: 62, ac: 16 },
      },
    },
  });

  const gundren = await prisma.npc.create({
    data: {
      name: "Gundren Rockseeker",
      race: "Dwarf",
      class: "Expert",
      level: 5,
      alignment: "Lawful Good",
      description: "Anão robusto de barba ruiva trançada. Sempre animado e gesticulando ao falar sobre negócios.",
      backstory: "Mercador anão que descobriu a localização da Mina Perdida de Phandelver.",
      type: "neutral",
      edition: "3.5",
      attributes: {
        create: { str: 14, dex: 10, con: 16, intl: 12, wis: 11, cha: 13, hp: 35, ac: 14 },
      },
    },
  });

  const strahd_npc = await prisma.npc.create({
    data: {
      name: "Conde Strahd von Zarovich",
      race: "Vampire",
      class: "Wizard/Fighter",
      level: 20,
      alignment: "Lawful Evil",
      description: "O senhor de Barovia. Elegante, pálido, com olhos penetrantes vermelhos. Veste uma capa negra com forro carmesim.",
      backstory: "Antigo general que fez um pacto sombrio para alcançar a imortalidade por amor a Tatyana.",
      gmNotes: "Sempre observando o grupo. Aparece em momentos estratégicos para testar os jogadores.",
      type: "enemy",
      edition: "5e",
      attributes: {
        create: { str: 18, dex: 18, con: 18, intl: 20, wis: 15, cha: 18, hp: 144, ac: 16 },
      },
    },
  });

  const ireena = await prisma.npc.create({
    data: {
      name: "Ireena Kolyana",
      race: "Human",
      class: "Fighter",
      level: 5,
      alignment: "Lawful Good",
      description: "Jovem mulher de cabelos ruivos e olhos determinados. Carrega uma espada longa e se recusa a ser vítima.",
      type: "ally",
      edition: "5e",
      attributes: {
        create: { str: 14, dex: 12, con: 13, intl: 10, wis: 12, cha: 16, hp: 38, ac: 16 },
      },
    },
  });

  console.log("👥 5 NPCs criados");

  // ── Campaign-NPC links ─────────
  await prisma.campaignNpc.createMany({
    data: [
      { npcId: thaldrin.id, campaignId: waterdeep.id },
      { npcId: elara.id, campaignId: waterdeep.id },
      { npcId: gundren.id, campaignId: waterdeep.id },
      { npcId: strahd_npc.id, campaignId: strahd.id },
      { npcId: ireena.id, campaignId: strahd.id },
    ],
  });

  // ── Relations ──────────────────
  await prisma.relation.createMany({
    data: [
      { originId: thaldrin.id, targetId: elara.id, type: "inimigo", description: "Thaldrin tenta sabotar a missão de Elara" },
      { originId: elara.id, targetId: gundren.id, type: "aliado", description: "Elara protege Gundren como missão divina" },
      { originId: strahd_npc.id, targetId: ireena.id, type: "obsessão", description: "Strahd acredita que Ireena é a reencarnação de Tatyana" },
    ],
  });

  // ── Items ──────────────────────
  await prisma.item.createMany({
    data: [
      { npcId: thaldrin.id, name: "Adaga Envenenada +2", type: "arma", value: "8.000 gp", magical: true, description: "+2d6 veneno" },
      { npcId: thaldrin.id, name: "Capa da Sombra", type: "magico", value: "12.000 gp", magical: true, description: "+5 em Stealth, 1x/dia Invisibilidade" },
      { npcId: elara.id, name: "Símbolo Sagrado de Selûne", type: "magico", magical: true, description: "Foco divino, +1 nível em curas" },
      { npcId: elara.id, name: "Maça +1", type: "arma", value: "2.300 gp", magical: true },
      { npcId: gundren.id, name: "Mapa da Mina Perdida", type: "outro", description: "O mapa que começou tudo" },
    ],
  });

  console.log("🗡️ 5 itens criados");

  // ── Sessions ───────────────────
  const sessions = [];
  for (let i = 1; i <= 23; i++) {
    const session = await prisma.session.create({
      data: {
        campaignId: waterdeep.id,
        number: i,
        title: i === 23 ? "A Revelação de Thaldrin" : i === 22 ? "A Taverna dos Segredos" : i === 21 ? "Emboscada no Capítulo 4" : `Sessão ${i}`,
        date: new Date(2026, 0, i * 7),
        durationMin: 180 + Math.floor(Math.random() * 120),
      },
    });
    sessions.push(session);
  }

  // Strahd sessions
  for (let i = 1; i <= 8; i++) {
    await prisma.session.create({
      data: {
        campaignId: strahd.id,
        number: i,
        title: i === 8 ? "O Jantar com Strahd" : i === 1 ? "Névoa de Barovia" : `Sessão ${i}`,
        date: new Date(2026, 1, i * 7),
        durationMin: 200 + Math.floor(Math.random() * 60),
      },
    });
  }

  console.log("📖 31 sessões criadas");

  // ── Notes ──────────────────────
  await prisma.note.createMany({
    data: [
      { campaignId: waterdeep.id, title: "Thaldrin é agente duplo", content: "Thaldrin revelou ser um agente duplo dos Zhentarim. O grupo ainda não sabe.", private: true },
      { campaignId: waterdeep.id, title: "Espada do Crepúsculo encontrada", content: "Grupo encontrou a Espada do Crepúsculo (+3, Vorpal) na cripta sob Waterdeep.", private: false },
      { campaignId: waterdeep.id, title: "Plot hook: Mina de Gundren", content: "Gundren ainda espera notícias sobre a mina perdida. Já se passaram 6 sessões. Preciso retomar esse arco.", private: true },
      { campaignId: waterdeep.id, title: "Sildar morto", content: "NPC Sildar Hallwinter morto na emboscada do Capítulo 4. O grupo ficou abalado.", private: false },
      { campaignId: strahd.id, title: "Carta de Strahd", content: "Strahd enviou uma carta formal convidando o grupo para jantar no castelo. Armadilha óbvia, mas os jogadores querem ir.", private: true },
    ],
  });

  console.log("📝 5 notas criadas");

  // ── Story Arcs ─────────────────
  await prisma.storyArc.createMany({
    data: [
      { campaignId: waterdeep.id, title: "Conspiração Zhentarim", description: "Infiltrar e desmantelar a rede Zhentarim em Waterdeep", status: "active" },
      { campaignId: waterdeep.id, title: "Mina Perdida de Phandelver", description: "Ajudar Gundren a encontrar a mina", status: "active" },
      { campaignId: waterdeep.id, title: "O Culto do Dragão", description: "Culto tentou invocar Tiamat", status: "resolved" },
      { campaignId: strahd.id, title: "Fuga de Barovia", description: "Encontrar uma forma de escapar da névoa", status: "active" },
      { campaignId: strahd.id, title: "Proteger Ireena", description: "Manter Ireena longe de Strahd", status: "active" },
    ],
  });

  console.log("🧵 5 arcos narrativos criados");

  // ── Events ─────────────────────
  if (sessions.length > 0) {
    const lastSession = sessions[sessions.length - 1];
    await prisma.event.createMany({
      data: [
        { sessionId: lastSession.id, description: "Thaldrin revelado como traidor", type: "plot" },
        { sessionId: lastSession.id, description: "Combate contra 3 assassinos Zhentarim", type: "combate" },
        { sessionId: lastSession.id, description: "Elara curou o grupo após a emboscada", type: "social" },
      ],
    });
  }

  console.log("⚡ 3 eventos criados");
  console.log("\n✅ Seed completo! Hub RPG pronto para uso. 🎲");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
