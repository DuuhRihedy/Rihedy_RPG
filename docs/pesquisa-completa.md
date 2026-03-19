# 🔬 Hub RPG — Pesquisa Completa

> **Atualizado em:** 2026-03-19
> **Consolida:** Pesquisa de mercado, ferramentas de IA, VTTs, SRD, viabilidade e custos

---

## 📚 D&D 3.5 — Dimensão do Acervo

**~263 publicações** catalogadas (Fandom Wiki). Suplementos oficiais: ~90-120 livros. Com aventuras: 200+.

### Principais Séries

| Série | Livros |
|---|---|
| **Core (3)** | Player's Handbook, DMG, Monster Manual |
| **Complete (8)** | Adventurer, Arcane, Champion, Divine, Mage, Psionic, Scoundrel, Warrior |
| **Races (5)** | Destiny, Stone, Dragon, Wild, Eberron/Faerun |
| **Environment (3)** | Frostburn, Sandstorm, Stormwrack |
| **Monster Manual (5)** | MM I a V |
| **Compendiums (2)** | Spell Compendium, Magic Item Compendium |
| **Settings** | Eberron, Forgotten Realms, Dragonlance, Greyhawk |
| **Outros** | Tome of Battle, Book of Exalted Deeds, Draconomicon, Expanded Psionics, Unearthed Arcana, etc. |

---

## 📊 SRD — Dados Disponíveis (3.5 e 5e)

### D&D 3.5 SRD (Open Game License)

| Recurso | Formato | Conteúdo |
|---|---|---|
| **d20srd.org** | HTML | SRD completo |
| **Andargor MySQL/XML** (ENWorld) | MySQL + XML | Classes, feats, monsters, powers, skills, spells, equipment, magic items, Epic, Psionic |
| **olimot/srd-v3.5** | HTML (GitHub) | SRD revisado completo |
| **katekorsaro/dnd3.5e-srd** | Markdown (GitHub) | SRD convertido de RTF |
| **DnD-3.5-SRD-Markdown** | Markdown + Frontmatter (GitHub) | SRD para Obsidian |
| **dndtools.org** | HTML | Feats, spells, classes de múltiplos livros |

### D&D 5e SRD (OGL + CC-BY-4.0)

| Recurso | Formato | Conteúdo |
|---|---|---|
| **dnd5eapi.co** | REST API (JSON), sem autenticação | SRD completo (classes, spells, monsters, etc.) |
| **5e-database** (GitHub) | MongoDB/JSON | Dados brutos |
| **Open5e** (open5e.com) | REST API + Website | SRD + conteúdo OGL de terceiros |

### Estratégia Dual 3.5 + 5e

| Edição | Base de Dados | IA (RAG) | Fonte |
|---|---|---|---|
| **3.5** | MySQL/Markdown local | SRD indexado + notas pessoais | Andargor MySQL + Markdown repos |
| **5e** | API externa + cache local | SRD via dnd5eapi + notas pessoais | dnd5eapi.co + Open5e |

> ⚠️ Conteúdo fora do SRD (livros suplementares) **NÃO é aberto**. Estratégia: notas pessoais indexadas + IA com RAG.

---

## 🔍 Análise de Mercado — Gerenciadores de Campanha

| Ferramenta | Tipo | IA? | Destaques | Limitações |
|---|---|---|---|---|
| **LegendKeeper** | Wiki + Mapas | ❌ | Wiki interconectada, timelines | Sem IA |
| **World Anvil** | Wiki + DM Tools | ❌ | Completo, mapas com layers | Pesado, curva alta |
| **Kanka** | Wiki + Relações | ❌ | Linking flexível | Sem IA |
| **Obsidian Portal** | Wiki | ❌ | Simples, GM Only | Antigo |
| **Notion / Obsidian** | Notas gerais | Plugins | Flexível | Montar do zero |

---

## 🤖 Ferramentas de IA para RPG — Análise Detalhada

### 1. Chronicle RPG (chroniclerpg.ai)

**O que é:** IA co-autora que "vive" dentro da campanha e pensa proativamente.

**Features principais:**
- **Memória Total** — Lembra cada NPC, promessa e segredo
- **Plot Thread Tracking** — Detecta hooks abandonados e NPCs esquecidos
- **NPCs Vivos** — Múltiplos frameworks psicológicos, agendas próprias
- **Campaign Health** — Dashboard de saúde (frequência, engajamento)
- **Session Recaps** — Gera resumos automáticos
- **NPC Dialogue Generator** — Diálogos in-voice, maneirismos, segredos
- **Rule & Lore Lookup** — Busca instantânea de regras

