"use client";

/**
 * Drain Strainer Model
 * Generates parametric 3D geometry using Replicad
 *
 * A customizable sink drain strainer with:
 * - Perforated drainage holes in concentric circular patterns
 * - Flat rim to sit on drain opening
 * - Optional center post for easy removal
 */

import { makeCylinder, drawCircle } from "replicad";
import type { Shape3D } from "replicad";
import type { ParameterValues } from "@/types/parameters";

/**
 * Build a drain strainer with the given parameters
 *
 * The strainer consists of:
 * - A cylindrical basket that extends into the drain
 * - A flat rim on top that sits on the drain surface
 * - Drainage holes arranged in concentric circular rows
 * - Optional center post for grabbing/removal
 *
 * @param params - Parameter values for the strainer
 * @returns Replicad solid representing the strainer
 */
export function buildDrainStrainer(params: ParameterValues) {
  const {
    diameter,
    depth,
    rimHeight,
    wallThickness,
    holeDiameter,
    holeRows,
    holesPerRow,
    centerPost,
  } = params;

  const outerRadius = diameter / 2;
  const innerRadius = outerRadius - wallThickness;
  const holeRadius = holeDiameter / 2;

  // Build the main body - cylinder with bottom
  const outerCylinder = makeCylinder(outerRadius, depth + rimHeight).translate(
    0,
    0,
    0
  );

  // Create the hollow interior (leaving bottom solid for now, we'll add holes)
  const innerCylinder = makeCylinder(innerRadius, depth).translate(
    0,
    0,
    rimHeight
  );

  // Start with hollow basket
  let body = outerCylinder.cut(innerCylinder);

  // Add drainage holes in the bottom
  // The bottom is at z=0, with thickness = rimHeight
  const bottomCenter = rimHeight / 2;

  // Create holes in concentric circular rows
  for (let row = 0; row < holeRows; row++) {
    // Calculate radius for this row of holes
    // Distribute rows evenly from center to edge, leaving space at edge
    const maxHoleRadius = innerRadius - holeRadius - wallThickness;
    const rowRadius = ((row + 1) / (holeRows + 1)) * maxHoleRadius;

    // Calculate number of holes for this row
    // Outer rows can fit more holes
    const circumference = 2 * Math.PI * rowRadius;
    const minHoleSpacing = holeDiameter * 1.5; // Minimum space between holes
    const maxHolesInRow = Math.floor(circumference / minHoleSpacing);
    const actualHolesInRow = Math.min(holesPerRow, maxHolesInRow);

    // Skip if row radius is too small or would create invalid geometry
    if (rowRadius < holeRadius * 2 || actualHolesInRow < 3) {
      continue;
    }

    // Place holes around the circle
    for (let i = 0; i < actualHolesInRow; i++) {
      const angle = (2 * Math.PI * i) / actualHolesInRow;
      const x = Math.cos(angle) * rowRadius;
      const y = Math.sin(angle) * rowRadius;

      // Create hole cylinder going through the bottom
      const hole = makeCylinder(holeRadius, rimHeight + 2).translate(
        x,
        y,
        -1
      );
      body = body.cut(hole);
    }
  }

  // Add holes in the side walls of the basket
  // Create vertical rows of holes on the cylindrical wall
  const sideHoleCount = Math.floor(depth / (holeDiameter * 2));
  if (sideHoleCount > 0) {
    const angleStep = (2 * Math.PI) / holesPerRow;

    for (let i = 0; i < holesPerRow; i++) {
      const angle = i * angleStep;
      const x = Math.cos(angle) * (outerRadius - wallThickness / 2);
      const y = Math.sin(angle) * (outerRadius - wallThickness / 2);

      for (let j = 0; j < sideHoleCount; j++) {
        const z = rimHeight + (j + 0.5) * (depth / sideHoleCount);

        // Create horizontal holes through the wall
        // These need to be oriented radially
        const hole = makeCylinder(holeRadius, wallThickness + 1)
          .rotate(90, [0, 1, 0])
          .translate(x, y, z);

        body = body.cut(hole);
      }
    }
  }

  // Add center post if requested
  if (centerPost > 0) {
    const postRadius = Math.min(holeDiameter, innerRadius / 4);
    const post = makeCylinder(postRadius, centerPost).translate(
      0,
      0,
      rimHeight + depth
    );
    body = body.fuse(post);
  }

  // Center the model at origin (bottom at z=0, centered in XY)
  body = body.translate(0, 0, 0);

  return body;
}

/**
 * Helper function to validate that the model can be built with given parameters
 * Returns true if the parameters will produce valid geometry
 */
export function canBuildStrainer(params: ParameterValues): boolean {
  const { diameter, holeDiameter, wallThickness, holeRows } = params;

  // Check that holes aren't too large for the diameter
  const innerRadius = diameter / 2 - wallThickness;
  if (holeDiameter >= innerRadius) {
    return false;
  }

  // Check that we have room for at least one row of holes
  if (holeRows < 1) {
    return false;
  }

  return true;
}
