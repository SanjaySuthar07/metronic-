import { Metadata } from 'next';
import UserList from './components/user-list';
export const metadata: Metadata = {
  title: 'Users',
  description: 'Manage users.',
};

export default async function Page() {
  return (
    <>
      <UserList />
    </>
  );
}
