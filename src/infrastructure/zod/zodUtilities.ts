import { z } from "zod";
import { Types } from "mongoose";

// ObjectId field zod validation
export const objectIdField = (fieldName = "ID") =>
  z.string()
    .min(1, { message: `${fieldName} is required` })
    .refine((id) => Types.ObjectId.isValid(id), {
      message: `Invalid ${fieldName} format`,
    });

// Boolean field zod validation
export const booleanField = (fieldName = "Boolean") =>
  z.boolean().refine(val => typeof val === 'boolean', {
    message: `${fieldName} must be boolean`,
  });

// String field zod validation
export const stringField = (
  fieldName = "Value",
  min?: number,
  max?: number,
  regex?: RegExp,
  regexMessage = `Invalid ${fieldName} format`
) => {
  let schema = z.string().min(1, { message: `${fieldName} is required` });

  if (min !== undefined) {
    schema = schema.min(min, `${fieldName} must be at least ${min} characters`);
  }

  if (max !== undefined) {
    schema = schema.max(max, `${fieldName} must be at most ${max} characters`);
  }

  if (regex !== undefined) {
    schema = schema.regex(regex, regexMessage);
  }

  return schema;
};

// Date common field
export const dateField = z.preprocess(
  (val) => {
    if (typeof val === "string" || val instanceof String) {
      const parsed = new Date(val as string);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    return val;
  },
  z.date()
);

// Number field zod validation
export const numberField = (
  fieldName = "Value",
  min?: number,
  max?: number
) => {
  let schema = z.number().int();

  if (min !== undefined) {
    schema = schema.min(min, `${fieldName} must be at least ${min}`);
  }

  if (max !== undefined) {
    schema = schema.max(max, `${fieldName} must be at most ${max}`);
  }

  return schema;
};

// String enum field
export const enumField = (fieldName: string, values: readonly string[]) =>
  z.enum(values as [string, ...string[]]) // cast to tuple for TypeScript
    .refine((val) => values.includes(val), {
      message: `${fieldName} must be one of: ${values.join(", ")}`,
    });

// String enum field
export const stringArrayField = (
  fieldName = "Value",
  arrayMin?: number,
  arrayMax?: number,
  itemMin?: number,
  itemMax?: number,
  regex?: RegExp,
  regexMessage = "Invalid format"
) => {
  let itemSchema = z.string().min(1, { message: `${fieldName} is required` });

  if (itemMin !== undefined) {
    itemSchema = itemSchema.min(itemMin, `${fieldName} item must be at least ${itemMin} characters`);
  }

  if (itemMax !== undefined) {
    itemSchema = itemSchema.max(itemMax, `${fieldName} item must be at most ${itemMax} characters`);
  }

  if (regex !== undefined) {
    itemSchema = itemSchema.regex(regex, regexMessage);
  }

  let arraySchema = z.array(itemSchema);

  if (arrayMin !== undefined) {
    arraySchema = arraySchema.min(arrayMin, `At least ${arrayMin} ${fieldName.toLowerCase()}(s) required`);
  }

  if (arrayMax !== undefined) {
    arraySchema = arraySchema.max(arrayMax, `At most ${arrayMax} ${fieldName.toLowerCase()}(s) allowed`);
  }

  return arraySchema;
};

// Optional url
export const optionalUrl = z.union([z.string().url("Invalid photo URL"), z.literal("")]);

// Reusable helper: parse stringified JSON into array
export const jsonArrayParser = <T>(schema: z.ZodType<T>) =>
  z.union([
    z.string().transform((val) => {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }),
    z.array(schema),
  ]);
