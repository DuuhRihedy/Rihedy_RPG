"use client";

import { useState, useEffect } from "react";
import {
  getAiConfig,
  saveAiConfig,
  testAiProvider,
  getAiUsageStats,
} from "@/lib/actions/ai-config";
import { PROVIDER_INFO, type ProviderName } from "@/lib/services/ai";
import { getAdapter } from "@/lib/services/ai";

const PROVIDERS: ProviderName[] = ["gemini", "groq", "openrouter"];

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
  const [testResult, setTestResult] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);
  const [stats, setStats] = useState<{
    today: number;
    byProvider: { provider: string; requests: number; tokens: number }[];
  } | null>(null);

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
  }, []);

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
    const result = await testAiProvider(
      provider,
      apiKey || undefined,
      model || undefined,
    );
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

  const providerModels = (() => {
    try {
      return getAdapter(provider).models;
    } catch {
      return [];
    }
  })();

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
            return (
              <button
                key={p}
                className={`config-provider-card ${provider === p ? "active" : ""}`}
                onClick={() => {
                  setProvider(p);
                  setModel("");
                  setTestResult(null);
                }}
              >
                <strong>{info.label}</strong>
                <span>{info.description}</span>
              </button>
            );
          })}
        </div>

        <div className="config-fields">
          {/* API Key */}
          <div className="form-group">
            <label className="form-label">
              API Key
              {hasExistingKey && !apiKey && (
                <span className="config-key-badge">Configurada</span>
              )}
            </label>
            <input
              type="password"
              className="input"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={`Cole sua ${PROVIDER_INFO[provider].label} API Key...`}
            />
            <span className="config-hint">
              Variável de ambiente: {PROVIDER_INFO[provider].envKey}
            </span>
          </div>

          {/* Modelo */}
          <div className="form-group">
            <label className="form-label">Modelo</label>
            <select
              className="input select"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            >
              <option value="">Padrão ({getAdapter(provider).defaultModel})</option>
              {providerModels.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Teste */}
          <div className="config-test-row">
            <button
              className="btn btn-ghost"
              onClick={handleTest}
              disabled={testing}
            >
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

      {/* Parâmetros */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">🎛️ Parâmetros</span>
        </div>

        <div className="config-fields">
          {/* Temperatura */}
          <div className="form-group">
            <label className="form-label">
              Temperatura: {temperature.toFixed(1)}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="config-slider"
            />
            <div className="config-slider-labels">
              <span>Preciso</span>
              <span>Criativo</span>
            </div>
          </div>

          {/* Max Tokens */}
          <div className="form-group">
            <label className="form-label">Máximo de Tokens</label>
            <input
              type="number"
              className="input"
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value) || 4096)}
              min={256}
              max={32768}
              step={256}
            />
          </div>

          {/* Fallback */}
          <label className="config-toggle">
            <input
              type="checkbox"
              checked={fallback}
              onChange={(e) => setFallback(e.target.checked)}
            />
            <span>Fallback automático (tentar outro provider se falhar)</span>
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
                <span className="config-stat-tokens">
                  {p.tokens.toLocaleString()} tokens
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Salvar */}
      <div className="config-save-row">
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "⏳ Salvando..." : "💾 Salvar Configurações"}
        </button>
        {saved && (
          <span className="config-saved">✅ Configurações salvas!</span>
        )}
      </div>
    </div>
  );
}
