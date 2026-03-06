'use client';

import React, { use, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Activity, MoveLeft, UserPen } from 'lucide-react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Container } from '@/components/common/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
  ToolbarTitle,
} from '@/components/common/toolbar';

import UserHero from './components/user-hero';

type NavRoutes = Record<
  string,
  {
    title: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    path: string;
  }
>;

export default function UserLayout({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {

  const { id } = use(params);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<string>('general');

  // Dummy user data
  const user = {
    id,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
  };

  const navRoutes = useMemo<NavRoutes>(
    () => ({
      general: {
        title: 'Profile',
        icon: UserPen,
        path: `/user-management/users/${id}`,
      },
      logs: {
        title: 'Activity Logs',
        icon: Activity,
        path: `/user-management/users/${id}/logs`,
      },
    }),
    [id],
  );

  const handleTabClick = (key: string, path: string) => {
    setActiveTab(key);
    router.push(path);
  };

  return (
    <Container>
      <Toolbar>
        <ToolbarHeading>
          <ToolbarTitle>User</ToolbarTitle>

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbPage>User Management</BreadcrumbPage>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbLink href="/user-management/users">
                  Users
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </ToolbarHeading>

        <ToolbarActions>
          <Button asChild variant="outline">
            <Link href="/user-management/users">
              <MoveLeft />
              Back to users
            </Link>
          </Button>
        </ToolbarActions>
      </Toolbar>

      {/* Dummy User Hero */}
      <UserHero user={user} />

      <Tabs value={activeTab}>
        <TabsList variant="line" className="mb-5">
          {Object.entries(navRoutes).map(
            ([key, { title, icon: Icon, path }]) => (
              <TabsTrigger
                key={key}
                value={key}
                onClick={() => handleTabClick(key, path)}
              >
                <Icon />
                <span>{title}</span>
              </TabsTrigger>
            ),
          )}
        </TabsList>
      </Tabs>

      {children}
    </Container>
  );
}