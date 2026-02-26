"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, Minus } from "lucide-react";

type MenuItem = {
    title: string;
    icon?: string;
    href?: string;
    children?: MenuItem[];
    isHeading?: boolean;
};

const sidebarMenu: MenuItem[] = [
    {
        title: "Dashboards",
        icon: "ki-filled ki-element-11",
        children: [
            { title: "Light Sidebar", href: "/dashboards/light" },
            { title: "Dark Sidebar", href: "/dashboards/dark" },
            { title: "Empty Dashboard", href: "/dashboards/empty" },
        ],
    },

    { title: "USER", isHeading: true },

    {
        title: "Onboarding",
        icon: "ki-filled ki-rocket",
        href: "/onboarding",
    },
    {
        title: "Public Profile",
        icon: "ki-filled ki-profile-circle",
        href: "/public-profile",
    },
    {
        title: "My Account",
        icon: "ki-filled ki-setting-2",
        href: "/my-account",
    },
    {
        title: "Community",
        icon: "ki-filled ki-people",
        href: "/community",
    },
    {
        title: "User Management",
        icon: "ki-filled ki-user",
        href: "/user-management",
    },
    {
        title: "Authentication",
        icon: "ki-filled ki-shield",
        href: "/authentication",
    },

    { title: "PAGES", isHeading: true },

    {
        title: "Marketplace",
        icon: "ki-filled ki-shop",
        href: "/marketplace",
    },
    {
        title: "Social",
        icon: "ki-filled ki-share",
        href: "/social",
    },
    {
        title: "Company",
        icon: "ki-filled ki-briefcase",
        href: "/company",
    },
    {
        title: "Blog",
        icon: "ki-filled ki-document",
        href: "/blog",
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [openItems, setOpenItems] = useState<Set<string>>(new Set());

    const toggleItem = (title: string) => {
        setOpenItems((prev) => {
            const newSet = new Set(prev);
            newSet.has(title) ? newSet.delete(title) : newSet.add(title);
            return newSet;
        });
    };

    const renderMenuItem = (item: MenuItem, level = 0) => {
        const isOpen = openItems.has(item.title);
        const hasChildren = item.children && item.children.length > 0;
        const isActive = item.href && pathname === item.href;

        if (item.isHeading) {
            return (
                <div className="mt-6 mb-2 px-4">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {item.title}
                    </span>
                </div>
            );
        }

        return (
            <div>
                {item.href && !hasChildren ? (
                    <Link
                        href={item.href}
                        className={`
              flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${isActive
                                ? "bg-gray-100 text-blue-600"
                                : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"}
            `}
                        style={{ paddingLeft: `${level * 16 + 16}px` }}
                    >
                        {item.icon && <i className={`${item.icon} text-lg`} />}
                        <span className="flex-1">{item.title}</span>
                    </Link>
                ) : (
                    <button
                        onClick={() => toggleItem(item.title)}
                        className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-all"
                        style={{ paddingLeft: `${level * 16 + 16}px` }}
                    >
                        {item.icon && <i className={`${item.icon} text-lg`} />}
                        <span className="flex-1 text-left">{item.title}</span>
                        {hasChildren && (
                            <span className="ml-auto">
                                {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                            </span>
                        )}
                    </button>
                )}

                {hasChildren && isOpen && (
                    <div className="ml-2 border-l border-gray-200">
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
        <div className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col">
            <div className="px-6 py-5 border-b border-gray-100">
                <Link href="/">
                    <img src="/logo-dark.svg" alt="Logo" className="h-6" />
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                {sidebarMenu.map((item) => (
                    <div key={item.title}>{renderMenuItem(item)}</div>
                ))}
            </div>
        </div>
    );
}