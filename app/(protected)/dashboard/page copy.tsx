"use client";

import { getProfile } from '@/store/thunk/auth.thunk';
import React, { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Card, CardContent, CardDescription, CardHeader, CardHeading, CardTitle } from '@/components/ui/card';
import { DashboardHeader } from '../components/dashboardHeader';
import { getDashboard } from '@/store/thunk/dashboard.thunk';
import Image from 'next/image';
import CountBox from '../components/count';
import { Container } from '@/components/common/container';
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
    useEffect(() => {
        dispatch(getProfile());
        dispatch(getDashboard());
    }, [dispatch]);

    const Users: IChannelStatsItems = [
        { logo: 'admin.svg', info: count?.total_admin, desc: 'Admin', path: '' },
        { logo: 'agency.svg', info: count?.total_agency, desc: 'Agency', path: '' },
        { logo: 'agent.svg', info: count?.total_agents, desc: 'Agents', path: '' },

    ]
    const Invitation: IChannelStatsItems = [
        { logo: 'invitation.svg', info: count?.total_invitation, desc: 'Invitations', path: '' },
        { logo: 'admin-inv.svg', info: count?.total_admin_invitation, desc: 'Admin Invitations', path: '' },
        { logo: 'agency-inv.svg', info: count?.total_agency_invitation, desc: 'Agency Invitations', path: '' },
        { logo: 'agent-inv.svg', info: count?.total_agent_invitation, desc: 'Agent Invitations', path: '' },

        { logo: 'panding.svg', info: count?.total_pending_invitation, desc: 'Pending Invitations', path: '' },
        { logo: 'accepted.svg', info: count?.total_accepted_invitation, desc: 'Accepted Invitations', path: '' },
        { logo: 'expired.svg', info: count?.total_expired_invitation, desc: 'Expired Invitations', path: '' },
        { logo: 'rejected.svg', info: count?.total_rejected_invitation, desc: 'Rejected Invitations', path: '' },
    ];
    return (
        <Fragment >
            <Container>
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
                <Card>
                    <CardHeader className="py-3 ">
                        <CardHeading>
                            <CardTitle>Users</CardTitle>
                            {/* <CardDescription>
                                List All Total User
                            </CardDescription> */}
                        </CardHeading>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-4">
                        {Users.map((item, index) => (
                            <CountBox key={index} item={item} />
                        ))}
                    </CardContent>
                </Card>
                <Card className='mt-5'>
                    <CardHeader className="py-3">
                        <CardHeading>
                            <CardTitle>Invitation</CardTitle>
                            {/* <CardDescription>
                                List All Total Invitation
                            </CardDescription> */}
                        </CardHeading>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-4">
                        {Invitation.map((item, index) => (
                            <CountBox key={index} item={item} />
                        ))}
                    </CardContent>
                </Card>
            </Container>
        </Fragment>
    );
}

export default Dashboard;