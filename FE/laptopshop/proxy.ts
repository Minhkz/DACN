import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname, search } = request.nextUrl;

  if (!token) {
    const loginUrl = new URL("/signin", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname + search);

    // Nếu là API thì trả 401
    if (pathname.startsWith("/api/proxy")) {
      return NextResponse.json(
        {
          message: "Unauthorized",
          redirectTo: loginUrl.pathname + loginUrl.search,
        },
        { status: 401 },
      );
    }

    // Nếu là page thì redirect thẳng
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/wishlist/:path*",
    "/checkout/:path*",
    "/api/proxy/orders/:path*",
    "/api/proxy/reviews/:path*",
  ],
};
