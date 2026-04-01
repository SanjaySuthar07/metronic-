"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toAbsoluteUrl } from "@/lib/helpers";
import {
    Card,
    CardContent,
    CardHeader,
    CardHeading,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "../components/dashboardHeader";
import { getDashboard } from "@/store/thunk/dashboard.thunk";
import CountBox from "../components/count";
import { Container } from "@/components/common/container";

interface IChannelStatsItem {
    logo: string;
    logoDark?: string;
    info: string;
    desc: string;
    path: string;
}

type IChannelStatsItems = Array<IChannelStatsItem>;

function SkeletonCountBox() {
    return (
        <Card className="rounded-xl overflow-hidden">
            <CardContent className="p-0 flex flex-col justify-between h-[140px]">
                <div className="pt-4 ps-5">
                    <Skeleton className="w-7 h-7 rounded" />
                </div>
                <div className="pb-4 px-5 flex flex-col gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </CardContent>
        </Card>
    );
}

function Dashboard() {
    const dispatch = useDispatch<any>();

    const { count, loading } = useSelector((s: any) => s.dashboard);
    const { user } = useSelector((s: any) => s.auth);

    useEffect(() => {
        const checkAuth = async () => {
            if (!loading) {
                await dispatch(getDashboard());
            }
        };
        checkAuth();
    }, []);

    const Users: IChannelStatsItems = [
        { logo: "admin.svg", info: count?.total_admin, desc: "Admin", path: "" },
        { logo: "agency.svg", info: count?.total_agency, desc: "Agency", path: "" },
        { logo: "agent.svg", info: count?.total_agents, desc: "Agents", path: "" },
    ];

    const Invitation: IChannelStatsItems = [
        {
            logo: "invitation.svg",
            info: count?.total_invitation,
            desc: "Invitations",
            path: "",
        },
        {
            logo: "admin-inv.svg",
            info: count?.total_admin_invitation,
            desc: "Admin Invitations",
            path: "",
        },
        {
            logo: "agency-inv.svg",
            info: count?.total_agency_invitation,
            desc: "Agency Invitations",
            path: "",
        },
        {
            logo: "agent-inv.svg",
            info: count?.total_agent_invitation,
            desc: "Agent Invitations",
            path: "",
        },
        {
            logo: "panding.svg",
            info: count?.total_pending_invitation,
            desc: "Pending Invitations",
            path: "",
        },
        {
            logo: "accepted.svg",
            info: count?.total_accepted_invitation,
            desc: "Accepted Invitations",
            path: "",
        },
        {
            logo: "expired.svg",
            info: count?.total_expired_invitation,
            desc: "Expired Invitations",
            path: "",
        },
        {
            logo: "rejected.svg",
            info: count?.total_rejected_invitation,
            desc: "Rejected Invitations",
            path: "",
        },
    ];


    const filteredUsers =
        user?.user_type === "agency" ? Users.slice(2) :
            user?.user_type === "admin" ? Users.slice(1, 3) : Users;

    const filteredInvitation =
        user?.user_type === "agency" ? [] : user?.user_type === "admin" ?
            Users.slice(Users.length) : Invitation.slice(0, 7);

    return (
        <>
            <Container>
                <DashboardHeader
                    title={"Dashboard"}
                    description={"Central Hub for Personal Customizations"}
                />

                <style>
                    {`
        .channel-stats-bg {
          background-image: url('${toAbsoluteUrl(
                        "/media/images/2600x1600/bg-3.png"
                    )}');
        }
        .dark .channel-stats-bg {
          background-image: url('${toAbsoluteUrl(
                        "/media/images/2600x1600/bg-3-dark.png"
                    )}');
        }
      `}
                </style>

                {loading ? (
                    <>
                        <Card>
                            <CardHeader className="py-3">
                                <CardHeading>
                                    <Skeleton className="h-5 w-20" />
                                </CardHeading>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <SkeletonCountBox key={`user-skel-${i}`} />
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="mt-3">
                            <CardHeader className="py-3">
                                <CardHeading>
                                    <Skeleton className="h-5 w-28" />
                                </CardHeading>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {Array.from({ length: 7 }).map((_, i) => (
                                    <SkeletonCountBox key={`inv-skel-${i}`} />
                                ))}
                            </CardContent>
                        </Card>
                    </>
                ) : (
                    <>
                        {filteredUsers.length > 0 ? !count?.status ? (
                            <Card>
                                <CardHeader className="py-3">
                                    <CardHeading>
                                        <CardTitle>Users</CardTitle>
                                    </CardHeading>
                                </CardHeader>

                                <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {filteredUsers.map((item, index) => (
                                        <CountBox key={index} item={item} />
                                    ))}
                                </CardContent>
                            </Card>
                        ) : (
                            ""
                        ) : ""}

                        {filteredInvitation.length > 0 ? !count?.status ? (
                            <Card className="mt-3">
                                <CardHeader className="py-3">
                                    <CardHeading>
                                        <CardTitle>Invitation</CardTitle>
                                    </CardHeading>
                                </CardHeader>

                                <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {filteredInvitation.map((item, index) => (
                                        <CountBox key={index} item={item} />
                                    ))}
                                </CardContent>
                            </Card>
                        ) : (
                            ""
                        ) : ""}
                    </>
                )}
            </Container>
        </>
    );
}

export default Dashboard;
