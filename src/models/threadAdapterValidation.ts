/**
 * Thread Adapter Validation
 * Product-specific validation rules and dynamic constraints
 */

import type {
  ValidationError,
  ParameterValues,
  ParameterSchema,
  NumberParameterDefinition,
} from "@/types/parameters";
import type { DynamicConstraints } from "@/lib/validation";

/**
 * Custom validation for thread adapter parameters
 * Checks domain-specific constraints beyond basic min/max/step
 */
export function validateThreadAdapter<T extends (...args: any[]) => string>(
  values: ParameterValues,
  t?: T
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Note: Removed thread type validation - both male-male and female-female
  // adapters are valid use cases (e.g., male-to-male couplers, female-to-female extenders)

  // Validate minimum diameter for structural integrity
  if (values.threadADiameter !== undefined && values.threadADiameter < 12) {
    errors.push({
      parameterId: "threadADiameter",
      message: t
        ? t("threadAdapter.diameterTooSmall")
        : "Minimum diameter is 12mm for structural integrity",
    });
  }

  if (values.threadBDiameter !== undefined && values.threadBDiameter < 12) {
    errors.push({
      parameterId: "threadBDiameter",
      message: t
        ? t("threadAdapter.diameterTooSmall")
        : "Minimum diameter is 12mm for structural integrity",
    });
  }

  // Validate thread length relative to diameter (max 60%)
  if (
    values.threadALength !== undefined &&
    values.threadADiameter !== undefined
  ) {
    const maxThreadALength = values.threadADiameter * 0.6;
    if (values.threadALength > maxThreadALength) {
      errors.push({
        parameterId: "threadALength",
        message: t
          ? t("threadAdapter.threadLengthTooLong")
          : "Thread length cannot exceed 60% of diameter",
      });
    }
  }

  if (
    values.threadBLength !== undefined &&
    values.threadBDiameter !== undefined
  ) {
    const maxThreadBLength = values.threadBDiameter * 0.6;
    if (values.threadBLength > maxThreadBLength) {
      errors.push({
        parameterId: "threadBLength",
        message: t
          ? t("threadAdapter.threadLengthTooLong")
          : "Thread length cannot exceed 60% of diameter",
      });
    }
  }

  // Validate hex grip size
  if (values.hexGripSize !== undefined && values.hexGripSize > 0) {
    const maxDiameter = Math.max(
      values.threadADiameter || 0,
      values.threadBDiameter || 0
    );
    if (values.hexGripSize < maxDiameter + 4) {
      errors.push({
        parameterId: "hexGripSize",
        message: t
          ? t("threadAdapter.hexGripTooSmall")
          : "Hex grip size must be at least 4mm larger than the maximum thread diameter, or set to 0 for round body",
      });
    }
  }

  // Validate thread pitch is printable (minimum 0.8mm)
  if (values.threadAPitch !== undefined && values.threadAPitch < 0.8) {
    errors.push({
      parameterId: "threadAPitch",
      message: t
        ? t("threadAdapter.pitchTooSmall")
        : "Thread pitch must be at least 0.8mm for printability",
    });
  }

  if (values.threadBPitch !== undefined && values.threadBPitch < 0.8) {
    errors.push({
      parameterId: "threadBPitch",
      message: t
        ? t("threadAdapter.pitchTooSmall")
        : "Thread pitch must be at least 0.8mm for printability",
    });
  }

  return errors;
}

/**
 * Calculate dynamic constraints for thread adapter parameters
 * Adjusts parameter ranges based on current values
 */
export function calculateThreadAdapterConstraints(
  schema: ParameterSchema,
  values: ParameterValues
): Record<string, DynamicConstraints> {
  const constraints: Record<string, DynamicConstraints> = {};

  // Calculate dynamic max for threadALength based on threadADiameter (60% rule)
  if (values.threadADiameter !== undefined && schema.threadALength) {
    const threadALengthDef = schema.threadALength as NumberParameterDefinition;
    const maxThreadALength = values.threadADiameter * 0.6;
    constraints.threadALength = {
      max: Math.min(threadALengthDef.max || 30, maxThreadALength),
    };
  }

  // Calculate dynamic max for threadBLength based on threadBDiameter (60% rule)
  if (values.threadBDiameter !== undefined && schema.threadBLength) {
    const threadBLengthDef = schema.threadBLength as NumberParameterDefinition;
    const maxThreadBLength = values.threadBDiameter * 0.6;
    constraints.threadBLength = {
      max: Math.min(threadBLengthDef.max || 30, maxThreadBLength),
    };
  }

  // Calculate dynamic min for hexGripSize based on max diameter
  if (
    values.hexGripSize !== undefined &&
    values.hexGripSize > 0 &&
    schema.hexGripSize
  ) {
    const hexGripSizeDef = schema.hexGripSize as NumberParameterDefinition;
    const maxDiameter = Math.max(
      values.threadADiameter || 0,
      values.threadBDiameter || 0
    );
    constraints.hexGripSize = {
      min: Math.max(hexGripSizeDef.min || 0, maxDiameter + 4),
    };
  }

  // Enforce minimum pitch of 0.8mm for printability
  if (schema.threadAPitch) {
    const threadAPitchDef = schema.threadAPitch as NumberParameterDefinition;
    constraints.threadAPitch = {
      min: Math.max(threadAPitchDef.min || 0.5, 0.8),
    };
  }

  if (schema.threadBPitch) {
    const threadBPitchDef = schema.threadBPitch as NumberParameterDefinition;
    constraints.threadBPitch = {
      min: Math.max(threadBPitchDef.min || 0.5, 0.8),
    };
  }

  return constraints;
}
