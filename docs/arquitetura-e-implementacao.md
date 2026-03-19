# 🏗️ Hub RPG — Arquitetura e Implementação

> **Criado em:** 2026-03-19
> **Status:** Plano inicial

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

> **Cinzel** = fonte medieval/épica, perfeita para RPG
> **Inter** = fonte UI moderna, altamente legível
> **JetBrains Mono** = stats, fichas, dados numéricos

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

### Bordas e Sombras

```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;

--shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
--shadow-md: 0 4px 12px rgba(0,0,0,0.4);
--shadow-lg: 0 8px 24px rgba(0,0,0,0.5);
--shadow-glow-gold: 0 0 12px rgba(200,168,78,0.3);
--shadow-glow-red: 0 0 12px rgba(204,0,0,0.3);
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
│  ─────────────   │  ┌───────┐  ┌───────┐       │
│  3.5 | 5e        │  │ PANEL │  │ PANEL │       │
│  (toggle)        │  └───────┘  └───────┘       │
└──────────────────────────────────────────────────┘
```

### Sidebar

- **Fixa** no desktop (240px), **colapsável** para ícones (64px)
- **Drawer** no mobile (overlay com backdrop)
- Logo + nome no topo
- Navegação principal no centro
- **Toggle de edição** (3.5 / 5e) na parte inferior
- Indicador visual da edição ativa (cor muda: vermelho escuro = 3.5, azul = 5e)

### Header

- Breadcrumb de navegação
- Barra de busca global (Ctrl+K)
- Indicador de sessão de IA (tokens restantes)
- Notificações

### Content Area

- **Responsivo** — adapta de 1 coluna (mobile) a grid (desktop)
- Máximo 1200px de largura para leitura confortável

---

## 🗂️ Páginas e Módulos

### 1. Dashboard (Página Inicial)

```
┌─────────────────────────────────────────────┐
│ Bem-vindo, Mestre                     ⚙️    │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│  │Campanhas│ │ NPCs    │ │ Sessões │      │
│  │  active │ │  total  │ │ recente │      │
│  │    3    │ │   127   │ │ há 2d   │      │
│  └─────────┘ └─────────┘ └─────────┘      │
│                                             │
│  ┌──── Campanha Ativa ──────────────────┐  │
│  │ ⚔️ A Queda de Waterdeep              │  │
│  │ Sessão 23 · Último jogo: 15/03       │  │
│  │ [Continuar]  [Ver Sessões]           │  │
│  └──────────────────────────────────────┘  │
│                                             │
│  ┌── Últimas Notas ─┐ ┌── IA Rápida ────┐ │
│  │ • NPC encontrado  │ │ Pergunte algo   │ │
│  │ • Item coletado   │ │ sobre regras... │ │
│  │ • Plot hook       │ │ [3.5] [5e]      │ │
│  └───────────────────┘ └─────────────────┘ │
└─────────────────────────────────────────────┘
```

### 2. Campanhas

- Lista de campanhas (ativa/arquivada)
- Cada campanha: sessões, NPCs vinculados, notas, arcos narrativos
- Timeline visual de sessões
- Notas privadas (GM-only)

### 3. NPCs

- Grid/lista de NPCs com imagem, nome, status
- Ficha completa: atributos, skills, itens, história, relações
- Tags: aliado/neutro/inimigo, vivo/morto
- Vinculação a campanhas

### 4. Acervo / Busca de Regras

- Input de texto: "Como funciona grapple no 3.5?"
- Toggle: buscar no 3.5 / 5e / ambos
- Resultado com citação de fonte (livro, página)
- Histórico de buscas
- Navegação por categorias: Spells, Feats, Monsters, Classes, Equipment

### 5. Assistente IA

- Chat com o Gemini Flash 2.5
- Contexto da campanha ativa injetado
- Comandos rápidos:
  - `/npc` — Gerar NPC
  - `/recap` — Resumir sessão
  - `/regra` — Buscar regra
  - `/plot` — Analisar plot threads

### 6. Sessões

