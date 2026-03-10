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
