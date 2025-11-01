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
 * Get translated parameter schema
 * Takes a translation function and returns the schema with translated labels and help text
 */
export function getTranslatedSchema(
  t: (key: string) => string
): ParameterSchema {
  return {
    innerDiameter: {
      id: "innerDiameter",
      label: t("innerDiameter.label"),
      help: t("innerDiameter.help"),
      min: 10,
      max: 100,
      default: 32,
      step: 0.5,
      unit: "mm",
      precision: 1,
    },
    outerDiameter: {
      id: "outerDiameter",
      label: t("outerDiameter.label"),
      help: t("outerDiameter.help"),
      min: 15,
      max: 150,
      default: 38,
      step: 0.5,
      unit: "mm",
      precision: 1,
    },
    length: {
      id: "length",
      label: t("length.label"),
      help: t("length.help"),
      min: 20,
      max: 200,
      default: 60,
      step: 1,
      unit: "mm",
      precision: 0,
    },
    wallThickness: {
      id: "wallThickness",
      label: t("wallThickness.label"),
      help: t("wallThickness.help"),
      min: 1,
      max: 10,
      default: 2,
      step: 0.1,
      unit: "mm",
      precision: 1,
    },
    taperLength: {
      id: "taperLength",
      label: t("taperLength.label"),
      help: t("taperLength.help"),
      min: 10,
      max: 150,
      default: 40,
      step: 1,
      unit: "mm",
      precision: 0,
    },
    ridgeCount: {
      id: "ridgeCount",
      label: t("ridgeCount.label"),
      help: t("ridgeCount.help"),
      min: 0,
      max: 8,
      default: 3,
      step: 1,
      unit: "",
      precision: 0,
    },
    ridgeDepth: {
      id: "ridgeDepth",
      label: t("ridgeDepth.label"),
      help: t("ridgeDepth.help"),
      min: 0,
      max: 3,
      default: 0.8,
      step: 0.1,
      unit: "mm",
      precision: 1,
    },
    ridgeWidth: {
      id: "ridgeWidth",
      label: t("ridgeWidth.label"),
      help: t("ridgeWidth.help"),
      min: 1,
      max: 10,
      default: 3,
      step: 0.5,
      unit: "mm",
      precision: 1,
    },
  };
}

/**
 * Vacuum Hose Adapter Parameter Schema (without translations)
 * For use in contexts where translations are not available
 *
 * This adapter connects two vacuum hoses with different diameters.
 * It features a tapered body with optional ridges for secure fitting.
 */
export const HOSE_ADAPTER_SCHEMA: ParameterSchema = {
  innerDiameter: {
    id: "innerDiameter",
    label: "Inner Diameter",
    help: "Inner diameter of the smaller hose connection",
    min: 10,
    max: 100,
    default: 32,
    step: 0.5,
    unit: "mm",
    precision: 1,
  },
  outerDiameter: {
    id: "outerDiameter",
    label: "Outer Diameter",
    help: "Inner diameter of the larger hose connection",
    min: 15,
    max: 150,
    default: 38,
    step: 0.5,
    unit: "mm",
    precision: 1,
  },
  length: {
    id: "length",
    label: "Total Length",
    help: "Overall length of the adapter",
    min: 20,
    max: 200,
    default: 60,
    step: 1,
    unit: "mm",
    precision: 0,
  },
  wallThickness: {
    id: "wallThickness",
    label: "Wall Thickness",
    help: "Thickness of the adapter walls",
    min: 1,
    max: 10,
    default: 2,
    step: 0.1,
    unit: "mm",
    precision: 1,
  },
  taperLength: {
    id: "taperLength",
    label: "Taper Length",
    help: "Length of the tapered transition between diameters",
    min: 10,
    max: 150,
    default: 40,
    step: 1,
    unit: "mm",
    precision: 0,
  },
  ridgeCount: {
    id: "ridgeCount",
    label: "Ridge Count",
    help: "Number of grip ridges on each end (0 for smooth)",
    min: 0,
    max: 8,
    default: 3,
    step: 1,
    unit: "",
    precision: 0,
  },
  ridgeDepth: {
    id: "ridgeDepth",
    label: "Ridge Depth",
    help: "Depth of grip ridges (only applies if ridge count > 0)",
    min: 0,
    max: 3,
    default: 0.8,
    step: 0.1,
    unit: "mm",
    precision: 1,
  },
  ridgeWidth: {
    id: "ridgeWidth",
    label: "Ridge Width",
    help: "Width of each grip ridge",
    min: 1,
    max: 10,
    default: 3,
    step: 0.5,
    unit: "mm",
    precision: 1,
  },
};

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
