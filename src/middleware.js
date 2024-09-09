// middleware.ts
import { NextResponse } from "next/server";
import { getCookie } from "cookies-next";

const publicRoutes = ["/", "/authentication"];
const authenticationRoute = "/authentication";
export function middleware(req) {
  const { pathname } = req.nextUrl;

  const token = getCookie(process.env.NEXT_PUBLIC_COOKIES_ACCESS_TOKEN, {
    req,
  });
  console.log(token);
  const isPublicRoute = publicRoutes.some((route) =>
    new RegExp(`^${route}$`).test(pathname)
  );

  // If no token and accessing a public route, allow access
  if (!token && isPublicRoute) {
    return NextResponse.next();
  }

  // If no token and accessing a private route, redirect to auth
  if (!token) {
    return NextResponse.redirect(new URL(authenticationRoute, req.url));
  }

  // If token exists and user is trying to access the auth route, redirect to home
  if (token && pathname.startsWith(authenticationRoute)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If token exists and accessing any route, allow access
  if (token) {
    return NextResponse.next();
  }

  // Default response if no conditions are met
  return NextResponse.redirect(new URL("/auth/authentication", req.url));
}

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   */
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"], // Apply the middleware globally
};
