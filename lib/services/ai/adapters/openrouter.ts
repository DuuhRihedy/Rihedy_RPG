import type { AIProvider, AIGenerateOptions, AIResponse } from "../types";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export class OpenRouterAdapter implements AIProvider {
  readonly name = "openrouter";
  readonly defaultModel = "google/gemini-2.5-flash";
  readonly models = [
    "google/gemini-2.5-flash",
    "meta-llama/llama-3.3-70b-instruct",
    "anthropic/claude-sonnet-4",
    "openai/gpt-4o-mini",
    "mistralai/mistral-small-3.2",
  ];

  async generateText(
    options: AIGenerateOptions,
    model?: string,
    apiKey?: string,
  ): Promise<AIResponse> {
    const key = apiKey || process.env.OPENROUTER_API_KEY?.trim();
    if (!key) throw new Error("OPENROUTER_API_KEY não configurada");

    const modelId = model || this.defaultModel;

    const messages = [
      { role: "system" as const, content: options.systemPrompt },
      ...options.history.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      { role: "user" as const, content: options.userMessage },
    ];

    const res = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
        "HTTP-Referer": "https://hub-rpg.vercel.app",
        "X-Title": "Hub RPG — VTT",
      },
      body: JSON.stringify({
        model: modelId,
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 4096,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenRouter (${res.status}): ${err}`);
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || "Sem resposta.";
    const tokensUsed =
      (data.usage?.prompt_tokens || 0) + (data.usage?.completion_tokens || 0);

    return { text, tokensUsed, provider: this.name, model: modelId };
  }
}
