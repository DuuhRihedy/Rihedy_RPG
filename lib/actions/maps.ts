"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getMaps(campaignId?: string) {
  const where = campaignId ? { campaignId } : {};
  return prisma.map.findMany({
    where,
    include: { campaign: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllMaps() {
  return prisma.map.findMany({
    include: { campaign: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function createMap(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const type = (formData.get("type") as string) || "other";
  const description = (formData.get("description") as string)?.trim() || null;
  const imageUrl = formData.get("imageUrl") as string;
  const campaignId = (formData.get("campaignId") as string) || null;

  if (!name || !imageUrl) {
    throw new Error("Nome e imagem são obrigatórios");
  }

  await prisma.map.create({
    data: {
      name,
      type,
      description,
      imageUrl,
      ...(campaignId && { campaignId }),
    },
  });

  revalidatePath("/ferramentas/mapas");
  if (campaignId) {
    revalidatePath(`/campanhas/${campaignId}`);
  }
}

export async function deleteMap(id: string) {
  const map = await prisma.map.findUnique({ where: { id } });
  if (!map) return;

  await prisma.map.delete({ where: { id } });

  revalidatePath("/ferramentas/mapas");
  if (map.campaignId) {
    revalidatePath(`/campanhas/${map.campaignId}`);
  }
}

export async function getCampaignsForSelect() {
  return prisma.campaign.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}
