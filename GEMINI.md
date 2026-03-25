# GEMINI.md — Memória do Projeto Hub RPG

> **Última atualização:** 2026-03-25 (Hub campanha reestruturado + Imagens + Clone NPC + VTT Engine completo)
> **Objetivo:** Preservar todo o contexto do projeto entre conversas
> **Status:** Fases 1-4 concluídas + VTT Engine (Fases 1-4) + Hub reestruturado

---

## 🎯 Sobre o Projeto

**Hub RPG** — Centro de comando pessoal para gerenciamento de campanhas de RPG com inteligência artificial.

**Criador:** Mestre de RPG com 17 anos de experiência, foco em D&D 3.5.

### Objetivo Principal
Criar um hub personalizado que combine:
- Acervo inteligente de regras D&D 3.5 + 5e com busca por IA
- Gerenciador de campanhas (aventuras, sessões, arcos, notas)
- Banco de NPCs com fichas completas, itens, imagens, relações
- Assistente IA para regras, worldbuilding e gestão de campanha
- [Futuro] VTT integrado ou conexão com VTT externo (Talespire)

### O Que NÃO É
- Não é um VTT 3D (pelo menos não na V1)
- Não é uma cópia das ferramentas existentes
- Não é pago — custo zero é requisito

---

## 🧠 Decisões Tomadas

| Data | Decisão | Detalhe |
|---|---|---|
| 2026-03-19 | Edições suportadas | D&D 3.5 + 5e |
| 2026-03-19 | IA principal | Gemini Flash 2.5 Free (250 req/dia, 1M context) |
| 2026-03-19 | Custo alvo | $0 total |
| 2026-03-19 | VTT externo | Talespire (integração via Symbiotes) |
| 2026-03-19 | VTT alternativo | Multiverse Designer (visual, cutscenes) |
| 2026-03-19 | Foco inicial | Hub de gestão, NÃO VTT 3D |
| 2026-03-19 | SRD em português | Dados SRD traduzidos em PT-BR como idioma principal, EN como referência. Tradução fixa no banco, sem API externa |
| 2026-03-20 | PT-BR FIRST sempre | TODO conteúdo do hub é PT-BR primeiro, EN como referência. Se detectar algo em EN → traduzir para PT-BR |
| 2026-03-19 | Idioma da documentação | Português |
| 2026-03-19 | Frontend | Next.js + React + TypeScript |
| 2026-03-19 | Backend | NestJS + TypeScript |
| 2026-03-19 | Estilização | CSS puro (TailwindCSS só se necessário) |
| 2026-03-19 | Banco de dados | ~~SQLite~~ → **Neon PostgreSQL** (migrado 2026-03-20) |
| 2026-03-19 | ORM | Prisma |

---

## 📁 Estrutura de Documentos

