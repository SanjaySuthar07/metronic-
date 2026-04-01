import { z } from 'zod';
import { getPasswordSchema } from './password-schema';
export const getChangePasswordSchema = () => {
  return z
    .object({
      current_password: getPasswordSchema(),
      new_password: getPasswordSchema(),
      new_password_confirmation: getPasswordSchema(),
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