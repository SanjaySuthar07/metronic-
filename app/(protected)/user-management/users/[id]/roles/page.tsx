import { Metadata } from 'next';
import RolesList from './components/role-list';
export const metadata: Metadata = {
  title: 'Roles',
  description: 'Manage Roles.',
};
export default async function Page() {
  return (
    <>
      <RolesList />
    </>
  );
}
