/**
 * Parameter Definition Schema
 * Defines the structure for parametric model parameters with validation constraints
 */

/**
 * Parameter type discriminator
 */
export type ParameterType = "number" | "enum" | "boolean" | "color";

/**
 * Enum option for enum-type parameters
 */
export interface EnumOption {
  /** Value stored in parameter values */
  value: number;
  /** Display label shown in UI */
  label: string;
}

/**
 * Base parameter definition with validation and UI metadata
 */
export interface BaseParameterDefinition {
  /** Unique identifier for the parameter */
  id: string;
  /** Display label shown in UI */
  label: string;
  /** Help text explaining the parameter's purpose */
  help: string;
  /** Parameter type - determines which control to render */
  type?: ParameterType;
}

/**
 * Number parameter definition (slider + input)
 */
export interface NumberParameterDefinition extends BaseParameterDefinition {
  type?: "number";
  /** Minimum allowed value */
  min: number;
  /** Maximum allowed value */
  max: number;
  /** Default value */
  default: number;
  /** Increment/decrement step size */
  step: number;
  /** Unit of measurement (e.g., "mm", "deg") */
  unit: string;
  /** Optional decimal precision for display */
  precision?: number;
}

/**
 * Enum parameter definition (dropdown select)
 */
export interface EnumParameterDefinition extends BaseParameterDefinition {
  type: "enum";
  /** Available options */
  options: EnumOption[];
  /** Default value */
  default: number;
}

/**
 * Boolean parameter definition (checkbox/toggle)
 */
export interface BooleanParameterDefinition extends BaseParameterDefinition {
  type: "boolean";
  /** Default value (0 = false, 1 = true) */
  default: number;
}

/**
 * Color parameter definition (color picker)
 */
export interface ColorParameterDefinition extends BaseParameterDefinition {
  type: "color";
  /** Default value (RGB as number) */
  default: number;
}

/**
 * Union of all parameter definition types
 */
export type ParameterDefinition =
  | NumberParameterDefinition
  | EnumParameterDefinition
  | BooleanParameterDefinition
  | ColorParameterDefinition;

/**
 * Collection of parameter definitions for a product
 */
export type ParameterSchema = {
  [key: string]: ParameterDefinition;
};

/**
 * Runtime parameter values (what the user has configured)
 */
export type ParameterValues = {
  [key: string]: number;
};

/**
 * Validation error for a specific parameter
 */
export interface ValidationError {
  parameterId: string;
  message: string;
}

/**
 * Result of parameter validation
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Get default parameter values from schema
 */
export function getDefaultValues(schema: ParameterSchema): ParameterValues {
  const values: ParameterValues = {};
  for (const [key, param] of Object.entries(schema)) {
    values[key] = param.default;
  }
  return values;
}

/**
 * Get parameter definition by ID
 */
export function getParameter(
  schema: ParameterSchema,
  id: string
): ParameterDefinition | undefined {
  return schema[id];
}

