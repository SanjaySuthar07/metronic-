import * as z from "zod";

export const menuSchema = z.object({
  menuName: z.string().min(1, "Menu Name is required"),
  menuTitle: z.string().min(1, "Menu Title is required"),
  parentMenu: z.string().min(1, "Parent Menu is required"),
  status: z.string().min(1, "Status is required"),
  userType: z.string().min(1, "User Type is required"),

  adminType: z.string().optional(),
  customerType: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.userType === "admin" && !data.adminType) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Admin Type is required",
      path: ["adminType"],
    });
  }

  if (data.userType === "customer" && !data.customerType) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Customer Type is required",
      path: ["customerType"],
    });
  }
});

export type MenuSchemaType = z.infer<typeof menuSchema>;