```
VTT/
├── GEMINI.md                      ← Este arquivo (memória do projeto)
├── package.json                   ← Dependências (Next.js, Prisma, etc.)
├── prisma.config.ts               ← Config Prisma 7
├── .env                           ← DATABASE_URL (Neon PostgreSQL) + GEMINI_API_KEY
│
├── app/                           ← FRONTEND — Páginas (App Router)
│   ├── layout.tsx / layout.css    ← Layout raiz (sidebar + header)
│   ├── globals.css                ← Design system (tokens, componentes)
│   ├── page.tsx                   ← Dashboard
│   ├── campanhas/                 ← Páginas de campanhas + edição
│   │   └── [id]/editar/           ← Edição de campanha (NPCs, notas, arcos)
│   ├── npcs/                      ← Páginas de NPCs + edição
│   │   └── [id]/editar/           ← Edição de NPC (backstory, itens, relações)
│   ├── assistente/                ← Assistente IA
│   │   ├── page.tsx               ← Página do chat
│   │   ├── AssistantChat.tsx      ← Componente client (chat interativo)
│   │   └── assistente.css         ← Estilos
│   └── acervo/                    ← Acervo SRD
│       ├── page.tsx               ← Hub de categorias (6 cards)
│       ├── spells/                ← Busca + detalhe de magias
│       ├── monsters/              ← Busca + detalhe de monstros
│       ├── equipment/             ← Busca + detalhe de equipamentos
│       ├── magic-items/           ← Busca + detalhe de itens mágicos
│       ├── classes/               ← Listagem + detalhe de classes
│       └── feats/                 ← Listagem de talentos (3.5+5e)
│
│   └── layout/                    ← Sidebar, Header, ChatSidebar (mini-chat)
│
├── components/                    ← FRONTEND — Componentes React
│   ├── layout/                    ← Sidebar, Header, ChatSidebar
│   ├── CampaignTabs.tsx           ← Abas do hub da campanha (client)
│   ├── CampaignImageField.tsx     ← Upload de capa da campanha
│   ├── ImageUpload.tsx            ← Componente genérico de upload (Vercel Blob)
│   ├── NpcImageField.tsx          ← Upload de imagem do NPC
│   ├── ItemImageField.tsx         ← Upload de imagem de item
│   └── ImportNpcPanel.tsx         ← Painel de vincular/importar NPCs
│
├── lib/                           ← BACKEND — Lógica servidor
│   ├── db.ts                      ← Prisma Client (conexão)
│   ├── translations.ts            ← Dicionários PT-BR (escolas, tipos, tamanhos, etc.)
│   ├── actions/                   ← Server Actions por domínio
│   │   ├── campaigns.ts           ← CRUD campanhas + vincular NPCs + notas + arcos + clone NPC
│   │   ├── npcs.ts                ← CRUD NPCs + itens + relações
│   │   ├── sessions.ts            ← CRUD sessões + update + dashboard stats
│   │   ├── srd.ts                 ← Busca acervo SRD (busca bilíngue EN+PT-BR)
│   │   └── assistant.ts           ← Assistente IA (enviar msg, salvar NPC/recap)
│   └── services/                  ← Lógica de negócio
│       ├── gemini.ts              ← Client REST Gemini Flash 2.5 (sem SDK)
│       └── ai-assistant.ts        ← RAG + prompts especializados
│
├── prisma/                        ← DATABASE — Schema e seed
│   ├── schema.prisma              ← 25 modelos com colunas PT-BR (campanha + SRD completo)
│   ├── seed.ts                    ← Dados de exemplo
│   ├── import-srd.ts              ← Importação SRD 5e API
│   ├── import-srd-35.ts           ← Importação feats 3.5 (hardcoded PT-BR)
│   ├── import-spells-35.ts        ← Importação magias 3.5 nível 0-3 (PT-BR)
│   ├── import-spells-35-hi.ts     ← Importação magias 3.5 nível 4-9 (PT-BR)
│   ├── import-monsters-35.ts      ← Importação monstros 3.5 icônicos (PT-BR)
│   ├── import-srd-35-bulk.ts      ← Importação em massa 3.5 (Foundry VTT D35E)
│   ├── srd-35-data/               ← Dados brutos baixados do GitHub
│   │   ├── monsters-parsed.json   ← 681 monstros (6.2MB)
│   │   ├── spells.db              ← ~700 magias (3.5MB)
│   │   └── feats.db               ← ~400 feats (1.8MB)
│   ├── translate-srd.ts           ← Tradução hardcoded (EN → PT-BR, sem API)
│   └── srd-pt-br/                 ← Nomes traduzidos (1253 entradas)
│       ├── spell-names.ts         ← 319 magias 5e
│       ├── monster-names.ts       ← 334 monstros 5e
│       └── item-names.ts          ← 237 equip + 362 itens mágicos + 1 feat
│
├── public/                        ← Assets estáticos
└── docs/                          ← Documentação
    ├── visao-do-projeto.md
    ├── pesquisa-completa.md
    ├── arquitetura-e-implementacao.md
    └── arquitetura-vtt-engine.md   ← Arquitetura VTT engine (rules, compendium, generators)
```

---

## 📊 Pesquisa Realizada (Resumo)

### Mercado Analisado
- **Gerenciadores de campanha:** LegendKeeper, World Anvil, Kanka, Obsidian Portal, Chronica
- **Ferramentas com IA:** Chronicle RPG, LoreKeeper.ai, Quest Portal, Tabletop Arc, Archivist AI
- **Mapas com IA:** Dungeon Alchemist, Constructo, tt-rpg.app, DunGen, Inkarnate
- **VTTs 3D:** Talespire, Multiverse Designer (🇧🇷), Constructo
- **Plataformas BR:** Multiverse Designer, RPGpédia, Firecast/RRPG, HubRPG, Sessão Virtual
- **D&D Digital oficial:** Project Sigil (ENCERRADO out/2025)

