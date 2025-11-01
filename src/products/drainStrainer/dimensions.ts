/**
 * Drain Strainer Dimensions Calculator
 * Calculates derived dimensions from parameter values
 */

import type { ParameterValues } from "@/types/parameters";
import type { DimensionReadout, TranslationFunction } from "@/products/registry";

/**
 * Calculate drain strainer dimensions for display
 * @param values - Current parameter values
 * @param t - Translation function
 * @returns Array of dimension readouts
 */
export function calculateDrainStrainerDimensions(
  values: ParameterValues,
  t: TranslationFunction
): DimensionReadout[] {
  const {
    diameter = 0,
    depth = 0,
    rimHeight = 0,
    wallThickness = 0,
    holeDiameter = 0,
    holeRows = 0,
    holesPerRow = 0,
  } = values;

  const innerDiameter = diameter - 2 * wallThickness;
  const totalHeight = rimHeight + depth;
  const approximateHoles = holeRows * holesPerRow;

  return [
    {
      label: t("calculatedDimensions.outerDiameter"),
      value: diameter,
    },
    {
      label: t("calculatedDimensions.innerDiameter"),
      value: innerDiameter,
    },
    {
      label: t("calculatedDimensions.totalHeight"),
      value: totalHeight,
    },
    {
      label: t("calculatedDimensions.basketDepth"),
      value: depth,
    },
    {
      label: t("calculatedDimensions.approximateHoles"),
      value: approximateHoles,
    },
  ];
}
