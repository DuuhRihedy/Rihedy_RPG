import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ChatSidebar } from "@/components/layout/ChatSidebar";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";

export default function HubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">
        <Header />
        <main className="app-content">
          {children}
        </main>
      </div>
      <ChatSidebar />
      <KeyboardShortcuts />
    </div>
  );
}