- Notas de cada sessão
- Recap gerado por IA
- Timeline de eventos
- NPCs encontrados nesta sessão

---

## 🗄️ Banco de Dados — Schema Prisma

```prisma
// ── Campanhas ──────────────────────

model Campanha {
  id          String   @id @default(cuid())
  nome        String
  descricao   String?
  edicao      String   @default("3.5") // "3.5" | "5e"
  status      String   @default("ativa") // "ativa" | "pausada" | "encerrada"
  imagemUrl   String?
  criadoEm    DateTime @default(now())
  atualizadoEm DateTime @updatedAt

  sessoes     Sessao[]
  npcs        NpcCampanha[]
  notas       Nota[]
  arcos       ArcoNarrativo[]
}

// ── Sessões ────────────────────────

model Sessao {
  id          String   @id @default(cuid())
  numero      Int
  titulo      String?
  data        DateTime?
  notas       String?  // Notas do mestre (markdown)
  recapIA     String?  // Recap gerado pela IA
  duracaoMin  Int?
  criadoEm    DateTime @default(now())

  campanhaId  String
  campanha    Campanha @relation(fields: [campanhaId], references: [id])
  eventos     Evento[]
  npcsPresentes NpcSessao[]
}

// ── NPCs ───────────────────────────

model Npc {
  id          String   @id @default(cuid())
  nome        String
  raca        String?
  classe      String?
  nivel       Int?
  alinhamento String?
  descricao   String?  // Descrição física e de personalidade
  historia    String?  // Backstory
  notas       String?  // Notas privadas do mestre
  imagemUrl   String?
  status      String   @default("vivo") // "vivo" | "morto" | "desaparecido"
  tipo        String   @default("neutro") // "aliado" | "neutro" | "inimigo"
  edicao      String   @default("3.5")
  criadoEm    DateTime @default(now())
  atualizadoEm DateTime @updatedAt

  atributos   NpcAtributos?
  itens       Item[]
  relacoes    Relacao[]     @relation("npcOrigem")
  relacoesInv Relacao[]     @relation("npcDestino")
  campanhas   NpcCampanha[]
  sessoes     NpcSessao[]
}

model NpcAtributos {
  id    String @id @default(cuid())
  str   Int    @default(10)
  dex   Int    @default(10)
  con   Int    @default(10)
  int_  Int    @default(10)   @map("int")
  wis   Int    @default(10)
  cha   Int    @default(10)
  hp    Int    @default(10)
  ca    Int    @default(10)
  npcId String @unique
  npc   Npc    @relation(fields: [npcId], references: [id])
}

// ── Itens ──────────────────────────

model Item {
  id        String @id @default(cuid())
  nome      String
  tipo      String // "arma" | "armadura" | "pocao" | "magico" | "outro"
  descricao String?
  peso      Float?
  valor     String? // "150 gp"
  magico    Boolean @default(false)

  npcId     String?
  npc       Npc?    @relation(fields: [npcId], references: [id])
}

// ── Relações entre NPCs ────────────

model Relacao {
  id          String @id @default(cuid())
  tipo        String // "aliado" | "inimigo" | "familia" | "mestre" | "servo"
  descricao   String?

  origemId    String
  origem      Npc    @relation("npcOrigem", fields: [origemId], references: [id])
  destinoId   String
  destino     Npc    @relation("npcDestino", fields: [destinoId], references: [id])
}

// ── Tabelas de Junção ──────────────

model NpcCampanha {
  npcId      String
  npc        Npc      @relation(fields: [npcId], references: [id])
  campanhaId String
  campanha   Campanha  @relation(fields: [campanhaId], references: [id])

  @@id([npcId, campanhaId])
}

model NpcSessao {
  npcId    String
  npc      Npc    @relation(fields: [npcId], references: [id])
  sessaoId String
  sessao   Sessao @relation(fields: [sessaoId], references: [id])

  @@id([npcId, sessaoId])
}

// ── Notas e Eventos ────────────────

model Nota {
  id         String   @id @default(cuid())
  titulo     String
  conteudo   String   // Markdown
  privada    Boolean  @default(true) // GM-only
  criadoEm   DateTime @default(now())

  campanhaId String
  campanha   Campanha @relation(fields: [campanhaId], references: [id])
}

model Evento {
  id        String @id @default(cuid())
  descricao String
  tipo      String // "combate" | "social" | "exploracao" | "lore" | "plot"

  sessaoId  String
  sessao    Sessao @relation(fields: [sessaoId], references: [id])
}

model ArcoNarrativo {
  id         String  @id @default(cuid())
  titulo     String
  descricao  String?
  status     String  @default("ativo") // "ativo" | "resolvido" | "abandonado"

  campanhaId String
  campanha   Campanha @relation(fields: [campanhaId], references: [id])
}

// ── SRD (Acervo de Regras) ─────────

model SrdSpell {
  id          String @id @default(cuid())
  nome        String
  nivel       Int
  escola      String
  classes     String  // "Wizard,Sorcerer,Cleric"
  tempo       String  // Casting time
  alcance     String  // Range
  componentes String  // V, S, M
  duracao     String  // Duration
  descricao   String  // Description (full text)
  edicao      String  // "3.5" | "5e"
  fonte       String  // "PHB p.123" ou "SRD"
}

model SrdFeat {
  id          String @id @default(cuid())
  nome        String
  tipo        String  // "General" | "Fighter" | "Metamagic" | "Epic"
  prerequisito String?
  descricao   String
  edicao      String
  fonte       String
}

model SrdMonster {
  id          String @id @default(cuid())
  nome        String
  tipo        String  // "Aberration" | "Beast" | "Dragon" etc.
  cr          String  // Challenge Rating
  hp          String
  ca          Int
  descricao   String
  habilidades String? // JSON ou texto
  edicao      String
  fonte       String
}

model SrdClasse {
  id          String @id @default(cuid())
  nome        String
  hitDie      String  // "d8"
  descricao   String
  features    String  // JSON ou texto
  edicao      String
  fonte       String
}

// ── Histórico de Chat IA ───────────

model ChatHistorico {
  id         String   @id @default(cuid())
  pergunta   String
  resposta   String
  contexto   String?   // Qual campanha/NPC estava ativo
  tokensUsados Int?
  criadoEm   DateTime @default(now())
}
```

