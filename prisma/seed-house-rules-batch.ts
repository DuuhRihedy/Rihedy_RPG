import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

interface RuleData {
  title: string;
  slug: string;
  icon: string;
  category: string;
  summary: string;
  content: string;
  sortOrder: number;
}

const RULES: RuleData[] = [
  // ── 1. Poções ──
  {
    title: "Poções Alternativas",
    slug: "pocoes-alternativas",
    icon: "🧪",
    category: "combate",
    summary: "Regra para tornar o consumo de poções mais dinâmico — ação bônus rola dados, ação completa maximiza a cura.",
    sortOrder: 1,
    content: `
<h2>Poções</h2>
<p>Uma regra simples e direta que pode ser útil para o grupo, especialmente se não houver um personagem dedicado à cura, ou caso você queira tornar o consumo de poções mais dinâmico.</p>

<blockquote><p>Ao usar uma <strong>ação bônus</strong>, o jogador bebe a poção e rola os dados de cura normalmente. No entanto, se optar por beber a poção utilizando uma <strong>ação</strong>, a cura será <strong>maximizada</strong>, considerando o valor máximo de todos os dados.</p></blockquote>

<p>Além das poções de cura padrão, você pode utilizar versões aprimoradas delas.</p>

<h3>Tabela de Poções</h3>
<table>
<thead>
<tr><th>Nome</th><th>Raridade</th><th>Valor Sugerido</th><th>Cura na Ação Bônus</th><th>Cura na Ação</th></tr>
</thead>
<tbody>
<tr><td>Poção de Cura</td><td>Comum</td><td>50 PO</td><td>2d4+2</td><td>10</td></tr>
<tr><td>Poção de Cura Maior</td><td>Incomum</td><td>200 a 350 PO</td><td>4d6+4</td><td>28</td></tr>
<tr><td>Poção de Cura Superior</td><td>Rara</td><td>1.500 a 2.500 PO</td><td>8d8+8</td><td>72</td></tr>
<tr><td>Poção de Cura Suprema</td><td>Muito Rara</td><td>10.000 a 20.000 PO</td><td>10d10+20</td><td>120</td></tr>
</tbody>
</table>

<p><em>Os valores sugeridos foram baseados no livro Xanathar's Guide to Everything, que fornece fórmulas para o custo de criação de itens.</em></p>
`,
  },

  // ── 2. Style Points ──
  {
    title: "Pontos de Estilo (Style Points)",
    slug: "pontos-de-estilo",
    icon: "⚔️",
    category: "combate",
    summary: "Recompense a criatividade dos jogadores com dados bônus que podem ser doados a aliados durante o combate.",
    sortOrder: 2,
    content: `
<h2>Pontos de Estilo</h2>
<p>Os <strong>Style Points</strong> (Pontos de Estilo) são uma forma de recompensar a criatividade dos jogadores ao descreverem ações de maneira envolvente no jogo.</p>

<h3>Como Funciona</h3>
<ul>
<li>Durante combates (ou situações semelhantes), sempre que um jogador fizer uma <strong>descrição cinemática e empolgante</strong> de sua ação, ele ganha um <em>style point</em>.</li>
<li>Cada personagem pode possuir apenas <strong>um style point por vez</strong> — não são cumulativos.</li>
<li>O ponto deve ser usado <strong>no mesmo combate</strong> em que foi recebido, caso contrário, será perdido.</li>
<li>Diferente das inspirações, que podem ser guardadas para momentos posteriores.</li>
<li>Uma vez utilizado, o personagem pode receber outro.</li>
</ul>

<h3>Efeito</h3>
<p>O style point concede um <strong>dado extra</strong> a qualquer aliado no momento em que o detentor decidir usá-lo (<em>não pode ser usado em si mesmo</em>). O dado pode ser somado a:</p>
<ul>
<li>Um <strong>ataque de um aliado</strong> (para acerto)</li>
<li>Um <strong>teste de resistência</strong></li>
</ul>

<h3>Tabela de Dados</h3>
<table>
<thead>
<tr><th>Nível</th><th>Dado</th></tr>
</thead>
<tbody>
<tr><td>Nível 1 a 4</td><td>1d4</td></tr>
<tr><td>Nível 5 a 8</td><td>1d6</td></tr>
<tr><td>Nível 9 a 12</td><td>1d8</td></tr>
<tr><td>Nível 13 a 16</td><td>1d10</td></tr>
<tr><td>Nível 17 a 20</td><td>1d12</td></tr>
</tbody>
</table>
`,
  },

  // ── 3. Desconforto Físico ──
  {
    title: "Desconforto Físico",
    slug: "desconforto-fisico",
    icon: "🏕️",
    category: "exploracao",
    summary: "Camada de realismo para viagens — personagens sofrem penalidades na recuperação de HP se dormirem sem conforto adequado.",
    sortOrder: 3,
    content: `
<h2>Desconforto Físico</h2>
<p>Caso deseje adicionar uma camada extra de realismo às viagens dos personagens, você pode utilizar a regra do desconforto. O objetivo é dar ao cenário um toque adicional de sobrevivência, levando em consideração as condições em que os personagens descansam.</p>

<blockquote><p>Um personagem que dorme em um saco de dormir dentro de uma tenda desfruta de muito mais conforto do que outro que se limita a usar apenas o saco de dormir, sem qualquer abrigo.</p></blockquote>

<h3>Mecânica</h3>
<p>O personagem deve realizar um <strong>Teste de Resistência de Constituição</strong> ao acordar. A <strong>CD base é 16</strong> (dormir na grama em ambiente aberto). Essa CD pode ser ajustada com itens de conforto ou ambientes mais desconfortáveis (a critério do mestre).</p>
<p><em>Se a CD for reduzida a 7 ou menos, o personagem está muito confortável e não precisa realizar o teste.</em></p>

<h3>Resultados</h3>
<ul>
<li><strong>Sucesso:</strong> Recupera pontos de vida e dados de vida normalmente.</li>
<li><strong>Falha no teste:</strong> Não recupera automaticamente todos os HP. Role metade dos dados de vida + CON (não consome dados de vida); dados de vida são recuperados normalmente.</li>
<li><strong>Falha por 5 ou mais:</strong> Role metade dos dados de vida + CON, e a recuperação será <strong>metade</strong> do valor final (arredondando para baixo). Não recupera dados de vida.</li>
<li><strong>Falha por 8 ou mais:</strong> Recupera HP igual a <strong>(CON × Nível) / 2</strong>. Não recupera dados de vida.</li>
</ul>

<hr>

<h3>Aumentando o Conforto Físico</h3>
<p>Para reduzir a CD dos testes, os personagens podem adquirir itens ou realizar ações que melhorem o descanso.</p>

<table>
<thead>
<tr><th>Nome</th><th>Redução / Aumento</th></tr>
</thead>
<tbody>
<tr><td>Saco de Dormir</td><td>-2 na CD de CON</td></tr>
<tr><td>Cobertor</td><td>-1 na CD de CON</td></tr>
<tr><td>Tenda</td><td>-3 na CD de CON</td></tr>
<tr><td>Montar Fogueira</td><td>-1 na CD de CON / +1 na CD de SAB</td></tr>
<tr><td>Montar Vigia</td><td>-1 na CD de SAB</td></tr>
<tr><td>Montar Vigia com 2 por vez</td><td>-2 na CD de SAB / +1 na CD de CON</td></tr>
<tr><td>Colocar Armadilhas</td><td>-1 na CD de SAB</td></tr>
</tbody>
</table>

<p>Muitas magias podem proporcionar conforto. Uma sugestão é reduzir a CD de CON e SAB em um valor igual ao <strong>nível do círculo da magia</strong>. Exemplo: <em>Leomund's Tiny Hut</em> reduz a CD de CON em 3 (magia de 3º círculo).</p>
<p>Quando os personagens dormem <strong>em camas nas cidades</strong>, não é necessário realizar os testes. Em pousadas luxuosas, o mestre pode conceder um <em>"conforto duradouro"</em>, isentando os jogadores dos testes nos próximos X dias.</p>
`,
  },

  // ── 4. Desconforto Mental ──
  {
    title: "Desconforto Mental",
    slug: "desconforto-mental",
    icon: "🧠",
    category: "exploracao",
    summary: "A tensão do ambiente afeta a recuperação de magias e habilidades — locais perigosos exigem testes de Sabedoria ao despertar.",
    sortOrder: 4,
    content: `
<h2>Desconforto Mental</h2>
<p>Para determinar o desconforto mental dos personagens, causado pela tensão do ambiente em que se encontram, o personagem deve realizar um <strong>Teste de Resistência de Sabedoria</strong> ao acordar.</p>

<blockquote><p>O desconforto mental está diretamente relacionado ao local onde os personagens descansam. Antes de aplicar reduções de itens, ações e/ou magias, o mestre deve avaliar o nível de perigo do local.</p></blockquote>

<h3>CD Base por Nível de Perigo</h3>
<table>
<thead>
<tr><th>Ambiente</th><th>CD Base</th></tr>
</thead>
<tbody>
<tr><td>Seguro</td><td>Não precisa realizar o teste</td></tr>
<tr><td>Pouco seguro</td><td>10</td></tr>
<tr><td>Ambiente pouco perigoso</td><td>12</td></tr>
<tr><td>Ambiente perigoso</td><td>14</td></tr>
<tr><td>Ambiente muito perigoso</td><td>16</td></tr>
<tr><td>Ambiente extremamente Hostil</td><td>18 ou mais (a critério do mestre)</td></tr>
</tbody>
</table>

<p><em>Se a CD reduzir a 7 ou menos, o personagem está muito confortável e não precisa realizar o teste.</em></p>

<h3>Resultados</h3>
<ul>
<li><strong>Sucesso:</strong> Recupera habilidades e espaços de magia normalmente.</li>
<li><strong>Falha no teste:</strong> Recupera apenas <strong>metade</strong> dos usos de habilidades e espaços de magia.</li>
<li><strong>Falha por 5 ou mais:</strong> Recupera metade das habilidades mas <strong>não recupera magias</strong>, OU recupera metade das magias mas <strong>não recupera habilidades</strong> (escolha do jogador).</li>
<li><strong>Falha por 8 ou mais:</strong> <strong>Não recupera</strong> habilidades nem magias.</li>
</ul>

<p><em>Dividindo os valores pela metade, arredonde para baixo. Para espaços de magia, some todos os espaços e depois divida. Os espaços são recuperados do menor para o maior.</em></p>

<hr>

<h3>Reduzindo o Desconforto Mental</h3>
<p>Use a mesma tabela de itens e ações da regra de <strong>Desconforto Físico</strong> — Montar Vigia, Colocar Armadilhas e outras ações que reduzam a CD de SAB.</p>
`,
  },

  // ── 5. Avaria de Materiais ──
  {
    title: "Avaria de Materiais",
    slug: "avaria-de-materiais",
    icon: "🛡️",
    category: "combate",
    summary: "Equipamentos não-mágicos se desgastam com golpes e erros críticos — armaduras perdem CA e armas perdem acerto/dano.",
    sortOrder: 5,
    content: `
<h2>Avaria de Materiais</h2>
<p>Esta regra adiciona desgaste aos equipamentos durante os combates, trazendo mais realismo e uma nova forma de gastar riquezas adquiridas nas aventuras.</p>

<blockquote><p><strong>Aviso:</strong> Essa regra pode ser mais penalizadora do que recompensadora, especialmente para personagens corpo a corpo. Converse com seus jogadores antes de implementar!</p></blockquote>

<h3>Armaduras</h3>
<p>Quando um personagem usando <strong>armadura não mágica</strong> sofrer um <strong>dano crítico</strong>, a armadura sofre 1 ponto de avaria. Acumula até 3 pontos.</p>

<table>
<thead>
<tr><th>Pontos de Avaria</th><th>Consequência</th><th>Reparo</th></tr>
</thead>
<tbody>
<tr><td>1</td><td>-1 na CA</td><td>10% do valor ou magia <em>Mending/Reparo</em></td></tr>
<tr><td>2</td><td>-2 na CA</td><td>40% do valor da armadura</td></tr>
<tr><td>3</td><td>Não fornece mais proteção</td><td>70% do valor da armadura</td></tr>
</tbody>
</table>

<h3>Armas</h3>
<p>Quando um personagem usando <strong>arma não mágica</strong> rolar um <strong>erro crítico</strong> (natural 1), a arma sofre 1 ponto de avaria. Acumula até 3 pontos.</p>

<table>
<thead>
<tr><th>Pontos de Avaria</th><th>Consequência</th><th>Reparo</th></tr>
</thead>
<tbody>
<tr><td>1</td><td>-1 em acerto e dano</td><td>10% do valor ou magia <em>Mending/Reparo</em></td></tr>
<tr><td>2</td><td>-2 em acerto e dano</td><td>40% do valor com ferreiro</td></tr>
<tr><td>3</td><td>Arma inutilizável</td><td>70% do valor com ferreiro</td></tr>
</tbody>
</table>

<p><em>Os valores na tabela não são cumulativos — ela descreve os pontos negativos no nível de avaria atual.</em></p>

<hr>

<h3>Materiais Resistentes (Adamantina)</h3>
<p>Equipamentos feitos de <strong>Adamantina</strong> ou materiais fantásticos semelhantes possuem uma tabela diferente:</p>

<h4>Armaduras de Adamantina</h4>
<table>
<thead>
<tr><th>Avaria</th><th>Consequência</th><th>Reparo</th></tr>
</thead>
<tbody>
<tr><td>1-2</td><td>Nada acontece</td><td>10% do valor ou <em>Mending</em></td></tr>
<tr><td>3-5</td><td>-1 na CA</td><td>25% do valor</td></tr>
<tr><td>6-8</td><td>-2 na CA</td><td>50% do valor</td></tr>
<tr><td>9</td><td>Não fornece mais proteção</td><td>70% do valor</td></tr>
</tbody>
</table>

<h4>Armas de Adamantina</h4>
<table>
<thead>
<tr><th>Avaria</th><th>Consequência</th><th>Reparo</th></tr>
</thead>
<tbody>
<tr><td>1-2</td><td>Nada acontece</td><td>10% do valor ou <em>Mending</em></td></tr>
<tr><td>3-5</td><td>-1 em acerto e dano</td><td>25% do valor</td></tr>
<tr><td>6-8</td><td>-2 em acerto e dano</td><td>50% do valor</td></tr>
<tr><td>9</td><td>Arma inutilizável</td><td>70% do valor</td></tr>
</tbody>
</table>

<hr>

<h3>Consertando Equipamentos</h3>
<p>O tempo necessário para o conserto fica a critério do mestre. Se um personagem do grupo tiver proficiência, local e materiais, o mestre pode cobrar <strong>metade do valor</strong> do reparo.</p>

<blockquote><p><strong>Exemplo:</strong> Yarla, a guerreira, teve sua Cota de Talas (200 PO) danificada com 2 pontos de avaria (-2 CA). Reparo custaria 80 PO com ferreiro. Porém, o artífice Kevom pode reparar comprando materiais por <strong>40 PO</strong>.</p></blockquote>

<p>Ferreiros de boa qualidade podem cobrar <strong>20% do valor</strong> para revestir o equipamento com proteção extra. Equipamentos revestidos aguentam um golpe crítico <strong>sem sofrer avaria</strong>.</p>
`,
  },

  // ── 6. Avaria Mágica ──
  {
    title: "Avaria Mágica",
    slug: "avaria-magica",
    icon: "✨",
    category: "combate",
    summary: "Itens mágicos não são indestrutíveis — sofrem avaria em críticos e podem perder seus efeitos mágicos permanentemente.",
    sortOrder: 6,
    content: `
<h2>Avaria Mágica</h2>
<p>Itens mágicos são extremamente resistentes, mas não são indestrutíveis — eles simplesmente levam mais tempo para se quebrar.</p>

<h3>Mecânica</h3>
<ul>
<li><strong>Armadura mágica</strong> + ataque crítico recebido → 1 ponto de avaria</li>
<li><strong>Arma mágica</strong> + erro crítico no ataque → 1 ponto de avaria</li>
<li>Objetos mágicos podem ser atacados diretamente e recebem avaria por ataque sofrido</li>
</ul>

<p>Em determinados níveis de avaria, o jogador rola <strong>1d100</strong> no início de cada combate. Se o valor for igual ou menor que a porcentagem indicada, o efeito mágico é <strong>desativado por 1 minuto</strong> (10 rodadas).</p>

<h3>Tabela de Avaria Mágica</h3>
<table>
<thead>
<tr><th>Avaria</th><th>Consequência</th><th>Reparo</th></tr>
</thead>
<tbody>
<tr><td>1</td><td>Nada acontece</td><td>250 PO ou <em>Greater Mending</em></td></tr>
<tr><td>2</td><td>15% de chance do efeito falhar (1d100)</td><td>250 PO ou <em>Greater Mending</em></td></tr>
<tr><td>3</td><td>15% de chance do efeito falhar</td><td>500 PO</td></tr>
<tr><td>4</td><td>33% de chance do efeito falhar</td><td>500 PO</td></tr>
<tr><td>5</td><td>33% de chance do efeito falhar</td><td>1000 PO</td></tr>
<tr><td>6</td><td>Efeito mágico <strong>inativo</strong> até reparo</td><td>1000 PO</td></tr>
</tbody>
</table>

<p>Itens mágicos danificados devem ser levados a um <strong>conjurador especializado</strong> para reparo das propriedades mágicas.</p>

<hr>

<h3>Itens Mágicos de Adamantina</h3>
<table>
<thead>
<tr><th>Avaria</th><th>Consequência</th><th>Reparo</th></tr>
</thead>
<tbody>
<tr><td>1-2</td><td>Nada acontece</td><td>500 PO ou <em>Greater Mending</em></td></tr>
<tr><td>3-4</td><td>-1 em acerto e dano</td><td>500 PO ou <em>Greater Mending</em></td></tr>
<tr><td>5</td><td>-1 em acerto e dano</td><td>1000 PO</td></tr>
<tr><td>6-8</td><td>-2 em acerto e dano</td><td>1000 PO</td></tr>
<tr><td>9-11</td><td>Arma inutilizável</td><td>2000 PO</td></tr>
<tr><td>12</td><td>Arma inutilizável</td><td>4000 PO</td></tr>
</tbody>
</table>

<blockquote><p><strong>Importante:</strong> Se um item mágico receber avaria além do máximo, ele perde <strong>completamente</strong> seus efeitos mágicos — tanto ativos quanto passivos. Mesmo se consertado, se torna um item mundano.</p></blockquote>

<hr>

<h3>Greater Mending (Reparo Maior)</h3>
<p><em>Transmutação — 2º Círculo</em></p>

<table>
<thead>
<tr><th>Propriedade</th><th>Detalhe</th></tr>
</thead>
<tbody>
<tr><td><strong>Tempo de Conjuração</strong></td><td>10 minutos</td></tr>
<tr><td><strong>Alcance</strong></td><td>Toque</td></tr>
<tr><td><strong>Componentes</strong></td><td>S, M (Martelo de ouro com cabo de marfim no valor de 200 PO)</td></tr>
<tr><td><strong>Duração</strong></td><td>Instantânea</td></tr>
</tbody>
</table>

<p>Você toca um objeto que tenha sido danificado dentro de um período de 1 ano. Contanto que a quebra não ultrapasse 1,5 metros (5 pés) em qualquer dimensão, você o conserta, removendo completamente qualquer vestígio do dano anterior. Qualquer fragmento de material que o objeto tenha perdido reaparece no seu devido lugar.</p>

<p><strong>Classes:</strong> Artífice, Bardo, Clérigo, Druida, Feiticeiro, Mago.</p>

<p><em>Greater Mending pode reparar objetos mundanos com até 2 pontos de avaria ou objetos de adamantina com até 4 pontos.</em></p>
`,
  },
];

async function main() {
  console.log("📜 Inserindo 6 regras da casa...\n");

  for (const rule of RULES) {
    const existing = await prisma.houseRule.findUnique({
      where: { slug: rule.slug },
    });

    if (existing) {
      console.log(`   ↻ "${rule.title}" já existe — atualizando...`);
      await prisma.houseRule.update({
        where: { slug: rule.slug },
        data: {
          title: rule.title,
          icon: rule.icon,
          category: rule.category,
          summary: rule.summary,
          content: rule.content,
          sortOrder: rule.sortOrder,
        },
      });
    } else {
      await prisma.houseRule.create({
        data: {
          title: rule.title,
          slug: rule.slug,
          icon: rule.icon,
          category: rule.category,
          summary: rule.summary,
          content: rule.content,
          pinned: false,
          sortOrder: rule.sortOrder,
        },
      });
      console.log(`   ✓ "${rule.title}" criada`);
    }
  }

  const total = await prisma.houseRule.count();
  console.log(`\n✅ Pronto! Total de regras no banco: ${total}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
