'use client';

import { useState } from 'react';
import { formatDateTime } from '@/lib/helpers';
import { Badge, BadgeDot, BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import UserInviteDialog from '../../components/user-add-dialog';

const UserProfile = ({
  user,
  isLoading,
}: {
  user: User;
  isLoading: boolean;
}) => {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const Loading = () => (
    <Card>
      <CardContent>
        <dl className="grid grid-cols-[auto_1fr] text-muted-foreground gap-3 text-sm mb-5">
          <div className="grid grid-cols-subgrid col-span-2 items-baseline">
            <dt className="flex md:w-64">
              <Skeleton className="h-6 w-24" />
            </dt>
            <dd>
              <Skeleton className="h-5 w-36" />
            </dd>
          </div>
          <div className="grid grid-cols-subgrid col-span-2 items-baseline">
            <dt>
              <Skeleton className="h-5 w-36" />
            </dt>
            <dd>
              <Skeleton className="h-5 w-48" />
            </dd>
          </div>
          <div className="grid grid-cols-subgrid col-span-2 items-baseline">
            <dt>
              <Skeleton className="h-5 w-20" />
            </dt>
            <dd>
              <Skeleton className="h-5 w-24" />
            </dd>
          </div>
          <div className="grid grid-cols-subgrid col-span-2 items-baseline">
            <dt>
              <Skeleton className="h-5 w-24" />
            </dt>
            <dd>
              <Skeleton className="h-5 w-20" />
            </dd>
          </div>
          <div className="grid grid-cols-subgrid col-span-2 items-baseline">
            <dt>
              <Skeleton className="h-5 w-36" />
            </dt>
            <dd>
              <Skeleton className="h-5 w-24" />
            </dd>
          </div>
          <div className="grid grid-cols-subgrid col-span-2 items-baseline">
            <dt>
              <Skeleton className="h-5 w-24" />
            </dt>
            <dd>
              <Skeleton className="h-5 w-36" />
            </dd>
          </div>
        </dl>
        <Skeleton className="h-9 w-32" />
      </CardContent>
    </Card>
  );

  const Content = () => {
    console.log("user ->", user)
    const role = user?.roles?.[0]?.name || '-';

    return (
      <Card>
        <CardContent>

          <dl className="grid grid-cols-[auto_1fr] gap-3 text-sm mb-5 [&_dt]:text-muted-foreground">

            <div className="grid grid-cols-subgrid capitalize col-span-2 items-baseline">
              <dt className="flex md:w-64 ">Full name:</dt>
              <dd>{user?.first_name +" " +user?.last_name || 'Not available'}</dd>
            </div>

            <div className="grid  grid-cols-subgrid col-span-2 items-baseline">
              <dt className='capitalize'>Email address:</dt>
              <dd className="flex items-center gap-2.5">

                <span>{user?.email}</span>

                {user?.email_verified_at ? (
                  <Badge variant="success" appearance="light">
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="warning" appearance="light">
                    Not verified
                  </Badge>
                )}

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

            <div className="grid grid-cols-subgrid col-span-2 items-baseline">
              <dt>Joined:</dt>

              <dd>
                {user?.created_at
                  ? formatDateTime(new Date(user.created_at))
                  : '-'}
              </dd>

            </div>

          </dl>

          <Button
            variant="outline"
            onClick={() => {
              setEditData(user);
              setIsEdit(true);
              setInviteDialogOpen(true);
            }}
          >
            Edit user details
          </Button>

        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <Content />
      <UserInviteDialog
        open={inviteDialogOpen}
        isEdit={isEdit}
        editData={editData}
        closeDialog={() => setInviteDialogOpen(false)}
        isProfile={true}
      />
    </>
  );
};

export default UserProfile;
