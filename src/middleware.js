import { NextResponse } from 'next/server';

export function middleware(request) {
  const path = request.nextUrl.pathname;

  // Protect all /admin routes except /admin/login
  const isProtectedRoute = path.startsWith('/admin') && path !== '/admin/login';
  
  // Also protect API routes that modify data (POST, PUT, DELETE)
  const isProtectedApiRoute = (path.startsWith('/api/vehicles') || path.startsWith('/api/staff') || path.startsWith('/api/upload')) && request.method !== 'GET';

  if (isProtectedRoute || isProtectedApiRoute) {
    const session = request.cookies.get('admin_session');

    if (!session || session.value !== 'authenticated') {
      if (isProtectedApiRoute) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // If trying to access login page while already authenticated
  if (path === '/admin/login') {
    const session = request.cookies.get('admin_session');
    if (session && session.value === 'authenticated') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/vehicles/:path*',
    '/api/staff/:path*',
    '/api/upload',
  ],
};
