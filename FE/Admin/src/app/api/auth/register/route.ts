import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

import { ResponseResult } from '@/types/common/ResponseResult';
import { serverApi } from '@/lib/axios/server';

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone: string;
  address: string;
}
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RegisterPayload;

    const { data } = await serverApi.post<ResponseResult<string>>(
      '/auth/register',
      body
    );

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        error.response?.data ?? { message: 'Register failed' },
        { status: error.response?.status ?? 500 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