---

## 🏛️ Arquitetura de Pastas

```
hub-rpg/
├── apps/
│   ├── web/                          ← Next.js Frontend
│   │   ├── app/
│   │   │   ├── layout.tsx            ← Layout principal (sidebar + content)
│   │   │   ├── page.tsx              ← Dashboard
│   │   │   ├── campanhas/
│   │   │   │   ├── page.tsx          ← Lista de campanhas
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx      ← Detalhe da campanha
│   │   │   │       └── sessoes/
│   │   │   ├── npcs/
│   │   │   │   ├── page.tsx          ← Lista/grid de NPCs
│   │   │   │   └── [id]/page.tsx     ← Ficha do NPC
│   │   │   ├── acervo/
│   │   │   │   ├── page.tsx          ← Busca de regras
│   │   │   │   ├── spells/
│   │   │   │   ├── feats/
│   │   │   │   ├── monsters/
│   │   │   │   └── classes/
│   │   │   ├── assistente/
│   │   │   │   └── page.tsx          ← Chat IA
│   │   │   └── configuracoes/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   └── EditionToggle.tsx
│   │   │   ├── campanha/
│   │   │   ├── npc/
│   │   │   ├── acervo/
│   │   │   ├── assistente/
│   │   │   └── ui/                   ← Componentes reutilizáveis
│   │   ├── styles/
│   │   │   ├── globals.css           ← Design tokens + reset
│   │   │   ├── layout.css
│   │   │   └── components/
│   │   └── lib/
│   │       ├── api.ts                ← Client HTTP para backend
│   │       └── utils.ts
│   │
│   └── api/                          ← NestJS Backend
│       ├── src/
│       │   ├── app.module.ts
│       │   ├── campanhas/
│       │   │   ├── campanhas.controller.ts
│       │   │   ├── campanhas.service.ts
│       │   │   └── campanhas.module.ts
│       │   ├── npcs/
│       │   ├── sessoes/
│       │   ├── acervo/
│       │   │   ├── acervo.controller.ts
│       │   │   ├── acervo.service.ts
│       │   │   └── srd-import.service.ts  ← Importar dados SRD
│       │   ├── ia/
│       │   │   ├── ia.controller.ts
│       │   │   ├── ia.service.ts          ← Wrapper do Gemini
│       │   │   └── rag.service.ts         ← RAG: busca + contexto
│       │   └── prisma/
│       │       ├── prisma.service.ts
│       │       └── prisma.module.ts
│       └── prisma/
│           ├── schema.prisma
│           ├── seed.ts                ← Seed com dados SRD
│           └── migrations/
│
├── packages/
│   └── shared/                       ← Tipos compartilhados
│       └── types/
│
├── data/
│   ├── srd-3.5/                      ← Dados SRD 3.5 (MySQL/Markdown)
│   └── srd-5e/                       ← Cache da API 5e
│
├── prisma/
│   └── hub-rpg.db                    ← SQLite database
│
├── GEMINI.md
├── docs/
│   ├── visao-do-projeto.md
│   ├── pesquisa-completa.md
│   └── arquitetura-e-implementacao.md ← Este documento
│
└── package.json                      ← Monorepo (npm workspaces ou turborepo)
```

