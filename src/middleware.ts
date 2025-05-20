import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';
import type { NextFetchEvent } from 'next/server';
import type { JWT } from 'next-auth/jwt';

export default withAuth(
  async function middleware(
    req: NextRequest & { nextauth: { token: JWT | null } },
    event: NextFetchEvent
  ) {
    const token = req.nextauth.token;

    if (!token) {
      const url = new URL('/', req.url);
      url.searchParams.set('authModal', 'true'); 
      return NextResponse.redirect(url);
    }

    return NextResponse.next(); 
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, 
    },
  }
);

export const config = {
  matcher: [
    '/create-course',
    '/create-course/:path*',
    '/dashboard/:path*',
    '/profile',
    '/courses/:id',
  ],
};
