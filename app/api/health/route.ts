import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  const diagnostics: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    hasDbUrl: !!process.env.DATABASE_URL,
    dbUrlPrefix: process.env.DATABASE_URL?.substring(0, 30) + "...",
  };

  try {
    const { prisma } = await import("@/lib/db");
    const count = await prisma.campaign.count();
    diagnostics.dbConnected = true;
    diagnostics.campaignCount = count;
  } catch (error: unknown) {
    diagnostics.dbConnected = false;
    diagnostics.error = error instanceof Error ? error.message : String(error);
    diagnostics.errorStack = error instanceof Error ? error.stack?.split("\n").slice(0, 5) : undefined;
  }

  return NextResponse.json(diagnostics, { status: diagnostics.dbConnected ? 200 : 500 });
}
