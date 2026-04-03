import { NextRequest, NextResponse } from 'next/server';

import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  clearCookieOptions,
} from '@/lib/auth/cookies';
import { serverApi } from '@/lib/axios/server';

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  try {
    if (refreshToken) {
      await serverApi.post('/auth/logout', { refreshToken });
    }
  } catch {
    // Dù backend logout lỗi, frontend vẫn clear cookie
  }

  const res = NextResponse.json({
    success: true,
    message: 'Logout successful',
  });

  res.cookies.set(ACCESS_TOKEN_COOKIE, '', clearCookieOptions);
  res.cookies.set(REFRESH_TOKEN_COOKIE, '', clearCookieOptions);

  return res;
}
