import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

const CONVERSAS_DE_FOGUEIRA_HTML = `
<h2>Sobre Este Material</h2>
<p>Transforme as interações de seu RPG em momentos de roleplay e desenvolvimento de grupo.</p>
<p>Este sistema não usa perguntas genéricas, funcionando através de <strong>Âncoras Narrativas</strong>. O jogador se conecta ao passado do seu personagem através de um evento recente e real da campanha, preenchendo as lacunas <code>[ ]</code> com as vitórias, derrotas e escolhas relevantes ao momento.</p>
<blockquote><p><strong>Conversas de Fogueira</strong> — São as conversas no acampamento que constroem a alma do grupo e nos diz por quem valerá a pena sangrar de novo amanhã.</p></blockquote>

<hr>

<h2>Como Usar Esta Mecânica na Mesa</h2>
<ol>
<li>Quando o grupo acampar, o Narrador sugere uma Conversa de Fogueira. Ele pode definir uma das categorias específicas (descritas abaixo) ou deixar em aberto aos jogadores.</li>
<li>Um jogador escolhe uma pergunta da lista ou inventa uma nova que seja apropriada e direciona a conversa a um colega específico.</li>
<li>Interações que aprofundem os laços do grupo, revelem segredos ou gerem intrigas podem ser recompensadas com <strong>Inspiração</strong> ou outras mecânicas favoráveis aos personagens.</li>
</ol>

<hr>

<h2>Categorias de Assuntos</h2>

<h3>1. Ecos da Batalha</h3>
<p><em>Usado após combates difíceis e violentos ou emboscadas pesadas.</em></p>
<ol>
<li>Quando enfrentamos [cite um inimigo específico], você lutou com muita raiva (ou muito medo). O que aquele inimigo te lembrou?</li>
<li>Você me salvou (ou outro colega) de [cite um ataque, inimigo ou armadilha]. Por que assumiu esse risco por nós?</li>
<li>Naquela hora em que [cite um momento crítico do combate], achei que fôssemos morrer. O que passou pela sua cabeça ali?</li>
<li>Vi como você finalizou o [cite o inimigo]. Onde você aprendeu a combater desse jeito?</li>
<li>Tivemos que fazer [cite uma ação violenta] para sobreviver. Isso vai tirar o seu sono essa noite?</li>
<li>Seu corpo está cheio de marcas de [cite um tipo de dano sofrido: garras, fogo, magia...]. Isso é o pior que você já sofreu, ou carrega cicatrizes mais profundas?</li>
</ol>

<h3>2. Pesos na Consciência</h3>
<p><em>Usado após uma escolha difícil, uma mentira contada aos NPCs ou uma ação de moralidade duvidosa.</em></p>
<ol>
<li>Nós decidimos [cite a decisão polêmica tomada]. Você no fundo concorda com isso, ou só seguiu o grupo?</li>
<li>Quando você mentiu/ameaçou o [cite o NPC], você nem piscou. Você já precisou fazer muito isso antes?</li>
<li>Para conseguir o que queríamos, tivemos que abrir mão de [cite um recurso, tempo, ou valor moral]. Você acha que o preço foi justo?</li>
<li>Você se recusou a [cite algo que o personagem não quis fazer]. Onde exatamente você traça a sua linha vermelha?</li>
<li>Se a gente descobrisse que o [cite um NPC ou facção] estava nos usando, você voltaria atrás no que fizemos hoje?</li>
<li>Eu vi a sua expressão quando descobrimos [cite uma revelação ou segredo]. O que isso mudou na sua cabeça?</li>
</ol>

<h3>3. Falhas e Frustrações</h3>
<p><em>Usado após um fracasso, quando um plano deu errado, alguém quase morreu ou precisaram fugir.</em></p>
<ol>
<li>Quando [cite o plano que deu errado] falhou, você pareceu frustrado (ou calmo demais). Como você costuma lidar com a derrota?</li>
<li>Você quase caiu quando [cite o ataque que quase o matou]. Se tivesse morrido, o que teria ficado inacabado na sua vida?</li>
<li>Tivemos que recuar de [cite o perigo ou local do qual fugiram]. Existe algo no mundo de onde você nunca fugiria, não importa o risco?</li>
<li>No momento em que percebemos que não daria para conseguir [cite uma situação que falhou], você pensou em nos abandonar?</li>
<li>Eu vi que você hesitou na hora de [cite uma ação que o personagem evitou ou hesitou]. Do que você teve medo ali?</li>
<li>Nós sobrevivemos a [cite a ameaça] por pura sorte. Você acredita que os deuses (ou o destino) estão guardando você para algo maior?</li>
</ol>

<h3>4. Encontros Sobrenaturais</h3>
<p><em>Usado após ver magia bizarra, explorar ruínas antigas ou encontrar NPCs/monstros muito exóticos.</em></p>
<ol>
<li>Aquela magia/fenômeno [cite um efeito mágico ou bizarro] foi perturbadora. Essa foi a coisa mais estranha que você já viu na vida?</li>
<li>O lugar que exploramos, [cite a ruína, masmorra ou local], cheirava a morte (ou antiguidade). Você já tinha presenciado algo assim antes?</li>
<li>Aquele item [cite um loot ou objeto chave] parece ter muito poder. Se você pudesse ter um item mágico que realizasse um desejo, o que pediria?</li>
<li>A forma como o [cite um NPC misterioso] nos tratou foi bem suspeita. Você já foi enganado por alguém com essa mesma lábia?</li>
<li>Quando vimos [cite uma estátua, símbolo ou altar], você ficou observando com atenção e curiosidade. Você segue alguma fé cegamente?</li>
<li>A história que ouvimos sobre [cite um rumor ou lore descoberto] é assustadora. Existe alguma lenda da sua terra que ainda te dá pesadelos?</li>
</ol>

<h3>5. Reflexões na Estrada</h3>
<p><em>Usado durante viagens longas, dias tranquilos de caminhada ou turnos de vigília.</em></p>
<ol>
<li>Nós caminhamos o dia todo por [cite o terreno (pântano, floresta, planície...)]. O que você costuma pensar quando a estrada fica longa e silenciosa?</li>
<li>A ração de viagem estava com gosto de [invente um gosto ruim baseado no ambiente]. Qual é a melhor refeição que você já comeu, e quem a preparou?</li>
<li>Mais cedo, vi você mexendo em [cite um equipamento, amuleto ou arma do personagem]. Tem alguma história por trás desse objeto?</li>
<li>Quando passamos por [cite um marco geográfico que cruzaram], você parecia distante. Tem alguém te esperando em algum lugar?</li>
<li>Nós passamos a vida juntos e mal falamos do passado. Antes de vestir suas roupas de aventureiro, o que você fazia para ganhar a vida?</li>
<li>É o seu turno de vigília esta noite. Quando a escuridão aperta no acampamento, qual é a sua maior preocupação em relação a nós?</li>
</ol>

<h3>6. Triunfo e Recompensa</h3>
<p><em>Usado após conseguir um bom loot, chegar a um porto seguro ou após derrotar o chefe do arco.</em></p>
<ol>
<li>Nós conseguimos finalmente lidar com o [cite um problema resolvido]. Você comemora suas vitórias, ou já está esperando a próxima tragédia?</li>
<li>O tesouro que encontramos em [cite um local] é considerável. O que você vai fazer com a sua parte?</li>
<li>Quando finalmente chegarmos em [cite um local]. Qual é a primeira coisa que você quer fazer lá?</li>
<li>Nós trabalhamos muito bem juntos para derrubar [cite um obstáculo]. Tem alguém do seu passado com quem você fazia uma dupla tão boa assim?</li>
<li>Provamos que podemos lidar com coisas como [cite uma ameaça enfrentada]. Até onde você acha que o nosso grupo pode chegar antes de quebrar?</li>
<li>A recompensa por [cite uma missão concluída] nos deixa confortáveis por um tempo. Existe algo no mundo que te faria largar a vida de aventureiro?</li>
</ol>
`;

async function main() {
  console.log("🔥 Inserindo regra: Conversas de Fogueira...");

  const existing = await prisma.houseRule.findUnique({
    where: { slug: "conversas-de-fogueira" },
  });

  if (existing) {
    console.log("   → Já existe, atualizando conteúdo...");
    await prisma.houseRule.update({
      where: { slug: "conversas-de-fogueira" },
      data: {
        content: CONVERSAS_DE_FOGUEIRA_HTML,
        summary: "Mecânica de roleplay para momentos de acampamento — perguntas baseadas em Âncoras Narrativas que conectam personagens ao passado da campanha.",
      },
    });
  } else {
    await prisma.houseRule.create({
      data: {
        title: "Conversas de Fogueira",
        slug: "conversas-de-fogueira",
        icon: "🔥",
        category: "roleplay",
        summary: "Mecânica de roleplay para momentos de acampamento — perguntas baseadas em Âncoras Narrativas que conectam personagens ao passado da campanha.",
        content: CONVERSAS_DE_FOGUEIRA_HTML,
        pinned: true,
        sortOrder: 0,
      },
    });
  }

  console.log("✅ Regra inserida com sucesso!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
