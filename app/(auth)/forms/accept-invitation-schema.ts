import { z } from 'zod';
import { getPasswordSchema } from './password-schema';

export const acceptInvitationSchema = () => {
    return z
        .object({
            password: getPasswordSchema(),
            confirm_password: z
                .string()
                .min(6, 'Confirm password must be at least 6 characters'),
        })
        .refine((data) => data.password === data.confirm_password, {
            path: ['confirm_password'],
            message: 'Passwords do not match',
        });
};