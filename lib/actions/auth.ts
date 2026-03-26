"use server";

import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { signToken, setSessionCookie, clearSessionCookie, getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function login(prevState: { error?: string } | null, formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Preencha email e senha" };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return { error: "Email ou senha incorretos" };
    }

    const token = await signToken({
      userId: user.id,
      role: user.role as "admin" | "user",
    });

    await setSessionCookie(token);
  } catch (err) {
    console.error("[login] Erro:", err);
    return { error: "Erro interno ao fazer login" };
  }

  redirect("/");
}

export async function logout() {
  await clearSessionCookie();
  redirect("/login");
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { name: true, email: true, role: true },
    });
    return user;
  } catch {
    return null;
  }
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role?: "admin" | "user";
}) {
  const hash = await bcrypt.hash(data.password, 12);
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase().trim(),
      password: hash,
      role: data.role || "user",
    },
  });
}
