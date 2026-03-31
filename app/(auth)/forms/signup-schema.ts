import { z } from 'zod';
import { getPasswordSchema } from './password-schema';

export const getSignupSchema = () => {
  return z
    .object({
      firstName: z
        .string()
        .min(2, { message: 'First name must be at least 2 characters long.' })
        .min(1, { message: 'First name is required.' }),
      lastName: z
        .string()
        .min(2, { message: 'Last name must be at least 2 characters long.' })
        .min(1, { message: 'Last name is required.' }),
      email: z
        .string()
        .email({ message: 'Please enter a valid email address.' })
        .min(1, { message: 'Email is required.' }),
      password: getPasswordSchema(),
      passwordConfirmation: getPasswordSchema(),
      accept: z.boolean().refine((val) => val === true, {
        message: 'You must accept the terms and conditions.',
      }),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: 'Passwords do not match.',
      path: ['passwordConfirmation'],
    });
};

export type SignupSchemaType = z.infer<ReturnType<typeof getSignupSchema>>;
