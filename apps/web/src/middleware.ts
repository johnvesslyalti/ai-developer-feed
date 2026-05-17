import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('google_id_token')?.value;
  const { pathname } = request.nextUrl;

  const protected_ = ['/feed', '/onboarding', '/dashboard'];
  if (protected_.some((p) => pathname.startsWith(p)) && !token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/feed/:path*', '/onboarding/:path*', '/dashboard/:path*'],
};
