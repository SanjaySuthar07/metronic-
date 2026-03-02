import { z } from 'zod';
export const getChangePasswordSchema = () => {
  return z
    .object({
      current_password: z
        .string()
        .min(1, { message: 'Current password is required' }),

      new_password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters' }),

      new_password_confirmation: z
        .string()
        .min(1, { message: 'Confirm password is required' }),
    })
    .refine(
      (data) => data.new_password === data.new_password_confirmation,
      {
        path: ['new_password_confirmation'],
        message: 'Passwords must match',
      }
    );
};
export type ChangePasswordSchemaType = z.infer<
  ReturnType<typeof getChangePasswordSchema>
>;