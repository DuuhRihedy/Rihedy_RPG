// ══════════════════════════════════════════
// Hub RPG — Gemini API Client (REST, sem SDK)
// Modelo: gemini-2.5-flash (Free Tier)
// ══════════════════════════════════════════

import { prisma } from "@/lib/db";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export interface GeminiMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export interface GeminiResponse {
  text: string;
  tokensUsed: number;
}

export async function callGemini(
  systemPrompt: string,
  history: GeminiMessage[],
  userMessage: string,
  source: string = "chat",
): Promise<GeminiResponse> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY não configurada no .env");
  }

  const contents: GeminiMessage[] = [
    ...history,
    { role: "user", parts: [{ text: userMessage }] },
  ];

  const body = {
    system_instruction: {
      parts: [{ text: systemPrompt }],
    },
    contents,
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 4096,
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
    ],
  };

  const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${err}`);
  }

  const data = await res.json();

  const text =
    data.candidates?.[0]?.content?.parts?.[0]?.text || "Sem resposta do Gemini.";

  const tokensUsed =
    (data.usageMetadata?.promptTokenCount || 0) +
    (data.usageMetadata?.candidatesTokenCount || 0);

  // Registrar uso da API
  try {
    await prisma.apiUsage.create({
      data: { source, tokensUsed },
    });
  } catch (err) {
    console.error("[ApiUsage] Erro ao registrar:", err);
  }

  return { text, tokensUsed };
}
