// middleware.js
import { NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(req) {
  const { nextUrl, headers } = req;
  const pathname = nextUrl.pathname;

  // Bỏ qua các request tới static files, API, hoặc _next
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Các locale hỗ trợ
  const locales = ['en', 'vi'];

  // Kiểm tra nếu URL chưa có locale
  const pathnameMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}`)
  );

  if (pathnameMissingLocale) {
    // Lấy header ngôn ngữ từ trình duyệt
    const acceptLang = headers.get('accept-language');
    const preferredLocale = acceptLang ? acceptLang.split(',')[0].split('-')[0] : 'vi';
    const locale = locales.includes(preferredLocale) ? preferredLocale : 'vi';

    // Redirect sang URL có locale
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
