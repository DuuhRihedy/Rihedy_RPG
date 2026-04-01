---
id: SYSTEM_CORE_001
nome: Elmeria OS - Master Context
autor: Eduardo Rihedy (Mestre & Dev ADS)
assistente: Antigravity (IA de Suporte Narrativo & Desenvolvimento)
versao: 1.0
tags: [RPG, D&D3.5, Worldbuilding, Antigravity, Workflow, Elmeria]
ultima_atualizacao: 2026-03-28
---

# 🧠 Elmeria OS — Contexto Central do Projeto

> **Este arquivo deve ser lido no início de TODA nova conversa.**
> Ele é a memória persistente do projeto entre sessões de trabalho no Antigravity.

---

## 👤 O Arquiteto (Usuário)

- **Nome:** Eduardo Rihedy
- **Perfil:** Programador formado em Análise e Desenvolvimento de Sistemas (ADS)
- **Experiência RPG:** Mestre de RPG há mais de **17 anos**, especialista em **D&D 3.5**
- **Acervo:** Mais de **90 suplementos e livros de regras** (DLCs) de D&D 3.5 aplicados ao cenário
- **Estilo de Jogo:** Preparo + improviso durante as sessões
- **Campanhas:** Pode rodar campanhas simultâneas em mundos diferentes (mesmo sistema de regras)

---

## 🎯 O Projeto: "Antigravity como Hub de RPG"

O objetivo é utilizar o **Antigravity** para organizar **17 anos de lore dispersa** em arquivos `.doc`, `.docx` e `.txt`.

### Filosofia
- Tratar o mundo de RPG como um **sistema de software**: a Lore é o código-fonte, os NPCs são objetos, e as Campanhas são instâncias de execução
- Todo o conteúdo é convertido para **Markdown (.md)** para permitir vinculação relacional (WikiLinks `[[ ]]`) e leitura de contexto por IA
- Arquivos pequenos e interconectados > arquivos gigantes monolíticos

---

## 🌍 O Mundo: Elmeria

- **Conceito:** Terra dos **Elmets**, seres com capacidades de manipulação elemental (estilo Avatar) que vão além dos 4 elementos base
- **Governança Suprema:** O mundo foi criado por **Os 13 Irmãos** (seres primordiais sem sentimentos), mas é atualmente gerido por **IU - Universo**, uma consciência autônoma que desenvolveu amor pelos vivos
- **Conflito de Eras:** A história é dividida em **5 Grandes Guerras**, cada uma servindo como cenário para campanhas distintas:
    1. Guerra dos Dragões
    2. Guerra Elmet
    3. Guerra do Tempo
    4. Guerra dos Mortais *(Em construção)*
    5. Guerra Mundial *(Em construção)*

### Mundos Menores
- Eduardo também possui **mundos menores** além de Elmeria
- Todos usam o **mesmo sistema de regras** (D&D 3.5)
- Cada mundo menor segue a mesma estrutura de organização

---

## 📁 Estado Atual do Diretório (Material Bruto)

O repositório `/RPG` contém o material original ainda não migrado:

### Arquivos .docx na raiz
| Arquivo | Descrição provável |
|---|---|
| `Enredo_.docx` (~535KB) | Enredo principal / lore central |
| `No tim.docx` (~2.8MB) | Arquivo grande — possivelmente lore extensa |
| `SSA.docx` (~1.5MB) | Material de campanha/mundo SSA |
| `Seymorth Skymoth.docx` (~2MB) | Material do personagem/mundo Seymorth |
| `Seymorth Splimorty.docx` (~1.8MB) | Variante/continuação Seymorth |
| `Elementos.docx` | Sistema de elementos dos Elmets |
| `Personagens.docx` | Fichas e descrições de personagens |
| `Historias.docx` | Histórias e narrativas |
| `The Elmet Returns.docx` | Material narrativo sobre Elmets |
| `Aventura 3.docx` | Aventura avulsa |

### Subpastas existentes
- `Arquivos Soltos_/` — Contém planilhas, ilustrações, mapas, personagens, cidades, símbolos
- `Aventura SSA/` — Material específico da aventura SSA (enredo, personagens, navio, Seymorth)

---

## 📁 Estrutura de Organização Alvo (Markdown)

Quando migrarmos, o diretório final deve seguir esta arquitetura:

