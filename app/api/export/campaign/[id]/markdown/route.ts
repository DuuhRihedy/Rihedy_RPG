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
        sessions: { orderBy: { number: "asc" }, include: { events: true } },
        npcs: { include: { npc: { include: { attributes: true, items: true } } } },
        notes: { orderBy: { createdAt: "asc" } },
        arcs: true,
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campanha não encontrada" }, { status: 404 });
    }

    let md = `# ${campaign.name}\n\n`;
    md += `**Edição:** D&D ${campaign.edition} | **Status:** ${campaign.status}\n\n`;
    if (campaign.description) md += `> ${campaign.description}\n\n`;
    md += `---\n\n`;

    // Stats
    md += `## 📊 Estatísticas\n\n`;
    md += `| Sessões | NPCs | Notas | Arcos |\n`;
    md += `|---------|------|-------|-------|\n`;
    md += `| ${campaign.sessions.length} | ${campaign.npcs.length} | ${campaign.notes.length} | ${campaign.arcs.length} |\n\n`;

    // Arcs
    if (campaign.arcs.length > 0) {
      md += `## 📖 Arcos Narrativos\n\n`;
      for (const arc of campaign.arcs) {
        md += `### ${arc.title} (${arc.status})\n\n`;
        if (arc.description) md += `${arc.description}\n\n`;
      }
    }

    // NPCs
    if (campaign.npcs.length > 0) {
      md += `## 👥 NPCs\n\n`;
      for (const { npc } of campaign.npcs) {
        md += `### ${npc.name}\n\n`;
        const meta = [npc.race, npc.class, npc.level ? `Nv ${npc.level}` : null, npc.alignment].filter(Boolean).join(" · ");
        if (meta) md += `**${meta}** | ${npc.type === "ally" ? "🛡️ Aliado" : npc.type === "enemy" ? "💀 Inimigo" : "👤 Neutro"}\n\n`;
        if (npc.description) md += `${npc.description}\n\n`;
        if (npc.backstory) md += `**Backstory:** ${npc.backstory}\n\n`;

        if (npc.attributes) {
          const a = npc.attributes;
          md += `| FOR | DES | CON | INT | SAB | CAR | PV | CA |\n`;
          md += `|-----|-----|-----|-----|-----|-----|----|----|       \n`;
          md += `| ${a.str} | ${a.dex} | ${a.con} | ${a.intl} | ${a.wis} | ${a.cha} | ${a.hp} | ${a.ac} |\n\n`;
        }

        if (npc.items.length > 0) {
          md += `**Itens:** ${npc.items.map((i) => i.name).join(", ")}\n\n`;
        }
      }
    }

    // Sessions
    if (campaign.sessions.length > 0) {
      md += `## 📜 Sessões\n\n`;
      for (const s of campaign.sessions) {
        md += `### Sessão ${s.number}${s.title ? ` — ${s.title}` : ""}\n\n`;
        if (s.date) md += `**Data:** ${new Date(s.date).toLocaleDateString("pt-BR")}\n\n`;
        if (s.notes) md += `${s.notes}\n\n`;
        if (s.aiRecap) md += `**Recap IA:**\n\n${s.aiRecap}\n\n`;
        if (s.events.length > 0) {
          md += `**Eventos:**\n`;
          for (const e of s.events) {
            md += `- [${e.type}] ${e.description}\n`;
          }
          md += `\n`;
        }
      }
    }

    // Notes
    if (campaign.notes.length > 0) {
      md += `## 📝 Notas\n\n`;
      for (const n of campaign.notes) {
        md += `### ${n.title}\n\n${n.content}\n\n`;
      }
    }

    md += `---\n\n*Exportado em ${new Date().toLocaleString("pt-BR")} pelo Hub RPG*\n`;

    const filename = campaign.name.replace(/[^a-zA-Z0-9\u00C0-\u024F]/g, "_");

    return new NextResponse(md, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}.md"`,
      },
    });
  } catch (error) {
    console.error("[export-md] Error:", error);
    return NextResponse.json({ error: "Erro na exportação" }, { status: 500 });
  }
}
