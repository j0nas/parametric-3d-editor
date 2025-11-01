/**
 * Drain Strainer Validation
 * Product-specific validation rules and dynamic constraints
 */

import type { ValidationError, ParameterValues, ParameterSchema } from "@/types/parameters";
import type { DynamicConstraints } from "@/lib/validation";

/**
 * Custom validation for drain strainer parameters
 * Checks domain-specific constraints beyond basic min/max/step
 */
export function validateDrainStrainer<T extends (...args: any[]) => string>(
  values: ParameterValues,
  t?: T
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate hole diameter relative to strainer size
  if (values.diameter && values.holeDiameter) {
    const innerRadius = values.diameter / 2 - (values.wallThickness || 1.5);

    // Check if hole diameter is reasonable for the strainer size
    if (values.holeDiameter >= innerRadius) {
      errors.push({
        parameterId: "holeDiameter",
        message: t
          ? t("drainStrainer.holeTooLargeForDiameter")
          : "Hole diameter is too large for the strainer diameter",
      });
    }

    // Check if hole diameter is too large relative to strainer
    if (values.holeDiameter > values.diameter / 4) {
      errors.push({
        parameterId: "holeDiameter",
        message: t
          ? t("drainStrainer.holeDiameterExcessive")
          : "Hole diameter should not exceed 1/4 of strainer diameter",
      });
    }
  }

  // Validate center post height
  if (values.centerPost !== undefined && values.depth !== undefined) {
    if (values.centerPost > values.depth * 2) {
      errors.push({
        parameterId: "centerPost",
        message: t
          ? t("drainStrainer.centerPostTooTall")
          : "Center post height should not exceed twice the basket depth",
      });
    }
  }

  // Validate rim height
  if (values.rimHeight !== undefined && values.depth !== undefined) {
    if (values.rimHeight > values.depth) {
      errors.push({
        parameterId: "rimHeight",
        message: t
          ? t("drainStrainer.rimHeightExceedsDepth")
          : "Rim height should not exceed basket depth",
      });
    }
  }

  // Validate hole pattern feasibility
  if (values.holeRows && values.holesPerRow && values.holeDiameter && values.diameter) {
    const innerRadius = values.diameter / 2 - (values.wallThickness || 1.5);
    const holeRadius = values.holeDiameter / 2;

    // Check if innermost row can fit minimum holes
    const minRowRadius = holeRadius * 3; // Rough estimate for innermost row
    if (minRowRadius > innerRadius) {
      errors.push({
        parameterId: "holeRows",
        message: t
          ? t("drainStrainer.tooManyHoleRows")
          : "Too many hole rows for strainer size - reduce rows or hole diameter",
      });
    }
  }

  return errors;
}

/**
 * Calculate dynamic constraints for drain strainer parameters
 * Adjusts parameter ranges based on current values
 */
export function calculateDrainStrainerConstraints(
  schema: ParameterSchema,
  values: ParameterValues
): Record<string, DynamicConstraints> {
  const constraints: Record<string, DynamicConstraints> = {};

  // Calculate dynamic max for holeDiameter based on strainer diameter
  if (values.diameter !== undefined) {
    const maxHoleDiameter = values.diameter / 4; // Max 1/4 of diameter
    constraints.holeDiameter = {
      max: Math.min(schema.holeDiameter?.max || 10, maxHoleDiameter),
    };
  }

  // Calculate dynamic max for centerPost based on depth
  if (values.depth !== undefined) {
    const maxCenterPost = values.depth * 2;
    constraints.centerPost = {
      max: Math.min(schema.centerPost?.max || 20, maxCenterPost),
    };
  }

  // Calculate dynamic max for rimHeight based on depth
  if (values.depth !== undefined) {
    constraints.rimHeight = {
      max: Math.min(schema.rimHeight?.max || 5, values.depth),
    };
  }

  return constraints;
}