---

## 🚀 Fases de Implementação

### Fase 1 — Fundação (Sprint 1-2)

| Tarefa | Prioridade |
|---|---|
| Inicializar monorepo (Next.js + NestJS) | 🔴 |
| Configurar Prisma + SQLite | 🔴 |
| Criar design system CSS (tokens, reset, componentes base) | 🔴 |
| Layout principal: Sidebar + Header + Content Area | 🔴 |
| Dashboard (página inicial estática) | 🟡 |

### Fase 2 — CRUD Core (Sprint 3-4)

| Tarefa | Prioridade |
|---|---|
| CRUD Campanhas (criar, listar, editar, arquivar) | 🔴 |
| CRUD NPCs (criar, listar, ficha completa) | 🔴 |
| CRUD Sessões (vinculadas a campanhas) | 🔴 |
| Notas com Markdown | 🟡 |
| Upload de imagens para NPCs | 🟡 |

### Fase 3 — Acervo SRD (Sprint 5-6)

| Tarefa | Prioridade |
|---|---|
| Importar SRD 3.5 para SQLite (seed) | 🔴 |
| Importar/cachear SRD 5e (da API) | 🔴 |
| Busca full-text (FTS5) no acervo | 🔴 |
| Navegação por categorias (Spells, Feats, Monsters) | 🟡 |
| Toggle de edição (3.5 / 5e) | 🟡 |

### Fase 4 — Assistente IA (Sprint 7-8)

| Tarefa | Prioridade |
|---|---|
| Integrar Gemini Flash 2.5 API | 🔴 |
| Chat com contexto da campanha | 🔴 |
| RAG: busca no SRD + resposta com citação | 🔴 |
| Gerar NPC com IA | 🟡 |
| Gerar recap de sessão com IA | 🟡 |

### Fase 5 — Polish (Sprint 9-10)

| Tarefa | Prioridade |
|---|---|
| Plot Thread Tracking | 🟡 |
| Campaign Health dashboard | 🟡 |
| Export PDF (sourcebook da campanha) | 🟡 |
| Notes Decipher (importar notas com IA) | 🟡 |
| Relações entre NPCs (grafo visual) | 🟢 |

---

> 📝 **Documentos do projeto:**
> - `GEMINI.md` — Memória do projeto
> - `visao-do-projeto.md` — Visão geral e features
> - `pesquisa-completa.md` — Pesquisa consolidada
> - `arquitetura-e-implementacao.md` — **Este documento**
