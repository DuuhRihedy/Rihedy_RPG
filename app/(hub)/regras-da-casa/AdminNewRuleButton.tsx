"use client";

import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

export default function AdminNewRuleButton({
  variant = "primary",
  label = "Nova Regra",
}: {
  variant?: "primary" | "gold";
  label?: string;
}) {
  const { role } = useAuth();
  if (role !== "admin") return null;

  return (
    <Link href="/regras-da-casa/nova" className={`btn btn-${variant}`}>
      ✨ {label}
    </Link>
  );
}