**Preço:** Free ($0, 200 tokens/mês) → Pro ($15/mês) → Plus ($30/mês)

**Lições para o Hub:** Memória persistente, proatividade da IA, plot tracking, campaign health.
**Limitações:** Não suporta 3.5, não é VTT, personalização limitada.

---

### 2. LoreKeeper.ai (lorekeeper.ai)

**O que é:** Gerenciador de campanha com IA focado em notas e transcrição de áudio.

**Features principais:**
- **Storage ilimitado grátis** — Campanhas, personagens, mapas, tudo sem limite
- **Transcrição de Sessão** — Grave → upload → IA transcreve + gera resumo
- **Notes Decipher** — Cole notas bagunçadas → IA cria entidades organizadas
- **Sourcebook PDF** — Gera livro da campanha pronto pra impressão
- **Geração de imagens** de personagens e mapas
- **Notas privadas** (GM-Only) + colaborativas
- **Multi-sistema** — D&D, Pathfinder, Warhammer, qualquer um

**Preço:** Free (storage ilimitado) → MIGHTY (~$5-8/mês) → LEGEND (~$10-15/mês)

**Lições:** Transcrição, Notes Decipher, storage grátis, export PDF.
**Limitações:** Sem VTT, sem busca de regras, sem plot tracking.

---

### 3. Quest Portal (questportal.com)

**O que é:** VTT + IA + Assistente de Regras tudo em um. Web + iOS + Android.

**Features principais:**
- **VTT completo** — Mapas, fog, tokens, dados 3D, voice chat, cenas com música
- **Library Link** ⭐ — Upload PDFs → IA busca e responde citando capítulo e página
- **GM Assistant** — Regras, encontros, backstories, worldbuilding
- **No-Code Sheets** — Crie fichas sem programar para qualquer sistema
- **Generate Characters** — Descreva → receba ficha completa
- **Mobile App** — iOS + Android + Web sincronizado
- **Session Stories** — Cartão postal com personagens, cenas e mapas

**Preço:** Free (VTT generoso!) → Pro (IA + PDFs, baseado em créditos)

**Lições:** Library Link + PDF, VTT + IA integrado, no-code sheets, mobile-first.
**Limitações:** Não suporta 3.5, sem transcrição, sem plot tracking, sem memória profunda.

---

### Mega Comparativo

| Feature | Chronicle | LoreKeeper | Quest Portal | **Seu Hub** |
|---|---|---|---|---|
| **IA de Regras** | ✅ | ❌ | ✅ citação | ✅ **3.5 + 5e** |
| **Memória Persistente** | ✅ ⭐ | ❌ | ❌ | ✅ |
| **Plot Tracking** | ✅ ⭐ | ❌ | ❌ | ✅ |
| **Transcrição** | ✅ | ✅ ⭐ | ❌ | 🔜 |
| **Notes Decipher** | ❌ | ✅ ⭐ | ❌ | ✅ |
| **Export PDF** | ❌ | ✅ ⭐ | ❌ | ✅ |
| **D&D 3.5** | ❌ | ❌ | ❌ | ✅ ⭐⭐⭐ |
| **Personalização** | Baixa | Média | Média | **Total** |
| **Custo** | Freemium | Freemium | Freemium | **$0** |

---

## 🗺️ Ferramentas de Criação de Mapas

| Ferramenta | Tipo | Destaque |
|---|---|---|
| **Dungeon Alchemist** | Mapas 2D com IA | Desenhe cômodo + tema → IA popula automaticamente |
| **Constructo** | VTT 3D + editor | Fog of War, VR planejado, regras 5e |
| **Inkarnate** | Mapas de mundo | Profissional, popular |
| **DungeonFog** | Battle maps | Compatível com VTTs |
| **FantasyGen** | Gerador IA | Mapas procedurais |
| **tt-rpg.app** | Sketch to Map | Rascunho → mapa renderizado por IA |

---

## 🎮 D&D Digital Oficial — Project Sigil

VTT 3D oficial da WotC (Unreal Engine 5). **DESENVOLVIMENTO ENCERRADO** em outubro 2025. Servidores desligam em outubro 2026. Lição: até a WotC falhou no VTT 3D — foco correto é **Hub de gestão primeiro**.

