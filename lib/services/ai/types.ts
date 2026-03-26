// ══════════════════════════════════════════
// Hub RPG — Sistema de IA Plugável
// Interface base para providers de IA
// ══════════════════════════════════════════

export type AIRole = "user" | "assistant" | "system";

export interface AIMessage {
  role: AIRole;
  content: string;
}

export interface AIResponse {
  text: string;
  tokensUsed: number;
  provider: string;
  model: string;
}

export interface AIGenerateOptions {
  systemPrompt: string;
  history: AIMessage[];
  userMessage: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIProvider {
  readonly name: string;
  readonly defaultModel: string;
  readonly models: string[];
  generateText(
    options: AIGenerateOptions,
    model?: string,
    apiKey?: string,
  ): Promise<AIResponse>;
}

export type ProviderName = "gemini" | "groq" | "openrouter";

export const PROVIDER_INFO: Record<ProviderName, { label: string; description: string; envKey: string }> = {
  gemini: {
    label: "Google Gemini",
    description: "Gemini 2.5 Flash — gratuito, rápido",
    envKey: "GEMINI_API_KEY",
  },
  groq: {
    label: "Groq",
    description: "Llama 3.3 70B — gratuito, ultra-rápido",
    envKey: "GROQ_API_KEY",
  },
  openrouter: {
    label: "OpenRouter",
    description: "Múltiplos modelos — pague por uso",
    envKey: "OPENROUTER_API_KEY",
  },
};
