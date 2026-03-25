import * as z from "zod";

export const menuSchema = z.object({
  menuName: z.string().min(1, "Menu Name is required"),
  menuTitle: z.string().min(1, "Menu Title is required"),
  parentMenu: z.string().min(1, "Parent Menu is required"),
  status: z.string().min(1, "Status is required"),
  userType: z.string().min(1, "User Type is required"),

  adminType: z.array(z.string()).optional(),
  customerType: z.array(z.string()).optional(),
  icon: z.string().optional(),
  orderNumber: z.coerce
    .number()
    .int("Must be an integer")
    .min(1, "Minimum value is 1"),
}).superRefine((data, ctx) => {
  if (data.userType === "admin" && (!data.adminType || data.adminType.length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Admin Type is required",
      path: ["adminType"],
    });
  }

  if (data.userType === "customer" && (!data.customerType || data.customerType.length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Customer Type is required",
      path: ["customerType"],
    });
  }
});

export type MenuSchemaType = z.infer<typeof menuSchema>;