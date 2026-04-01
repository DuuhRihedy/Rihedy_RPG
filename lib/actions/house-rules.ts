"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ── Listar todas ──
export async function getHouseRules() {
  return prisma.houseRule.findMany({
    orderBy: [{ pinned: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

// ── Buscar por ID ──
export async function getHouseRule(id: string) {
  return prisma.houseRule.findUnique({ where: { id } });
}

// ── Buscar por slug ──
export async function getHouseRuleBySlug(slug: string) {
  return prisma.houseRule.findUnique({ where: { slug } });
}

// ── Criar ──
export async function createHouseRule(formData: FormData) {
  const title = formData.get("title") as string;
  if (!title?.trim()) throw new Error("Título é obrigatório");

  const icon = (formData.get("icon") as string) || "📜";
  const category = (formData.get("category") as string) || "geral";
  const summary = (formData.get("summary") as string) || null;
  const content = (formData.get("content") as string) || "";

  let slug = slugify(title);
  const existing = await prisma.houseRule.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  const rule = await prisma.houseRule.create({
    data: { title, slug, icon, category, summary, content },
  });

  revalidatePath("/regras-da-casa");
  redirect(`/regras-da-casa/${rule.id}/editar`);
}

// ── Atualizar ──
export async function updateHouseRule(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  if (!title?.trim()) throw new Error("Título é obrigatório");

  const icon = (formData.get("icon") as string) || "📜";
  const category = (formData.get("category") as string) || "geral";
  const summary = (formData.get("summary") as string) || null;
  const content = (formData.get("content") as string) || "";
  const pinned = formData.get("pinned") === "true";

  await prisma.houseRule.update({
    where: { id },
    data: { title, icon, category, summary, content, pinned },
  });

  revalidatePath("/regras-da-casa");
  revalidatePath(`/regras-da-casa/${id}`);
}

// ── Deletar ──
export async function deleteHouseRule(id: string) {
  await prisma.houseRule.delete({ where: { id } });
  revalidatePath("/regras-da-casa");
  redirect("/regras-da-casa");
}

// ── Toggle pin ──
export async function togglePinHouseRule(id: string) {
  const rule = await prisma.houseRule.findUnique({ where: { id } });
  if (!rule) throw new Error("Regra não encontrada");

  await prisma.houseRule.update({
    where: { id },
    data: { pinned: !rule.pinned },
  });

  revalidatePath("/regras-da-casa");
}
