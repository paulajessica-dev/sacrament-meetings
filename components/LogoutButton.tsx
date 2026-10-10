import { logout } from '@/lib/actions';

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button type="submit" className="text-blue-100 hover:underline px-3 py-1">
        Log out
      </button>
    </form>
  );
}