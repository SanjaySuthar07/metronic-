import { Metadata } from 'next';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Container } from '@/components/common/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
  ToolbarTitle,
} from '@/components/common/toolbar';
import PermissionList from './components/permission-list';

export const metadata: Metadata = {
  title: 'Permissions',
  description: 'Manage permissions.',
};

export default async function Page() {
  return (
    <>
      <Container>
        <PermissionList />
      </Container>
    </>
  );
}
