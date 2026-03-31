import { NextRequest, NextResponse } from "next/server";
import { askAssistant } from "@/lib/services/ai-assistant";

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json({ reply: "Mensagem vazia." }, { status: 400 });
    }

    const response = await askAssistant({
      message: message.trim(),
      mode: "chat",
    });

    return NextResponse.json({
      reply: response.text,
      tokensUsed: response.tokensUsed,
    });
  } catch (error) {
    console.error("Assistant chat API error:", error);
    return NextResponse.json(
      { reply: "⚠️ Erro ao consultar o Oráculo. Tente novamente." },
      { status: 500 },
    );
  }
}
