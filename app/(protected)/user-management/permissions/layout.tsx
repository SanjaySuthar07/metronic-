'use client'
import { useSelector } from "react-redux"
import { notFound } from "next/navigation"
import { hasPermission } from "@/lib/permissions"
export default function PermissionLayout({
    children
}: {
    children: React.ReactNode
}) {
    const { user } = useSelector((s: any) => s.auth)
    if (!user) {
        return null
    }
    const isSpecialRole = ['super_admin', 'agency'].includes(user.user_type)
    if (!isSpecialRole && !hasPermission(user, "permission-access")) {
        notFound()
    }

    return children
}