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
 * @returns Validation result with any errors found
 */
export function validateParameters(
  schema: ParameterSchema,
  values: ParameterValues
): ValidationResult {
  const errors: ValidationError[] = [];

  // Validate each parameter against its schema
  for (const [key, definition] of Object.entries(schema)) {
    const value = values[key];

    // Check if value exists
    if (value === undefined || value === null) {
      errors.push({
        parameterId: key,
        message: `${definition.label} is required`,
      });
      continue;
    }

    // Check min/max bounds
    if (value < definition.min) {
      errors.push({
        parameterId: key,
        message: `${definition.label} must be at least ${definition.min}${definition.unit}`,
      });
    }

    if (value > definition.max) {
      errors.push({
        parameterId: key,
        message: `${definition.label} must be at most ${definition.max}${definition.unit}`,
      });
    }

    // Check step increment (with floating-point tolerance)
    const stepsFromMin = (value - definition.min) / definition.step;
    const tolerance = 0.0001;
    if (Math.abs(stepsFromMin - Math.round(stepsFromMin)) > tolerance) {
      errors.push({
        parameterId: key,
        message: `${definition.label} must be a multiple of ${definition.step}${definition.unit}`,
      });
    }
  }

  // Domain-specific validation rules for hose adapter
  if (values.outerDiameter && values.innerDiameter) {
    if (values.outerDiameter <= values.innerDiameter) {
      errors.push({
        parameterId: "outerDiameter",
        message: "Outer diameter must be greater than inner diameter",
      });
    }

    // Check if the difference is too small (would result in invalid taper)
    const diameterDiff = values.outerDiameter - values.innerDiameter;
    if (diameterDiff < 2) {
      errors.push({
        parameterId: "outerDiameter",
        message: "Outer diameter must be at least 2mm larger than inner diameter",
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
        message: `Taper length must be at most ${maxTaperLength.toFixed(1)}mm (total length minus ${2 * minEndLength}mm for ends)`,
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
        message: `Wall thickness cannot exceed ${maxWallThickness.toFixed(1)}mm (half of inner diameter)`,
      });
    }

    // Minimum wall thickness for structural integrity
    if (values.wallThickness < 1) {
      errors.push({
        parameterId: "wallThickness",
        message: "Wall thickness must be at least 1mm for structural integrity",
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
        message: `Too many ridges for the available space. Maximum ${Math.floor(endLength / values.ridgeWidth) - 1} ridges`,
      });
    }

    // Ridge depth should be reasonable
    if (values.ridgeDepth > values.wallThickness) {
      errors.push({
        parameterId: "ridgeDepth",
        message: "Ridge depth should not exceed wall thickness",
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
