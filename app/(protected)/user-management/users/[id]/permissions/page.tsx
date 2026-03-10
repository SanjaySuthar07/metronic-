import { Metadata } from 'next';
import PermissionList from './components/permission-list';
export const metadata: Metadata = {
  title: 'Permissions',
  description: 'Manage permissions.',
};

export default async function Page() {
  return (
    <>
      <PermissionList />
    </>
  );
}
