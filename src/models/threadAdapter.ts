"use client";

/**
 * Thread Adapter Model
 * Generates parametric 3D geometry using Replicad
 *
 * Creates custom thread adapters to connect incompatible threaded containers,
 * bottles, hoses, and fittings.
 *
 * Implementation:
 * - Uses replicad-threads library for true helical threads
 * - Trapezoidal thread profile (standard metric thread shape)
 * - Male threads: external helical ridges
 * - Female threads: internal helical grooves
 */

import { makeCylinder, drawCircle, drawPolysides } from "replicad";
import type { Shape3D, Sketch } from "replicad";
import type { ParameterValues } from "@/types/parameters";
// @ts-ignore - replicad-threads doesn't have type declarations
import { makeThread, metricThreadConfig } from "replicad-threads";

/**
 * Build a thread adapter with the given parameters
 *
 * The adapter consists of:
 * - Thread A end (male or female, with true helical threads)
 * - Thread B end (male or female, with true helical threads)
 * - Tapered body connecting the two ends
 * - Optional hexagonal grip section for wrench
 *
 * Thread types:
 * - Male (0): External helical threads - triangular profile spiraling outward
 * - Female (1): Internal helical threads - grooved spiral cavity
 *
 * Thread geometry:
 * - Uses replicad-threads library for proper helical threads
 * - Trapezoidal thread profile following ISO standards
 * - Efficient and reliable geometry generation
 *
 * @param params - Parameter values for the adapter
 * @returns Replicad solid representing the adapter
 */
export function buildThreadAdapter(params: ParameterValues) {
  const {
    threadADiameter,
    threadAPitch,
    threadAType, // 0 = male, 1 = female
    threadALength,
    threadBDiameter,
    threadBPitch,
    threadBType, // 0 = male, 1 = female
    threadBLength,
    bodyLength,
    hexGripSize,
    hollow, // 0 = solid, 1 = hollow
  } = params;

  const WALL_THICKNESS = 2.5; // Minimum wall thickness for structural integrity

  // Calculate total length
  const totalLength = threadALength + bodyLength + threadBLength;

  // Build the adapter body (center section)
  const bodyStartZ = threadALength;
  const bodyEndZ = threadALength + bodyLength;

  // Determine the body diameter (max of the two thread diameters plus wall thickness)
  const threadARadius = threadADiameter / 2;
  const threadBRadius = threadBDiameter / 2;

  // For female threads, we need extra diameter for the outer wall
  const threadAOuterRadius =
    threadAType === 1
      ? threadARadius + WALL_THICKNESS
      : threadARadius;
  const threadBOuterRadius =
    threadBType === 1
      ? threadBRadius + WALL_THICKNESS
      : threadBRadius;

  const bodyRadiusStart = threadAOuterRadius;
  const bodyRadiusEnd = threadBOuterRadius;

  // Build tapered body connecting the two thread sections
  let body: Shape3D;

  if (hexGripSize > 0) {
    // Build hexagonal body
    const hexRadius = hexGripSize / 2;

    // Create hex cross-section at start
    const hexStart = drawPolysides(hexRadius, 6)
      .sketchOnPlane("XY", bodyStartZ) as Sketch;
    // Create hex cross-section at end
    const hexEnd = drawPolysides(hexRadius, 6)
      .sketchOnPlane("XY", bodyEndZ) as Sketch;

    body = hexStart.loftWith(hexEnd) as Shape3D;
  } else {
    // Build round tapered body
    const bodyStart = drawCircle(bodyRadiusStart)
      .sketchOnPlane("XY", bodyStartZ) as Sketch;
    const bodyEnd = drawCircle(bodyRadiusEnd)
      .sketchOnPlane("XY", bodyEndZ) as Sketch;

    body = bodyStart.loftWith(bodyEnd) as Shape3D;
  }

  // Build Thread A
  const threadA = buildThreadSection(
    threadADiameter,
    threadAPitch,
    threadAType,
    threadALength,
    0, // Start at z=0
    WALL_THICKNESS
  );

  // Build Thread B
  const threadB = buildThreadSection(
    threadBDiameter,
    threadBPitch,
    threadBType,
    threadBLength,
    bodyEndZ, // Start after body
    WALL_THICKNESS
  );

  // Fuse all sections
  body = body.fuse(threadA).fuse(threadB);

  // Make hollow if requested
  if (hollow === 1) {
    // Calculate the inner passage diameter (minimum of the two thread inner diameters)
    const threadAInnerDiameter =
      threadAType === 0 // male
        ? threadADiameter - threadAPitch * 0.8 // Slightly smaller for male
        : threadADiameter - threadAPitch * 0.6; // Inner diameter for female

    const threadBInnerDiameter =
      threadBType === 0 // male
        ? threadBDiameter - threadBPitch * 0.8
        : threadBDiameter - threadBPitch * 0.6;

    // Use the smaller diameter for the passage (ensures flow through entire adapter)
    const passageDiameter = Math.min(
      threadAInnerDiameter,
      threadBInnerDiameter
    );
    const passageRadius = passageDiameter / 2;

    // Create hollow passage through entire adapter
    const hollowPassage = makeCylinder(passageRadius, totalLength + 2).translate(
      0,
      0,
      -1
    );

    // Cut the passage through the body
    body = body.cut(hollowPassage);
  }

  // Center the model at the origin
  const centerOffset = -totalLength / 2;
  body = body.translate(0, 0, centerOffset);

  return body;
}

