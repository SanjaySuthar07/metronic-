'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { getInitials } from '@/lib/helpers';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';


interface InviteUserProfileProps {
  inviteUser: any;
  isLoading: boolean;
}

const InviteUserHero = ({ inviteUser, isLoading }: InviteUserProfileProps) => {
  const Loading = () => {
    return (
      <div className="flex items-center gap-5 mb-5">
        <Skeleton className="size-14 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-60" />
        </div>
      </div>
    );
  };

  const Content = () => {
    const { copyToClipboard } = useCopyToClipboard();
    const [showCopied, setShowCopied] = useState(false);

    const handleUserIdCopy = () => {
      copyToClipboard(inviteUser.id);
      setShowCopied(true);
      setTimeout(() => {
        setShowCopied(false);
      }, 2000);
    };

    return (
      <div className="flex items-center gap-5 mb-5">
        <Avatar className="h-14 w-14">
          {inviteUser.avatar ? (
            <AvatarImage src={inviteUser.avatar} alt={inviteUser.name || ''} />
          ) : (
            <AvatarFallback className="text-xl">
              {getInitials(inviteUser.first_name+' '+inviteUser.last_name || inviteUser.email)}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="space-y-px">
          <div className="font-medium text-base capitalize">{inviteUser.first_name} {inviteUser.last_name}</div>
          <div className="text-muted-foreground text-sm">{inviteUser.email}</div>
          <div>
            <TooltipProvider>
              <Tooltip delayDuration={50}>
                <TooltipTrigger className="cursor-pointer">
                  <Badge
                    variant="secondary"
                    className="gap-1.5 px-2 py-0.5"
                    onClick={handleUserIdCopy}
                  >
                    <span>User ID: {inviteUser.id}</span>
                    {showCopied && <Check className="text-success size-3" />}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="text-xs">
                  Click to copy
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    );
  };

  return isLoading || !inviteUser ? <Loading /> : <Content />;
};

export default InviteUserHero;
