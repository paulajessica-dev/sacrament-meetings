import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { authConfig } from './auth.config';
import { getUserByEmail } from '@/lib/users-db';

const CredentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        // 1. Are email and password in the right format?
        const parsed = CredentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // 2. Does this user exist?
        const user = await getUserByEmail(email);
        if (!user) return null;

        // 3. Does the typed password match the saved hash?
        const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordsMatch) return null;

        // 4. Success: this becomes the session's user (never include the hash)
        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
});