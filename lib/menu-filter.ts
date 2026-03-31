import { hasPermission } from "./permissions"
export const filterMenu: any = (menu: any[], user: any) => {
  return menu
    .map((item) => {
      const roleMatch = item.role ? item?.role?.includes(user?.user_type) : true
      const permissionMatch = item.permission ? hasPermission(user, item.permission) : true

      // If both role and permission are provided, at least one must match (OR logic)
      // If only role or only permission is provided, it must match
      if (item.role && item.permission) {
        if (!roleMatch && !permissionMatch) return null
      } else {
        if (item.role && !roleMatch) return null
        if (item.permission && !permissionMatch) return null
      }
      if (item.children) {
        const children = filterMenu(item.children, user)
        if (children.length === 0) {
          return null
        }
        return {
          ...item,
          children,
        }
      }
      return item
    })
    .filter(Boolean)
}