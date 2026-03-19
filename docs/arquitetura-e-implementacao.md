# 🏗️ Hub RPG — Arquitetura e Implementação

> **Criado em:** 2026-03-19
> **Status:** Fases 1-3 concluídas

---

## 🎨 Design System — Identidade Visual

### Paleta de Cores (Inspirada em D&D / WotC)

#### Modo Escuro (Padrão — "Underdark Mode")

| Token | Cor | Hex | Uso |
|---|---|---|---|
| `--bg-deep` | Preto profundo | `#0a0a0f` | Fundo principal |
| `--bg-surface` | Cinza escuro | `#141420` | Cards, painéis |
| `--bg-elevated` | Cinza médio | `#1e1e2e` | Elementos elevados, sidebar |
| `--bg-hover` | Cinza claro | `#2a2a3a` | Hover states |
| `--border` | Borda sutil | `#2e2e40` | Divisores, bordas |
| `--text-primary` | Branco suave | `#e8e6e3` | Texto principal |
| `--text-secondary` | Cinza claro | `#9e9e9e` | Texto secundário, placeholders |
| `--text-muted` | Cinza | `#6a6a7a` | Labels, captions |

#### Cores de Marca (D&D)

| Token | Cor | Hex | Uso |
|---|---|---|---|
| `--dnd-red` | Vermelho D&D | `#cc0000` | Marca principal, ações destrutivas |
| `--dnd-red-light` | Vermelho claro | `#e63946` | Hover do vermelho |
| `--dnd-gold` | Ouro D&D | `#c8a84e` | Destaques, badges, títulos premium |
| `--dnd-gold-light` | Ouro claro | `#dfc06e` | Hover do ouro |
| `--accent` | Ouro sutil | `#b8960c` | Links, ícones ativos |

#### Cores Funcionais

| Token | Cor | Hex | Uso |
|---|---|---|---|
| `--success` | Verde | `#22c55e` | Sucesso, vida/HP |
| `--warning` | Âmbar | `#f59e0b` | Alertas, atenção |
| `--danger` | Vermelho | `#ef4444` | Erros, dano |
| `--info` | Azul frio | `#3b82f6` | Informacional, magia |
| `--arcane` | Azul arcano | `#6366f1` | IA, magia arcana |

#### Cores de Edição

| Token | Cor | Hex | Uso |
|---|---|---|---|
| `--edition-35` | Vermelho escuro | `#8b0000` | Tag/badge D&D 3.5 |
| `--edition-5e` | Azul D&D | `#1a3a5c` | Tag/badge D&D 5e |

### Tipografia

| Uso | Fonte | Fallback | Peso |
|---|---|---|---|
| **Títulos/Display** | `"Cinzel"` | serif | 700-900 |
| **Corpo/UI** | `"Inter"` | system-ui, sans-serif | 400-600 |
| **Código/Stats** | `"JetBrains Mono"` | monospace | 400 |

### Escala Tipográfica (Ratio 1.25)

```
--text-xs:   0.75rem   (12px)
--text-sm:   0.875rem  (14px)
--text-base: 1rem      (16px)
--text-lg:   1.25rem   (20px)
--text-xl:   1.563rem  (25px)
--text-2xl:  1.953rem  (31px)
--text-3xl:  2.441rem  (39px)
--text-4xl:  3.052rem  (49px)
```

### Espaçamento (8-Point Grid)

```
--space-1:  4px
--space-2:  8px
--space-3:  12px
--space-4:  16px
--space-5:  20px
--space-6:  24px
--space-8:  32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
```

---

## 📐 Layout — Estrutura Principal

### Padrão: Sidebar + Content Area

```
┌──────────────────────────────────────────────────┐
│  SIDEBAR (240px)  │  MAIN CONTENT                │
│                   │                              │
│  ⚔️ Hub RPG      │  ┌──────────────────────┐    │
│  ─────────────   │  │  HEADER / BREADCRUMB  │    │
│  📊 Dashboard    │  └──────────────────────┘    │
│  📜 Campanhas    │                              │
│  👥 NPCs         │  ┌──────────────────────┐    │
│  📚 Acervo       │  │                      │    │
│  🤖 Assistente   │  │   CONTENT AREA       │    │
│  📖 Sessões      │  │                      │    │
│  🗺️ Mapas        │  │                      │    │
│  ⚙️ Config       │  └──────────────────────┘    │
│                   │                              │
│  ─────────────   │                              │
│  3.5 | 5e        │                              │
│  (toggle)        │                              │
└──────────────────────────────────────────────────┘
```

