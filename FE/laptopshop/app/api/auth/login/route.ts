import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  accessCookieOptions,
  refreshCookieOptions,
} from '@/lib/auth/cookies';
import { serverApi } from '@/lib/axios/server';
import { ResponseResult } from '@/types/common/ResponseResult';

interface LoginPayload {
  username: string;
  password: string;
}

interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LoginPayload;

    const { data } = await serverApi.post<ResponseResult<LoginResponseData>>(
      '/auth/login',
      body
    );

    if (!data?.data?.accessToken || !data?.data?.refreshToken) {
      return NextResponse.json(
        { success: false, message: 'Thiếu token từ server' },
        { status: 500 }
      );
    }

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
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        error.response?.data ?? {
          success: false,
          message: 'Đăng nhập thất bại',
        },
        { status: error.response?.status ?? 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Lỗi máy chủ nội bộ',
      },
      { status: 500 }
    );
  }
}
