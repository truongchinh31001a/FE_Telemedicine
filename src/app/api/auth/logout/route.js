// app/api/auth/logout/route.js
import { NextResponse } from 'next/server';

export async function POST() {
  const isProd = process.env.NODE_ENV === 'production';

  const res = NextResponse.json({ success: true });

  res.cookies.set('token', '', {
    httpOnly: true,
    secure: isProd,
    sameSite: 'Lax',
    path: '/',
    expires: new Date(0), // ✅ Xoá cookie bằng cách đặt thời gian hết hạn trong quá khứ
  });

  return res;
}
