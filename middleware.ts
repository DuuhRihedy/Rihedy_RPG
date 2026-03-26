import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("hub-rpg-session")?.value;
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/login";
  const isPublicApi = pathname.startsWith("/api/health") || pathname === "/manifest.webmanifest";

  // Rotas públicas: não precisa de auth
  if (isPublicApi) return NextResponse.next();

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