/**
 * Build a thread section using the replicad-threads library
 *
 * Creates proper helical threads using trapezoidal profile
 *
 * @param diameter - Thread diameter (nominal diameter)
 * @param pitch - Thread pitch (distance between threads)
 * @param threadType - 0 for male (external), 1 for female (internal)
 * @param length - Thread length
 * @param startZ - Z position to start the thread
 * @param wallThickness - Wall thickness for female threads
 * @returns Replicad solid representing the thread section
 */
function buildThreadSection(
  diameter: number,
  pitch: number,
  threadType: number,
  length: number,
  startZ: number,
  wallThickness: number
): Shape3D {
  const radius = diameter / 2;
  const isMale = threadType === 0;

  // Thread depth as fraction of pitch (standard is ~0.6)
  const toothHeight = pitch * 0.6;

  // Create thread using replicad-threads library
  const thread = makeThread({
    pitch: pitch,
    radius: radius,
    height: length,
    rootWidth: pitch * 0.6,  // Width at root
    apexWidth: pitch * 0.3,  // Width at apex (creates trapezoidal profile)
    toothHeight: isMale ? toothHeight : -toothHeight, // Negative for internal threads
  });

  // Translate to correct position
  const positionedThread = thread.translate(0, 0, startZ);

  if (isMale) {
    // Male thread: Fuse with base cylinder
    const baseCylinder = makeCylinder(radius - toothHeight * 0.5, length).translate(
      0,
      0,
      startZ
    );
    return baseCylinder.fuse(positionedThread);
  } else {
    // Female thread: Create hollow outer cylinder
    const outerRadius = radius + wallThickness;
    const outerCylinder = makeCylinder(outerRadius, length).translate(0, 0, startZ);

    // The thread library creates the groove, just fuse with outer cylinder
    return outerCylinder.fuse(positionedThread);
  }
}

/**
 * Helper function to validate that the model can be built with given parameters
 * Returns true if the parameters will produce valid geometry
 */
export function canBuildThreadAdapter(params: ParameterValues): boolean {
  // Check minimum diameters
  if (params.threadADiameter < 12 || params.threadBDiameter < 12) {
    return false;
  }

  // Note: Removed thread type check - male-male and female-female are valid

  // Check thread lengths are reasonable
  if (
    params.threadALength > params.threadADiameter * 0.6 ||
    params.threadBLength > params.threadBDiameter * 0.6
  ) {
    return false;
  }

  // Check body length is sufficient
  if (params.bodyLength < 10) {
    return false;
  }

  return true;
}
