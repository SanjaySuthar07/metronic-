'use client';

import React, { use, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { MoveLeft, UserPen, LucideUserKey, HatGlassesIcon, User } from 'lucide-react';

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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { fetchInvitationDetail } from '@/store/thunk/invite.thunk';

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
  const pathname = usePathname();
  const activeTab = useMemo(() => {
    if (pathname.includes('/agent')) return 'agent';
    else if (pathname.includes('/permissions')) return 'permissions';
    else if (pathname.includes('/roles')) return 'roles';
    return 'general';
  }, [pathname]);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (id) {
      dispatch(fetchInvitationDetail({ id }));
    }
  }, [id, dispatch]);
  const { userDetail } = useSelector((state: any) => state.userManagement);
  const navRoutes = useMemo<NavRoutes>(
    () => ({
      general: {
        title: 'Profile',
        icon: UserPen,
        path: `/user-management/users/${id}`,
      },
      roles: {
        title: 'roles',
        icon: User,
        path: `/user-management/users/${id}/roles`,
      },
      permissions: {
        title: 'Permissions',
        icon: LucideUserKey,
        path: `/user-management/users/${id}/permissions`,
      },
      agent: {
        title: 'Agent',
        icon: HatGlassesIcon,
        path: `/user-management/users/${id}/agent`,
      },
    }),
    [id],
  );

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

      <UserHero user={userDetail} />

      <Tabs value={activeTab}>
        <TabsList variant="line" className="mb-5">
          {Object.entries(navRoutes).map(
            ([key, { title, icon: Icon, path }]) => (
              <TabsTrigger
                key={key}
                value={key}
                onClick={() => router.push(path)}
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