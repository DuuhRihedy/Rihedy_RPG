import AssistantChat from "./AssistantChat";
import "./assistente.css";

export default function AssistantPage() {
  return (
    <div className="page-container" style={{ padding: 0, maxWidth: "100%" }}>
      <AssistantChat />
    </div>
  );
}
