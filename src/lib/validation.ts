/**
 * Parameter Validation
 * Validates parameter values against schema constraints and domain rules
 */

import type {
  ParameterSchema,
  ParameterValues,
  ValidationResult,
  ValidationError,
} from "@/types/parameters";

/**
 * Custom validation function type
 * Products can provide domain-specific validation logic
 */
export type CustomValidation<T extends (...args: any[]) => string = (...args: any[]) => string> = (
  values: ParameterValues,
  t?: T
) => ValidationError[];

/**
 * Validate parameter values against their schema definitions
 *
 * Checks:
 * - Values are within min/max bounds
 * - Values conform to step increments
 * - Custom domain-specific constraints (if provided)
 *
 * @param schema - Parameter schema with validation constraints
 * @param values - Current parameter values to validate
 * @param t - Optional translation function for error messages
 * @param customValidation - Optional product-specific validation function
 * @returns Validation result with any errors found
 */
export function validateParameters<T extends (...args: any[]) => string>(
  schema: ParameterSchema,
  values: ParameterValues,
  t?: T,
  customValidation?: CustomValidation<T>
): ValidationResult {
  const errors: ValidationError[] = [];

  // Validate each parameter against its schema
  for (const [key, definition] of Object.entries(schema)) {
    const value = values[key];

    // Check if value exists
    if (value === undefined || value === null) {
      errors.push({
        parameterId: key,
        message: t
          ? t("common.required", { label: definition.label })
          : `${definition.label} is required`,
      });
      continue;
    }

    // Check min/max bounds
    if (value < definition.min) {
      errors.push({
        parameterId: key,
        message: t
          ? t("common.min", { label: definition.label, min: definition.min, unit: definition.unit })
          : `${definition.label} must be at least ${definition.min}${definition.unit}`,
      });
    }

    if (value > definition.max) {
      errors.push({
        parameterId: key,
        message: t
          ? t("common.max", { label: definition.label, max: definition.max, unit: definition.unit })
          : `${definition.label} must be at most ${definition.max}${definition.unit}`,
      });
    }

    // Check step increment (with floating-point tolerance)
    const stepsFromMin = (value - definition.min) / definition.step;
    const tolerance = 0.0001;
    if (Math.abs(stepsFromMin - Math.round(stepsFromMin)) > tolerance) {
      errors.push({
        parameterId: key,
        message: t
          ? t("common.step", { label: definition.label, step: definition.step, unit: definition.unit })
          : `${definition.label} must be a multiple of ${definition.step}${definition.unit}`,
      });
    }
  }

  // Run custom product-specific validation if provided
  if (customValidation) {
    const customErrors = customValidation(values, t);
    errors.push(...customErrors);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get validation errors for a specific parameter
 */
export function getParameterErrors(
  validation: ValidationResult,
  parameterId: string
): ValidationError[] {
  return validation.errors.filter((error) => error.parameterId === parameterId);
}

/**
 * Check if a specific parameter has errors
 */
export function hasParameterError(
  validation: ValidationResult,
  parameterId: string
): boolean {
  return validation.errors.some((error) => error.parameterId === parameterId);
}

/**
 * Get the first error message for a parameter
 */
export function getParameterErrorMessage(
  validation: ValidationResult,
  parameterId: string
): string | undefined {
  const errors = getParameterErrors(validation, parameterId);
  return errors.length > 0 ? errors[0].message : undefined;
}

/**
 * Dynamic constraint for a parameter
 */
export interface DynamicConstraints {
  min?: number;
  max?: number;
}

/**
 * Custom dynamic constraints calculator type
 * Products can provide logic to adjust parameter ranges based on other values
 */
export type CustomConstraintsCalculator = (
  schema: ParameterSchema,
  values: ParameterValues
) => Record<string, DynamicConstraints>;

/**
 * Calculate dynamic constraints for parameters based on current values
 * This allows sliders to automatically adjust their ranges based on interdependencies
 *
 * @param schema - Parameter schema
 * @param values - Current parameter values
 * @param customCalculator - Optional product-specific constraint calculator
 * @returns Map of parameter IDs to their dynamic constraints
 */
export function calculateDynamicConstraints(
  schema: ParameterSchema,
  values: ParameterValues,
  customCalculator?: CustomConstraintsCalculator
): Record<string, DynamicConstraints> {
  // Use custom calculator if provided, otherwise return empty constraints
  if (customCalculator) {
    return customCalculator(schema, values);
  }

  return {};
}

/**
 * Get the effective constraints (schema + dynamic) for a parameter
 */
export function getEffectiveConstraints(
  schema: ParameterSchema,
  parameterId: string,
  dynamicConstraints: Record<string, DynamicConstraints>
): { min: number; max: number } {
  const definition = schema[parameterId];
  if (!definition) {
    throw new Error(`Parameter ${parameterId} not found in schema`);
  }

  const dynamic = dynamicConstraints[parameterId] || {};

  return {
    min: dynamic.min !== undefined ? dynamic.min : definition.min,
    max: dynamic.max !== undefined ? dynamic.max : definition.max,
  };
}

/**
 * Adjust parameter values to fit within valid constraints
 * Useful for correcting invalid defaults or ensuring interdependent parameters remain valid
 *
 * @param schema - Parameter schema
 * @param values - Current parameter values
 * @param customCalculator - Optional product-specific constraint calculator
 * @returns Adjusted parameter values that satisfy all constraints
 */
export function adjustToValidConstraints(
  schema: ParameterSchema,
  values: ParameterValues,
  customCalculator?: CustomConstraintsCalculator
): ParameterValues {
  const adjusted = { ...values };
  let changed = true;
  let iterations = 0;
  const maxIterations = 10; // Prevent infinite loops

  // Iterate until no changes or max iterations reached
  // This handles cascading adjustments (changing one param affects another)
  while (changed && iterations < maxIterations) {
    changed = false;
    iterations++;

    const dynamicConstraints = calculateDynamicConstraints(schema, adjusted, customCalculator);

    for (const [key, definition] of Object.entries(schema)) {
      const currentValue = adjusted[key];
      if (currentValue === undefined) continue;

      const constraints = getEffectiveConstraints(
        schema,
        key,
        dynamicConstraints
      );

      // Clamp value to valid range
      let newValue = currentValue;
      if (currentValue < constraints.min) {
        newValue = constraints.min;
        changed = true;
      } else if (currentValue > constraints.max) {
        newValue = constraints.max;
        changed = true;
      }

      // Round to nearest step
      const stepsFromMin = Math.round((newValue - definition.min) / definition.step);
      newValue = definition.min + stepsFromMin * definition.step;

      if (newValue !== currentValue) {
        adjusted[key] = newValue;
        changed = true;
      }
    }
  }

  return adjusted;
}
