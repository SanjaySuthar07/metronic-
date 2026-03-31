'use client'

import { useSelector } from "react-redux"
import { notFound } from "next/navigation"
import { hasPermission } from "@/lib/permissions"

export default function InviteLayout({
  children
}: {
  children: React.ReactNode
}) {

  const { user } = useSelector((s: any) => s.auth)

  if (!user) {
    return null
  }

  if (user.user_type !== "super_admin" && !hasPermission(user, ["invitation-access"])) {
    notFound()
  }

  return children
}