import { z } from "zod";

export const InviteAddSchema = z
  .object({
    name: z
      .string()
      .nonempty({ message: "Name is required." })
      .min(2, { message: "Name must be at least 2 characters long." })
      .max(50, { message: "Name must not exceed 50 characters." }),

    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z
      .string()
      .min(1, { message: "Password is required." })
      .min(6, { message: "Password must be at least 6 characters long." }),

    confirmPassword: z.string().min(1, {
      message: "Password confirmation is required.",
    }),
    typeID: z.string().nonempty({ message: "Type is required." }),
    agencyID: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.typeID === "2" && !data.agencyID) {
        return false;
      }
      return true;
    },
    {
      message: "Agency is required.",
      path: ["agencyID"],
    }
  );

export type InviteAddSchemaType = z.infer<typeof InviteAddSchema>;