import type { AIProvider, AIGenerateOptions, AIResponse, AIMessage } from "../types";

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

export class GeminiAdapter implements AIProvider {
  readonly name = "gemini";
  readonly defaultModel = "gemini-2.5-flash";
  readonly models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];

  async generateText(
    options: AIGenerateOptions,
    model?: string,
    apiKey?: string,
  ): Promise<AIResponse> {
    const key = apiKey || process.env.GEMINI_API_KEY?.trim();
    if (!key) throw new Error("GEMINI_API_KEY não configurada");

    const modelId = model || this.defaultModel;

    // Converter AIMessage[] para formato Gemini {role, parts}
    const contents = [
      ...options.history.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })),
      { role: "user", parts: [{ text: options.userMessage }] },
    ];

    const body = {
      system_instruction: { parts: [{ text: options.systemPrompt }] },
      contents,
      generationConfig: {
        temperature: options.temperature ?? 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: options.maxTokens ?? 4096,
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
      ],
    };

    const res = await fetch(`${GEMINI_BASE}/${modelId}:generateContent?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Gemini (${res.status}): ${err}`);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sem resposta.";
    const tokensUsed =
      (data.usageMetadata?.promptTokenCount || 0) +
      (data.usageMetadata?.candidatesTokenCount || 0);

    return { text, tokensUsed, provider: this.name, model: modelId };
  }
}
