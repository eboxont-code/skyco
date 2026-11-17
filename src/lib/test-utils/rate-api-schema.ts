import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

export type Schema = {
  $ref?: string;
  oneOf?: Schema[];
  type?: string;
  enum?: unknown[];
  pattern?: string;
  format?: string;
  minLength?: number;
  exclusiveMinimum?: number;
  required?: string[];
  properties?: Record<string, Schema>;
  additionalProperties?: boolean;
  items?: Schema;
  definitions?: Record<string, Schema>;
  examples?: unknown[];
};

export const rateApiSchema = JSON.parse(
  readFileSync(
    new URL("../../../docs/rates/rate-api-contract-v1.schema.json", import.meta.url),
    "utf8",
  ),
) as Schema;

function resolveRef(ref: string, root: Schema): Schema {
  assert.ok(ref.startsWith("#/definitions/"), `Only local definitions are supported: ${ref}`);
  const name = ref.slice("#/definitions/".length);
  const resolved = root.definitions?.[name];
  assert.ok(resolved, `Missing schema definition: ${name}`);
  return resolved;
}

/** Validate the draft-07 features used by this contract without adding a package. */
export function rateApiValidationErrors(
  value: unknown,
  current: Schema,
  root: Schema,
  path = "$",
): string[] {
  if (current.$ref) {
    return rateApiValidationErrors(value, resolveRef(current.$ref, root), root, path);
  }
  if (current.oneOf) {
    const matches = current.oneOf.filter(
      (candidate) => rateApiValidationErrors(value, candidate, root, path).length === 0,
    );
    return matches.length === 1 ? [] : [`${path} must match exactly one response variant`];
  }
  if (current.enum && !current.enum.includes(value)) {
    return [`${path} is outside the allowed enum`];
  }
  if (current.type === "object") {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return [`${path} must be an object`];
    }
    const record = value as Record<string, unknown>;
    const errors = (current.required ?? []).flatMap((key) =>
      Object.hasOwn(record, key) ? [] : [`${path}.${key} is required`],
    );
    for (const [key, child] of Object.entries(current.properties ?? {})) {
      if (Object.hasOwn(record, key)) {
        errors.push(...rateApiValidationErrors(record[key], child, root, `${path}.${key}`));
      }
    }
    if (current.additionalProperties === false) {
      for (const key of Object.keys(record)) {
        if (!Object.hasOwn(current.properties ?? {}, key)) {
          errors.push(`${path}.${key} is not allowed`);
        }
      }
    }
    return errors;
  }
  if (current.type === "array") {
    if (!Array.isArray(value)) return [`${path} must be an array`];
    return value.flatMap((entry, index) =>
      current.items
        ? rateApiValidationErrors(entry, current.items, root, `${path}[${index}]`)
        : [],
    );
  }
  if (current.type === "string") {
    if (typeof value !== "string") return [`${path} must be a string`];
    const errors: string[] = [];
    if (current.pattern && !new RegExp(current.pattern).test(value)) {
      errors.push(`${path} does not match ${current.pattern}`);
    }
    if (current.minLength !== undefined && value.length < current.minLength) {
      errors.push(`${path} is too short`);
    }
    if (current.format === "date-time" && !Number.isFinite(Date.parse(value))) {
      errors.push(`${path} must be a valid date-time`);
    }
    return errors;
  }
  if (current.type === "number") {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      return [`${path} must be a finite number`];
    }
    if (current.exclusiveMinimum !== undefined && value <= current.exclusiveMinimum) {
      return [`${path} must be greater than ${current.exclusiveMinimum}`];
    }
    return [];
  }
  if (current.type === "boolean" && typeof value !== "boolean") {
    return [`${path} must be a boolean`];
  }
  return [];
}

export function assertValidRateApiResponse(value: unknown) {
  assert.deepEqual(rateApiValidationErrors(value, rateApiSchema, rateApiSchema), []);
}
