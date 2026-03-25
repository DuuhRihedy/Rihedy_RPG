import { NextResponse } from "next/server";
import { getCompendiumStats } from "@/lib/engine/compendium";

export async function GET() {
  try {
    const stats = await getCompendiumStats();
    return NextResponse.json(stats);
  } catch {
    return NextResponse.json({ total: 0, breakdown: {} });
  }
}
