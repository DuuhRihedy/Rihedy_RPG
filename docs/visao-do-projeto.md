# 🎲 Hub RPG — Visão do Projeto

> **Status:** Fase de Pesquisa e Definição
> **Criado em:** 2026-03-19
> **Autor:** Mestre com 17 anos de experiência em RPG

---

## 🎯 O Que É Este Projeto

**Não é "apenas" um VTT.** É um **Hub de Mestre de RPG** — um centro de comando pessoal e robusto para gerenciar campanhas, acervo de regras, NPCs, itens, histórias e, no futuro, evoluir para uma mesa virtual completa.

### Pilares do Projeto

1. **Acervo Inteligente de Regras** — Consulta rápida com IA em todo o conteúdo de D&D 3.5 e 5e (200+ livros)
2. **Gerenciador de Campanhas** — Salvar aventuras, histórias, arcos narrativos, sessões
3. **Banco de NPCs** — Personagens com fichas, itens, imagens, relações, histórico
4. **Assistente de IA** — Responder dúvidas de regras, localizar informações em livros específicos (Gemini Flash 2.5 Free)
5. **[FUTURO] VTT** — Mesa virtual com mapas, tokens, fog of war, etc.

---

## 🧠 Decisões Tomadas

| Decisão | Escolha | Motivo |
|---|---|---|
| **Edições suportadas** | D&D 3.5 + 5e | Mestre veterano de 3.5, mas quer suportar 5e também |
| **IA** | Gemini Flash 2.5 Free | 250 req/dia, 1M tokens de contexto, $0 |
| **Custo total** | $0 | Tudo gratuito (exceto Talespire se quiser integrar) |
| **VTT externo** | Talespire (integração) | Symbiotes + WebSocket permitem integrar com o Hub |
| **VTT alternativo** | Multiverse Designer (brasileiro) | Visual Unreal Engine, Criteria scripting, Player grátis |
| **Foco inicial** | Hub de gestão, NÃO o VTT | Até a WotC (Project Sigil) falhou no VTT 3D |

---

## 🏗️ Diferencial — O Que NÃO Existe no Mercado

1. **Nenhuma ferramenta combina** Hub de Campanha + IA de Regras D&D 3.5 + Banco de NPCs + VTT
2. **Nenhuma ferramenta foca em D&D 3.5** — A maioria é D&D 5e ou genérica
3. **Nenhuma ferramenta brasileira oferece IA** para consulta de regras
4. **Personalização total** para um mestre veterano é rara — as ferramentas são genéricas
5. **Custo zero** — Todas as alternativas com IA são pagas ou limitadas

---

## 🎯 Features Priorizadas

### Prioridade Alta (MVP)
1. 📚 Acervo SRD 3.5 + 5e indexado com busca por IA
2. 🧠 Memória persistente da campanha — IA que lembra tudo
3. 👥 Banco de NPCs com fichas, itens, imagens, relações
4. 📖 Gerenciador de campanhas com sessões, arcos, notas privadas
5. 🔍 Busca de regras com IA — "Onde está a regra de grapple no 3.5?"

### Prioridade Média
6. 📜 Notes Decipher — Importar notas existentes e organizar com IA
7. 🧵 Plot Thread Tracking — Detectar hooks e NPCs esquecidos
8. 📊 Campaign Health — Métricas de engajamento
9. 📋 Session Recaps com IA
10. 📕 Export Sourcebook PDF

### Prioridade Futura
11. 🎙️ Transcrição de sessão
12. 🗺️ VTT (mapas, fog, tokens, dados)
13. 📱 Mobile (PWA)
14. 🖼️ Geração de imagens
15. 🔗 Integração Talespire via Symbiote

---

## 📋 Próximos Passos

- [x] Pesquisa de mercado completa ✅
- [x] Análise de ferramentas com IA ✅
- [x] Análise de viabilidade e custos ✅
- [x] Análise de plataformas brasileiras ✅
- [x] Análise de integração com Talespire ✅
- [x] Decisão: suportar D&D 3.5 + 5e ✅
- [x] Decisão: usar Gemini Flash 2.5 Free ✅
- [ ] Definir tech stack
- [ ] Definir arquitetura do banco de dados
- [ ] Definir modelo de IA (RAG)
- [ ] Criar protótipo do Hub

---

> 📝 **Este documento é vivo** — será atualizado conforme o projeto evolui.
> Pesquisa detalhada em: `pesquisa-completa.md`
