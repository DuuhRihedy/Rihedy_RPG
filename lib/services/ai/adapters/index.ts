import { GeminiAdapter } from "./gemini";
import { GroqAdapter } from "./groq";
import { OpenRouterAdapter } from "./openrouter";
import type { AIProvider, ProviderName } from "../types";

const adapters: Record<ProviderName, AIProvider> = {
  gemini: new GeminiAdapter(),
  groq: new GroqAdapter(),
  openrouter: new OpenRouterAdapter(),
};

export function getAdapter(name: ProviderName): AIProvider {
  return adapters[name];
}

export const FALLBACK_ORDER: ProviderName[] = ["gemini", "groq", "openrouter"];
