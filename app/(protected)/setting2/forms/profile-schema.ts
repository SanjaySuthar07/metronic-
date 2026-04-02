import { z } from 'zod';
export const getProfileSchema = () => {
  return z.object({
    firstName: z
      .string()
      .min(1, { message: 'First name is required' }),
    lastName: z
      .string()
      .min(1, { message: 'Last name is required' }),
    expiredLinkDuration: z
      .string()
      .min(1, { message: 'Expired Link Duration is required' }),
    accessTokenExpires: z
      .string()
      .min(1, { message: 'Access Token Expires is required' }),
    refreshTokenExpires: z
      .string()
      .min(1, { message: 'Refresh Token Expires is required' }),
    loginAttemptSeconds: z
      .string()
      .min(1, { message: 'Login Attempt in Seconds is required' }),
    loginAttemptMinute: z
      .string()
      .min(1, { message: 'Login Attempt in Minutes is required' }),
    loginAttemptHour: z
      .string()
      .min(1, { message: 'Login Attempt in Hour is required' })
  });
};
export type ProfileSchemaType = z.infer<
  ReturnType<typeof getProfileSchema>
>;
