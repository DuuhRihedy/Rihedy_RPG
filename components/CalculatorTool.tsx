"use client";

import { useState } from "react";

// XP Table (D&D 3.5 SRD)
const XP_TABLE: Record<number, Record<number, number>> = {
  1: { 1: 300, 2: 300, 3: 225, 4: 150, 5: 75 },
  2: { 1: 600, 2: 300, 3: 300, 4: 225, 5: 150, 6: 75 },
  3: { 1: 900, 2: 600, 3: 300, 4: 300, 5: 225, 6: 150, 7: 75 },
  4: { 2: 900, 3: 600, 4: 300, 5: 300, 6: 225, 7: 150, 8: 75 },
  5: { 3: 900, 4: 600, 5: 300, 6: 300, 7: 225, 8: 150, 9: 75 },
  6: { 4: 900, 5: 600, 6: 300, 7: 300, 8: 225, 9: 150, 10: 75 },
  7: { 5: 900, 6: 600, 7: 300, 8: 300, 9: 225, 10: 150, 11: 75 },
  8: { 6: 900, 7: 600, 8: 300, 9: 300, 10: 225, 11: 150, 12: 75 },
  9: { 7: 900, 8: 600, 9: 300, 10: 300, 11: 225, 12: 150, 13: 75 },
  10: { 8: 900, 9: 600, 10: 300, 11: 300, 12: 225, 13: 150, 14: 75 },
  11: { 9: 900, 10: 600, 11: 300, 12: 300, 13: 225, 14: 150, 15: 75 },
  12: { 10: 900, 11: 600, 12: 300, 13: 300, 14: 225, 15: 150, 16: 75 },
  13: { 11: 900, 12: 600, 13: 300, 14: 300, 15: 225, 16: 150, 17: 75 },
  14: { 12: 900, 13: 600, 14: 300, 15: 300, 16: 225, 17: 150, 18: 75 },
  15: { 13: 900, 14: 600, 15: 300, 16: 300, 17: 225, 18: 150, 19: 75 },
  16: { 14: 900, 15: 600, 16: 300, 17: 300, 18: 225, 19: 150, 20: 75 },
  17: { 15: 900, 16: 600, 17: 300, 18: 300, 19: 225, 20: 150 },
  18: { 16: 900, 17: 600, 18: 300, 19: 300, 20: 225 },
  19: { 17: 900, 18: 600, 19: 300, 20: 300 },
  20: { 18: 900, 19: 600, 20: 300 },
};

const WEALTH_BY_LEVEL: Record<number, number> = {
  1: 0, 2: 900, 3: 2700, 4: 5400, 5: 9000, 6: 13000, 7: 19000,
  8: 27000, 9: 36000, 10: 49000, 11: 66000, 12: 88000, 13: 110000,
  14: 150000, 15: 200000, 16: 260000, 17: 340000, 18: 440000,
  19: 580000, 20: 760000,
};

const XP_FOR_LEVEL: Record<number, number> = {
  1: 0, 2: 1000, 3: 3000, 4: 6000, 5: 10000, 6: 15000, 7: 21000,
  8: 28000, 9: 36000, 10: 45000, 11: 55000, 12: 66000, 13: 78000,
  14: 91000, 15: 105000, 16: 120000, 17: 136000, 18: 153000,
  19: 171000, 20: 190000,
};

function fmt(n: number): string {
  return n.toLocaleString("pt-BR");
}

type CalcTab = "xp" | "cr" | "wealth" | "craft";

