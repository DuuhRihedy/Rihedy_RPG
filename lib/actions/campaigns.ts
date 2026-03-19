"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getCampaigns() {
  return prisma.campaign.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { sessions: true, npcs: true, notes: true } },
    },
  });
}

export async function getCampaign(id: string) {
  return prisma.campaign.findUnique({
    where: { id },
    include: {
      sessions: { orderBy: { number: "desc" }, take: 10 },
      npcs: { include: { npc: true } },
      notes: { orderBy: { createdAt: "desc" }, take: 5 },
      arcs: true,
      _count: { select: { sessions: true, npcs: true, notes: true } },
    },
  });
}

export async function createCampaign(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const edition = formData.get("edition") as string || "3.5";

  if (!name?.trim()) return;

  const campaign = await prisma.campaign.create({
    data: { name: name.trim(), description: description?.trim() || null, edition },
  });

  revalidatePath("/campanhas");
  redirect(`/campanhas/${campaign.id}`);
}

export async function updateCampaign(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const edition = formData.get("edition") as string;
  const status = formData.get("status") as string;

  await prisma.campaign.update({
    where: { id },
    data: {
      ...(name && { name: name.trim() }),
      ...(description !== null && { description: description?.trim() || null }),
      ...(edition && { edition }),
      ...(status && { status }),
    },
  });

  revalidatePath(`/campanhas/${id}`);
  revalidatePath("/campanhas");
}

export async function deleteCampaign(id: string) {
  await prisma.campaign.delete({ where: { id } });
  revalidatePath("/campanhas");
  redirect("/campanhas");
}
