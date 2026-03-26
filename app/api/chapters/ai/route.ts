import { NextRequest, NextResponse } from "next/server";
import { callGemini } from "@/lib/services/gemini";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "prompt é obrigatório" }, { status: 400 });
    }

    const systemPrompt = `Você é um assistente especializado em D&D 3.5 Edition (Dungeons & Dragons 3ª Edição Revisada).
Sempre responda em Português (PT-BR).
Use terminologia oficial de D&D 3.5 quando possível.
Seja detalhado e criativo.`;

    const response = await callGemini(systemPrompt, [], prompt, "chapters");

    return NextResponse.json({
      result: response.text,
      tokensUsed: response.tokensUsed,
    });
  } catch (error) {
    console.error("Erro na IA de capítulos:", error);
    return NextResponse.json(
      { error: "Erro ao processar: " + (error instanceof Error ? error.message : "desconhecido") },
      { status: 500 },
    );
  }
}