### Conclusão da Pesquisa
1. Nenhuma ferramenta combina Hub + IA de Regras D&D 3.5
2. Nenhuma suporta D&D 3.5 com IA
3. Nenhuma BR oferece IA para regras
4. Personalização total é rara
5. Custo zero é possível com Gemini Flash 2.5

### Fontes de Dados SRD

**3.5 (OGL):**
- Andargor MySQL/XML (ENWorld) — tabelas: classes, feats, spells, monsters, skills, powers, equipment, magic_items
- Markdown repos no GitHub (katekorsaro, Obsidian Community)
- d20srd.org, dndtools.org

**5e (OGL + CC-BY-4.0):**
- dnd5eapi.co — REST API gratuita sem autenticação
- Open5e — API + conteúdo OGL de terceiros
- 5e-database no GitHub

---

## 🔧 Stack Técnica

### Frontend
- **Framework:** Next.js (React)
- **Linguagem:** TypeScript
- **Estilização:** CSS puro (vanilla) como padrão. TailwindCSS só se necessário (usuário não é fã por causa de bugs)
- **Abordagem:** HTML e CSS "grosso" — priorizar marcação semântica e CSS direto

### Backend
- **Framework:** NestJS (Node.js)
- **Linguagem:** TypeScript
- **Banco de dados:** **Neon PostgreSQL** (serverless, free tier)
- **ORM:** Prisma 7 + `@prisma/adapter-neon`
- **Driver:** `@neondatabase/serverless`

### IA
- **Modelo:** Gemini Flash 2.5 Free
- **Limites:** 250 req/dia, 250K tokens/min, 1M context window
- **Estratégia:** RAG sobre SRD indexado localmente
- **Embeddings:** Gemini text-embedding-004 (gratuito)
- **Banco vetorial:** ChromaDB ou LanceDB (local, gratuito)

---

## 🎮 Integração VTT

