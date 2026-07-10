import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('🔥 MIDDLEWARE JALAN:', request.nextUrl.pathname);
  const token = request.cookies.get('jwt_token')?.value;
  const userRole = request.cookies.get('user_role')?.value;
  const { pathname } = request.nextUrl;

  // Jika jwt_token tidak ada DAN path termasuk dalam daftar protected routes -> redirect ke /login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Jika path dimulai dengan /admin DAN user_role bukan "admin" -> redirect ke /dashboard
  if (pathname.startsWith('/admin') && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Jika path TERMASUK salah satu dari user routes, DAN user_role adalah "admin" -> redirect ke /admin/dashboard
  const isUserRoute =
    pathname === '/dashboard' ||
    pathname === '/pembayaran' ||
    pathname === '/riwayat' ||
    pathname === '/invoice' ||
    pathname === '/profile' ||
    pathname === '/verifikasi-pending' ||
    pathname.startsWith('/lapangan/') ||
    pathname.startsWith('/booking/');

  if (isUserRoute && userRole === 'admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard',
    '/pembayaran',
    '/riwayat',
    '/invoice',
    '/profile',
    '/verifikasi-pending',
    '/lapangan/:path*',
    '/booking/:path*',
  ],
};
