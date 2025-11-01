/**
 * Hose Adapter Parameter Schema
 * Defines parameters for vacuum hose adapters
 */

import type { ParameterSchema } from "@/types/parameters";

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
 * Get translated hose adapter parameter schema
 * Takes a translation function and returns the schema with translated labels and help text
 *
 * This function injects translated labels and help text into the base schema,
 * avoiding duplication of numeric metadata (min, max, default, step, unit, precision)
 */
export function getTranslatedHoseAdapterSchema<T extends (...args: any[]) => string>(
  t: T
): ParameterSchema {
  return {
    innerDiameter: {
      ...HOSE_ADAPTER_SCHEMA.innerDiameter,
      label: t("innerDiameter.label"),
      help: t("innerDiameter.help"),
    },
    outerDiameter: {
      ...HOSE_ADAPTER_SCHEMA.outerDiameter,
      label: t("outerDiameter.label"),
      help: t("outerDiameter.help"),
    },
    length: {
      ...HOSE_ADAPTER_SCHEMA.length,
      label: t("length.label"),
      help: t("length.help"),
    },
    wallThickness: {
      ...HOSE_ADAPTER_SCHEMA.wallThickness,
      label: t("wallThickness.label"),
      help: t("wallThickness.help"),
    },
    taperLength: {
      ...HOSE_ADAPTER_SCHEMA.taperLength,
      label: t("taperLength.label"),
      help: t("taperLength.help"),
    },
    ridgeCount: {
      ...HOSE_ADAPTER_SCHEMA.ridgeCount,
      label: t("ridgeCount.label"),
      help: t("ridgeCount.help"),
    },
    ridgeDepth: {
      ...HOSE_ADAPTER_SCHEMA.ridgeDepth,
      label: t("ridgeDepth.label"),
      help: t("ridgeDepth.help"),
    },
    ridgeWidth: {
      ...HOSE_ADAPTER_SCHEMA.ridgeWidth,
      label: t("ridgeWidth.label"),
      help: t("ridgeWidth.help"),
    },
  };
}
