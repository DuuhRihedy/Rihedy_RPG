"use client";

import { useState, useEffect } from "react";
import {
  getAiConfig,
  saveAiConfig,
  testAiProvider,
  getAiUsageStats,
  getApiKeys,
  addApiKey,
  removeApiKey,
  toggleApiKey,
  unblockApiKey,
} from "@/lib/actions/ai-config";
import { PROVIDER_INFO, type ProviderName } from "@/lib/services/ai";
import { getAdapter } from "@/lib/services/ai";

const PROVIDERS: ProviderName[] = ["gemini", "groq", "openrouter"];

interface ApiKeyEntry {
  id: string;
  provider: string;
  label: string;
  active: boolean;
  blockedUntil: Date | null;
  usageToday: number;
  lastUsedAt: Date | null;
}

export default function AiConfigForm() {
  const [provider, setProvider] = useState<ProviderName>("gemini");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");
  const [fallback, setFallback] = useState(true);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(4096);
  const [hasExistingKey, setHasExistingKey] = useState(false);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [stats, setStats] = useState<{
    today: number;
    byProvider: { provider: string; requests: number; tokens: number }[];
  } | null>(null);

  // Pool de keys
  const [keys, setKeys] = useState<ApiKeyEntry[]>([]);
  const [newKeyLabel, setNewKeyLabel] = useState("");
  const [newKeyValue, setNewKeyValue] = useState("");
  const [addingKey, setAddingKey] = useState(false);

  useEffect(() => {
    getAiConfig().then((config) => {
      setProvider(config.provider);
      setModel(config.model || "");
      setFallback(config.fallback);
      setTemperature(config.temperature);
      setMaxTokens(config.maxTokens);
      setHasExistingKey(config.hasApiKey);
    });
    getAiUsageStats().then(setStats);
    loadKeys();
  }, []);

  async function loadKeys() {
    const data = await getApiKeys();
    setKeys(data as ApiKeyEntry[]);
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    const result = await saveAiConfig({
      provider,
      apiKey: apiKey || undefined,
      model: model || undefined,
      fallback,
      temperature,
      maxTokens,
    });
    setSaving(false);
    if (result.ok) {
      setSaved(true);
      setHasExistingKey(!!apiKey || hasExistingKey);
      setApiKey("");
      setTimeout(() => setSaved(false), 3000);
    }
  }

  async function handleTest() {
    setTesting(true);
    setTestResult(null);
    const result = await testAiProvider(provider, apiKey || undefined, model || undefined);
    setTesting(false);
    if (result.ok) {
      setTestResult({
        ok: true,
        message: `Conectado! Modelo: ${result.model} · ${result.elapsed}ms · ${result.tokensUsed} tokens`,
      });
    } else {
      setTestResult({ ok: false, message: result.error || "Falha na conexão" });
    }
  }

  async function handleAddKey() {
    if (!newKeyValue.trim() || !newKeyLabel.trim()) return;
    setAddingKey(true);
    await addApiKey({ provider, label: newKeyLabel, apiKey: newKeyValue });
    setNewKeyLabel("");
    setNewKeyValue("");
    setAddingKey(false);
    await loadKeys();
  }

  async function handleRemoveKey(id: string) {
    if (!confirm("Remover esta API key?")) return;
    await removeApiKey(id);
    await loadKeys();
  }

  async function handleToggleKey(id: string, active: boolean) {
    await toggleApiKey(id, active);
    await loadKeys();
  }

  async function handleUnblock(id: string) {
    await unblockApiKey(id);
    await loadKeys();
  }

  const providerModels = (() => {
    try { return getAdapter(provider).models; } catch { return []; }
  })();

  const providerKeys = keys.filter((k) => k.provider === provider);

  return (
    <div className="config-grid">
      {/* Provider de IA */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">🤖 Provedor de IA</span>
        </div>

        <div className="config-providers">
          {PROVIDERS.map((p) => {
            const info = PROVIDER_INFO[p];
            const keyCount = keys.filter((k) => k.provider === p && k.active).length;
            return (
              <button
                key={p}
                className={`config-provider-card ${provider === p ? "active" : ""}`}
                onClick={() => { setProvider(p); setModel(""); setTestResult(null); }}
              >
                <strong>{info.label}</strong>
                <span>{info.description}</span>
                {keyCount > 0 && (
                  <span className="config-key-count">{keyCount} key{keyCount > 1 ? "s" : ""}</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="config-fields">
          <div className="form-group">
            <label className="form-label">Modelo</label>
            <select className="input select" value={model} onChange={(e) => setModel(e.target.value)}>
              <option value="">Padrão ({getAdapter(provider).defaultModel})</option>
              {providerModels.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="config-test-row">
            <button className="btn btn-ghost" onClick={handleTest} disabled={testing}>
              {testing ? "⏳ Testando..." : "🔌 Testar Conexão"}
            </button>
            {testResult && (
              <span className={`config-test-result ${testResult.ok ? "success" : "error"}`}>
                {testResult.ok ? "✅" : "❌"} {testResult.message}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Pool de API Keys */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">
            🔑 API Keys — {PROVIDER_INFO[provider].label}
          </span>
          <span className="config-hint" style={{ marginLeft: "auto" }}>
            Rotação automática quando atingir rate limit
          </span>
        </div>

        {/* Keys existentes */}
        {providerKeys.length > 0 ? (
          <div className="config-keys-list">
            {providerKeys.map((k) => {
              const isBlocked = k.blockedUntil && new Date(k.blockedUntil) > new Date();
              return (
                <div key={k.id} className={`config-key-row ${!k.active ? "disabled" : ""} ${isBlocked ? "blocked" : ""}`}>
                  <div className="config-key-info">
                    <strong>{k.label}</strong>
                    <span className="config-key-usage">
                      {k.usageToday} req hoje
                      {isBlocked && " · ⏳ bloqueada (rate limit)"}
                    </span>
                  </div>
                  <div className="config-key-actions">
                    {isBlocked && (
                      <button className="btn btn-ghost btn-sm" onClick={() => handleUnblock(k.id)} title="Desbloquear">
                        🔓
                      </button>
                    )}
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleToggleKey(k.id, !k.active)}
                      title={k.active ? "Desativar" : "Ativar"}
                    >
                      {k.active ? "🟢" : "⚫"}
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleRemoveKey(k.id)} title="Remover">
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", marginBottom: "var(--space-4)" }}>
            Nenhuma key cadastrada. Adicione abaixo ou use variável de ambiente ({PROVIDER_INFO[provider].envKey}).
          </p>
        )}

        {/* Adicionar nova key */}
        <div className="config-add-key">
          <input
            className="input"
            placeholder="Nome (ex: Projeto RPG 1)"
            value={newKeyLabel}
            onChange={(e) => setNewKeyLabel(e.target.value)}
            style={{ flex: 1 }}
          />
          <input
            className="input"
            type="password"
            placeholder="API Key..."
            value={newKeyValue}
            onChange={(e) => setNewKeyValue(e.target.value)}
            style={{ flex: 2 }}
          />
          <button
            className="btn btn-primary btn-sm"
            onClick={handleAddKey}
            disabled={addingKey || !newKeyLabel.trim() || !newKeyValue.trim()}
          >
            {addingKey ? "⏳" : "+ Adicionar"}
          </button>
        </div>
      </div>

      {/* Parâmetros */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">🎛️ Parâmetros</span>
        </div>
        <div className="config-fields">
          <div className="form-group">
            <label className="form-label">Temperatura: {temperature.toFixed(1)}</label>
            <input type="range" min="0" max="1" step="0.1" value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))} className="config-slider" />
            <div className="config-slider-labels"><span>Preciso</span><span>Criativo</span></div>
          </div>
          <div className="form-group">
            <label className="form-label">Máximo de Tokens</label>
            <input type="number" className="input" value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value) || 4096)} min={256} max={32768} step={256} />
          </div>
          <label className="config-toggle">
            <input type="checkbox" checked={fallback} onChange={(e) => setFallback(e.target.checked)} />
            <span>Fallback automático (tentar outro provider se todas as keys falharem)</span>
          </label>
        </div>
      </div>

      {/* Uso hoje */}
      {stats && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">📊 Uso Hoje</span>
          </div>
          <div className="config-stats">
            <div className="config-stat">
              <span className="config-stat-value">{stats.today}</span>
              <span className="config-stat-label">Requisições</span>
            </div>
            {stats.byProvider.map((p) => (
              <div key={p.provider} className="config-stat">
                <span className="config-stat-value">{p.requests}</span>
                <span className="config-stat-label">
                  {PROVIDER_INFO[p.provider as ProviderName]?.label || p.provider}
                </span>
                <span className="config-stat-tokens">{p.tokens.toLocaleString()} tokens</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Salvar */}
      <div className="config-save-row">
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "⏳ Salvando..." : "💾 Salvar Configurações"}
        </button>
        {saved && <span className="config-saved">✅ Configurações salvas!</span>}
      </div>
    </div>
  );
}
