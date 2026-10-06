import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

// Runs before every matched request and applies the "authorized" rule.
// Uses only the light config: no bcrypt and no database here.
export default NextAuth(authConfig).auth;

export const config = {
  // Run on every route except API, Next.js internals and image files
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)$).*)',
  ],
};