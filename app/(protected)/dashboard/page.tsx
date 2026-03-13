"use client";

import React, { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Card, CardContent, CardHeader, CardHeading, CardTitle } from '@/components/ui/card';
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
    const { count, loading } = useSelector((s: any) => s.dashboard);
    const { user } = useSelector((s) => s.auth)
    // console.log("hello ", user)
    useEffect(() => {
        const checkAuth = async () => {
            if (!loading) {
                await dispatch(getDashboard());
            }
        }
        checkAuth()
    }, []);

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
        <>
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

                {
                    // console.log()
                    !count?.status ? (
                        <Card>
                            <CardHeader className="py-3">
                                <CardHeading>
                                    <CardTitle>Users</CardTitle>
                                </CardHeading>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {Users.map((item, index) => (
                                    <CountBox key={index} item={item} />
                                ))}
                            </CardContent>
                        </Card>
                    ) : ""
                }
                {
                    // console.log()
                    !count?.status ? (
                        <Card className='mt-3'>
                            <CardHeader className="py-3">
                                <CardHeading>
                                    <CardTitle>Invitation</CardTitle>
                                </CardHeading>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {Invitation.map((item, index) => (
                                    <CountBox key={index} item={item} />
                                ))}
                            </CardContent>
                        </Card>
                    ) : ""
                }


            </Container>
        </>
    );
}

export default Dashboard;