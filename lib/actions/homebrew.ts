"use server";

import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

function customIndex() {
  return `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function createCustomSpell(formData: FormData) {
  const name = formData.get("name") as string;
  if (!name) throw new Error("Nome é obrigatório");

  await prisma.srdSpell.create({
    data: {
      index: customIndex(),
      name,
      namePtBr: (formData.get("namePtBr") as string) || name,
      level: parseInt(formData.get("level") as string) || 0,
      school: (formData.get("school") as string) || "Evocation",
      castingTime: (formData.get("castingTime") as string) || "1 action",
      range: (formData.get("range") as string) || "30 feet",
      components: (formData.get("components") as string) || "V, S",
      duration: (formData.get("duration") as string) || "Instantaneous",
      description: (formData.get("description") as string) || "",
      descriptionPtBr: (formData.get("descriptionPtBr") as string) || "",
      classes: (formData.get("classes") as string) || "",
      edition: "3.5",
      source: "custom",
    },
  });

  redirect("/ferramentas/homebrew");
}

export async function createCustomFeat(formData: FormData) {
  const name = formData.get("name") as string;
  if (!name) throw new Error("Nome é obrigatório");

  await prisma.srdFeat.create({
    data: {
      index: customIndex(),
      name,
      namePtBr: (formData.get("namePtBr") as string) || name,
      description: (formData.get("description") as string) || "",
      descriptionPtBr: (formData.get("descriptionPtBr") as string) || "",
      prerequisites: (formData.get("prerequisites") as string) || null,
      edition: "3.5",
      source: "custom",
    },
  });

  redirect("/ferramentas/homebrew");
}

export async function createCustomEquipment(formData: FormData) {
  const name = formData.get("name") as string;
  if (!name) throw new Error("Nome é obrigatório");

  await prisma.srdEquipment.create({
    data: {
      index: customIndex(),
      name,
      namePtBr: (formData.get("namePtBr") as string) || name,
      category: (formData.get("category") as string) || "Weapon",
      cost: (formData.get("cost") as string) || "0 gp",
      weight: parseFloat(formData.get("weight") as string) || 0,
      damage: (formData.get("damage") as string) || null,
      properties: (formData.get("properties") as string) || null,
      description: (formData.get("description") as string) || null,
      descriptionPtBr: (formData.get("descriptionPtBr") as string) || null,
      edition: "3.5",
      source: "custom",
    },
  });

  redirect("/ferramentas/homebrew");
}

export async function getCustomContent() {
  const [spells, feats, equipment] = await Promise.all([
    prisma.srdSpell.findMany({ where: { source: "custom" }, orderBy: { name: "asc" } }),
    prisma.srdFeat.findMany({ where: { source: "custom" }, orderBy: { name: "asc" } }),
    prisma.srdEquipment.findMany({ where: { source: "custom" }, orderBy: { name: "asc" } }),
  ]);
  return { spells, feats, equipment };
}

export async function deleteCustomSpell(id: string) {
  await prisma.srdSpell.delete({ where: { id } });
  redirect("/ferramentas/homebrew");
}

export async function deleteCustomFeat(id: string) {
  await prisma.srdFeat.delete({ where: { id } });
  redirect("/ferramentas/homebrew");
}

export async function deleteCustomEquipment(id: string) {
  await prisma.srdEquipment.delete({ where: { id } });
  redirect("/ferramentas/homebrew");
}
