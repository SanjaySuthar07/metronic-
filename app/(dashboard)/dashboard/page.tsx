"use client";

import { getProfile } from '@/store/thunk/auth.thunk';
import React, { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Card, CardContent } from '@/components/ui/card';
import { DashboardHeader } from '../components/dashboardHeader';
import { getDashboard } from '@/store/thunk/dashboard.thunk';
import Image from 'next/image';
interface IChannelStatsItem {
    logo: string;
    logoDark?: string;
    info: string;
    desc: string;
    path: string;
}

type IChannelStatsItems = Array<IChannelStatsItem>;

function Dashboard() {
    const dispatch = useDispatch();
    const { count } = useSelector((s) => s.dashboard)
    console.log(count)
    useEffect(() => {
        dispatch(getProfile());
        dispatch(getDashboard());
    }, [dispatch]);

    const items: IChannelStatsItems = [
        { logo: 'admin.svg', info: count?.total_admin, desc: 'Total Admin', path: '' },
        { logo: 'agency.svg', info: count?.total_agency, desc: 'Total Agency', path: '' },
        { logo: 'agent.svg', info: count?.total_agents, desc: 'Total Agents', path: '' },

        { logo: 'invitation.svg', info: count?.total_invitation, desc: 'Total Invitations', path: '' },

        { logo: 'admin-inv.svg', info: count?.total_admin_invitation, desc: 'Admin Invitations', path: '' },
        { logo: 'agency-inv.svg', info: count?.total_agency_invitation, desc: 'Agency Invitations', path: '' },
        { logo: 'agent-inv.svg', info: count?.total_agent_invitation, desc: 'Agent Invitations', path: '' },

        { logo: 'accepted.svg', info: count?.total_accepted_invitation, desc: 'Accepted Invitations', path: '' },
        { logo: 'rejected.svg', info: count?.total_rejected_invitation, desc: 'Rejected Invitations', path: '' },
        { logo: 'expired.svg', info: count?.total_expired_invitation, desc: 'Expired Invitations', path: '' },
        { logo: 'panding.svg', info: count?.total_pending_invitation, desc: 'Pending Invitations', path: '' },
    ];
    return (
        <>
            <DashboardHeader title={"Dashboard"} description={"Central Hub for Personal Customizations"} />
            <style>
                {`
        .channel-stats-bg {
          background-image: url('${toAbsoluteUrl('/media/images/2600x1600/bg-3.png')}');
        }
        .dark .channel-stats-bg {
          background-image: url('${toAbsoluteUrl('/media/images/2600x1600/bg-3-dark.png')}');
        }
      `}
            </style>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {items.map((item, index) => (
                    <Card key={index} className="rounded-xl overflow-hidden">
                        <CardContent className="p-0 flex flex-col justify-between h-[140px] bg-cover bg-no-repeat channel-stats-bg">

                            {/* Logo Section */}
                            <div className="pt-4 ps-5">
                                {item.logoDark ? (
                                    <>
                                        <Image
                                            src={toAbsoluteUrl(`/media/ui/${item.logo}`)}
                                            alt="logo"
                                            width={28}
                                            height={28}
                                            className="dark:hidden"
                                        />
                                        <Image
                                            src={toAbsoluteUrl(`/media/ui/${item.logoDark}`)}
                                            alt="logo"
                                            width={28}
                                            height={28}
                                            className="light:hidden"
                                        />
                                    </>
                                ) : (
                                    <Image
                                        src={toAbsoluteUrl(`/media/ui/${item.logo}`)}
                                        alt="logo"
                                        width={28}
                                        height={28}
                                    />
                                )}
                            </div>

                            {/* Bottom Info Section */}
                            <div className="pb-4 px-5 flex flex-col gap-1">
                                <span className="text-3xl font-semibold text-mono">
                                    {item.info ?? 0}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {item.desc}
                                </span>
                            </div>

                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    );
}

export default Dashboard;