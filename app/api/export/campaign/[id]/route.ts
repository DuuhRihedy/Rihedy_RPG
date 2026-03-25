import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        sessions: {
          orderBy: { number: "asc" },
          include: { events: true },
        },
        npcs: {
          include: {
            npc: {
              include: {
                attributes: true,
                items: true,
              },
            },
          },
        },
        notes: { orderBy: { createdAt: "asc" } },
        arcs: true,
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campanha não encontrada" }, { status: 404 });
    }

    const exportData = {
      _meta: {
        version: "1.0",
        exportDate: new Date().toISOString(),
        type: "campaign",
      },
      campaign: {
        name: campaign.name,
        description: campaign.description,
        edition: campaign.edition,
        status: campaign.status,
        imageUrl: campaign.imageUrl,
      },
      sessions: campaign.sessions.map((s) => ({
        number: s.number,
        title: s.title,
        date: s.date,
        notes: s.notes,
        durationMin: s.durationMin,
        aiRecap: s.aiRecap,
        events: s.events.map((e) => ({
          description: e.description,
          type: e.type,
        })),
      })),
      npcs: campaign.npcs.map(({ npc }) => ({
        name: npc.name,
        race: npc.race,
        class: npc.class,
        level: npc.level,
        alignment: npc.alignment,
        description: npc.description,
        backstory: npc.backstory,
        gmNotes: npc.gmNotes,
        status: npc.status,
        type: npc.type,
        edition: npc.edition,
        imageUrl: npc.imageUrl,
        attributes: npc.attributes
          ? {
              str: npc.attributes.str,
              dex: npc.attributes.dex,
              con: npc.attributes.con,
              intl: npc.attributes.intl,
              wis: npc.attributes.wis,
              cha: npc.attributes.cha,
              hp: npc.attributes.hp,
              ac: npc.attributes.ac,
            }
          : null,
        items: npc.items.map((item) => ({
          name: item.name,
          type: item.type,
          description: item.description,
          weight: item.weight,
          value: item.value,
          magical: item.magical,
          imageUrl: item.imageUrl,
        })),
      })),
      notes: campaign.notes.map((n) => ({
        title: n.title,
        content: n.content,
        createdAt: n.createdAt,
      })),
      arcs: campaign.arcs.map((a) => ({
        title: a.title,
        description: a.description,
        status: a.status,
      })),
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${campaign.name.replace(/[^a-zA-Z0-9]/g, "_")}_export.json"`,
      },
    });
  } catch (error) {
    console.error("[export] Error:", error);
    return NextResponse.json({ error: "Erro na exportação" }, { status: 500 });
  }
}
