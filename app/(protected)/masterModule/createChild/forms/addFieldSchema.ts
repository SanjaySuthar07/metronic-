import * as z from "zod";

export const fieldSchema = z.object({
    type: z.string().min(1, "Please select field type"),

    dbColumn: z
        .string()
        .min(1, "Database column is required")
        .min(3, "Minimum 3 characters required"),

    label: z.string().min(1, "Label is required"),

    validation: z.string().min(1, "Please select validation type"),
    max_file_size: z.string().optional(),
    is_multiple: z.boolean().optional(),
    cropImage: z.boolean().optional(),

    currency: z.string().optional(),

    is_ckeditor: z.boolean().optional(),

    tooltip_text: z.string().optional(),
    default_value: z.string().optional(),
    relationModel: z.string().optional(),

    visibility: z.array(z.number()).optional(),
    options: z
        .array(
            z.object({
                option_value: z.string().min(1, "Value required"), // ✅ FIX
                option_label: z.string().min(1, "Label required"), // ✅ FIX
            })
        )
        .optional(),
})
    .superRefine((data, ctx) => {

        if (data.type === "File" && !data.max_file_size) {
            ctx.addIssue({
                path: ["max_file_size"],
                message: "Max file size required",
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
                    if (!opt.option_value) {
                        ctx.addIssue({
                            path: ["options", index, "option_value"],
                            message: "Value required",
                            code: z.ZodIssueCode.custom,
                        });
                    }

                    if (!opt.option_label) {
                        ctx.addIssue({
                            path: ["options", index, "option_label"],
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




    });

export type FieldSchemaType = z.infer<typeof fieldSchema>;