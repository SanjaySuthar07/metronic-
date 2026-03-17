'use client';

import React, { use, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { MoveLeft, UserPen } from 'lucide-react';

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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { fetchInvitationDetail } from '@/store/thunk/invite.thunk';
import InviteUserHero from './components/invite-user-hero';

type NavRoutes = Record<
  string,
  {
    title: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    path: string;
  }
>;

export default function InviteUserLayout({
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
  const { inviteDetail } = useSelector((state: any) => state.invite);
  const navRoutes = useMemo<NavRoutes>(
    () => ({
      general: {
        title: 'Profile',
        icon: UserPen,
        path: `/invite/${id}`,
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
                <BreadcrumbPage>Invite</BreadcrumbPage>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbLink href="/user-management/users">

                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </ToolbarHeading>

        <ToolbarActions>
          <Button asChild variant="outline">
            <Link href="/invitation">
              <MoveLeft />
              Back to Invite
            </Link>
          </Button>
        </ToolbarActions>
      </Toolbar>

      <InviteUserHero inviteUser={inviteDetail} />

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