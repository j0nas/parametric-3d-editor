/**
 * Hose Adapter Validation
 * Product-specific validation rules and dynamic constraints
 */

import type { ValidationError, ParameterValues, ParameterSchema, NumberParameterDefinition } from "@/types/parameters";
import type { DynamicConstraints } from "@/lib/validation";

/**
 * Custom validation for hose adapter parameters
 * Checks domain-specific constraints beyond basic min/max/step
 */
export function validateHoseAdapter<T extends (...args: any[]) => string>(
  values: ParameterValues,
  t?: T
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate diameter relationship
  if (values.outerDiameter && values.innerDiameter) {
    if (values.outerDiameter <= values.innerDiameter) {
      errors.push({
        parameterId: "outerDiameter",
        message: t
          ? t("hoseAdapter.outerGreaterThanInner")
          : "Outer diameter must be greater than inner diameter",
      });
    }

    // Check if the difference is too small (would result in invalid taper)
    const diameterDiff = values.outerDiameter - values.innerDiameter;
    if (diameterDiff < 2) {
      errors.push({
        parameterId: "outerDiameter",
        message: t
          ? t("hoseAdapter.outerAtLeast2mmLarger")
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
          ? t("hoseAdapter.taperTooLong", {
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
          ? t("hoseAdapter.wallThicknessTooLarge", { maxWallThickness: maxWallThickness.toFixed(1) })
          : `Wall thickness cannot exceed ${maxWallThickness.toFixed(1)}mm (half of inner diameter)`,
      });
    }

    // Minimum wall thickness for structural integrity
    if (values.wallThickness < 1) {
      errors.push({
        parameterId: "wallThickness",
        message: t
          ? t("hoseAdapter.wallThicknessTooSmall")
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
          ? t("hoseAdapter.tooManyRidges", { maxRidges: Math.floor(endLength / values.ridgeWidth) - 1 })
          : `Too many ridges for the available space. Maximum ${Math.floor(endLength / values.ridgeWidth) - 1} ridges`,
      });
    }

    // Ridge depth should be reasonable
    if (values.ridgeDepth > values.wallThickness) {
      errors.push({
        parameterId: "ridgeDepth",
        message: t
          ? t("hoseAdapter.ridgeDepthExceedsWall")
          : "Ridge depth should not exceed wall thickness",
      });
    }
  }

  return errors;
}

/**
 * Calculate dynamic constraints for hose adapter parameters
 * Adjusts parameter ranges based on current values
 */
export function calculateHoseAdapterConstraints(
  schema: ParameterSchema,
  values: ParameterValues
): Record<string, DynamicConstraints> {
  const constraints: Record<string, DynamicConstraints> = {};

  // Calculate dynamic max for taperLength based on total length
  if (values.length !== undefined && schema.taperLength) {
    const taperLengthDef = schema.taperLength as NumberParameterDefinition;
    const minEndLength = 10; // Minimum 10mm for each end
    const maxTaperLength = values.length - 2 * minEndLength;
    constraints.taperLength = {
      max: Math.max(taperLengthDef.min || 0, maxTaperLength),
    };
  }

  // Calculate dynamic max for ridgeCount based on available space
  if (
    values.length !== undefined &&
    values.taperLength !== undefined &&
    values.ridgeWidth !== undefined &&
    schema.ridgeCount
  ) {
    const ridgeCountDef = schema.ridgeCount as NumberParameterDefinition;
    const endLength = (values.length - values.taperLength) / 2;
    // Need space for ridges: ridgeSpacing >= ridgeWidth
    // ridgeSpacing = endLength / (ridgeCount + 1)
    // So: endLength / (ridgeCount + 1) >= ridgeWidth
    // Therefore: ridgeCount <= (endLength / ridgeWidth) - 1
    const maxRidgeCount = Math.max(0, Math.floor(endLength / values.ridgeWidth) - 1);
    constraints.ridgeCount = {
      max: Math.min(ridgeCountDef.max || 8, maxRidgeCount),
    };
  }

  // Calculate dynamic max for wallThickness based on inner diameter
  if (values.innerDiameter !== undefined && schema.wallThickness) {
    const wallThicknessDef = schema.wallThickness as NumberParameterDefinition;
    const maxWallThickness = values.innerDiameter / 2;
    constraints.wallThickness = {
      max: Math.min(wallThicknessDef.max || 10, maxWallThickness),
    };
  }

  // Calculate dynamic max for ridgeDepth based on wall thickness
  if (values.wallThickness !== undefined && schema.ridgeDepth) {
    const ridgeDepthDef = schema.ridgeDepth as NumberParameterDefinition;
    constraints.ridgeDepth = {
      max: Math.min(ridgeDepthDef.max || 3, values.wallThickness),
    };
  }

  // Calculate dynamic min for outerDiameter based on innerDiameter
  if (values.innerDiameter !== undefined && schema.outerDiameter) {
    const outerDiameterDef = schema.outerDiameter as NumberParameterDefinition;
    constraints.outerDiameter = {
      min: Math.max(
        outerDiameterDef.min || 0,
        values.innerDiameter + 2 // At least 2mm larger
      ),
    };
  }

  return constraints;
}
