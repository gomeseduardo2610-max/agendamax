import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'agendamax_super_secret_jwt_key_2026_saas'
);

const protectedRoutes = [
  '/dashboard',
  '/agenda',
  '/clientes',
  '/funcionarios',
  '/servicos',
  '/financeiro',
  '/relatorios',
  '/configuracoes',
];

const authRoutes = ['/login', '/cadastrar'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('agendamax_session')?.value;

  let isAuthenticated = false;
  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  // Redirect unauthenticated visitors trying to access private dashboard pages
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from login/register to dashboard
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/agenda/:path*',
    '/clientes/:path*',
    '/funcionarios/:path*',
    '/servicos/:path*',
    '/financeiro/:path*',
    '/relatorios/:path*',
    '/configuracoes/:path*',
    '/login',
    '/cadastrar',
  ],
};
