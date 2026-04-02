import * as z from "zod";

export const generateSchemaFromConfig = (fields: any[]) => {
    const schema: any = {};

    fields.forEach((field) => {
        let validator = z.string();

        if (field.validation?.required) {
            validator = validator.min(1, `${field.label} is required`);
        }

        schema[field.name] = validator;
    });

    return z.object(schema);
};