import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * Retorna o filtro WHERE para visibilidade de conteúdo.
 *
 * Regra:
 * - Admin vê TUDO (conteúdo de todos)
 * - User vê: seus próprios + de outros users (NÃO vê o que admin criou)
 * - Conteúdo sem createdById (legado) é visível para todos
 */
export async function getVisibilityFilter() {
  const session = await getSession();
  if (!session) return { createdById: "__none__" };

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { role: true },
  });

  if (!user) return { createdById: "__none__" };

  // Admin vê tudo
  if (user.role === "admin") return {};

  // User: buscar IDs de admins para excluir
  const admins = await prisma.user.findMany({
    where: { role: "admin" },
    select: { id: true },
  });
  const adminIds = admins.map((a) => a.id);

  // Não vê conteúdo criado por admins (mas vê conteúdo sem dono / legado)
  return {
    OR: [
      { createdById: null },
      { createdById: { notIn: adminIds } },
    ],
  };
}

/**
 * Retorna o userId da sessão atual para usar em criação de conteúdo.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getSession();
  return session?.userId || null;
}
