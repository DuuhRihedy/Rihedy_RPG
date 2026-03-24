# VTT D&D 3.5 - Arquitetura Base (Customizável e Legal-Safe)

## 1. Objetivo do Projeto

Criar um VTT focado em D&D 3.5 baseado em uma **engine de regras desacoplada**, com **dados estruturados e totalmente customizáveis**, inspirado em boas práticas de ferramentas modernas, mas sem dependência de conteúdo proprietário.

---

## 2. Princípio Principal

Separação total entre:

1. Engine de regras (lógica)
2. Estrutura de dados (schemas)
3. Conteúdo (SRD ou custom/importado)

Isso garante:

* Flexibilidade total
* Segurança legal
* Escalabilidade

---

## 3. Arquitetura Geral

### 3.1 Módulos principais

1. rules-engine
2. compendium
3. generators
4. importer
5. character-system

---

## 4. Rules Engine (Coração do sistema)

Responsável por interpretar e executar regras dinamicamente.

### Exemplo de regra

```json
{
  "type": "craft_potion",
  "formula": "spell_level * caster_level * 50",
  "constraints": ["spell_level <= 3"]
}
```

### Responsabilidades

* Combate
* Crafting
* XP
* Condições
* Validações

---

## 5. Compendium (Banco estruturado)

Armazena entidades do sistema:

* classes
* spells
* feats
* condições
* itens

### Estrutura base

```json
{
  "name": "string",
  "source": "srd | custom",
  "data": {}
}
```

---

## 6. Generators

Sistema de geração automática:

### NPC

* nível
* atributos
* equipamentos

### Encontros

* baseado em CR
* dificuldade escalável

### Loot

* baseado em riqueza

---

## 7. Importer (Custom System)

Permite entrada de dados externos sem acoplar conteúdo ao core.

```json
{
  "type": "class",
  "data": {}
}
```

### Funções

* importar JSON
* validar estrutura
* separar conteúdo custom

---

## 8. Character System (Inspirado em D&D Beyond)

### Objetivo

Automatizar criação e progressão de personagem.

### Funcionalidades

* criação passo a passo
* aplicação automática de bônus
* validação de pré-requisitos
* progressão por nível

### Estrutura

```json
{
  "class": "fighter",
  "level": 5,
  "attributes": {},
  "feats": [],
  "spells": []
}
```

---

## 9. Sistemas de Regras

### 9.1 Combate

* ataque vs AC
* iniciativa
* ações
* dano
* condições

### 9.2 Crafting

* poções
* pergaminhos
* itens
* cálculo automático

### 9.3 Encontros

* cálculo por CR
* ajuste por dificuldade

### 9.4 NPC

* geração automática
* atributos
* equipamentos

### 9.5 Skills

* testes com modificadores
* DC configurável

### 9.6 Feats

* pré-requisitos
* efeitos dinâmicos

### 9.7 Condições

* efeitos aplicáveis
* impacto em combate

### 9.8 Magia

* duração
* resistência
* efeitos

### 9.9 Economia

* riqueza por nível
* compra/venda

### 9.10 Tempo

* controle de turnos
* duração de efeitos

---

## 10. UX (Inspirado em ferramentas modernas)

### Pode implementar:

* criação de personagem guiada
* aplicação automática de regras
* interface simplificada
* filtros e busca no compendium

---

## 11. Estrutura de Dados

### Classe

```json
{
  "name": "fighter",
  "levels": []
}
```

### Spell

```json
{
  "name": "spell_name",
  "level": 1
}
```

### Condição

```json
{
  "name": "condition",
  "effects": []
}
```

---

## 12. Diferencial do Projeto

* Engine de regras real
* Automação profunda
* Sistema totalmente customizável
* Independência de conteúdo

---

## 13. Plano de Ação

### Fase 1 - Base

1. Modelar banco (Neon PostgreSQL + Prisma)
2. Criar compendium básico
3. Criar estrutura de classes e spells

### Fase 2 - Engine

4. Implementar rules-engine
5. Criar sistema de combate
6. Criar sistema de condições

### Fase 3 - Automação

7. Criar character-system
8. Implementar validação de regras
9. Implementar progressão automática

### Fase 4 - Geração

10. Criar generator de NPC
11. Criar generator de encontros
12. Criar sistema de loot

### Fase 5 - UX

13. Criar interface de criação de personagem
14. Criar compendium com busca
15. Criar automações visuais

### Fase 6 - Expansão

16. Sistema de import
17. Sistema custom (classes/spells)
18. Preparar para plugins

---

## 14. Visão Final

O objetivo não é replicar sistemas existentes, mas criar:

> Uma engine de RPG capaz de interpretar qualquer regra de forma estruturada.

---

## 15. Decisões Técnicas (Alinhadas com o Hub RPG)

| Decisão | Escolha |
|---|---|
| Banco de dados | Neon PostgreSQL (já em uso) |
| ORM | Prisma 7 (já em uso) |
| Frontend | Next.js + React (já em uso) |
| Módulos | Dentro do mesmo projeto em `lib/engine/` |
| Dados SRD | Importação completa 3.5 + 5e |

---

Esse documento define a base para um VTT robusto, escalável e totalmente customizável.
