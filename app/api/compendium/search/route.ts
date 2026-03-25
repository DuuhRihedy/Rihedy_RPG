import { NextRequest, NextResponse } from "next/server";
import { searchCompendium } from "@/lib/engine/compendium";
import type { CompendiumCategory } from "@/lib/engine/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || undefined;
  const category = searchParams.get("category") as CompendiumCategory | undefined;
  const edition = searchParams.get("edition") as "3.5" | "5e" | undefined;
  const limit = parseInt(searchParams.get("limit") || "20");

  try {
    const results = await searchCompendium({
      query: q,
      category: category || undefined,
      edition: edition || undefined,
      limit,
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("[compendium/search]", error);
    return NextResponse.json([]);
  }
}
