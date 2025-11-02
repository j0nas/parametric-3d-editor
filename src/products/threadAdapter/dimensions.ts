/**
 * Thread Adapter Dimensions Calculator
 * Calculates derived dimensions from parameter values
 */

import type { ParameterValues } from "@/types/parameters";
import type {
  DimensionReadout,
  TranslationFunction,
} from "@/products/registry";

const WALL_THICKNESS = 2.5; // Match the constant in threadAdapter.ts

/**
 * Calculate thread adapter dimensions for display
 * @param values - Current parameter values
 * @param t - Translation function
 * @returns Array of dimension readouts
 */
export function calculateThreadAdapterDimensions(
  values: ParameterValues,
  t: TranslationFunction
): DimensionReadout[] {
  const {
    threadADiameter = 0,
    threadAPitch = 0,
    threadAType = 0,
    threadALength = 0,
    threadBDiameter = 0,
    threadBPitch = 0,
    threadBType = 0,
    threadBLength = 0,
    bodyLength = 0,
    hollow = 1,
  } = values;

  // Calculate outer diameters based on thread type
  const threadAOuterDiameter =
    threadAType === 1 // female
      ? threadADiameter + 2 * WALL_THICKNESS
      : threadADiameter;

  const threadBOuterDiameter =
    threadBType === 1 // female
      ? threadBDiameter + 2 * WALL_THICKNESS
      : threadBDiameter;

  const totalLength = threadALength + bodyLength + threadBLength;

  const dimensions: DimensionReadout[] = [
    {
      label: t("calculatedDimensions.threadAOuterDiameter"),
      value: threadAOuterDiameter,
      unit: "mm",
      precision: 1,
    },
    {
      label: t("calculatedDimensions.threadBOuterDiameter"),
      value: threadBOuterDiameter,
      unit: "mm",
      precision: 1,
    },
    {
      label: t("calculatedDimensions.totalLength"),
      value: totalLength,
      unit: "mm",
      precision: 1,
    },
    {
      label: t("calculatedDimensions.wallThickness"),
      value: WALL_THICKNESS,
      unit: "mm",
      precision: 1,
    },
  ];

  // Add inner passage diameter if hollow
  if (hollow === 1) {
    const threadAInnerDiameter =
      threadAType === 0 // male
        ? threadADiameter - threadAPitch * 0.8
        : threadADiameter - threadAPitch * 0.6;

    const threadBInnerDiameter =
      threadBType === 0 // male
        ? threadBDiameter - threadBPitch * 0.8
        : threadBDiameter - threadBPitch * 0.6;

    const passageDiameter = Math.min(
      threadAInnerDiameter,
      threadBInnerDiameter
    );

    dimensions.push({
      label: t("calculatedDimensions.innerPassageDiameter"),
      value: passageDiameter,
      unit: "mm",
      precision: 1,
    });
  }

  return dimensions;
}
