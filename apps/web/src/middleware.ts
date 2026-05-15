import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('google_id_token')?.value;
  const pathname = request.nextUrl.pathname;

  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (pathname === '/dashboard' && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (pathname === '/auth/callback' && !token) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/dashboard', '/auth/callback'],
};
