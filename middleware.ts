import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_KEY = "portfolio_admin_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // The /admin hub renders the login screen itself, so always allow it.
  if (pathname === "/admin" || pathname === "/admin/") {
    return NextResponse.next();
  }

  const token = req.cookies.get(AUTH_KEY)?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
