import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    const name = file.name.toLowerCase();
    const buffer = Buffer.from(await file.arrayBuffer());
    let text = "";

    if (name.endsWith(".txt") || name.endsWith(".md")) {
      text = buffer.toString("utf-8");
    } else if (name.endsWith(".pdf")) {
      // pdf-parse v1 — CommonJS, importação dinâmica
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require("pdf-parse");
      const result = await pdfParse(buffer);
      text = result.text;
    } else if (name.endsWith(".doc") || name.endsWith(".docx")) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (name.endsWith(".xls") || name.endsWith(".xlsx") || name.endsWith(".csv")) {
      const XLSX = await import("xlsx");
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const parts: string[] = [];
      for (const sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName];
        parts.push(`=== ${sheetName} ===`);
        parts.push(XLSX.utils.sheet_to_csv(sheet, { FS: "\t", blankrows: false }));
      }
      text = parts.join("\n\n");
    } else {
      return NextResponse.json(
        { error: "Formato não suportado. Use .txt, .md, .pdf, .doc, .docx, .xls, .xlsx ou .csv" },
        { status: 400 },
      );
    }

    // Limpar espaços excessivos
    text = text.replace(/\n{3,}/g, "\n\n").trim();

    return NextResponse.json({
      text,
      fileName: file.name,
      chars: text.length,
      words: text.split(/\s+/).filter(Boolean).length,
    });
  } catch (error) {
    console.error("[extract-text] Erro:", error);
    return NextResponse.json(
      { error: "Erro ao extrair texto: " + (error instanceof Error ? error.message : "desconhecido") },
      { status: 500 },
    );
  }
}
