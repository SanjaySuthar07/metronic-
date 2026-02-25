'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, Plus, Minus } from 'lucide-react'; // ya apna icon library

type MenuItem = {
    title: string;
    icon?: string;
    href?: string;
    badge?: string;
    children?: MenuItem[];
    soon?: boolean;
    isHeading?: boolean;
};

const sidebarMenu: MenuItem[] = [
    {
        title: 'Dashboards',
        icon: 'ki-filled ki-element-11',
        children: [
            { title: 'Light Sidebar', href: '/dashboards/light' },
            { title: 'Dark Sidebar', href: '/dashboards/dark', active: true },
        ],
    },

    { title: 'User', isHeading: true },

    {
        title: 'Public Profile',
        icon: 'ki-filled ki-profile-circle',
        children: [
            {
                title: 'Profiles',
                children: [
                    { title: 'Default', href: '/public-profile/profiles/default' },
                    { title: 'Creator', href: '/public-profile/profiles/creator' },
                    { title: 'Company', href: '/public-profile/profiles/company' },
                    { title: 'NFT', href: '/public-profile/profiles/nft' },
                    { title: 'Blogger', href: '/public-profile/profiles/blogger' },
                    { title: 'CRM', href: '/public-profile/profiles/crm' },
                    { title: 'Gamer', href: '/public-profile/profiles/gamer' },
                    { title: 'Feeds', href: '/public-profile/profiles/feeds' },
                    { title: 'Plain', href: '/public-profile/profiles/plain' },
                    { title: 'Modal', href: '/public-profile/profiles/modal' },
                ],
            },
            {
                title: 'Projects',
                children: [
                    { title: '3 Columns', href: '/public-profile/projects/3-columns' },
                    { title: '2 Columns', href: '/public-profile/projects/2-columns' },
                ],
            },
            { title: 'Works', href: '/public-profile/works' },
            { title: 'Teams', href: '/public-profile/teams' },
            { title: 'Network', href: '/public-profile/network' },
            { title: 'Activity', href: '/public-profile/activity' },
        ],
    },

    {
        title: 'My Account',
        icon: 'ki-filled ki-setting-2',
        children: [
            {
                title: 'Account Home',
                children: [
                    { title: 'Get Started', href: '/account/home/get-started' },
                    { title: 'User Profile', href: '/account/home/user-profile' },
                    // ...
                ],
            },
        ],
    },


    { title: 'Apps', isHeading: true },

    {
        title: 'Store - Client',
        icon: 'ki-filled ki-users',
        children: [
            { title: 'Home', href: '/store-client/home' },
            { title: 'Search Results - Grid', href: '/store-client/search-results-grid' },
        ],
    },

    {
        title: 'Project Planning',
        icon: 'ki-filled ki-calendar-tick',
        href: '/plugins/fullcalendar',
    },

    { title: 'Store - Admin', soon: true },
    { title: 'AI Prompt', soon: true },
    { title: 'Invoice Generator', soon: true },
];

export default function Sidebar() {
    const [openItems, setOpenItems] = useState<Set<string>>(new Set());

    const toggleItem = (title: string) => {
        setOpenItems((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(title)) {
                newSet.delete(title);
            } else {
                newSet.add(title);
            }
            return newSet;
        });
    };

    const renderMenuItem = (item: MenuItem, level = 0) => {
        const isOpen = openItems.has(item.title);
        const hasChildren = item.children && item.children.length > 0;
        const paddingLeft = level * 5 + 2.5;

        if (item.isHeading) {
            return (
                <div className="pt-2.5 pb-px">
                    <span className="uppercase text-xs font-medium text-muted-foreground px-2.5">
                        {item.title}
                    </span>
                </div>
            );
        }

        if (item.soon) {
            return (
                <div className="flex items-center gap-2.5 px-2.5 py-2 text-sm font-medium text-muted-foreground">
                    <i className={`${item.icon} text-lg`} />
                    <span>{item.title}</span>
                    <span className="ml-auto text-xs bg-accent/40 text-accent-foreground px-1.5 py-0.5 rounded">
                        Soon
                    </span>
                </div>
            );
        }

        const content = (
            <>
                {item.icon && (
                    <i className={`${item.icon} text-lg min-w-[20px]`} />
                )}

                <span className="text-sm font-medium flex-1">
                    {item.title}
                </span>

                {hasChildren && (
                    <span className="ml-auto">
                        {isOpen ? <Minus size={11} /> : <Plus size={11} />}
                    </span>
                )}

                {item.href && !hasChildren && (
                    <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-70" />
                )}
            </>
        );

        if (item.href && !hasChildren) {
            return (
                <Link
                    href={item.href}
                    className={`
            group flex items-center gap-2.5 px-2.5 py-2 rounded-lg
            hover:bg-accent/60 transition-colors
            ${item.active ? 'bg-accent/60 text-primary font-semibold' : ''}
          `}
                    style={{ paddingLeft: `${paddingLeft}rem` }}
                >
                    {content}
                </Link>
            );
        }

        return (
            <div>
                <button
                    onClick={() => hasChildren && toggleItem(item.title)}
                    className={`
            w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg cursor-pointer
            hover:text-primary transition-colors
            ${isOpen ? 'text-primary' : 'text-foreground'}
          `}
                    style={{ paddingLeft: `${paddingLeft}rem` }}
                >
                    {content}
                </button>

                {hasChildren && isOpen && (
                    <div className="mt-1 space-y-0.5">
                        {item.children!.map((child) => (
                            <div key={child.title}>
                                {renderMenuItem(child, level + 1)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="
      fixed top-0 bottom-0 left-0 z-20 hidden lg:flex flex-col
      w-64 bg-background border-r border-border
    ">
            {/* Header + Logo + Toggle */}
            <div className="shrink-0 px-6 py-5 flex items-center justify-between">
                <Link href="/">
                    <img src="/logo-dark.svg" alt="Logo" className="h-7" />
                </Link>
                {/* Toggle button */}
            </div>

            <div className="flex-1 overflow-y-auto px-3 lg:px-5 py-5">
                <div className="space-y-1">
                    {sidebarMenu.map((item) => (
                        <div key={item.title}>
                            {renderMenuItem(item)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}