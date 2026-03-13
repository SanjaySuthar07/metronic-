import { hasPermission } from "./permissions"
export const filterMenu: any = (menu: any[], user: any) => {
  return menu
    .map((item) => {
      if (item.role && !item?.role?.includes(user?.user_type)) {
        return null
      }

      if (item.permission && !hasPermission(user, item.permission)) {
        return null
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