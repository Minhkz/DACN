import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // 1. Lấy token từ cookie của request
  // (Giả sử bạn lưu token trong cookie với tên là 'accessToken')
  const token = request.cookies.get("accessToken")?.value;

  // 2. Lấy URL hiện tại
  const { pathname } = request.nextUrl;

  // 3. Nếu không có token, chuyển hướng người dùng về trang đăng nhập
  if (!token) {
    const loginUrl = new URL("/signin", request.url);
    // Bạn có thể lưu lại trang người dùng đang muốn vào để redirect lại sau khi login thành công
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Nếu có token, cho phép tiếp tục
  return NextResponse.next();
}

// Xác định các route mà middleware này sẽ chạy
export const config = {
  matcher: ["/wishlist/:path*", "/checkout/:path*"],
};