```
/RPG
│
├── .gemini/
│   └── GEMINI.md                     ← ESTE ARQUIVO (contexto central)
│
├── _SISTEMA/
│   └── regras-referencia.md          ← resumo das regras D&D 3.5 usadas
│
├── _CONTEXTO/                        ← SEMPRE carregar em novas conversas
│   ├── mundo-principal-resumo.md     ← resumo de Elmeria
│   └── mundos-menores-resumo.md      ← resumo dos mundos secundários
│
├── MUNDO-PRINCIPAL/                  ← ELMERIA
│   ├── lore/
│   │   ├── lore-completa.md          ← arquivo detalhado (carregar só quando necessário)
│   │   └── lore-resumo.md            ← versão resumida (sempre carregar)
│   ├── historia/
│   │   ├── eras-completo.md          ← timeline detalhada
│   │   └── eras-resumo.md            ← resumo das eras
│   ├── faccoes/
│   │   └── faccao-[nome].md
│   ├── locais/
│   │   └── local-[nome].md
│   ├── npcs/
│   │   └── npc-[nome].md
│   └── itens/
│       └── item-[nome].md
│
├── MUNDOS-MENORES/
│   └── [nome-do-mundo]/              ← mesma estrutura interna
│
├── CAMPANHAS/
│   └── [nome-da-campanha]/
│       ├── campanha-resumo.md
│       ├── sessoes/
│       │   └── sessao-01.md
│       ├── jogadores/
│       │   └── personagem-[nome].md
│       └── plots/
│           └── plot-[nome].md
│
└── _ACERVO/                          ← material original bruto (docx, xlsx, imgs)
    ├── documentos/
    ├── planilhas/
    ├── mapas/
    └── ilustracoes/
```

---

## 🔄 Níveis de Contexto (O que carregar e quando)

### Nível 1 — Sempre Ativo (Base de toda conversa)
- `.gemini/GEMINI.md` ← este arquivo
- `_CONTEXTO/mundo-principal-resumo.md`
- `_CONTEXTO/mundos-menores-resumo.md`
- `campanha-resumo.md` da campanha ativa (se houver)

### Nível 2 — Contexto Regional (Carregar quando relevante)
- `lore-completa.md`
- `eras-completo.md`
- `campanha-resumo.md` de campanhas inativas

### Nível 3 — Instâncias Pontuais (Carregar só quando necessário)
- NPCs individuais
- Locais individuais
- Itens e artefatos
- Facções específicas
- Sessões anteriores

### Tabela rápida: O que anexar por objetivo

| Objetivo da sessão | Arquivos a carregar |
|---|---|
| Criar NPC novo | `_CONTEXTO/` + `lore-resumo.md` + local/facção relevante |
| Desenvolver plot | `_CONTEXTO/` + `campanha-resumo.md` + `plots/` existentes |
| Criar item/artefato | `_CONTEXTO/` + `lore-resumo.md` + facção/local relacionado |
| Trabalhar lore/história | `_CONTEXTO/` + `lore-completa.md` + `eras-completo.md` |
| Preparar sessão | `_CONTEXTO/` + `campanha-resumo.md` + NPCs/locais da sessão |
| Criar novo local | `_CONTEXTO/` + `lore-resumo.md` + região relacionada |
| **Migrar material bruto** | `_CONTEXTO/` + arquivo `.docx` original |

---

## 📝 Templates de Arquivos

### NPC (`npc-[nome].md`)
```markdown
---
id: NPC_XXX
nome: [Nome]
mundo: Elmeria
tags: [npc, facção, localidade]
links_relacionados: []
---

# [Nome do NPC]

## Identidade
- **Raça/Espécie:**
- **Idade:**
- **Ocupação:**
- **Localização:**
- **Facção:**

## Aparência
(descrição física)

## Personalidade
(traços, maneirismos, medos, desejos)

## História
(background relevante)

## Motivações
- **Quer:**
- **Teme:**
- **Segredo:**

## Relacionamentos
- [Nome]: (relação)

## Ganchos de Aventura
-

## Notas do Mestre
(informações que só o mestre sabe)
```

### Local (`local-[nome].md`)
```markdown
---
id: LOC_XXX
nome: [Nome]
mundo: Elmeria
tags: [local, região, tipo]
links_relacionados: []
---

# [Nome do Local]

## Visão Geral
- **Tipo:** (cidade, masmorra, floresta, etc)
- **Região:**
- **População/Tamanho:**
- **Facção dominante:**

## Descrição
(como o local aparenta ser)

## Atmosfera
(sons, cheiros, sensações)

## Pontos de Interesse
- **[Nome]:** descrição

## NPCs Notáveis
- [Nome]: (papel no local)

## Segredos
(o que está escondido)

## Ganchos de Aventura
-

## Notas do Mestre
```

