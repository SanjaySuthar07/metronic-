import { z } from 'zod';
export const getProfileSchema = () => {
  return z.object({
    name: z
      .string()
      .min(1, { message: 'Name is required' }),
  });
};
export type ProfileSchemaType = z.infer<
  ReturnType<typeof getProfileSchema>
>;