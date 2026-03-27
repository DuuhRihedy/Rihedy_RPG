# 🔧 Otimização do Script de Tradução SRD

> **Data:** 2026-03-27
> **Arquivo:** `prisma/translate-descriptions-gemini.ts`
> **Status atual:** 40% (1778/4411) após 8h de execução
> **Velocidade atual:** ~40 registros/hora
> **Estimativa atual:** ~66h restantes (~3 dias)

---

## 📊 Diagnóstico

### Por que está lento:
1. **BATCH_SIZE = 10** → muitos requests pra pouco conteúdo
2. **Bloqueio de 1h** por key ao tomar rate limit
3. **Keys bloqueiam com ~35-40 req** (não 250 como documentado)
4. **5 keys no pool** mas openrouter está excluído da rotação
5. **DELAY_MS = 6000** (6s entre batches) — conservador demais

### Keys atuais (6 no banco):
| Key | Provider | Última vez bloqueou com |
|---|---|---|
| Limit Project | gemini | 34 req |
| RPG Vercel | gemini | 38 req |
| Teste API | gemini | 39 req |
| Hub 1 | gemini | 40 req |
| Hub RPG | groq | 27 req |
| Hub RPG | openrouter | excluído |

---

## 🚀 Otimizações Propostas

### 1. Aumentar BATCH_SIZE (10 → 25)
```typescript
const BATCH_SIZE = 25; // era 10
```
- **Impacto:** 2.5x menos requests pro mesmo conteúdo
- **Risco:** Prompt mais longo, chance de timeout → mitigar com retry
- **Nota:** Gemini Flash 2.5 suporta 1M tokens de contexto, 25 descrições de D&D cabem fácil

### 2. Reduzir bloqueio (1h → 20min)
```typescript
// Linha 92 — na função blockKey()
const blockUntil = new Date(Date.now() + 20 * 60 * 1000); // era 60min, agora 20min
```
- **Impacto:** Keys voltam 3x mais rápido
- **Risco:** Se o rate limit real for por hora, vai tomar 429 de novo e re-bloquear
- **Nota:** Gemini tem RPM (req/min) e RPD (req/dia) — o bloqueio de 1h é excessivo pra RPM

### 3. Reduzir delay entre batches (6s → 3s)
```typescript
const DELAY_MS = 3000; // era 6000
```
- **Impacto:** 2x mais rápido nos períodos ativos
- **Risco:** Pode acelerar o rate limit por minuto

### 4. Adicionar mais keys Gemini (GRATUITO)
- **Como:** Criar novos projetos no Google Cloud Console
  - https://aistudio.google.com/apikey
  - Cada projeto Google Cloud tem sua própria cota
  - Criar 3-4 projetos adicionais = 3-4 keys novas
- **Impacto:** Dobrar ou triplicar a capacidade
- **Limite por projeto:** 250 RPD no Gemini Flash 2.5 Free

### 5. Habilitar OpenRouter (já tem key)
```typescript
const ALLOWED_PROVIDERS = ["gemini", "groq", "openrouter"] as const;
```
- **Impacto:** +1 provider na rotação
- **Risco:** OpenRouter free tier pode ser limitado
- **Nota:** Verificar se a key ainda funciona e qual modelo usar

---

## 📈 Estimativa com otimizações

### Cenário conservador (só pontos 1, 2, 3):
- BATCH_SIZE 25 + bloqueio 20min + delay 3s
- Capacidade: ~200 req/ciclo × 25 items = 5000 items/ciclo
- Ciclo: ~10min ativos + 20min espera = 30min
- **Velocidade estimada:** ~150-200 registros/hora
- **Tempo restante:** 2633 ÷ 175 = **~15 horas**

### Cenário otimista (pontos 1-5 + novas keys):
- 8 keys Gemini + Groq + OpenRouter = 10 keys
- Raramente todas bloqueadas ao mesmo tempo
- **Velocidade estimada:** ~300-400 registros/hora
- **Tempo restante:** 2633 ÷ 350 = **~7-8 horas**

---

## 🎯 Plano de Ação (amanhã)

1. **Parar o script atual** (Ctrl+C)
2. **Aplicar mudanças 1, 2, 3** no código (5 min)
3. **Criar novas keys Gemini** no Google AI Studio (10 min)
4. **Inserir keys no banco** via script/SQL
5. **Opcional:** habilitar OpenRouter
6. **Reiniciar o script** — ele é idempotente (pula os já traduzidos)
7. **Monitorar** o output do terminal (já tem logging completo)

### Linhas exatas a alterar:
- **Linha 15:** `BATCH_SIZE = 10` → `25`
- **Linha 16:** `DELAY_MS = 6000` → `3000`
- **Linha 92:** `60 * 60 * 1000` → `20 * 60 * 1000`

---

## ⚠️ Notas
- O script é **idempotente**: usa `WHERE descriptionPtBr IS NULL`, então re-executar não duplica
- **Não precisa recriar nada** — só alterar 3 linhas e adicionar keys
- As traduções já feitas (1778) estão salvas no banco permanentemente
