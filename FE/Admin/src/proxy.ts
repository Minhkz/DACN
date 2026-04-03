import { NextRequest, NextResponse } from 'next/server';
import { serverApi } from './lib/axios/server';

const adminPaths = ['/', '/users', '/products', '/filters'];
const authPaths = ['/signin', '/signup'];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get('accessToken')?.value;

  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));
  const isAdminPath = adminPaths.some((path) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path)
  );

  if (isAuthPath && accessToken) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (isAdminPath) {
    if (!accessToken) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }

    try {
      const response = await serverApi.get('/profile/me');
      const currentUser = response.data.data;

      if (currentUser.roleId !== 'ADMIN') {
        return NextResponse.redirect(new URL('/error-401', req.url));
      }
    } catch (error: any) {
      const status = error?.response?.status ?? 'unknown';
      const message =
        error?.response?.data?.message ??
        error?.response?.data?.error ??
        'proxy_error';

      const url = new URL('/signin', req.url);
      url.searchParams.set('reason', String(message));
      url.searchParams.set('status', String(status));

      const response = NextResponse.redirect(url);
      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
