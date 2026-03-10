import { z } from 'zod';

export const PermissionsAddSchema = z.object({
  name: z
    .string()
    .nonempty({ message: 'Name is required.' })
});

export type PermissionsAddSchemaType = z.infer<typeof PermissionsAddSchema>;
