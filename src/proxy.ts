import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "admin_session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow the login page and its actions through unconditionally
  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const loggedIn = request.cookies.get(SESSION_COOKIE)?.value === "1";

  if (!loggedIn) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
