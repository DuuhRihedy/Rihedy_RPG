import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ChatSidebar } from "@/components/layout/ChatSidebar";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import { EditionProvider } from "@/lib/EditionContext";
import { AuthProvider } from "@/lib/AuthContext";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function HubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { name: true, role: true },
  });

  if (!user) redirect("/login");

  return (
    <AuthProvider user={{ name: user.name, role: user.role as "admin" | "user" }}>
      <EditionProvider>
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
      </EditionProvider>
    </AuthProvider>
  );
}
