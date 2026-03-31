'use client'
import { useSelector } from "react-redux"
import { notFound } from "next/navigation"
import { hasPermission } from "@/lib/permissions"
export default function UserLayout({
    children
}: {
    children: React.ReactNode
}) {
    const { user } = useSelector((s: any) => s.auth)
    if (!user) {
        return null
    }
    if (!hasPermission(user, "user-access")) {
        notFound()
    }
    return children
}