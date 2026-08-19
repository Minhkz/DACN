import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("user_accessToken")?.value;
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith("/api/proxy")) {
    const requestHeaders = new Headers(request.headers);
    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  if (!token) {
    const loginUrl = new URL("/signin", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/proxy/:path*", "/wishlist/:path*", "/checkout/:path*"],
};