---

## 🏛️ Arquitetura Real — Estrutura de Pastas

```
VTT/
├── GEMINI.md                      ← Memória do projeto
├── package.json                   ← Dependências
├── prisma.config.ts               ← Config Prisma 7 (better-sqlite3 adapter)
├── dev.db                         ← SQLite database
│
├── app/                           ← FRONTEND — Páginas (App Router)
│   ├── layout.tsx / layout.css    ← Layout raiz (sidebar + header)
│   ├── globals.css                ← Design system completo (tokens, componentes)
│   ├── page.tsx                   ← Dashboard
│   ├── campanhas/                 ← CRUD campanhas
│   │   ├── page.tsx               ← Lista de campanhas
│   │   └── [id]/page.tsx          ← Detalhe da campanha + sessões
│   ├── npcs/                      ← CRUD NPCs
│   │   ├── page.tsx               ← Lista de NPCs
│   │   └── [id]/page.tsx          ← Ficha do NPC
│   └── acervo/                    ← Acervo SRD
│       ├── page.tsx               ← Hub de categorias (6 cards)
│       ├── acervo.css             ← Estilos do módulo
│       ├── spells/
│       │   ├── page.tsx           ← Busca + filtros (nível, escola, classe)
│       │   └── [index]/page.tsx   ← Detalhe da magia
│       └── monsters/
│           ├── page.tsx           ← Busca + filtros (tipo, CR)
│           └── [index]/page.tsx   ← Ficha do monstro
│
├── components/                    ← FRONTEND — Componentes React
│   └── layout/
│       ├── Sidebar.tsx            ← Navegação + toggle edição
│       └── Header.tsx             ← Breadcrumb
│
├── lib/                           ← BACKEND — Lógica servidor
│   ├── db.ts                      ← Prisma Client singleton (better-sqlite3)
│   └── actions/                   ← Server Actions por domínio
│       ├── campaigns.ts           ← CRUD campanhas
│       ├── npcs.ts                ← CRUD NPCs + atributos
│       ├── sessions.ts            ← CRUD sessões + dashboard stats
│       └── srd.ts                 ← Busca acervo SRD (spells, monsters, filtros)
│
├── prisma/                        ← DATABASE
│   ├── schema.prisma              ← 17 modelos (campanha + SRD)
│   ├── seed.ts                    ← Dados de exemplo (campanhas, NPCs, sessões)
│   └── import-srd.ts             ← Script importação 5e API (1265 registros)
│
├── public/                        ← Assets estáticos
└── docs/                          ← Documentação
    ├── visao-do-projeto.md
    ├── pesquisa-completa.md
    └── arquitetura-e-implementacao.md ← Este documento
```

### Decisão Arquitetural

**Next.js fullstack com Server Actions** — sem backend separado (NestJS).

- Server Actions rodam 100% no servidor, nunca no cliente
- Cada domínio tem seu arquivo em `lib/actions/`
- Prisma Client singleton em `lib/db.ts` com better-sqlite3 adapter
- **Quando precisar de API externa** (mobile, Talespire), aí sim criamos um backend separado

---

## 🗄️ Banco de Dados — Schema Real (Prisma 7 + SQLite)

### Modelos de Campanha (10 modelos)

| Modelo | Campos chave | Relações |
|---|---|---|
| `Campaign` | name, description, edition, status | Sessions, CampaignNpc, Notes, StoryArcs |
| `Session` | number, title, date, notes, aiRecap, durationMin | Campaign, Events, SessionNpc |
| `Npc` | name, race, class, level, alignment, status, type | NpcAttributes, Items, Relations, Campaigns, Sessions |
| `NpcAttributes` | str, dex, con, intl, wis, cha, hp, ac | Npc (1:1) |
| `Item` | name, type, description, weight, value, magical | Npc |
| `Relation` | type, description | origin Npc ↔ target Npc |
| `CampaignNpc` | — | Npc ↔ Campaign (M:M) |
| `SessionNpc` | — | Npc ↔ Session (M:M) |
| `Note` | title, content, private | Campaign |
| `Event` | description, type | Session |
| `StoryArc` | title, description, status | Campaign |
| `ChatHistory` | question, answer, context, tokensUsed | — |

### Modelos SRD — Acervo de Regras (6 modelos)

