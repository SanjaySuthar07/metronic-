import * as z from "zod";

export const menuSchema = z.object({
  menuName: z.string().min(1, "Menu Name is required"),
  menuTitle: z.string().min(1, "Menu Title is required"),
  parentMenu: z.string().min(1, "Parent Menu is required"),
  status: z.string().min(1, "Status is required"),
  userType: z.string().min(1, "User Type is required"),
});

export type MenuSchemaType = z.infer<typeof menuSchema>;