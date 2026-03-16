'use client';
import InviteUserProfile from './components/invite-user-profile';
import { useSelector } from 'react-redux';

export default function Page() {
  const { inviteDetail, loadingInvite } = useSelector((state: any) => state.invite);
  return (
    <div className="space-y-10">
      <InviteUserProfile user={inviteDetail} isLoading={loadingInvite} />
    </div>
  );
}