### Talespire (preferência)
- **Symbiotes:** Extensões web (HTML/CSS/JS) que rodam dentro do Talespire
- **WebSocket:** Interface Plugin não-oficial para controle externo
- **URL Scheme:** Links diretos (talespire://dice/4d6)
- **Preço:** ~$25 USD (compra única)

### Multiverse Designer (alternativa BR)
- **Engine:** Unreal Engine (visual ultra-realista)
- **Player Edition:** GRÁTIS
- **GM Edition:** $40-90 (compra única)
- **Criteria:** Linguagem de scripting para implementar regras RPG
- **Cutscenes:** Editor cinematográfico com lip-sync
- **Sem API** — não integrável externamente
- **Requisitos:** i7-7700HQ, GTX 1070 (8GB VRAM), 8GB RAM, 100GB disco
- **Status:** Early Access, reviews Mixed (60%), comunidade pequena

### PC do Usuário
- **CPU:** i5-13400 (notebook)
- **GPU:** RTX 3050 (6GB VRAM)
- **RAM:** 16GB
- **Veredicto Multiverse:** Roda mas com limitações (VRAM abaixo do mínimo de 8GB)
- **Veredicto Talespire:** Roda tranquilo

---

## 🗂️ Histórico de Conversas

| Data | Tópicos | Decisões |
|---|---|---|
| 2026-03-19 | Pesquisa inicial: VTTs, D&D 3.5 acervo, ferramentas existentes | Dual 3.5 + 5e, Hub antes de VTT |
| 2026-03-19 | Chronicle RPG, LoreKeeper, Quest Portal aprofundados | Features inspiradoras identificadas |
| 2026-03-19 | Viabilidade, Gemini Flash 2.5, custos, plataformas BR | Custo $0 confirmado, Gemini Free suficiente |
| 2026-03-19 | Multiverse Designer detalhado | Alternativa visual, mas Talespire melhor pra integração |
| 2026-03-19 | Consolidação de documentação | 2 docs: visao-do-projeto.md + pesquisa-completa.md |
| 2026-03-19 | Definição de stack | Next.js + NestJS + Prisma + SQLite + CSS puro |
| 2026-03-19 | Arquitetura e implementação | Design system, schema DB, roadmap 5 fases definido |
| 2026-03-19 | Fase 1 concluída | Monorepo, Next.js, design system Underdark, layout sidebar + header + dashboard |
| 2026-03-19 | Fase 2 — CRUD Core | Prisma 7 + SQLite + better-sqlite3 adapter, Server Actions, páginas Campanhas/NPCs/Sessões, seed com dados |
| 2026-03-19 | Fase 3 — Acervo SRD | Importação 5e API (1265 registros: 319 spells, 334 monsters, 12 classes, 237 equip, 362 magic items), páginas de busca com filtros |
| 2026-03-20 | Tradução SRD PT-BR | 1253 nomes traduzidos hardcoded (sem API), dicionários de sistema, UI PT-BR first |
| 2026-03-20 | Fase 4 — Assistente IA | Gemini Flash 2.5 REST client, RAG sobre SRD, 3 modos (chat regras, gerar NPC, recap sessão), contexto campanha, página /assistente |
| 2026-03-20 | Acervo expandido | Novas páginas: equipment, magic-items, classes, feats. Mini-chat sidebar. Funções translateCategory/translateClassName |
| 2026-03-20 | Importação SRD 3.5 em massa | Fonte: Rughalt/D35E (Foundry VTT OGL). 682 magias, 689 monstros, 398 feats do 3.5. Total: 3034 registros no banco |
| 2026-03-20 | Migração Neon PostgreSQL | SQLite → Neon PostgreSQL (serverless). Todos os scripts migrados de better-sqlite3 para @prisma/adapter-neon. Dados re-importados e traduções aplicadas. |
| 2026-03-23 | Melhorias Acervo + UI | Busca case-insensitive, filtro edição (3.5/5e), badges, delete com confirmação, dashboard funcional, micro-animações |
| 2026-03-23 | Formulários editáveis | Páginas de edição: campanha (NPCs, notas, arcos) e NPC (backstory, atributos, itens, relações). Actions expandidas |
| 2026-03-23 | SRD 5e completo | 8 novas tabelas: raças (9), sub-raças (4), subclasses (12), features (407), condições (15), skills (18), traits (38), idiomas (16). Total ~3550 registros |
| 2026-03-23 | Importação 3.5 completa | Equipamentos (233), itens mágicos (635), classes (33), condições (38), raças (7). Total 3.5: 2715 registros. Total geral: ~4500 |
| 2026-03-23 | Arquitetura VTT | Documento docs/arquitetura-vtt-engine.md: rules engine, character system, generators, importer. 6 fases planejadas |
| 2026-03-24 | VTT Engine Fases 1-4 | lib/engine/ completo: types, compendium, rules-engine, dice, combat, conditions, character, generators (NPC, encounter, loot), validators, importer. 18 funções. Páginas /ferramentas/* (dados, gerador-npc, encontros) |
| 2026-03-24 | Melhorias Hub | RAG priorizar D&D 3.5, ImportNpcPanel com busca, upload de imagens (Vercel Blob), API /api/upload |
| 2026-03-25 | Hub Campanha reestruturado | Campanha virou hub central com hero header + abas (Visão Geral, Sessões, NPCs, Notas, Arcos). Sidebar com campanhas ativas como sub-links. Upload de capa da campanha. Clone NPC entre campanhas. Imagens nos cards de listagem. |

---

## 📌 Regras do Projeto

1. **Toda documentação em português** — nomes de arquivos em português
2. **Custos devem ser zero** — usar ferramentas e APIs gratuitas
3. **D&D 3.5 é prioridade** — é o sistema principal do mestre
4. **Hub primeiro, VTT depois** — foco em gestão e IA antes de mesa virtual
5. **Gemini Flash 2.5 Free** como IA principal
6. **GEMINI.md sempre atualizado** — memória viva do projeto
7. **🇧🇷 PT-BR FIRST** — TODO conteúdo é PT-BR primeiro, EN como referência. Se detectar QUALQUER coisa em inglês na UI, traduzir imediatamente. Termos de sistema via dicionários (`lib/translations.ts`), nomes/descrições via colunas no banco (`namePtBr`, `descriptionPtBr`).

---

## 🚨 Regras de Comunicação (OBRIGATÓRIO)

1. **SEMPRE responder em português** — No chat, na documentação, nos comentários. Variáveis e código em inglês.
2. **NUNCA abrir o browser subagent** sem o usuário pedir explicitamente para testar/ver algo. Só abrir se o usuário disser algo como "testa", "abre", "mostra no browser", "veja como ficou".
3. **Código e nomes técnicos** permanecem em inglês (variáveis, componentes, imports).
4. **Nomes de arquivos de documentação** em português.
5. **SEMPRE fechar o dev server** (e qualquer instância) após testar. Não deixar processos rodando para evitar conflitos de porta.

---

> 📝 **Este arquivo deve ser lido no início de cada nova conversa sobre o projeto.**
