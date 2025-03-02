import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export { default } from "next-auth/middleware";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXT_AUTH_SECRET,
  });

  const currentUrl = req.nextUrl;

  // client side redirect

  if (
    token &&
    (currentUrl.pathname.startsWith("/advocates/login") ||
      currentUrl.pathname.startsWith("/advocates/register"))
  ) {
    return NextResponse.redirect(new URL("/advocates/post-content", req.url));
  }

  if (!token && currentUrl.pathname.startsWith("/advocates/profile")) {
    return NextResponse.redirect(new URL("/advocates/login", req.url));
  }
}

export const config = {
  matcher: [
    "/advocates/login",
    "/advocates/register",
    "/advocates/profile",
    "/advocates/post-content",
  ],
};
