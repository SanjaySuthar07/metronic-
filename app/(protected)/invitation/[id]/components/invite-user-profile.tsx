'use client';

import { useState } from 'react';
import { formatDateTime } from '@/lib/helpers';
import { Badge, BadgeDot } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const InviteUserProfile = ({
  user,
}: {
  user: User;
  isLoading: boolean;
}) => {
  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "success";
      case "pending":
        return "warning";
      case "expired":
        return "destructive";
      case "rejected":
        return "destructive";
      default:
        return "destructive";
    }
  };

  const Content = () => {
    console.log("user ->", user)
    const role = user?.roles?.[0]?.name || '-';

    return (
      <Card>
        <CardContent>

          <dl className="grid grid-cols-[auto_1fr] gap-3 text-sm mb-5 [&_dt]:text-muted-foreground">

            <div className="grid grid-cols-subgrid capitalize col-span-2 items-baseline">
              <dt className="flex md:w-64 ">Full name:</dt>
              <dd>{user?.first_name+' '+user?.last_name || 'Not available'}</dd>
            </div>

            <div className="grid  grid-cols-subgrid col-span-2 items-baseline">
              <dt className='capitalize'>Email address:</dt>
              <dd className="flex items-center gap-2.5">

                <span>{user?.email}</span>


              </dd>
            </div>



            <div className="grid grid-cols-subgrid col-span-2 items-baseline">
              <dt>Role:</dt>
              <dd>
                <span className="inline-flex items-center gap-1 capitalize">
                  <Badge variant="secondary" className="capitalize">
                    {user?.user_type}
                  </Badge>
                </span>
              </dd>
            </div>

            <div className="grid grid-cols-subgrid capitalize col-span-2 items-baseline">
              <dt className="flex md:w-64 ">Invite Status:</dt>
              <dd>
                <Badge variant={getStatusVariant(user.status) as any} appearance="ghost">
                  <BadgeDot />
                  {user.status}
                </Badge>
              </dd>
            </div>
            <div className="grid grid-cols-subgrid col-span-2 items-baseline">
              <dt>Joined:</dt>
              <dd>
                {user?.created_at
                  ? formatDateTime(new Date(user.created_at))
                  : '-'}
              </dd>
            </div>
          </dl>


        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <Content />
    </>
  );
};

export default InviteUserProfile;
