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

    if (token?.role === 'student') {
      return NextResponse.redirect(new URL('/dashboard/student', req.url));
    } else if (token?.role === 'teacher') {
      return NextResponse.redirect(new URL('/dashboard/teacher', req.url));
    } else {
      return NextResponse.redirect(new URL('/', req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*'],
};
