/**
 * Drain Strainer Parameter Schema
 * Defines parameters for drain strainers
 */

import type { ParameterSchema } from "@/types/parameters";

/**
 * Drain Strainer Parameter Schema
 * For custom sink drain strainers with configurable hole patterns.
 * Features perforated drainage holes in concentric circular patterns.
 */
export const DRAIN_STRAINER_SCHEMA: ParameterSchema = {
  diameter: {
    id: "diameter",
    label: "Overall Diameter",
    help: "Total diameter of the strainer to fit your drain",
    min: 40,
    max: 120,
    default: 75,
    step: 1,
    unit: "mm",
    precision: 0,
  },
  depth: {
    id: "depth",
    label: "Basket Depth",
    help: "How deep the strainer basket extends into the drain",
    min: 10,
    max: 50,
    default: 20,
    step: 1,
    unit: "mm",
    precision: 0,
  },
  rimHeight: {
    id: "rimHeight",
    label: "Rim Height",
    help: "Height of the flat rim that sits on top of the drain",
    min: 1,
    max: 5,
    default: 2,
    step: 0.5,
    unit: "mm",
    precision: 1,
  },
  wallThickness: {
    id: "wallThickness",
    label: "Wall Thickness",
    help: "Thickness of the strainer walls and rim",
    min: 1,
    max: 4,
    default: 1.5,
    step: 0.1,
    unit: "mm",
    precision: 1,
  },
  holeDiameter: {
    id: "holeDiameter",
    label: "Hole Diameter",
    help: "Size of each drainage hole",
    min: 2,
    max: 10,
    default: 4,
    step: 0.5,
    unit: "mm",
    precision: 1,
  },
  holeRows: {
    id: "holeRows",
    label: "Hole Rows",
    help: "Number of concentric circular rows of holes",
    min: 2,
    max: 6,
    default: 3,
    step: 1,
    unit: "",
    precision: 0,
  },
  holesPerRow: {
    id: "holesPerRow",
    label: "Holes Per Row",
    help: "Approximate number of holes in each row",
    min: 4,
    max: 16,
    default: 8,
    step: 1,
    unit: "",
    precision: 0,
  },
  centerPost: {
    id: "centerPost",
    label: "Center Post Height",
    help: "Height of center post for easy removal (0 = no post)",
    min: 0,
    max: 20,
    default: 10,
    step: 1,
    unit: "mm",
    precision: 0,
  },
};

/**
 * Get translated drain strainer parameter schema
 * Takes a translation function and returns the schema with translated labels and help text
 */
export function getTranslatedDrainStrainerSchema<T extends (...args: any[]) => string>(
  t: T
): ParameterSchema {
  return {
    diameter: {
      id: "diameter",
      label: t("diameter.label"),
      help: t("diameter.help"),
      min: 40,
      max: 120,
      default: 75,
      step: 1,
      unit: "mm",
      precision: 0,
    },
    depth: {
      id: "depth",
      label: t("depth.label"),
      help: t("depth.help"),
      min: 10,
      max: 50,
      default: 20,
      step: 1,
      unit: "mm",
      precision: 0,
    },
    rimHeight: {
      id: "rimHeight",
      label: t("rimHeight.label"),
      help: t("rimHeight.help"),
      min: 1,
      max: 5,
      default: 2,
      step: 0.5,
      unit: "mm",
      precision: 1,
    },
    wallThickness: {
      id: "wallThickness",
      label: t("wallThickness.label"),
      help: t("wallThickness.help"),
      min: 1,
      max: 4,
      default: 1.5,
      step: 0.1,
      unit: "mm",
      precision: 1,
    },
    holeDiameter: {
      id: "holeDiameter",
      label: t("holeDiameter.label"),
      help: t("holeDiameter.help"),
      min: 2,
      max: 10,
      default: 4,
      step: 0.5,
      unit: "mm",
      precision: 1,
    },
    holeRows: {
      id: "holeRows",
      label: t("holeRows.label"),
      help: t("holeRows.help"),
      min: 2,
      max: 6,
      default: 3,
      step: 1,
      unit: "",
      precision: 0,
    },
    holesPerRow: {
      id: "holesPerRow",
      label: t("holesPerRow.label"),
      help: t("holesPerRow.help"),
      min: 4,
      max: 16,
      default: 8,
      step: 1,
      unit: "",
      precision: 0,
    },
    centerPost: {
      id: "centerPost",
      label: t("centerPost.label"),
      help: t("centerPost.help"),
      min: 0,
      max: 20,
      default: 10,
      step: 1,
      unit: "mm",
      precision: 0,
    },
  };
}
