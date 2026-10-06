import type { Metadata } from 'next';
import LoginForm from '@/components/LoginForm';

export const metadata: Metadata = {
  title: 'Log in | Sacrament Meeting Planner',
};

// Auth.js sends the full address the visitor tried to open (http://.../meetings/new).
// Keep only the path, so the redirect can never leave this site.
function toSafePath(callbackUrl: string | string[] | undefined): string {
  if (typeof callbackUrl !== 'string') return '/meetings';

  try {
    const url = new URL(callbackUrl, 'http://localhost');
    const path = url.pathname + url.search;
    return path.startsWith('//') ? '/meetings' : path;
  } catch {
    return '/meetings';
  }
}

export default async function LoginPage(props: {
  searchParams?: Promise<{ callbackUrl?: string | string[] }>;
}) {
  const searchParams = await props.searchParams;

  return (
    <div className="mx-auto max-w-sm">
      <h2 className="mb-6 text-2xl font-bold">Log in</h2>
      <LoginForm redirectTo={toSafePath(searchParams?.callbackUrl)} />
    </div>
  );
}