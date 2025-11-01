/**
 * Parameter Definition Schema
 * Defines the structure for parametric model parameters with validation constraints
 */

/**
 * Base parameter definition with validation and UI metadata
 */
export interface ParameterDefinition {
  /** Unique identifier for the parameter */
  id: string;
  /** Display label shown in UI */
  label: string;
  /** Help text explaining the parameter's purpose */
  help: string;
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