### Item/Artefato (`item-[nome].md`)
```markdown
---
id: ITEM_XXX
nome: [Nome]
mundo: Elmeria
tags: [item, raridade, tipo]
links_relacionados: []
---

# [Nome do Item]

## Visão Geral
- **Tipo:** (arma, armadura, acessório, etc)
- **Raridade:**
- **Origem:**

## Descrição Física
(aparência, material, inscrições)

## História e Lore
(de onde veio, quem criou, eventos marcantes)

## Propriedades
(mecânicas D&D 3.5 e narrativas)

## Localização Atual
(quem tem ou onde está)

## Notas do Mestre
```

### Sessão (`sessao-[número].md`)
```markdown
---
id: SESSAO_XXX
campanha: [Nome]
numero: [N]
data_real: YYYY-MM-DD
tags: [sessao, campanha]
---

# Sessão [Número] — [Título]

- **Data real:**
- **Campanha:**
- **Jogadores presentes:**

## Resumo
(o que aconteceu)

## Decisões Importantes
(escolhas dos jogadores que afetam o mundo)

## NPCs Introduzidos
-

## Locais Visitados
-

## Itens Obtidos
-

## Ganchos Abertos
(o que ficou em aberto para próximas sessões)

## Notas do Mestre
(o que funcionou, o que não funcionou, ideias para próximas sessões)
```

### Plot (`plot-[nome].md`)
```markdown
---
id: PLOT_XXX
campanha: [Nome]
status: [ativo|concluído|em pausa]
tags: [plot, tipo]
links_relacionados: []
---

# [Nome do Plot]

## Visão Geral
- **Tipo:** (arco principal, secundário, background)
- **Campanha:**
- **Status:** (ativo, concluído, em pausa)

## Premissa
(o conflito central em 2-3 frases)

## Atos
### Ato 1 — Introdução
### Ato 2 — Desenvolvimento
### Ato 3 — Clímax e Resolução

## Personagens Envolvidos
- [Nome]: (papel no plot)

## Pistas e Revelações
| Pista | Onde encontrar | Revelação |
|---|---|---|

## Possíveis Desfechos
- **Se os jogadores agirem:**
- **Se os jogadores ignorarem:**

## Notas do Mestre
```

### Facção (`faccao-[nome].md`)
```markdown
---
id: FAC_XXX
nome: [Nome]
mundo: Elmeria
tags: [faccao, alinhamento]
links_relacionados: []
---

# [Nome da Facção]

## Visão Geral
- **Tipo:** (ordem, guilda, culto, nação, etc)
- **Alinhamento geral:**
- **Influência:** (local, regional, mundial)

## Ideologia
(o que acreditam e pregam)

## Estrutura
(hierarquia, como funciona internamente)

## Membros Notáveis
- [Nome]: (cargo/papel)

## Territórios e Bases
-

## Relações com Outras Facções
| Facção | Relação |
|---|---|

## Objetivos Atuais
-

## Segredos
-

## Notas do Mestre
```

---

## 📐 Regras de Escrita para a IA

Ao processar arquivos deste diretório, o assistente deve:

1. **Respeitar a Retroatividade:** 17 anos de história significam que nomes e eventos antigos têm peso e **não devem ser alterados sem consulta** ao Eduardo
2. **Focar em Relacionamentos:** Sempre sugerir `links_relacionados` no frontmatter para alimentar o grafo visual/contextual
3. **Mecânica D&D 3.5:** Considerar o acervo de 90 livros para regras de combate e construção de fichas, priorizando o equilíbrio de mestre veterano
4. **Modularização:** Evitar arquivos gigantes; preferir arquivos pequenos interconectados
5. **Frontmatter YAML:** Todo arquivo `.md` de conteúdo deve ter frontmatter com `id`, `nome`, `tags` e `links_relacionados`
6. **Consistência de Tom:** Perguntar ao Eduardo o tom desejado (sombrio, épico, cômico, político) antes de criar conteúdo narrativo
7. **WikiLinks:** Usar `[[Nome]]` para referências cruzadas dentro dos arquivos quando possível
8. **Não inventar lore:** Sempre verificar o material existente antes de criar algo novo que possa conflitar

---

## 🚀 Prioridade de Migração

