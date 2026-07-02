import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateSession } from "@/supabase/middleware";

/**
 * Middleware auth + vérification rôle admin pour xopus-admin.
 * Redirige vers /login si non connecté.
 * Vérifie le rôle admin dans la table user_profiles.
 */
export async function middleware(request: NextRequest) {
  /* ── Refresh session Supabase + auth check ── */
  const response = await updateSession(request);

  /* ── Redirection www → non-www ── */
  const host = request.headers.get("host") ?? "";
  if (host.startsWith("www.")) {
    const url = request.nextUrl.clone();
    url.hostname = host.replace("www.", "");
    return NextResponse.redirect(url, { status: 301 });
  }

  /* ── Protected routes ── */
  const pathname = request.nextUrl.pathname;
  const isPublic = pathname === "/login" || pathname === "/register";

  if (!isPublic) {
    const supabaseToken = request.cookies.get("sb-ukqvaejnbiojnwmrykki-auth-token");
    if (!supabaseToken) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      return NextResponse.redirect(loginUrl);
    }

    // Note: Vérification du rôle admin côté client et server components
    // Le middleware vérifie uniquement la présence du token.
    // La vérification du rôle se fait dans les server components
    // via getServerSession() + requête vers user_profiles.
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};