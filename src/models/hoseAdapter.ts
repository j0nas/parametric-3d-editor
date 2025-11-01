"use client";

/**
 * Vacuum Hose Adapter Model
 * Generates parametric 3D geometry using Replicad
 */

import { makeCylinder, drawCircle } from "replicad";
import type { ParameterValues } from "@/types/parameters";

/**
 * Build a vacuum hose adapter with the given parameters
 *
 * The adapter consists of:
 * - Two cylindrical ends with different diameters
 * - A tapered transition section connecting them
 * - Optional grip ridges on each end
 * - Hollowed out using shell operation for truly open ends
 *
 * @param params - Parameter values for the adapter
 * @returns Replicad solid representing the adapter
 */
export function buildHoseAdapter(params: ParameterValues) {
  const {
    innerDiameter,
    outerDiameter,
    length,
    wallThickness,
    taperLength,
    ridgeCount,
    ridgeDepth,
    ridgeWidth,
  } = params;

  // Calculate derived dimensions
  const smallInnerRadius = innerDiameter / 2;
  const smallOuterRadius = smallInnerRadius + wallThickness;
  const largeInnerRadius = outerDiameter / 2;
  const largeOuterRadius = largeInnerRadius + wallThickness;

  // Calculate lengths for each section
  const endLength = (length - taperLength) / 2;

  // Ensure we have valid geometry
  if (endLength < 0) {
    throw new Error(
      "Taper length cannot be greater than total length minus minimum end lengths"
    );
  }

  // Build OUTER shape - solid body representing the outside
  const outerSmallEnd = drawCircle(smallOuterRadius)
    .sketchOnPlane("XY", 0)
    .extrude(endLength) as any;

  const outerTaperBottom = drawCircle(smallOuterRadius)
    .sketchOnPlane("XY", endLength) as any;
  const outerTaperTop = drawCircle(largeOuterRadius)
    .sketchOnPlane("XY", endLength + taperLength) as any;
  const outerTaper = outerTaperBottom.loftWith(outerTaperTop) as any;

  const outerLargeEnd = drawCircle(largeOuterRadius)
    .sketchOnPlane("XY", endLength + taperLength)
    .extrude(endLength) as any;

  let outerBody = outerSmallEnd.fuse(outerTaper).fuse(outerLargeEnd) as any;

  // Add ridges to outer body
  if (ridgeCount > 0 && ridgeDepth > 0) {
    const ridgeSpacing = endLength / (ridgeCount + 1);

    for (let i = 1; i <= ridgeCount; i++) {
      const ridgeZ = i * ridgeSpacing - ridgeWidth / 2;
      const ridge = makeCylinder(
        smallOuterRadius + ridgeDepth,
        ridgeWidth
      ).translate(0, 0, ridgeZ);
      outerBody = outerBody.fuse(ridge);
    }

    for (let i = 1; i <= ridgeCount; i++) {
      const ridgeZ =
        endLength + taperLength + i * ridgeSpacing - ridgeWidth / 2;
      const ridge = makeCylinder(
        largeOuterRadius + ridgeDepth,
        ridgeWidth
      ).translate(0, 0, ridgeZ);
      outerBody = outerBody.fuse(ridge);
    }
  }

  // Build INNER shape - solid body representing the hollow cavity
  const innerSmallEnd = drawCircle(smallInnerRadius)
    .sketchOnPlane("XY", 0)
    .extrude(endLength) as any;

  const innerTaperBottom = drawCircle(smallInnerRadius)
    .sketchOnPlane("XY", endLength) as any;
  const innerTaperTop = drawCircle(largeInnerRadius)
    .sketchOnPlane("XY", endLength + taperLength) as any;
  const innerTaper = innerTaperBottom.loftWith(innerTaperTop) as any;

  const innerLargeEnd = drawCircle(largeInnerRadius)
    .sketchOnPlane("XY", endLength + taperLength)
    .extrude(endLength) as any;

  const innerBody = innerSmallEnd.fuse(innerTaper).fuse(innerLargeEnd) as any;

  // CUT the inner body from the outer body to create a hollow shell
  let body = outerBody.cut(innerBody);

  // Center the model at the origin
  const centerOffset = -length / 2;
  body = body.translate(0, 0, centerOffset);

  // The model is now complete - truly hollow with open ends for vacuum airflow
  return body;
}

/**
 * Helper function to validate that the model can be built with given parameters
 * Returns true if the parameters will produce valid geometry
 */
export function canBuildAdapter(params: ParameterValues): boolean {
  const { length, taperLength } = params;

  // Check if taper length is valid
  const minEndLength = 5; // Minimum length for each end section
  if (taperLength > length - 2 * minEndLength) {
    return false;
  }

  return true;
}
