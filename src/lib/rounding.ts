/**
 * Rounding and Snapping Utilities
 * Provides precise rounding and snapping for parametric values
 */

import type {
  ParameterSchema,
  ParameterValues,
  ParameterDefinition,
  NumberParameterDefinition,
} from "@/types/parameters";

/**
 * Standard 3D printing nozzle sizes (in mm)
 * Common nozzle diameters for FDM printers
 */
export const NOZZLE_SIZES = [0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1.0] as const;

/**
 * Manufacturing resolution (0.1mm)
 * All dimensions will be rounded to this precision
 */
export const RESOLUTION = 0.1;

/**
 * Round a value to the specified resolution
 *
 * @param value - Value to round
 * @param resolution - Resolution to round to (default: 0.1mm)
 * @returns Rounded value
 *
 * @example
 * roundToResolution(1.234, 0.1) // => 1.2
 * roundToResolution(1.278, 0.1) // => 1.3
 */
export function roundToResolution(
  value: number,
  resolution: number = RESOLUTION
): number {
  return Math.round(value / resolution) * resolution;
}

/**
 * Snap a value to the nearest multiple of a given increment
 *
 * @param value - Value to snap
 * @param multiple - Multiple to snap to
 * @returns Snapped value
 *
 * @example
 * snapToMultiple(1.23, 0.4) // => 1.2 (3 × 0.4)
 * snapToMultiple(2.7, 0.5) // => 2.5 (5 × 0.5)
 */
export function snapToMultiple(value: number, multiple: number): number {
  return Math.round(value / multiple) * multiple;
}

/**
 * Snap a value to the nearest nozzle size multiple
 *
 * Useful for wall thickness and other dimensions that should align
 * with 3D printing nozzle widths for optimal print quality.
 *
 * @param value - Value to snap
 * @param nozzleSize - Nozzle diameter (default: 0.4mm)
 * @returns Value snapped to nozzle multiple
 *
 * @example
 * snapToNozzle(2.1, 0.4) // => 2.0 (5 × 0.4mm)
 * snapToNozzle(2.3, 0.4) // => 2.4 (6 × 0.4mm)
 */
export function snapToNozzle(value: number, nozzleSize: number = 0.4): number {
  const snapped = snapToMultiple(value, nozzleSize);
  // Ensure we maintain the minimum resolution
  return roundToResolution(snapped);
}

/**
 * Round a parameter value according to its schema definition
 *
 * Applies the parameter's step size and precision constraints.
 * Only applies to number-type parameters; other types return the value unchanged.
 *
 * @param value - Value to round
 * @param definition - Parameter definition with step and precision
 * @returns Rounded value conforming to parameter constraints
 */
export function roundParameter(
  value: number,
  definition: ParameterDefinition
): number {
  // Only round numeric parameters; return other types unchanged
  if (definition.type && definition.type !== "number") {
    return value;
  }

  // Type assertion safe here because we've checked type === "number" or undefined
  const numDef = definition as NumberParameterDefinition;

  // First snap to the parameter's step size
  let rounded = snapToMultiple(value, numDef.step);

  // Then apply resolution rounding
  rounded = roundToResolution(rounded, RESOLUTION);

  // Finally, apply precision constraints if specified
  if (numDef.precision !== undefined) {
    const factor = Math.pow(10, numDef.precision);
    rounded = Math.round(rounded * factor) / factor;
  }

  // Clamp to min/max bounds
  rounded = Math.max(numDef.min, Math.min(numDef.max, rounded));

  return rounded;
}

/**
 * Round all parameter values according to their schema definitions
 *
 * @param values - Parameter values to round
 * @param schema - Parameter schema with definitions
 * @returns New parameter values with all values rounded
 */
export function roundAllParameters(
  values: ParameterValues,
  schema: ParameterSchema
): ParameterValues {
  const rounded: ParameterValues = {};

  for (const [key, value] of Object.entries(values)) {
    const definition = schema[key];
    if (definition) {
      rounded[key] = roundParameter(value, definition);
    } else {
      // If no definition found, apply default resolution rounding
      rounded[key] = roundToResolution(value);
    }
  }

  return rounded;
}

/**
 * Apply nozzle-based snapping to specific parameters
 *
 * Useful for wall thickness and other parameters that should align
 * with 3D printing nozzle multiples
 *
 * @param values - Parameter values
 * @param parameterIds - Array of parameter IDs to snap to nozzle multiples
 * @param nozzleSize - Nozzle diameter (default: 0.4mm)
 * @returns New parameter values with specified parameters snapped to nozzle multiples
 */
export function applyNozzleSnapping(
  values: ParameterValues,
  parameterIds: string[],
  nozzleSize: number = 0.4
): ParameterValues {
  const snapped = { ...values };

  for (const id of parameterIds) {
    if (snapped[id] !== undefined) {
      snapped[id] = snapToNozzle(snapped[id], nozzleSize);
    }
  }

  return snapped;
}

/**
 * Get the closest nozzle size for a given value
 *
 * @param value - Value to find closest nozzle size for
 * @returns Closest standard nozzle size
 */
export function getClosestNozzleSize(value: number): number {
  return NOZZLE_SIZES.reduce((prev, curr) =>
    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
  );
}

/**
 * Check if a value is a multiple of the given increment (within tolerance)
 *
 * @param value - Value to check
 * @param multiple - Multiple to check against
 * @param tolerance - Floating-point tolerance (default: 0.0001)
 * @returns True if value is a multiple of the increment
 */
export function isMultipleOf(
  value: number,
  multiple: number,
  tolerance: number = 0.0001
): boolean {
  const remainder = value % multiple;
  return (
    Math.abs(remainder) < tolerance ||
    Math.abs(remainder - multiple) < tolerance
  );
}
