import * as z from "zod";

export const fieldSchema = z.object({
    type: z.string().min(1, "Type is required"),

    dbColumn: z
        .string()
        .min(1, "Database column is required")
        .min(3, "Minimum 3 characters"),

    label: z.string().min(1, "Label is required"),

    validation: z.string().min(1, "Validation is required"),

    tooltip: z.string().min(1, "Tooltip is required"),

    defaultValue: z.string().min(1, "Default value is required"),
});

export type FieldSchemaType = z.infer<typeof fieldSchema>;