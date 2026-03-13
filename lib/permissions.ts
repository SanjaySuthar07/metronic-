export const getUserPermissions = (user: any): string[] => {

  if (!user) return []

  if (user.user_type === "super_admin") {
    return ["*"]
  }

  return (
    user?.roles?.flatMap((role: any) =>
      role.permissions.map((p: any) => p.name)
    ) || []
  )
}

export const hasPermission = (
  user: any,
  requiredPermissions?: string | string[]
) => {

  if (!requiredPermissions) return true

  if (!user) return false

  if (user.user_type === "super_admin") {
    return true
  }

  const permissions = getUserPermissions(user)

  const required = Array.isArray(requiredPermissions)
    ? requiredPermissions
    : [requiredPermissions]

  return required.some((p) => permissions.includes(p))
}