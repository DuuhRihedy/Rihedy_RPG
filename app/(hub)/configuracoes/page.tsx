import AiConfigForm from "./AiConfigForm";
import "./configuracoes.css";

export default function ConfiguracoesPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>⚙️ Configurações</h1>
          <p>Gerencie o provedor de IA e preferências do sistema</p>
        </div>
      </div>
      <AiConfigForm />
    </div>
  );
}
