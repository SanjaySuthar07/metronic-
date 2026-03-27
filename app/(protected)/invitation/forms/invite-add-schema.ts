import { getPasswordSchema } from "@/app/(auth)/forms/password-schema";
import { z } from "zod";

export const InviteAddSchema = z
  .object({
    first_name: z
      .string()
      .nonempty({ message: "First Name is required." })
      .min(2, { message: "Last Name must be at least 2 characters long." }),
      // .max(50, { message: "Name must not exceed 50 characters." }),

    last_name: z
      .string()
      .nonempty({ message: "First Name is required." })
      .min(2, { message: "First Name must be at least 2 characters long." }),
      // .max(50, { message: "Name must not exceed 50 characters." }),

    email: z.string().email({
      message: "Please enter a valid email address.",
    }),

    // password: getPasswordSchema(),

    // confirmPassword: getPasswordSchema(),

    user_type: z.string().nonempty({
      message: "Type is required.",
    }),

    tenant_id: z.string().optional(),
  })

  // .refine((data) => data.password === data.confirmPassword, {
  //   message: "Passwords do not match.",
  //   path: ["confirmPassword"],
  // })

  .refine(
    (data) => {
      if (data.user_type === "agent" && !data.tenant_id) {
        return false;
      }
      return true;
    },
    {
      message: "Agency is required.",
      path: ["tenant_id"],
    }
  );

export type InviteAddSchemaType = z.infer<typeof InviteAddSchema>;