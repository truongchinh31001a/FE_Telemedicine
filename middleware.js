// middleware.js
import { NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;
const locales = ['en', 'vi'];

export function middleware(req) {
  const { nextUrl, headers, cookies } = req;
  const pathname = nextUrl.pathname;

  // Bỏ qua static files, API, _next
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // ✅ Tự thêm locale nếu thiếu
  const missingLocale = locales.every((locale) => !pathname.startsWith(`/${locale}`));
  if (missingLocale) {
    const langHeader = headers.get('accept-language') || 'vi';
    const preferredLocale = langHeader.split(',')[0].split('-')[0];
    const locale = locales.includes(preferredLocale) ? preferredLocale : 'vi';

    return NextResponse.redirect(new URL(`/${locale}${pathname}`, req.url));
  }

  // ✅ Kiểm tra token cho các path cần bảo vệ
  const currentLocale = pathname.split('/')[1]; // vi hoặc en
  const isProtectedPath = pathname.startsWith(`/${currentLocale}/main`);

  if (isProtectedPath) {
    const token = cookies.get('token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL(`/${currentLocale}/auth`, req.url));
    }

    try {
      const payload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString()
      );
      const isExpired = payload.exp * 1000 < Date.now();

      if (isExpired) {
        const res = NextResponse.redirect(new URL(`/${currentLocale}/auth`, req.url));
        res.cookies.delete('token');
        return res;
      }
    } catch (err) {
      return NextResponse.redirect(new URL(`/${currentLocale}/auth`, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
