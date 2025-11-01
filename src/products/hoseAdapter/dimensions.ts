/**
 * Hose Adapter Dimensions Calculator
 * Calculates derived dimensions from parameter values
 */

import type { ParameterValues } from "@/types/parameters";
import type { DimensionReadout, TranslationFunction } from "@/products/registry";

/**
 * Calculate hose adapter dimensions for display
 * @param values - Current parameter values
 * @param t - Translation function
 * @returns Array of dimension readouts
 */
export function calculateHoseAdapterDimensions(
  values: ParameterValues,
  t: TranslationFunction
): DimensionReadout[] {
  const {
    innerDiameter = 0,
    outerDiameter = 0,
    wallThickness = 0,
    length = 0,
    taperLength = 0,
    ridgeCount = 0,
  } = values;

  const dimensions: DimensionReadout[] = [
    {
      label: t("calculatedDimensions.smallEndOuterDiameter"),
      value: innerDiameter + 2 * wallThickness,
      unit: "mm",
      precision: 1,
    },
    {
      label: t("calculatedDimensions.largeEndOuterDiameter"),
      value: outerDiameter + 2 * wallThickness,
      unit: "mm",
      precision: 1,
    },
    {
      label: t("calculatedDimensions.endSectionLength"),
      value: (length - taperLength) / 2,
      unit: "mm",
      precision: 1,
    },
    {
      label: t("calculatedDimensions.diameterDifference"),
      value: outerDiameter - innerDiameter,
      unit: "mm",
      precision: 1,
    },
  ];

  // Add ridge spacing if ridges are present
  if (ridgeCount > 0) {
    const endLength = (length - taperLength) / 2;
    dimensions.push({
      label: t("calculatedDimensions.ridgeSpacing"),
      value: endLength / (ridgeCount + 1),
      unit: "mm",
      precision: 1,
    });
  }

  return dimensions;
}
