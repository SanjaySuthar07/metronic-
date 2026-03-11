import { Metadata } from 'next';
import AgentList from './components/agent-list';
export const metadata: Metadata = {
  title: 'Users',
  description: 'Manage users.',
};

export default async function Page() {
  return (
    <>
      <AgentList />
    </>
  );
}
