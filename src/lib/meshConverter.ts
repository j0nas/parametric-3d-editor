"use client";

/**
 * Replicad to Three.js Mesh Converter
 * Converts Replicad solid geometry to Three.js BufferGeometry
 */

import * as THREE from "three";
import type { Solid } from "replicad";

/**
 * Convert a Replicad solid to Three.js BufferGeometry
 *
 * @param shape - Replicad solid shape to convert
 * @param tolerance - Tessellation tolerance (lower = more detail, default: 0.1)
 * @returns Three.js BufferGeometry
 */
export async function convertToThreeMesh(
  shape: Solid,
  tolerance: number = 0.1
): Promise<THREE.BufferGeometry> {
  // Get the triangulated mesh from Replicad
  const mesh = await shape.mesh({ tolerance, angularTolerance: 30 });

  // Create Three.js BufferGeometry
  const geometry = new THREE.BufferGeometry();

  // Convert vertices
  const vertices = new Float32Array(mesh.vertices);
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

  // Convert triangle indices
  const indices = new Uint32Array(mesh.triangles);
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));

  // Compute normals for proper lighting
  geometry.computeVertexNormals();

  return geometry;
}

/**
 * Create a Three.js mesh from a Replicad solid with default material
 *
 * @param shape - Replicad solid shape
 * @param tolerance - Tessellation tolerance
 * @param color - Material color (default: light blue)
 * @returns Three.js Mesh
 */
export async function createMeshFromShape(
  shape: Solid,
  tolerance: number = 0.1,
  color: number = 0x5588ff
): Promise<THREE.Mesh> {
  const geometry = await convertToThreeMesh(shape, tolerance);

  // Create a material with realistic shading
  const material = new THREE.MeshStandardMaterial({
    color,
    metalness: 0.3,
    roughness: 0.6,
    side: THREE.FrontSide, // Only render outer faces (proper CAD solid)
    // Removed transparency - not needed for solid objects, prevents artifacts
  });

  const mesh = new THREE.Mesh(geometry, material);

  // Enable shadow casting and receiving
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return mesh;
}
