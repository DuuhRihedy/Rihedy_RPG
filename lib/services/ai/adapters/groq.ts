import type { AIProvider, AIGenerateOptions, AIResponse } from "../types";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export class GroqAdapter implements AIProvider {
  readonly name = "groq";
  readonly defaultModel = "llama-3.3-70b-versatile";
  readonly models = [
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
    "mixtral-8x7b-32768",
    "gemma2-9b-it",
  ];

  async generateText(
    options: AIGenerateOptions,
    model?: string,
    apiKey?: string,
  ): Promise<AIResponse> {
    const key = apiKey || process.env.GROQ_API_KEY?.trim();
    if (!key) throw new Error("GROQ_API_KEY não configurada");

    const modelId = model || this.defaultModel;

    const messages = [
      { role: "system" as const, content: options.systemPrompt },
      ...options.history.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      { role: "user" as const, content: options.userMessage },
    ];

    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
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
      throw new Error(`Groq (${res.status}): ${err}`);
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || "Sem resposta.";
    const tokensUsed =
      (data.usage?.prompt_tokens || 0) + (data.usage?.completion_tokens || 0);

    return { text, tokensUsed, provider: this.name, model: modelId };
  }
}
