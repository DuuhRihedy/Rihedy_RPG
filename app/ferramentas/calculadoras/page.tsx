import CalculatorTool from "@/components/CalculatorTool";
import "./calculadoras.css";

export default function CalculadorasPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>🧮 Calculadoras D&D 3.5</h1>
          <p>Ferramentas de cálculo rápido para XP, CR, riqueza e crafting</p>
        </div>
      </div>
      <CalculatorTool />
    </div>
  );
}
