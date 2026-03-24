import * as z from "zod";

export const fieldSchema = z.object({
    type: z.string().min(1, "Please select field type"),

    dbColumn: z
        .string()
        .min(1, "Database column is required")
        .min(3, "Minimum 3 characters required"),

    label: z.string().min(1, "Label is required"),

    validation: z.string().min(1, "Please select validation type"),

    tooltip: z.string().min(1, "Tooltip is required"),

    // COMMON OPTIONAL
    defaultValue: z.string().optional(),

    maxFileSize: z.string().optional(),
    multipleFiles: z.boolean().optional(),

    maxPhotoSize: z.string().optional(),
    cropImage: z.boolean().optional(),

    currency: z.string().optional(),
    precision: z.string().optional(),

    useCKEditor: z.boolean().optional(),

    relationModel: z.string().optional(),

    options: z
        .array(
            z.object({
                value: z.string().min(1, "Value required"),
                label: z.string().min(1, "Label required"),
            })
        )
        .optional(),
})
    .superRefine((data, ctx) => {
        // 🔥 TYPE BASED VALIDATION

        if (data.type === "Text" && !data.defaultValue) {
            ctx.addIssue({
                path: ["defaultValue"],
                message: "Default value required for Text",
                code: z.ZodIssueCode.custom,
            });
        }

        if (data.type === "File" && !data.maxFileSize) {
            ctx.addIssue({
                path: ["maxFileSize"],
                message: "Max file size required",
                code: z.ZodIssueCode.custom,
            });
        }

        if (data.type === "Photo" && !data.maxPhotoSize) {
            ctx.addIssue({
                path: ["maxPhotoSize"],
                message: "Max photo size required",
                code: z.ZodIssueCode.custom,
            });
        }

        if (data.type === "Select") {
            if (!data.options || data.options.length === 0) {
                ctx.addIssue({
                    path: ["options"],
                    message: "At least one option required",
                    code: z.ZodIssueCode.custom,
                });
            } else {
                data.options.forEach((opt, index) => {
                    if (!opt.value) {
                        ctx.addIssue({
                            path: ["options", index, "value"],
                            message: "Value required",
                            code: z.ZodIssueCode.custom,
                        });
                    }

                    if (!opt.label) {
                        ctx.addIssue({
                            path: ["options", index, "label"],
                            message: "Label required",
                            code: z.ZodIssueCode.custom,
                        });
                    }
                });
            }
        }

        if (
            (data.type === "BelongsTo Relationship" ||
                data.type === "BelongsToMany Relationship") &&
            !data.relationModel
        ) {
            ctx.addIssue({
                path: ["relationModel"],
                message: "Please select model",
                code: z.ZodIssueCode.custom,
            });
        }

        if (data.type === "Money" && !data.currency) {
            ctx.addIssue({
                path: ["currency"],
                message: "Currency is required",
                code: z.ZodIssueCode.custom,
            });
        }

        if (data.type === "Float" && !data.precision) {
            ctx.addIssue({
                path: ["precision"],
                message: "Precision is required",
                code: z.ZodIssueCode.custom,
            });
        }
    });

export type FieldSchemaType = z.infer<typeof fieldSchema>;