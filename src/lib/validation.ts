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
 * Validate parameter values against their schema definitions
 *
 * Checks:
 * - Values are within min/max bounds
 * - Values conform to step increments
 * - Domain-specific constraints are met
 *
 * @param schema - Parameter schema with validation constraints
 * @param values - Current parameter values to validate
 * @param t - Optional translation function for error messages
 * @returns Validation result with any errors found
 */
export function validateParameters(
  schema: ParameterSchema,
  values: ParameterValues,
  t?: (key: string, params?: Record<string, string | number | Date>) => string
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
          ? t("required", { label: definition.label })
          : `${definition.label} is required`,
      });
      continue;
    }

    // Check min/max bounds
    if (value < definition.min) {
      errors.push({
        parameterId: key,
        message: t
          ? t("min", { label: definition.label, min: definition.min, unit: definition.unit })
          : `${definition.label} must be at least ${definition.min}${definition.unit}`,
      });
    }

    if (value > definition.max) {
      errors.push({
        parameterId: key,
        message: t
          ? t("max", { label: definition.label, max: definition.max, unit: definition.unit })
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
          ? t("step", { label: definition.label, step: definition.step, unit: definition.unit })
          : `${definition.label} must be a multiple of ${definition.step}${definition.unit}`,
      });
    }
  }

  // Domain-specific validation rules for hose adapter
  if (values.outerDiameter && values.innerDiameter) {
    if (values.outerDiameter <= values.innerDiameter) {
      errors.push({
        parameterId: "outerDiameter",
        message: t
          ? t("outerGreaterThanInner")
          : "Outer diameter must be greater than inner diameter",
      });
    }

    // Check if the difference is too small (would result in invalid taper)
    const diameterDiff = values.outerDiameter - values.innerDiameter;
    if (diameterDiff < 2) {
      errors.push({
        parameterId: "outerDiameter",
        message: t
          ? t("outerAtLeast2mmLarger")
          : "Outer diameter must be at least 2mm larger than inner diameter",
      });
    }
  }

  // Validate taper length
  if (values.taperLength && values.length) {
    const minEndLength = 10; // Minimum 10mm for each end
    const maxTaperLength = values.length - 2 * minEndLength;

    if (values.taperLength > maxTaperLength) {
      errors.push({
        parameterId: "taperLength",
        message: t
          ? t("taperTooLong", {
              maxTaperLength: maxTaperLength.toFixed(1),
              minEndLengthTotal: 2 * minEndLength,
            })
          : `Taper length must be at most ${maxTaperLength.toFixed(1)}mm (total length minus ${2 * minEndLength}mm for ends)`,
      });
    }
  }

  // Validate wall thickness
  if (values.wallThickness && values.innerDiameter) {
    // Wall thickness should be reasonable relative to diameter
    const maxWallThickness = values.innerDiameter / 2;
    if (values.wallThickness > maxWallThickness) {
      errors.push({
        parameterId: "wallThickness",
        message: t
          ? t("wallThicknessTooLarge", { maxWallThickness: maxWallThickness.toFixed(1) })
          : `Wall thickness cannot exceed ${maxWallThickness.toFixed(1)}mm (half of inner diameter)`,
      });
    }

    // Minimum wall thickness for structural integrity
    if (values.wallThickness < 1) {
      errors.push({
        parameterId: "wallThickness",
        message: t
          ? t("wallThicknessTooSmall")
          : "Wall thickness must be at least 1mm for structural integrity",
      });
    }
  }

  // Validate ridge parameters
  if (values.ridgeCount && values.ridgeCount > 0) {
    const endLength = (values.length - values.taperLength) / 2;

    // Check if there's enough space for ridges
    const ridgeSpacing = endLength / (values.ridgeCount + 1);
    if (ridgeSpacing < values.ridgeWidth) {
      errors.push({
        parameterId: "ridgeCount",
        message: t
          ? t("tooManyRidges", { maxRidges: Math.floor(endLength / values.ridgeWidth) - 1 })
          : `Too many ridges for the available space. Maximum ${Math.floor(endLength / values.ridgeWidth) - 1} ridges`,
      });
    }

    // Ridge depth should be reasonable
    if (values.ridgeDepth > values.wallThickness) {
      errors.push({
        parameterId: "ridgeDepth",
        message: t
          ? t("ridgeDepthExceedsWall")
          : "Ridge depth should not exceed wall thickness",
      });
    }
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
 * Calculate dynamic constraints for parameters based on current values
 * This allows sliders to automatically adjust their ranges based on interdependencies
 *
 * @param schema - Parameter schema
 * @param values - Current parameter values
 * @returns Map of parameter IDs to their dynamic constraints
 */
export function calculateDynamicConstraints(
  schema: ParameterSchema,
  values: ParameterValues
): Record<string, DynamicConstraints> {
  const constraints: Record<string, DynamicConstraints> = {};

  // Calculate dynamic max for taperLength based on total length
  if (values.length !== undefined) {
    const minEndLength = 10; // Minimum 10mm for each end
    const maxTaperLength = values.length - 2 * minEndLength;
    constraints.taperLength = {
      max: Math.max(schema.taperLength?.min || 0, maxTaperLength),
    };
  }

  // Calculate dynamic max for ridgeCount based on available space
  if (
    values.length !== undefined &&
    values.taperLength !== undefined &&
    values.ridgeWidth !== undefined
  ) {
    const endLength = (values.length - values.taperLength) / 2;
    // Need space for ridges: ridgeSpacing >= ridgeWidth
    // ridgeSpacing = endLength / (ridgeCount + 1)
    // So: endLength / (ridgeCount + 1) >= ridgeWidth
    // Therefore: ridgeCount <= (endLength / ridgeWidth) - 1
    const maxRidgeCount = Math.max(0, Math.floor(endLength / values.ridgeWidth) - 1);
    constraints.ridgeCount = {
      max: Math.min(schema.ridgeCount?.max || 8, maxRidgeCount),
    };
  }

  // Calculate dynamic max for wallThickness based on inner diameter
  if (values.innerDiameter !== undefined) {
    const maxWallThickness = values.innerDiameter / 2;
    constraints.wallThickness = {
      max: Math.min(schema.wallThickness?.max || 10, maxWallThickness),
    };
  }

  // Calculate dynamic max for ridgeDepth based on wall thickness
  if (values.wallThickness !== undefined) {
    constraints.ridgeDepth = {
      max: Math.min(schema.ridgeDepth?.max || 3, values.wallThickness),
    };
  }

  // Calculate dynamic min for outerDiameter based on innerDiameter
  if (values.innerDiameter !== undefined) {
    constraints.outerDiameter = {
      min: Math.max(
        schema.outerDiameter?.min || 0,
        values.innerDiameter + 2 // At least 2mm larger
      ),
    };
  }

  return constraints;
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
 * @returns Adjusted parameter values that satisfy all constraints
 */
export function adjustToValidConstraints(
  schema: ParameterSchema,
  values: ParameterValues
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

    const dynamicConstraints = calculateDynamicConstraints(schema, adjusted);

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
