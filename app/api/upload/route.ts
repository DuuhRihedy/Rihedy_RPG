import { put, del } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    // Validar tipo
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de arquivo não suportado. Use JPEG, PNG, WebP ou GIF." },
        { status: 400 },
      );
    }

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Arquivo muito grande. Máximo 5MB." },
        { status: 400 },
      );
    }

    // Gerar nome único
    const ext = file.name.split(".").pop() || "jpg";
    const filename = `hub-rpg/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

    const blob = await put(filename, file, {
      access: "public",
    });

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error("[upload] Erro:", err);
    return NextResponse.json(
      { error: `Falha no upload: ${err instanceof Error ? err.message : "Erro desconhecido"}` },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: "URL não fornecida" }, { status: 400 });
    }

    await del(url);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[upload/delete] Erro:", err);
    return NextResponse.json(
      { error: `Falha ao deletar: ${err instanceof Error ? err.message : "Erro desconhecido"}` },
      { status: 500 },
    );
  }
}