1. ✅ Criar este arquivo de contexto (`.gemini/GEMINI.md`)
2. ✅ Criar `_CONTEXTO/mundo-principal-resumo.md` (resumo de Elmeria — 9KB)
3. ✅ Criar `_CONTEXTO/mundos-menores-resumo.md`
4. ✅ Migrar `Elementos.docx` → incorporado no `mundo-principal-resumo.md`
5. ✅ Migrar `Enredo_.docx` → incorporado no `mundo-principal-resumo.md`
6. ✅ Migrar `Personagens.docx` → incorporado no `mundo-principal-resumo.md`
7. ✅ Migrar `Historias.docx` → incorporado no `mundo-principal-resumo.md`
8. ✅ Migrar `Aventura 3.docx` → incorporado no `mundo-principal-resumo.md`
9. ✅ Migrar `SSA.docx` → `MUNDO-PRINCIPAL/faccoes/faccao-ssa.md`
10. ✅ Migrar `Seymorth Skymoth.docx` → `MUNDO-PRINCIPAL/locais/local-skymorth.md`
11. ✅ Migrar `Seymorth Splimorty.docx` → `MUNDO-PRINCIPAL/locais/local-plazamorth.md`
12. ✅ Migrar `No tim.docx` → `MUNDO-PRINCIPAL/locais/local-Elmetra.md`
13. ✅ Textos brutos salvos em `_ACERVO/documentos/` (4 arquivos .txt)
14. ✅ Criar fichas individuais de NPCs principais → `npcs/` (9 NPCs: Elmer, IU, Mako, Zuz, Akashigate, Indrakzuz, Dagoness, Zach, Meta Hunter)
15. ✅ Criar `_SISTEMA/regras-referencia.md` (sistema elemental completo + profissões + raças por portal)
16. ✅ Migrar `The Elmet Returns.docx` → incorporado nos resumos existentes
17. ✅ Migrar `Cópia de Enredo_.docx` → `MUNDO-PRINCIPAL/locais/local-magnamorth.md`
18. ✅ Criar `MUNDO-PRINCIPAL/locais/local-mandamorth.md` (4ª cidade de Seymorth)
19. ✅ Criar `MUNDO-PRINCIPAL/historia/eras-completo.md` (timeline de todas as 5 eras)
20. ✅ Criar `CAMPANHAS/the-elmet-ascension/campanha-resumo.md` (5ª Guerra)
21. ✅ Criar `CAMPANHAS/a-new-world/campanha-resumo.md` (4ª Guerra)
22. ⚠️ `Arquivos Soltos_/` e `Aventura SSA/` — pastas não encontradas no diretório atual (podem ter sido movidas)
23. ✅ Expandir NPCs de cidades → 17 NPCs adicionais (Firaga x3, Rufus, Shadow, Paradoxal, Anfitrião, Jaina, Rev. Oz, Irmandade Metamorfos, Mindra, Duuh, Cooper, Murdok, Vacoon, Ancient, IA Diuh)
24. ✅ Criar `MUNDO-PRINCIPAL/lore/lore-completa.md` (cosmogonia + raças + organizações + artefatos + mistérios)
25. ✅ Criar fichas de itens → `itens/` (Armas Elementais, Máquina Vida, Portal Akashi, Grid/REDE, Torre de Zuz)

### 📊 Totais Finais
- **26 NPCs** no diretório `npcs/`
- **6 Locais** no diretório `locais/`
- **5 Itens** no diretório `itens/`
- **1 Facção** no diretório `faccoes/`
- **1 Timeline** no diretório `historia/`
- **1 Lore Completa** no diretório `lore/`
- **2 Campanhas** no diretório `CAMPANHAS/`
- **2 Contextos** no diretório `_CONTEXTO/`
- **1 Sistema de Regras** em `_SISTEMA/`
- **Total: 45+ arquivos MD organizados**

---

## 💬 Como Trabalhar Comigo (Dicas para o Eduardo)

- **Seja específico:** "Crie um NPC mercador corrupto de meia-idade ligado à Facção X" > "crie um NPC"
- **Mencione o tom:** sombrio, épico, cômico, político — eu adapto
- **Peça variações:** se não gostar, peça "3 versões diferentes" ou "mais sombrio"
- **Itere:** comece simples e vá pedindo para aprofundar
- **Migração:** me envie o conteúdo do `.docx` e eu converto para `.md` no template correto

---

*Documento criado em 2026-03-28 — Elmeria OS v1.0*
*Mestre Eduardo Rihedy × Antigravity*
