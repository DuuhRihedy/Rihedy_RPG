// ══════════════════════════════════════════════════════
// Traduções PT-BR — Descrições de CONDIÇÕES (53)
// Inclui 5e (completas) + 3.5 (descrições expandidas)
// ══════════════════════════════════════════════════════

export const conditionDescriptions: Record<string, string> = {
  // ── 3.5 Conditions ──────────────────────────────────
  "ability-damaged-35":
    "A criatura teve uma ou mais de suas habilidades (Força, Destreza, etc.) temporariamente reduzidas. Dano de habilidade se recupera naturalmente a uma taxa de 1 ponto por dia de descanso.",
  "ability-drained-35":
    "A criatura teve uma ou mais de suas habilidades permanentemente reduzidas. Dreno de habilidade não se recupera naturalmente e requer magia de restauração.",
  "blinded-35":
    "A criatura não pode enxergar. Sofre −2 em CA, perde o bônus de Destreza na CA (se houver), se desloca com metade da velocidade e sofre −4 em testes de Busca e na maioria dos testes baseados em Força e Destreza. Todos os oponentes têm camuflagem total contra a criatura cega. Testes de perícia baseados em visão (como Observar) falham automaticamente.",
  "blown-away-35":
    "A criatura é derrubada e rola 1d4 × 10 pés, sofrendo 1d4 pontos de dano não-letal a cada 10 pés. Criaturas Pequenas ou menores em áreas com ventos fortes podem ser arremessadas.",
  "charmed": // 5e
    "- Uma criatura enfeitiçada não pode atacar o encantador nem alvejar o encantador com habilidades prejudiciais ou efeitos mágicos.\n\n- O encantador tem vantagem em qualquer teste de habilidade para interagir socialmente com a criatura.",
  "checked-35":
    "A criatura é impedida de realizar uma ação específica. Ventos fortes podem impedir o avanço de uma criatura ou dispersar gases e vapores.",
  "confused-35":
    "A criatura não pode agir normalmente. Em vez de agir por conta própria, a criatura confusa rola na tabela de confusão a cada rodada para determinar o que faz naquela rodada.",
  "cowering-35":
    "A criatura está apavorada e paralisada de medo. Perde o bônus de Destreza na CA e os oponentes ganham +2 nas jogadas de ataque contra ela.",
  "dazed-35":
    "A criatura não pode agir normalmente. Pode realizar apenas uma ação de movimento por rodada (sem ações padrão ou de rodada completa).",
  "dazzled-35":
    "A criatura não consegue enxergar bem devido a estímulos visuais excessivos. Sofre −1 em jogadas de ataque e testes de Observar baseados em visão.",
  "dead-35":
    "Os pontos de vida da criatura foram reduzidos a −10 ou menos, sua Constituição caiu para 0, ou foi morta instantaneamente por uma magia ou efeito. A alma da criatura deixa o corpo. Não pode agir de nenhuma forma.",
  "deafened-35":
    "A criatura não pode ouvir. Sofre −4 em testes de iniciativa e falha automaticamente em testes de Ouvir. Personagens que se comunicam por meios não-auditivos não sofrem penalidade.",
  "disabled-35":
    "A criatura tem exatamente 0 pontos de vida. Pode realizar apenas uma ação padrão ou de movimento (mas não ambas, nem ações de rodada completa). Sofre dano normal e fica agonizante se sofrer qualquer dano adicional.",
  "dying-35":
    "A criatura está inconsciente e com −1 a −9 pontos de vida. A cada rodada, perde 1 ponto de vida até morrer ou ser estabilizada.",
  "energy-drained-35":
    "A criatura ganhou um ou mais níveis negativos. Cada nível negativo impõe −1 em jogadas de ataque, testes e jogadas de proteção, e causa a perda de 5 pontos de vida e um nível efetivo de conjuração.",
  "entangled-35":
    "A criatura está presa em um laço ou teia. Move-se com metade da velocidade, não pode correr ou realizar investidas, e sofre −2 em jogadas de ataque e −4 em Destreza. Conjurar magias com componentes somáticos requer um teste de Concentração (CD 15).",
  "exhausted-35":
    "A criatura se move com metade da velocidade e sofre −6 em Força e Destreza. Após 1 hora de descanso completo, uma criatura exausta fica apenas fatigada.",
  "exhaustion": // 5e
    "Algumas habilidades especiais e perigos ambientais, como fome e os efeitos prolongados de temperaturas congelantes ou escaldantes, podem levar a uma condição especial chamada exaustão. Exaustão é medida em seis níveis. Um efeito pode dar a uma criatura um ou mais níveis de exaustão, conforme especificado na descrição do efeito.\n\n1 — Desvantagem em testes de habilidade\n\n2 — Velocidade reduzida pela metade\n\n3 — Desvantagem em jogadas de ataque e testes de resistência\n\n4 — Máximo de pontos de vida reduzido pela metade\n\n5 — Velocidade reduzida a 0\n\n6 — Morte\n\nSe uma criatura já exausta sofrer outro efeito que cause exaustão, seu nível atual de exaustão aumenta pela quantidade especificada na descrição do efeito.\n\nUma criatura sofre o efeito de seu nível atual de exaustão, bem como de todos os níveis inferiores. Por exemplo, uma criatura que sofre nível 2 de exaustão tem sua velocidade reduzida pela metade e desvantagem em testes de habilidade.\n\nUm efeito que remova exaustão reduz seu nível em 1, desde que a criatura também tenha comida e bebida. Terminar um descanso longo reduz o nível de exaustão da criatura em 1, desde que tenha comido e bebido.",
  "fascinated-35":
    "A criatura está encantada por uma magia ou efeito. Sofre −4 em testes de perícia feitos como reações, como Ouvir e Observar. O fascínio termina se a criatura for ameaçada ou receber dano.",
  "fatigued-35":
    "A criatura não pode correr nem realizar investidas e sofre −2 em Força e Destreza. Realizar algo que normalmente causaria fadiga deixa a criatura exausta. Após 8 horas de descanso completo, a fadiga é removida.",
  "flat-footed-35":
    "A criatura ainda não agiu neste combate. Perde o bônus de Destreza na CA (se houver) e não pode realizar ataques de oportunidade.",
  "frightened": // 5e
    "- Uma criatura amedrontada tem desvantagem em testes de habilidade e jogadas de ataque enquanto a fonte de seu medo estiver em linha de visão.\n\n- A criatura não pode se mover voluntariamente para mais perto da fonte de seu medo.",
  "frightened-35":
    "A criatura foge da fonte de seu medo o mais rápido que puder. Pode lutar se for encurralada. Sofre −2 em jogadas de ataque, testes e jogadas de proteção.",
  "grappled": // 5e
    "- A velocidade de uma criatura agarrada se torna 0, e ela não pode se beneficiar de qualquer bônus em sua velocidade.\n\n- A condição termina se o agarrador ficar incapacitado (veja a condição).\n\n- A condição também termina se um efeito remover a criatura agarrada do alcance do agarrador ou do efeito de agarrar, como quando uma criatura é arremessada pela magia onda trovejante.",
  "grappling-35":
    "A criatura está engajada em uma agarradura. Não pode se mover livremente, perde o bônus de Destreza na CA (exceto contra o oponente agarrado) e não pode usar armas de duas mãos.",
  "helpless-35":
    "A criatura está paralisada, presa, dormindo, inconsciente ou de outra forma incapaz de agir. Os oponentes podem realizar ataques certeiros corpo-a-corpo (+4 no ataque) ou aplicar golpes de misericórdia contra ela.",
  "incapacitated": // 5e
    "- Uma criatura incapacitada não pode realizar ações ou reações.",
  "incorporeal-35":
    "A criatura não tem corpo físico. Pode ser ferida apenas por outras criaturas incorpóreas, armas mágicas +1 ou superior, ou magias. Tem 50% de chance de ignorar qualquer dano de fonte corpórea.",
  "invisible-35":
    "A criatura é visualmente indetectável. Ganha +2 em jogadas de ataque e ignora o bônus de Destreza do oponente na CA. Possui camuflagem total (50% de chance de erro).",
  "invisible": // 5e
    "- Uma criatura invisível é impossível de ver sem a ajuda de magia ou um sentido especial. Para fins de se esconder, a criatura está totalmente obscurecida. A localização da criatura pode ser detectada por qualquer ruído que ela faça ou por qualquer rastro que deixe.\n\n- Jogadas de ataque contra a criatura têm desvantagem, e as jogadas de ataque da criatura têm vantagem.",
  "knocked-down-35":
    "A criatura foi derrubada por um vento forte. Pode agir normalmente, mas não pode se mover até se levantar. Levantar-se é uma ação de movimento que provoca ataques de oportunidade.",
  "nauseated-35":
    "A criatura está com ânsia e incapaz de atacar, conjurar magias ou se concentrar em magias, ou fazer qualquer outra coisa que exija atenção. Pode realizar apenas uma ação de movimento por rodada.",
  "panicked-35":
    "A criatura larga tudo que está segurando e foge da fonte de seu medo o mais rápido que puder. Se for encurralada, fica paralisada de medo. Sofre −2 em testes e jogadas de proteção.",
  "paralyzed-35":
    "A criatura está imóvel (mas não inconsciente). Os valores de Força e Destreza da criatura são efetivamente 0. Ataques corpo-a-corpo contra a criatura ganham +4, e ela não ameaça os quadrados adjacentes.",
  "paralyzed": // 5e
    "- Uma criatura paralisada está incapacitada (veja a condição) e não pode se mover ou falar.\n\n- A criatura falha automaticamente em testes de resistência de Força e Destreza.\n\n- Jogadas de ataque contra a criatura têm vantagem.\n\n- Qualquer ataque que acerte a criatura é um acerto crítico se o atacante estiver a até 1,5 metro da criatura.",
  "petrified-35":
    "A criatura foi transformada em pedra. Está inconsciente e não percebe nada ao seu redor. Se for quebrada enquanto petrificada, sofre efeitos equivalentes ao morrer.",
  "petrified": // 5e
    "- Uma criatura petrificada é transformada, junto com qualquer objeto não-mágico que esteja vestindo ou carregando, em uma substância inanimada sólida (geralmente pedra). Seu peso aumenta por um fator de dez e ela para de envelhecer.\n\n- A criatura está incapacitada (veja a condição), não pode se mover ou falar e não tem consciência do que acontece ao seu redor.\n\n- Jogadas de ataque contra a criatura têm vantagem.\n\n- A criatura falha automaticamente em testes de resistência de Força e Destreza.\n\n- A criatura tem resistência a todos os tipos de dano.\n\n- A criatura é imune a veneno e doenças, embora veneno ou doença já presentes em seu sistema fiquem suspensos, não neutralizados.",
  "pinned-35":
    "A criatura está imobilizada firmemente durante uma agarradura. Não pode realizar nenhuma ação exceto tentar escapar. Perde o bônus de Destreza na CA.",
  "poisoned": // 5e
    "- Uma criatura envenenada tem desvantagem em jogadas de ataque e testes de habilidade.",
  "prone-35":
    "A criatura está deitada no chão. Sofre −4 em jogadas de ataque corpo-a-corpo e não pode usar armas de projétil (exceto bestas). Ataques corpo-a-corpo contra ela ganham +4, mas ataques à distância sofrem −4.",
  "prone": // 5e
    "- A única opção de movimento de uma criatura caída é rastejar, a menos que ela se levante e assim encerre a condição.\n\n- A criatura tem desvantagem em jogadas de ataque.\n\n- Uma jogada de ataque contra a criatura tem vantagem se o atacante estiver a até 1,5 metro da criatura. Caso contrário, a jogada de ataque tem desvantagem.",
  "restrained": // 5e
    "- A velocidade de uma criatura contida se torna 0, e ela não pode se beneficiar de qualquer bônus em sua velocidade.\n\n- Jogadas de ataque contra a criatura têm vantagem, e as jogadas de ataque da criatura têm desvantagem.\n\n- A criatura tem desvantagem em testes de resistência de Destreza.",
  "shaken-35":
    "A criatura sofre −2 em jogadas de ataque, testes e jogadas de proteção. Abalada é uma forma menos severa de medo.",
  "sickened-35":
    "A criatura sofre −2 em todas as jogadas de ataque, testes de dano de arma, jogadas de proteção, testes de perícia e testes de habilidade.",
  "stable-35":
    "A criatura está inconsciente e com pontos de vida negativos, mas não está mais perdendo pontos de vida. Está estabilizada e não precisa fazer testes de estabilização.",
  "staggered-35":
    "A criatura tem exatamente 0 pontos de vida ou está sob um efeito que a deixa cambaleante. Pode realizar apenas uma ação padrão ou ação de movimento a cada rodada (além de ações livres e rápidas).",
  "stunned": // 5e
    "- Uma criatura atordoada está incapacitada (veja a condição), não pode se mover e pode falar apenas com dificuldade.\n\n- A criatura falha automaticamente em testes de resistência de Força e Destreza.\n\n- Jogadas de ataque contra a criatura têm vantagem.",
  "stunned-35":
    "A criatura perde o bônus de Destreza na CA (se houver), não ameaça quadrados adjacentes e não pode realizar ações. Os atacantes ganham +2 nas jogadas de ataque contra ela.",
  "turned-35":
    "A criatura (geralmente morto-vivo) foi expulsa por um clérigo. Deve fugir do clérigo o mais rápido possível por 10 rodadas. Se não puder fugir, fica paralisada de medo.",
  "unconscious-35":
    "A criatura está inconsciente e indefesa. É tratada como tendo os valores de Força e Destreza efetivamente iguais a 0.",
  "unconscious": // 5e
    "- Uma criatura inconsciente está incapacitada (veja a condição), não pode se mover ou falar e não tem consciência do que acontece ao seu redor.\n\n- A criatura larga o que estiver segurando e cai no chão.\n\n- A criatura falha automaticamente em testes de resistência de Força e Destreza.\n\n- Jogadas de ataque contra a criatura têm vantagem.\n\n- Qualquer ataque que acerte a criatura é um acerto crítico se o atacante estiver a até 1,5 metro da criatura.",
  // ── 5e Conditions (restantes) ──────────────────────
  "blinded": // 5e
    "- Uma criatura cega não pode enxergar e falha automaticamente em qualquer teste de habilidade que exija visão.\n\n- Jogadas de ataque contra a criatura têm vantagem, e as jogadas de ataque da criatura têm desvantagem.",
  "deafened": // 5e
    "- Uma criatura surda não pode ouvir e falha automaticamente em qualquer teste de habilidade que exija audição.",
};
