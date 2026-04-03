import { serverApi } from './../../../../lib/axios/server';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  accessCookieOptions,
  clearCookieOptions,
  refreshCookieOptions,
} from '@/lib/auth/cookies';
import { ResponseResult } from '@/types/common/ResponseResult';

interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { message: 'Refresh token not found' },
      { status: 401 }
    );
  }

  try {
    const { data } = await serverApi.post<ResponseResult<LoginResponseData>>(
      '/auth/refresh-token',
      { refreshToken }
    );

    const res = NextResponse.json({
      success: true,
      message: data.message,
    });

    res.cookies.set(
      ACCESS_TOKEN_COOKIE,
      data.data.accessToken,
      accessCookieOptions
    );
    res.cookies.set(
      REFRESH_TOKEN_COOKIE,
      data.data.refreshToken,
      refreshCookieOptions
    );

    return res;
  } catch (error) {
    const res = NextResponse.json(
      { message: 'Session expired' },
      { status: 401 }
    );

    res.cookies.set(ACCESS_TOKEN_COOKIE, '', clearCookieOptions);
    res.cookies.set(REFRESH_TOKEN_COOKIE, '', clearCookieOptions);

    if (axios.isAxiosError(error)) {
      return res;
    }

    return res;
  }
}
