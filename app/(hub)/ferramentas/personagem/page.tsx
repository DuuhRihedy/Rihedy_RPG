import CharacterCreator from "@/components/CharacterCreator";
import "./personagem.css";

export default function PersonagemPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>🧙 Criação de Personagem</h1>
          <p>Wizard step-by-step para criar personagens D&D 3.5</p>
        </div>
      </div>
      <CharacterCreator />
    </div>
  );
}
