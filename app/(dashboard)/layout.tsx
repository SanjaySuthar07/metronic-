// import Sidebar from "@/components/layout/Sidebar";
import { ReactNode } from "react";

export default function DashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div className="flex">
            {/* <Sidebar /> */}
            <main className="flex-1 lg:ms-[265px] p-6">
                {children}
            </main>
        </div>
    );
}