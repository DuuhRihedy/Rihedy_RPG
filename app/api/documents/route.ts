import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET — listar documentos (opcional: ?campaignId=xxx)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get("campaignId");

    const where = campaignId ? { campaignId } : {};

    const documents = await prisma.document.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Erro ao listar documentos:", error);
    return NextResponse.json({ error: "Erro ao listar documentos" }, { status: 500 });
  }
}

// POST — criar documento (FormData: name, type, campaignId, content OU file)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = (formData.get("name") as string)?.trim();
    const type = (formData.get("type") as string) || "notas";
    const campaignId = formData.get("campaignId") as string;
    const contentField = (formData.get("content") as string)?.trim() || null;
    const file = formData.get("file") as File | null;

    if (!name || !campaignId) {
      return NextResponse.json(
        { error: "Nome e campanha são obrigatórios" },
        { status: 400 },
      );
    }

    let content = contentField || "";
    let sourceFile: string | null = null;

    if (file && file.size > 0) {
      sourceFile = file.name;
      const ext = file.name.split(".").pop()?.toLowerCase();

      if (ext === "txt") {
        // Lê arquivo .txt diretamente
        content = await file.text();
      } else if (ext === "pdf") {
        // PDF não suportado sem biblioteca extra
        return NextResponse.json(
          {
            error:
              "Arquivos PDF ainda não são suportados. Por favor, copie o texto do PDF e cole no campo de conteúdo, ou envie como .txt.",
          },
          { status: 400 },
        );
      } else {
        return NextResponse.json(
          { error: "Formato não suportado. Use .txt ou cole o texto diretamente." },
          { status: 400 },
        );
      }
    }

    if (!content) {
      return NextResponse.json(
        { error: "Conteúdo é obrigatório (envie um arquivo .txt ou cole o texto)" },
        { status: 400 },
      );
    }

    const document = await prisma.document.create({
      data: { name, type, content, sourceFile, campaignId },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar documento:", error);
    return NextResponse.json({ error: "Erro ao criar documento" }, { status: 500 });
  }
}

// DELETE — excluir documento por ?id=xxx
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
    }

    await prisma.document.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao excluir documento:", error);
    return NextResponse.json({ error: "Erro ao excluir documento" }, { status: 500 });
  }
}
