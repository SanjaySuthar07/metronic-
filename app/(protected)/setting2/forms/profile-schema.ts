import { z } from 'zod';
export const getProfileSchema = () => {
  return z.object({
    firstName: z
      .string()
      .min(1, { message: 'First name is required' }),
    lastName: z
      .string()
      .min(1, { message: 'Last name is required' }),
  });
};
export type ProfileSchemaType = z.infer<
  ReturnType<typeof getProfileSchema>
>;