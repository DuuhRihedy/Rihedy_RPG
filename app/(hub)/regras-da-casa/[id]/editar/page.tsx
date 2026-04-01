import { getHouseRule } from "@/lib/actions/house-rules";
import { notFound } from "next/navigation";
import HouseRuleEditClient from "./HouseRuleEditClient";
import "../../regras.css";

export const dynamic = "force-dynamic";

export default async function EditarRegraPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rule = await getHouseRule(id);
  if (!rule) notFound();

  return (
    <HouseRuleEditClient
      rule={{
        id: rule.id,
        title: rule.title,
        icon: rule.icon,
        category: rule.category,
        summary: rule.summary,
        content: rule.content,
        pinned: rule.pinned,
      }}
    />
  );
}
