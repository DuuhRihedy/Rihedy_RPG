import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface ImportNpc {
  name: string;
  race?: string;
  class?: string;
  level?: number;
  alignment?: string;
  description?: string;
  backstory?: string;
  gmNotes?: string;
  status?: string;
  type?: string;
  edition?: string;
  imageUrl?: string;
  attributes?: {
    str: number; dex: number; con: number; intl: number;
    wis: number; cha: number; hp: number; ac: number;
  };
  items?: {
    name: string; type?: string; description?: string;
    weight?: number; value?: string; magical?: boolean; imageUrl?: string;
  }[];
}

interface ImportData {
  _meta: { version: string; type: string };
  campaign: {
    name: string; description?: string; edition?: string;
    status?: string; imageUrl?: string;
  };
  sessions?: {
    number: number; title?: string; date?: string;
    notes?: string; durationMin?: number; aiRecap?: string;
    events?: { description: string; type?: string }[];
  }[];
  npcs?: ImportNpc[];
  notes?: { title: string; content: string }[];
  arcs?: { title: string; description?: string; status?: string }[];
}

export async function POST(request: NextRequest) {
  try {
    const data: ImportData = await request.json();

    if (!data._meta || data._meta.type !== "campaign") {
      return NextResponse.json({ error: "Formato inválido — tipo deve ser 'campaign'" }, { status: 400 });
    }

    if (!data.campaign?.name) {
      return NextResponse.json({ error: "Nome da campanha é obrigatório" }, { status: 400 });
    }

    // Create campaign
    const campaign = await prisma.campaign.create({
      data: {
        name: `${data.campaign.name} (Importado)`,
        description: data.campaign.description || null,
        edition: data.campaign.edition || "3.5",
        status: data.campaign.status || "active",
        imageUrl: data.campaign.imageUrl || null,
      },
    });

    let sessionsCreated = 0;
    let npcsCreated = 0;
    let notesCreated = 0;
    let arcsCreated = 0;

    // Import sessions
    if (data.sessions?.length) {
      for (const s of data.sessions) {
        const session = await prisma.session.create({
          data: {
            campaignId: campaign.id,
            number: s.number,
            title: s.title || null,
            date: s.date ? new Date(s.date) : new Date(),
            notes: s.notes || null,
            durationMin: s.durationMin || null,
            aiRecap: s.aiRecap || null,
          },
        });

        if (s.events?.length) {
          await prisma.event.createMany({
            data: s.events.map((e) => ({
              sessionId: session.id,
              description: e.description,
              type: e.type || "narrative",
            })),
          });
        }

        sessionsCreated++;
      }
    }

    // Import NPCs
    if (data.npcs?.length) {
      for (const n of data.npcs) {
        const npc = await prisma.npc.create({
          data: {
            name: n.name,
            race: n.race || null,
            class: n.class || null,
            level: n.level || null,
            alignment: n.alignment || null,
            description: n.description || null,
            backstory: n.backstory || null,
            gmNotes: n.gmNotes || null,
            status: n.status || "alive",
            type: n.type || "neutral",
            edition: n.edition || "3.5",
            imageUrl: n.imageUrl || null,
            ...(n.attributes && {
              attributes: {
                create: n.attributes,
              },
            }),
            campaigns: {
              create: { campaignId: campaign.id },
            },
          },
        });

        if (n.items?.length) {
          await prisma.item.createMany({
            data: n.items.map((item) => ({
              npcId: npc.id,
              name: item.name,
              type: item.type || "item",
              description: item.description || null,
              weight: item.weight || null,
              value: item.value || null,
              magical: item.magical || false,
              imageUrl: item.imageUrl || null,
            })),
          });
        }

        npcsCreated++;
      }
    }

    // Import notes
    if (data.notes?.length) {
      await prisma.note.createMany({
        data: data.notes.map((n) => ({
          campaignId: campaign.id,
          title: n.title,
          content: n.content,
        })),
      });
      notesCreated = data.notes.length;
    }

    // Import arcs
    if (data.arcs?.length) {
      await prisma.storyArc.createMany({
        data: data.arcs.map((a) => ({
          campaignId: campaign.id,
          title: a.title,
          description: a.description || null,
          status: a.status || "active",
        })),
      });
      arcsCreated = data.arcs.length;
    }

    return NextResponse.json({
      success: true,
      campaignId: campaign.id,
      stats: {
        sessions: sessionsCreated,
        npcs: npcsCreated,
        notes: notesCreated,
        arcs: arcsCreated,
      },
    });
  } catch (error) {
    console.error("[import] Error:", error);
    return NextResponse.json({ error: "Erro na importação" }, { status: 500 });
  }
}