---

## 🖥️ VTTs 3D — Talespire vs Multiverse Designer

### Talespire (🇳🇴 BouncyRock)

| Aspecto | Detalhe |
|---|---|
| **Engine** | Unity |
| **Visual** | Estilizado (miniaturas) |
| **Construção** | Blocos/Lego (tiles/slabs) |
| **Preço** | ~$25 USD (compra única) |
| **Comunidade** | Grande e ativa |
| **Estabilidade** | Boa |
| **Integração** | ✅ Symbiotes (oficial, web) + WebSocket (não-oficial) |

**Integração com o Hub (4 fases):**

| Fase | Método | Esforço |
|---|---|---|
| V1 | Hub standalone | Zero |
| V2 | URL Scheme (dados) | Baixo |
| V3 | Symbiote (Hub dentro do Talespire) | Médio |
| V4 | WebSocket (controle total) | Alto |

### Multiverse Designer (🇧🇷 Toopan Games)

| Aspecto | Detalhe |
|---|---|
| **Engine** | Unreal Engine |
| **Visual** | Ultra-realista |
| **Construção** | Terreno + drag-drop, mapas até 64km² |
| **Assets** | ~10.000 3D inclusos |
| **Preço** | Player: **GRÁTIS** / GM: $40-90 (compra única) |
| **Cutscenes** | ✅ Editor cinematográfico com lip-sync |
| **Scripting** | Criteria — linguagem própria para regras RPG |
| **D&D 5e** | Parcialmente implementado via Criteria |
| **Integração** | ❌ Sem API |
| **Reviews Steam** | Mixed (60%, 28 reviews) |
| **Requisitos** | i7-7700HQ, GTX 1070 (8GB VRAM), 8GB RAM, 100GB disco |
| **Comunidade** | Pequena |
| **Riscos** | Early Access, bugs, estúdio pequeno |

**Veredicto:** Talespire para integração com Hub / Multiverse Designer para visual máximo e cutscenes.

---

## 🇧🇷 Plataformas Brasileiras

| Plataforma | Status | Preço | Destaque |
|---|---|---|---|
| **Multiverse Designer** | Early Access Steam | Player grátis | VTT 3D, Unreal Engine, cutscenes, Criteria |
| **RPGpédia** | Beta (launch mid-2026) | Grátis (sem assinatura) | Criadores do CRIS/Ordem Paranormal, ficha universal modular |
| **Firecast/RRPG** | Ativo | Grátis | Veterano BR, plugins Lua, Windows only |
| **HubRPG** | Ativo | Grátis | Fichas customizadas, grid |
| **Sessão Virtual** | Ativo | Grátis | Simplificado |

---

## 💰 Viabilidade e Custos

### Gemini Flash 2.5 Free — Limites

| Limite | Valor | Uso estimado/dia |
|---|---|---|
| Requests/dia | 250 | ~30-70 |
| Tokens/minuto | 250.000 | ~500-5000/consulta |
| Context Window | 1.000.000 tokens | Cabe SRD inteiro! |

**Conclusão:** Sobra mais de 70% do limite diário para uso típico do Hub.

### Custo Total: $0

| Componente | Custo |
|---|---|
| IA (Gemini Flash 2.5 Free) | $0 |
| SRD 3.5 (OGL) | $0 |
| SRD 5e (API gratuita) | $0 |
| Banco de dados (local) | $0 |
| Hosting (Vercel/Cloudflare Free) | $0 |
| Framework | $0 |
| Talespire (opcional) | ~$25 one-time |

### Viabilidade por Feature

| Feature | Viável grátis? | Como |
|---|---|---|
| Busca de regras com IA | ✅ | RAG + Gemini Flash 2.5 |
| Memória persistente | ✅ | Banco de dados + context injection |
| Plot Thread Tracking | ✅ | Gemini analisa histórico |
| NPC Generator | ✅ | Gemini + templates |
| Session Recaps | ✅ | Gemini resume notas |
| Notes Decipher | ✅ | Gemini parseia texto |
| Export PDF | ✅ | jsPDF / Puppeteer |
| Library Link (PDFs) | ✅ | pdf.js + indexação + RAG |
| Transcrição de áudio | ⚠️ | Whisper local (pesado) |
| Geração de imagens | ❌ | Outro modelo necessário |

---

> 📝 Documento de visão: `visao-do-projeto.md`
