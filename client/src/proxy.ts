import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE = "todo_app_auth";
const PUBLIC_ROUTES = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAuth = request.cookies.has(AUTH_COOKIE);
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(hasAuth ? "/tasks" : "/login", request.url)
    );
  }

  if (!hasAuth && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (hasAuth && isPublicRoute) {
    return NextResponse.redirect(new URL("/tasks", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
