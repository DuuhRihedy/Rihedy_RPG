import { getCharacter } from "@/lib/actions/characters";
import { notFound } from "next/navigation";
import CharacterSheet from "./CharacterSheet";
import "../personagem.css";

export default async function CharacterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const character = await getCharacter(id);
  if (!character) notFound();

  return (
    <div className="page-container">
      <CharacterSheet character={character as any} />
    </div>
  );
}
