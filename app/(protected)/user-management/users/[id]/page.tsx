'use client';
import { useSearchParams } from 'next/navigation';
import UserDangerZone from './components/user-danger-zone';
import UserProfile from './components/user-profile';
import { useSelector } from 'react-redux';

export default function Page() {
  const searchParams = useSearchParams();
  const id = searchParams?.get('id') || null;
  const user = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
  };

  const isLoading = false;
  const { userDetail, loadingUserDetail } = useSelector(
    (state: any) => state.userManagement
  );
  console.log(userDetail)
  return (
    <div className="space-y-10">
      <UserProfile user={userDetail} isLoading={loadingUserDetail} />
      <UserDangerZone user={userDetail} isLoading={loadingUserDetail} />
    </div>
  );
}