export default function CalculatorTool() {
  const [tab, setTab] = useState<CalcTab>("xp");

  return (
    <div className="calc-container">
      <div className="calc-tabs">
        {([
          { key: "xp", icon: "⭐", label: "XP & Nível" },
          { key: "cr", icon: "💀", label: "CR Encontro" },
          { key: "wealth", icon: "💰", label: "Riqueza" },
          { key: "craft", icon: "🔨", label: "Crafting" },
        ] as { key: CalcTab; icon: string; label: string }[]).map((t) => (
          <button
            key={t.key}
            className={`calc-tab ${tab === t.key ? "active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === "xp" && <XpCalculator />}
      {tab === "cr" && <CrCalculator />}
      {tab === "wealth" && <WealthCalculator />}
      {tab === "craft" && <CraftCalculator />}
    </div>
  );
}

function XpCalculator() {
  const [cr, setCr] = useState(1);
  const [partyLevel, setPartyLevel] = useState(3);
  const [partySize, setPartySize] = useState(4);

  const xpPerPlayer = XP_TABLE[cr]?.[partyLevel] || 0;
  const totalXp = xpPerPlayer * partySize;

  return (
    <div className="calc-panel">
      <h3>⭐ Calculadora de XP</h3>
      <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-4)" }}>
        No D&D 3.5, XP é distribuído por encontro baseado no <strong>CR</strong> (Challenge Rating) do monstro comparado ao <strong>nível do grupo</strong>.
        Cada jogador recebe a mesma quantidade. XP insuficiente para o nível → sem recompensa.
      </p>
      <div className="calc-inputs">
        <div className="calc-field">
          <label>CR do Monstro</label>
          <input type="number" className="input" value={cr} onChange={(e) => setCr(+e.target.value)} min={1} max={20} />
        </div>
        <div className="calc-field">
          <label>Nível do Grupo</label>
          <input type="number" className="input" value={partyLevel} onChange={(e) => setPartyLevel(+e.target.value)} min={1} max={20} />
        </div>
        <div className="calc-field">
          <label>Tamanho do Grupo</label>
          <input type="number" className="input" value={partySize} onChange={(e) => setPartySize(+e.target.value)} min={1} max={10} />
        </div>
      </div>

      <div className="calc-results">
        <div className="calc-result-card">
          <span className="calc-result-label">XP por Jogador</span>
          <span className="calc-result-value">{fmt(xpPerPlayer)}</span>
        </div>
        <div className="calc-result-card highlight">
          <span className="calc-result-label">XP Total do Encontro</span>
          <span className="calc-result-value">{fmt(totalXp)}</span>
        </div>
      </div>

      <div className="calc-table-wrap">
        <h4>Tabela de XP para Nível</h4>
        <table className="calc-table">
          <thead>
            <tr><th>Nível</th><th>XP Necessário</th><th>Para Próximo</th></tr>
          </thead>
          <tbody>
            {Array.from({ length: 20 }, (_, i) => i + 1).map((lv) => (
              <tr key={lv} className={lv === partyLevel ? "active" : ""}>
                <td>{lv}</td>
                <td>{fmt(XP_FOR_LEVEL[lv])}</td>
                <td>{lv < 20 ? fmt(XP_FOR_LEVEL[lv + 1] - XP_FOR_LEVEL[lv]) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CrCalculator() {
  const [creatures, setCreatures] = useState([{ cr: 1, count: 1 }]);
  const [partyLevel, setPartyLevel] = useState(3);
  const [partySize, setPartySize] = useState(4);

  // D&D 3.5: Encounter CR calculation
  function getEncounterCR(): number {
    const totalCreatures = creatures.reduce((sum, c) => {
      let effectiveCR = c.cr;
      if (c.count > 1) {
        effectiveCR += Math.floor(Math.log2(c.count));
      }
      return Math.max(sum, effectiveCR);
    }, 0);
    return totalCreatures;
  }

  function getDifficulty(ecr: number): { label: string; color: string } {
    const diff = ecr - partyLevel;
    if (diff <= -4) return { label: "Trivial", color: "var(--text-muted)" };
    if (diff <= -2) return { label: "Fácil", color: "var(--success)" };
    if (diff <= 0) return { label: "Médio", color: "var(--info)" };
    if (diff <= 2) return { label: "Difícil", color: "var(--warning)" };
    return { label: "Mortal", color: "var(--danger)" };
  }

  const ecr = getEncounterCR();
  const diff = getDifficulty(ecr);
  const totalXp = creatures.reduce((sum, c) => {
    return sum + (XP_TABLE[c.cr]?.[partyLevel] || 0) * c.count;
  }, 0);

  return (
    <div className="calc-panel">
      <h3>💀 Calculadora de CR de Encontro</h3>
      <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-4)" }}>
        O <strong>CR (Challenge Rating)</strong> mede a dificuldade de um encontro. Um encontro com CR igual ao nível do grupo é considerado <strong>médio</strong> — deve gastar ~25% dos recursos do grupo.
        Múltiplas criaturas aumentam o CR efetivo: dobrar a quantidade adiciona +2 ao CR.
      </p>
      <div className="calc-inputs">
        <div className="calc-field">
          <label>Nível do Grupo</label>
          <input type="number" className="input" value={partyLevel} onChange={(e) => setPartyLevel(+e.target.value)} min={1} max={20} />
        </div>
        <div className="calc-field">
          <label>Tamanho do Grupo</label>
          <input type="number" className="input" value={partySize} onChange={(e) => setPartySize(+e.target.value)} min={1} max={10} />
        </div>
      </div>

      <div className="calc-creature-list">
        <h4>Criaturas</h4>
        {creatures.map((c, i) => (
          <div key={i} className="calc-creature-row">
            <input type="number" className="input" value={c.count} min={1} max={20}
              onChange={(e) => { const n = [...creatures]; n[i].count = +e.target.value; setCreatures(n); }}
              style={{ width: 60 }} />
            <span>×</span>
            <div className="calc-field" style={{ flex: 1 }}>
              <label>CR</label>
              <input type="number" className="input" value={c.cr} min={0.125} max={30} step={0.5}
                onChange={(e) => { const n = [...creatures]; n[i].cr = +e.target.value; setCreatures(n); }} />
            </div>
            {creatures.length > 1 && (
              <button className="btn btn-ghost btn-sm" onClick={() => setCreatures(creatures.filter((_, j) => j !== i))}>✕</button>
            )}
          </div>
        ))}
        <button className="btn btn-ghost btn-sm" onClick={() => setCreatures([...creatures, { cr: 1, count: 1 }])}>
          + Adicionar Criatura
        </button>
      </div>

      <div className="calc-results">
        <div className="calc-result-card">
          <span className="calc-result-label">CR do Encontro</span>
          <span className="calc-result-value">{ecr}</span>
        </div>
        <div className="calc-result-card" style={{ borderColor: diff.color }}>
          <span className="calc-result-label">Dificuldade</span>
          <span className="calc-result-value" style={{ color: diff.color }}>{diff.label}</span>
        </div>
        <div className="calc-result-card">
          <span className="calc-result-label">XP Total</span>
          <span className="calc-result-value">{fmt(totalXp)}</span>
        </div>
        <div className="calc-result-card">
          <span className="calc-result-label">XP por Jogador</span>
          <span className="calc-result-value">{fmt(Math.floor(totalXp / partySize))}</span>
        </div>
      </div>
    </div>
  );
}

function WealthCalculator() {
  const [level, setLevel] = useState(5);

  return (
    <div className="calc-panel">
      <h3>💰 Riqueza por Nível (D&D 3.5)</h3>
      <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-4)" }}>
        A tabela de <strong>Wealth by Level</strong> indica quanto ouro (em itens, dinheiro e equipamento) um personagem deveria ter ao atingir cada nível.
        Útil para mestres equilibrarem recompensas e para criar personagens acima do nível 1.
      </p>
      <div className="calc-inputs">
        <div className="calc-field">
          <label>Nível do Personagem</label>
          <input type="number" className="input" value={level} onChange={(e) => setLevel(+e.target.value)} min={1} max={20} />
        </div>
      </div>

      <div className="calc-results">
        <div className="calc-result-card highlight">
          <span className="calc-result-label">Riqueza Esperada (gp)</span>
          <span className="calc-result-value">{fmt(WEALTH_BY_LEVEL[level] || 0)} po</span>
        </div>
      </div>

      <div className="calc-table-wrap">
        <h4>Tabela Completa</h4>
        <table className="calc-table">
          <thead>
            <tr><th>Nível</th><th>Riqueza (po)</th></tr>
          </thead>
          <tbody>
            {Object.entries(WEALTH_BY_LEVEL).map(([lv, gold]) => (
              <tr key={lv} className={+lv === level ? "active" : ""}>
                <td>{lv}</td>
                <td>{fmt(gold)} po</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Dados de cada tipo de crafting do D&D 3.5
const CRAFT_TYPES = {
  potion: {
    name: "Poção",
    feat: "Brew Potion",
    minLevel: 3,
    desc: "Poções são itens mágicos consumíveis que contêm uma magia de até 3º nível. Ao beber, o efeito da magia é aplicado ao usuário. Qualquer personagem pode usar uma poção.",
    rules: "Custo = Nível da Magia × Nível de Conjurador × 50 po. Magias de nível 0 contam como ½. Tempo: 1 dia para cada 1.000 po do preço base. Limite: magias de até 3º nível que afetam apenas o alvo.",
    fields: "spell" as const,
  },
  scroll: {
    name: "Pergaminho",
    feat: "Scribe Scroll",
    minLevel: 1,
    desc: "Pergaminhos contêm uma magia escrita que pode ser conjurada uma vez e se desfaz. Apenas quem tem a magia na sua lista de classe pode usar. Falha é possível se o nível do conjurador for baixo.",
    rules: "Custo = Nível da Magia × Nível de Conjurador × 25 po. Magias de nível 0 contam como ½. Tempo: 1 dia para cada 1.000 po. Sem limite de nível de magia.",
    fields: "spell" as const,
  },
  wand: {
    name: "Varinha",
    feat: "Craft Wand",
    minLevel: 5,
    desc: "Varinhas armazenam 50 cargas de uma magia de até 4º nível. Ao ativar, gasta 1 carga. Quando chega a 0, vira um graveto inútil. Apenas quem tem a magia na lista de classe pode usar.",
    rules: "Custo = Nível da Magia × Nível de Conjurador × 750 po (para 50 cargas). Magias de nível 0 contam como ½. Tempo: 1 dia para cada 1.000 po. Limite: magias de até 4º nível.",
    fields: "spell" as const,
  },
  arms: {
    name: "Arma / Armadura Mágica",
    feat: "Craft Magic Arms and Armor",
    minLevel: 5,
    desc: "Permite adicionar bônus de aprimoramento (+1 a +5) e propriedades especiais (flamejante, vorpal, etc.) a armas, armaduras e escudos. O item base deve ser uma obra-prima (masterwork).",
    rules: "Custo = Preço de Mercado / 2. O bônus de aprimoramento base (+1) custa 2.000 po (arma) ou 1.000 po (armadura). Propriedades especiais têm bônus equivalente. Nível de Conjurador mínimo = 3× o bônus de aprimoramento. Tempo: 1 dia por 1.000 po.",
    fields: "base" as const,
  },
  rod: {
    name: "Cetro (Rod)",
    feat: "Craft Rod",
    minLevel: 9,
    desc: "Cetros são itens mágicos em forma de bastão curto (~60cm) com poderes variados. Podem ter cargas ou usos ilimitados dependendo do tipo. Geralmente não requerem ativação por classe.",
    rules: "Custo = Preço de Mercado / 2. Nível de Conjurador necessário varia por cetro. Tempo: 1 dia por 1.000 po. O criador deve ter as magias pré-requisito do cetro.",
    fields: "base" as const,
  },
  staff: {
    name: "Cajado (Staff)",
    feat: "Craft Staff",
    minLevel: 12,
    desc: "Cajados são bastões longos (~1,8m) que armazenam múltiplas magias com 50 cargas compartilhadas. Podem ser recarregados. Apenas conjuradores com as magias na lista podem usar.",
    rules: "Custo = Preço de Mercado / 2. Cajados usam cargas variáveis por magia (1-3 cargas). Nível de Conjurador mínimo = 8 ou mais alto exigido pelas magias. Tempo: 1 dia por 1.000 po.",
    fields: "base" as const,
  },
  ring: {
    name: "Anel",
    feat: "Forge Ring",
    minLevel: 12,
    desc: "Anéis mágicos concedem efeitos contínuos, ativados ou com cargas. Um personagem pode usar no máximo 2 anéis mágicos simultaneamente (um em cada mão).",
    rules: "Custo = Preço de Mercado / 2. Nível de Conjurador necessário varia por anel. Tempo: 1 dia por 1.000 po. O criador deve ter as magias pré-requisito.",
    fields: "base" as const,
  },
  wondrous: {
    name: "Item Maravilhoso",
    feat: "Craft Wondrous Item",
    minLevel: 3,
    desc: "Categoria que abrange todos os itens mágicos que não se encaixam em outras categorias: capas, botas, luvas, cintos, amuletos, óculos, bolsas mágicas, tapetes voadores, etc.",
    rules: "Custo = Preço de Mercado / 2. Se o item reproduz uma magia, o preço base = Nível da Magia × Nível de Conjurador × 2.000 po (uso contínuo) ou × 1.800 po (ativado por comando). Tempo: 1 dia por 1.000 po.",
    fields: "base" as const,
  },
};

type CraftType = keyof typeof CRAFT_TYPES;

function CraftCalculator() {
  const [itemType, setItemType] = useState<CraftType>("potion");
  const [spellLevel, setSpellLevel] = useState(1);
  const [casterLevel, setCasterLevel] = useState(3);
  const [basePrice, setBasePrice] = useState(2000);

  const craft = CRAFT_TYPES[itemType];

  function getCost(): number {
    const sl = Math.max(spellLevel, 0.5);
    switch (itemType) {
      case "potion": return sl * casterLevel * 50;
      case "scroll": return sl * casterLevel * 25;
      case "wand": return sl * casterLevel * 750;
      default: return basePrice / 2;
    }
  }

  function getXpCost(): number {
    return Math.floor(getCost() / 25);
  }

  function getDays(): number {
    return Math.max(1, Math.ceil(getCost() / 1000));
  }

  return (
    <div className="calc-panel">
      <h3>🔨 Criação de Itens Mágicos (D&D 3.5)</h3>
      <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-4)" }}>
        No D&D 3.5, personagens com os feats apropriados podem criar itens mágicos gastando ouro, XP e tempo.
        A regra geral é: <strong>Custo = Preço de Mercado ÷ 2</strong> em ouro, mais <strong>1/25 desse custo em XP</strong>.
        O tempo é de <strong>1 dia por 1.000 po</strong> do custo base (mínimo 1 dia).
      </p>

      <div className="calc-inputs">
        <div className="calc-field" style={{ minWidth: "100%" }}>
          <label>Tipo de Item</label>
          <select className="input select" value={itemType} onChange={(e) => setItemType(e.target.value as CraftType)}>
            {Object.entries(CRAFT_TYPES).map(([key, val]) => (
              <option key={key} value={key}>
                {val.name} ({val.feat})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Explicação do tipo selecionado */}
      <div style={{ padding: "var(--space-3) var(--space-4)", background: "var(--bg-deep)", borderRadius: "var(--radius-md)", marginBottom: "var(--space-4)", border: "1px solid var(--border-subtle)" }}>
        <div style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--dnd-gold)", marginBottom: "var(--space-2)" }}>
          📖 {craft.name} — {craft.feat}
        </div>
        <p style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 var(--space-2)" }}>
          {craft.desc}
        </p>
        <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>
          Requisitos: Nível de Conjurador mínimo {craft.minLevel}. {craft.rules}
        </p>
      </div>

      {/* Campos de cálculo */}
      <div className="calc-inputs">
        {craft.fields === "spell" && (
          <>
            <div className="calc-field">
              <label>Nível da Magia</label>
              <input type="number" className="input" value={spellLevel} onChange={(e) => setSpellLevel(+e.target.value)} min={0} max={itemType === "potion" ? 3 : itemType === "wand" ? 4 : 9} />
            </div>
            <div className="calc-field">
              <label>Nível de Conjurador</label>
              <input type="number" className="input" value={casterLevel} onChange={(e) => setCasterLevel(+e.target.value)} min={craft.minLevel} max={20} />
            </div>
          </>
        )}
        {craft.fields === "base" && (
          <div className="calc-field">
            <label>Preço de Mercado (po)</label>
            <input type="number" className="input" value={basePrice} onChange={(e) => setBasePrice(+e.target.value)} min={0} step={100} />
          </div>
        )}
      </div>

      {/* Resultados */}
      <div className="calc-results">
        <div className="calc-result-card highlight">
          <span className="calc-result-label">Custo em Ouro</span>
          <span className="calc-result-value">{fmt(getCost())} po</span>
        </div>
        <div className="calc-result-card">
          <span className="calc-result-label">Custo em XP</span>
          <span className="calc-result-value">{fmt(getXpCost())} XP</span>
        </div>
        <div className="calc-result-card">
          <span className="calc-result-label">Preço de Venda</span>
          <span className="calc-result-value">{fmt(getCost() * 2)} po</span>
        </div>
        <div className="calc-result-card">
          <span className="calc-result-label">Tempo de Criação</span>
          <span className="calc-result-value">{getDays()} {getDays() === 1 ? "dia" : "dias"}</span>
        </div>
      </div>

      {/* Tabela de referência rápida */}
      <div className="calc-table-wrap" style={{ marginTop: "var(--space-4)" }}>
        <h4>Referência Rápida — Todos os Feats de Criação</h4>
        <table className="calc-table">
          <thead>
            <tr><th>Feat</th><th>Nível Mín.</th><th>Fórmula do Custo</th><th>Limite</th></tr>
          </thead>
          <tbody>
            <tr><td>Brew Potion</td><td>3</td><td>NM × NC × 50 po</td><td>Magias até 3º nível</td></tr>
            <tr><td>Scribe Scroll</td><td>1</td><td>NM × NC × 25 po</td><td>Qualquer magia</td></tr>
            <tr><td>Craft Wand</td><td>5</td><td>NM × NC × 750 po</td><td>Magias até 4º nível, 50 cargas</td></tr>
            <tr><td>Craft Arms/Armor</td><td>5</td><td>Preço / 2</td><td>Item base masterwork</td></tr>
            <tr><td>Craft Rod</td><td>9</td><td>Preço / 2</td><td>NC varia por cetro</td></tr>
            <tr><td>Craft Staff</td><td>12</td><td>Preço / 2</td><td>50 cargas, recarregável</td></tr>
            <tr><td>Forge Ring</td><td>12</td><td>Preço / 2</td><td>Máximo 2 anéis por personagem</td></tr>
            <tr><td>Craft Wondrous</td><td>3</td><td>Preço / 2</td><td>Itens variados</td></tr>
          </tbody>
        </table>
        <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: "var(--space-2)" }}>
          NM = Nível da Magia (0 conta como ½) · NC = Nível de Conjurador · XP = Custo em ouro ÷ 25 · Tempo = 1 dia por 1.000 po
        </p>
      </div>
    </div>
  );
}
