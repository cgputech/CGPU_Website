import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareClient } from "@/utils/supabase/middleware";
import {
  ADMIN_ACCESS_COOKIE,
  getAdminAccessCookieOptions,
  isAdminEmail,
  validateAdminToken,
} from "@/services/auth/auth";

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const { supabase, applySessionCookies } = createMiddlewareClient(request);

  const hasSupabaseAdminSession = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return Boolean(user && isAdminEmail(user.email));
  };

  // Login page is public; still refresh Supabase session cookies when present.
  if (pathname === "/admin/login") {
    await supabase.auth.getUser();
    return applySessionCookies(NextResponse.next());
  }

  const token = searchParams.get("token");

  // Valid URL token → set admin_access cookie and redirect to a clean URL.
  if (token !== null) {
    if (!validateAdminToken(token)) {
      return applySessionCookies(
        NextResponse.rewrite(new URL("/not-found", request.url)),
      );
    }

    const cleanUrl = new URL(pathname, request.url);
    searchParams.forEach((value, key) => {
      if (key !== "token") cleanUrl.searchParams.set(key, value);
    });

    const redirectResponse = NextResponse.redirect(cleanUrl);
    redirectResponse.cookies.set(
      ADMIN_ACCESS_COOKIE,
      "true",
      getAdminAccessCookieOptions(),
    );
    await supabase.auth.getUser();
    return applySessionCookies(redirectResponse);
  }

  // Token-based cookie gate (no Supabase required).
  if (request.cookies.get(ADMIN_ACCESS_COOKIE)?.value === "true") {
    await supabase.auth.getUser();
    return applySessionCookies(NextResponse.next());
  }

  // Supabase email/password session for configured admin email.
  if (await hasSupabaseAdminSession()) {
    return applySessionCookies(NextResponse.next());
  }

  return applySessionCookies(
    NextResponse.rewrite(new URL("/not-found", request.url)),
  );
}

export const config = {
  matcher: ["/admin/:path*"],
};
