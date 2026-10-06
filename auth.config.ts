import type { NextAuthConfig } from 'next-auth';
import { NextResponse } from 'next/server';

// Only these routes require login. Everything else stays public.
function isProtectedRoute(pathname: string) {
  return pathname === '/meetings/new' || /^\/meetings\/[^/]+\/edit$/.test(pathname);
}

export const authConfig = {
  pages: {
    signIn: '/login', // where to send visitors who are not logged in
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      // Already logged in? No reason to see the login page again.
      if (nextUrl.pathname === '/login' && isLoggedIn) {
        return NextResponse.redirect(new URL('/meetings', nextUrl));
      }

      // Returning false sends the visitor to the login page
      if (isProtectedRoute(nextUrl.pathname)) {
        return isLoggedIn;
      }

      return true;
    },
  },
  providers: [], // the real provider lives in auth.ts
} satisfies NextAuthConfig;