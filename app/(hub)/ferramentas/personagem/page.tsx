import { getCharacters, getCampaignsForCharacter } from "@/lib/actions/characters";
import CharacterList from "./CharacterList";
import "./personagem.css";

export default async function PersonagemPage() {
  const [characters, campaigns] = await Promise.all([
    getCharacters(),
    getCampaignsForCharacter(),
  ]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>🧙 Personagens</h1>
          <p>Crie e gerencie fichas de personagem para D&D 3.5 e 5e</p>
        </div>
      </div>
      <CharacterList
        initialCharacters={characters as any}
        campaigns={campaigns as any}
      />
    </div>
  );
}
