import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("hub-rpg-session")?.value;
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/login";
  const isTalespireApi =
    pathname.startsWith("/api/characters") ||
    pathname.startsWith("/api/npcs") ||
    pathname.startsWith("/api/assistant/chat");
  const isPublicApi = 
    pathname.startsWith("/api/health") || 
    pathname.startsWith("/api/srd") || 
    isTalespireApi ||
    pathname.startsWith("/talespire") || 
    pathname === "/manifest.webmanifest";

  // Agrega cabeçalhos de CORS nas rotas do TaleSpire e SRD para evitar bloqueios no Chromium embarcado
  if (isPublicApi) {
    const response = NextResponse.next();
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    return response;
  }

  if (!token) {
    if (isLoginPage) return NextResponse.next();
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const session = await verifyToken(token);
  if (!session) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("hub-rpg-session");
    return response;
  }

  // Já logado tentando acessar login → redireciona pro hub
  if (isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sw.js|icons/).*)",
  ],
};
