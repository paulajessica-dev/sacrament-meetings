import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set. Check your .env.local file.');
}
const sql = neon(databaseUrl);

export type User = {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
};

// Used only by the login flow, to compare the typed password with the saved hash
export async function getUserByEmail(email: string): Promise<User | null> {
  const rows = await sql`
    SELECT id, name, email, password_hash AS "passwordHash"
    FROM users
    WHERE email = ${email.toLowerCase()}
  `;
  return (rows[0] as User | undefined) ?? null;
}