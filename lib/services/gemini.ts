// ══════════════════════════════════════════
// Hub RPG — Bridge de compatibilidade
// Redireciona callGemini() para o AIManager
// ══════════════════════════════════════════

import { generateText, type AIMessage } from "./ai";

export interface GeminiMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export interface GeminiResponse {
  text: string;
  tokensUsed: number;
}

// Converte formato Gemini → formato neutro
function convertHistory(history: GeminiMessage[]): AIMessage[] {
  return history.map((msg) => ({
    role: msg.role === "model" ? "assistant" as const : "user" as const,
    content: msg.parts.map((p) => p.text).join(""),
  }));
}

/**
 * Mantém a assinatura original para compatibilidade.
 * Internamente usa o AIManager que roteia pro provider ativo.
 */
export async function callGemini(
  systemPrompt: string,
  history: GeminiMessage[],
  userMessage: string,
  source: string = "chat",
): Promise<GeminiResponse> {
  const response = await generateText(
    {
      systemPrompt,
      history: convertHistory(history),
      userMessage,
    },
    source,
  );
  return { text: response.text, tokensUsed: response.tokensUsed };
}
