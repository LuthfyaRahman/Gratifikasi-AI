import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/login' || pathname.startsWith('/_next') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('gratifikasi_token')?.value;

  // For SPA with localStorage auth, we allow the request through and let
  // client-side auth handle the redirect. The middleware checks a cookie fallback.
  if (!token && pathname !== '/login') {
    // We don't block here since token is in localStorage (client-side only).
    // The DashboardLayout will handle the redirect client-side.
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
