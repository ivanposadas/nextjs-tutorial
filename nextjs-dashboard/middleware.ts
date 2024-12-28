import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './auth';

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const isPublicPath = pathname === '/login' || 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api');

  // Check if the user is authenticated
  const isAuthenticated = !!session?.user;

  // Redirect authenticated users away from login page
  if (isPublicPath && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users to login page
  if (!isPublicPath && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};