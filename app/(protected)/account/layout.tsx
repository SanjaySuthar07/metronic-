'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { MoveLeft, SquarePen, UserPen } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { getInitials } from '@/lib/helpers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Container } from '@/components/common/container';
import { DashboardHeader } from '../components/dashboardHeader';
import { Button } from '@/components/ui/button';

type NavRoutes = Record<
  string,
  {
    title: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    path: string;
  }
>;

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const { user } = useSelector((state: RootState) => state.auth);

  const navRoutes = useMemo<NavRoutes>(
    () => ({
      profile: {
        title: 'Profile',
        icon: UserPen,
        path: '/account/my-profile',
      },
      security: {
        title: 'Change Password',
        icon: SquarePen,
        path: '/account/change-password',
      },
    }),
    [],
  );

  const [activeTab, setActiveTab] = useState<string>('profile');

  useEffect(() => {
    const found = Object.keys(navRoutes).find((key) =>
      pathname.startsWith(navRoutes[key].path),
    );

    setActiveTab(found || 'profile');
  }, [pathname, navRoutes]);

  const handleTabClick = (key: string, path: string) => {
    setActiveTab(key);
    router.push(path);
  };

  return (
    <Container>
      <div className='flex justify-between'>
        <DashboardHeader title={"Account"} description={""} />
        <Button asChild variant="outline">
          <p onClick={() => window.history.back()}>
            <MoveLeft />
            Back
          </p>
        </Button>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row lg:gap-14">
        <div className="space-y-7 lg:w-[230px] shrink-0 pt-6">
          <div className="flex items-center gap-3">
            <Avatar className="size-12">
              {user?.avatar && (
                <AvatarImage src={user.avatar} alt={user?.first_name + " " + user?.last_name} />
              )}
              <AvatarFallback className="text-lg">
                {getInitials(user?.first_name + " " + user?.last_name || user?.email || 'U')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="capitalize font-semibold text-base">
                {user?.first_name + " " + user?.last_name || ''}
              </div>
              <div className="capitalize text-muted-foreground text-xs">
                {user?.user_type === "agency" ? "Customer" : user?.user_type === "agent" ? "User" : user?.user_type}
              </div>
            </div>
          </div>

          <Tabs value={activeTab}>
            <TabsList
              variant="button"
              className="flex flex-col mt-4 items-stretch gap-3 border-0"
            >
              {Object.entries(navRoutes).map(
                ([key, { title, icon: Icon, path }]) => (
                  <TabsTrigger
                    key={key}
                    value={key}
                    onClick={() => handleTabClick(key, path)}
                    className="justify-start gap-2"
                  >
                    <Icon size={16} />
                    <span>{title}</span>
                  </TabsTrigger>
                ),
              )}
            </TabsList>
          </Tabs>
        </div>

        {/* Content */}
        <div className="grow pt-6">{children}</div>
      </div>
    </Container>
  );
}