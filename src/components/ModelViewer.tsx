"use client";

/**
 * 3D Model Viewer Component
 * Displays parametric models using Three.js and React-three-fiber
 */

import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Grid } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useEffect } from "react";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";

interface ModelViewerProps {
  /** Three.js mesh to display */
  mesh: THREE.Mesh | null;
  /** Whether to show loading state */
  loading?: boolean;
}

/**
 * Scene component containing the 3D model, lights, and controls
 */
function Scene({ mesh }: { mesh: THREE.Mesh | null }) {
  const controlsRef = useRef<OrbitControlsType>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  // Store initial camera position for reset
  const initialCameraPosition = new THREE.Vector3(100, 100, 100);
  const initialCameraTarget = new THREE.Vector3(0, 0, 0);

  // Reset view function
  const resetView = () => {
    if (controlsRef.current && cameraRef.current) {
      cameraRef.current.position.copy(initialCameraPosition);
      controlsRef.current.target.copy(initialCameraTarget);
      controlsRef.current.update();
    }
  };

  // Expose reset function globally (can be called from parent)
  useEffect(() => {
    // @ts-ignore - attaching to window for demo purposes
    window.resetCameraView = resetView;
    return () => {
      // @ts-ignore
      delete window.resetCameraView;
    };
  }, []);

  return (
    <>
      {/* Camera */}
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[100, 100, 100]}
        fov={50}
      />

      {/* Orbit Controls */}
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        minDistance={20}
        maxDistance={500}
        target={[0, 0, 0]}
      />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />

      {/* Grid helper */}
      <Grid
        args={[200, 200]}
        cellSize={10}
        cellThickness={0.5}
        cellColor="#6b7280"
        sectionSize={50}
        sectionThickness={1}
        sectionColor="#374151"
        fadeDistance={400}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid
      />

      {/* The model mesh */}
      {mesh && <primitive object={mesh} />}
    </>
  );
}

/**
 * ModelViewer component - Main 3D viewer wrapper
 */
export default function ModelViewer({ mesh, loading = false }: ModelViewerProps) {
  return (
    <div className="w-full h-full relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 z-10">
          <div className="text-white text-lg">Loading model...</div>
        </div>
      )}
      <Canvas
        shadows
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1,
        }}
        className="bg-gray-950"
      >
        <Scene mesh={mesh} />
      </Canvas>
    </div>
  );
}