| Modelo | Registros | Campos chave |
|---|---|---|
| `SrdSpell` | 319 | name, level, school, components, description, classes, damageType |
| `SrdMonster` | 334 | name, size, type, AC, HP, CR, XP, 6 attrs, actions (JSON), legendaryActions (JSON) |
| `SrdClass` | 12 | name, hitDie, proficiencies (JSON), savingThrows, spellcasting (JSON) |
| `SrdFeat` | 1 | name, description, prerequisites (JSON) |
| `SrdEquipment` | 237 | name, category, cost, weight, damage (JSON), properties (JSON) |
| `SrdMagicItem` | 362 | name, category, rarity, description, requiresAttunement |

**Total: 1.265 registros importados** da API dnd5eapi.co (OGL + CC-BY-4.0)

> ⚠️ **Pendente:** Tradução PT-BR como idioma principal e importação SRD 3.5 (Andargor MySQL)

---

## 🔧 Stack Técnica

| Componente | Tecnologia | Versão |
|---|---|---|
| **Framework** | Next.js (React) | 15.x (App Router) |
| **Linguagem** | TypeScript | 5.x |
| **Estilização** | CSS puro (vanilla) | — |
| **ORM** | Prisma | 7.5 |
| **Banco** | SQLite (via better-sqlite3) | — |
| **Driver** | @prisma/adapter-better-sqlite3 | — |
| **Fontes** | Cinzel (títulos) + Inter (corpo) + JetBrains Mono (stats) | Google Fonts |

### Scripts npm

| Script | Comando | O que faz |
|---|---|---|
| `npm run dev` | `next dev` | Dev server local |
| `npm run build` | `next build` | Build produção |
| `npm run seed` | `npx tsx prisma/seed.ts` | Seed dados exemplo |
| `npm run db:push` | `npx prisma db push` | Aplicar schema |
| `npm run db:studio` | `npx prisma studio` | GUI do banco |
| `npm run srd:import` | `npx tsx prisma/import-srd.ts` | Importar SRD 5e API |

---

## 🚀 Fases de Implementação

### ✅ Fase 1 — Fundação (Concluída)

| Tarefa | Status |
|---|---|
| Inicializar Next.js + TypeScript | ✅ |
| Configurar Prisma 7 + SQLite + better-sqlite3 | ✅ |
| Design system CSS completo (Underdark Mode) — `globals.css` | ✅ |
| Layout: Sidebar + Header + Content Area | ✅ |
| Dashboard com stats dinâmicos | ✅ |

### ✅ Fase 2 — CRUD Core (Concluída)

| Tarefa | Status |
|---|---|
| CRUD Campanhas (criar, listar, detalhe, editar, deletar) | ✅ |
| CRUD NPCs (criar, listar, ficha com atributos) | ✅ |
| CRUD Sessões (vinculadas a campanhas) | ✅ |
| Seed com dados de exemplo (3 campanhas, 5 NPCs, 31 sessões) | ✅ |
| Server Actions separados por domínio | ✅ |

### ✅ Fase 3 — Acervo SRD (Concluída)

| Tarefa | Status |
|---|---|
| Schema SRD (6 modelos: Spell, Monster, Class, Feat, Equipment, MagicItem) | ✅ |
| Script de importação da API dnd5eapi.co (1265 registros) | ✅ |
| Página hub do acervo (6 categorias com contagem) | ✅ |
| Busca de spells com filtros (nível, escola, classe) | ✅ |
| Ficha de spell (casting time, range, componentes, descrição) | ✅ |
| Busca de monsters com filtros (tipo, CR) | ✅ |
| Ficha de monster (stats, ações, habilidades, lendárias) | ✅ |

### 🔜 Fase 4 — Assistente IA (Próxima)

| Tarefa | Prioridade |
|---|---|
| Integrar Gemini Flash 2.5 API | 🔴 |
| Chat com contexto da campanha | 🔴 |
| RAG: busca no SRD + resposta com citação | 🔴 |
| Gerar NPC com IA | 🟡 |
| Gerar recap de sessão com IA | 🟡 |

### ⏳ Fase 5 — Polish + VTT

| Tarefa | Prioridade |
|---|---|
| Tradução SRD para PT-BR (banco fixo) | 🔴 |
| Importar SRD 3.5 (Andargor MySQL) | 🔴 |
| Plot Thread Tracking | 🟡 |
| Campaign Health dashboard | 🟡 |
| Export PDF (sourcebook da campanha) | 🟡 |
| Integração Talespire (Symbiotes) | 🟢 |

---

> 📝 **Documentos do projeto:**
> - `GEMINI.md` — Memória do projeto
> - `visao-do-projeto.md` — Visão geral e features
> - `pesquisa-completa.md` — Pesquisa consolidada
> - `arquitetura-e-implementacao.md` — **Este documento**
