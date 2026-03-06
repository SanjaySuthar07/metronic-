'use client';
import { useSearchParams } from 'next/navigation';
import UserDangerZone from './components/user-danger-zone';
import UserProfile from './components/user-profile';

export default function Page() {
  const searchParams = useSearchParams();
  const id = searchParams?.get('id') || null;
  alert(id)
  const user = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
  };

  const isLoading = false;
  return (
    <div className="space-y-10">
      <UserProfile user={user} isLoading={isLoading} />
      <UserDangerZone user={user} isLoading={isLoading} />
    </div>
  );
}