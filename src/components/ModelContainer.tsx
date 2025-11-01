"use client";

/**
 * Model Container Component
 * Manages model generation and mesh conversion
 */

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import * as THREE from "three";
import type { ParameterValues } from "@/types/parameters";
import ModelViewer from "./ModelViewer";

// Import Replicad type for shape
type ReplicadShape = any; // Will be the actual Replicad shape type

interface ModelContainerProps {
  /** Parameter values for model generation */
  parameters: ParameterValues;
  /** Callback when loading state changes */
  onLoadingChange?: (loading: boolean) => void;
  /** Callback when shape is generated (for export) */
  onShapeChange?: (shape: ReplicadShape | null) => void;
}

export default function ModelContainer({
  parameters,
  onLoadingChange,
  onShapeChange,
}: ModelContainerProps) {
  const t = useTranslations("Common");
  const [mesh, setMesh] = useState<THREE.Mesh | null>(null);
  const [shape, setShape] = useState<ReplicadShape | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track if Replicad has been initialized
  const isInitialized = useRef(false);

  // Update loading state callback
  useEffect(() => {
    onLoadingChange?.(loading);
  }, [loading, onLoadingChange]);

  // Update shape callback
  useEffect(() => {
    onShapeChange?.(shape);
  }, [shape, onShapeChange]);

  // Generate/regenerate model when parameters change
  useEffect(() => {
    async function generateModel() {
      try {
        setLoading(true);
        setError(null);

        // Initialize Replicad/OpenCASCADE WASM (only once)
        if (!isInitialized.current) {
          const { initReplicad } = await import("@/lib/replicadInit");
          await initReplicad();
          isInitialized.current = true;
        }

        // Dynamically import Replicad modules (client-side only)
        const { buildHoseAdapter } = await import("@/models/hoseAdapter");
        const { createMeshFromShape } = await import("@/lib/meshConverter");

        // Build the Replicad model with current parameters
        const replicadShape = buildHoseAdapter(parameters);

        // Convert to Three.js mesh
        const threeMesh = await createMeshFromShape(replicadShape, 0.1, 0x5588ff);

        // Update both mesh (for viewer) and shape (for export)
        setMesh(threeMesh);
        setShape(replicadShape);
      } catch (err) {
        console.error("Error generating model:", err);
        setError(err instanceof Error ? err.message : "Failed to generate model");
      } finally {
        setLoading(false);
      }
    }

    generateModel();
  }, [parameters]); // Regenerate whenever parameters change

  // Reset view handler
  const handleResetView = () => {
    // @ts-ignore - resetCameraView is attached to window in ModelViewer
    if (typeof window !== "undefined" && window.resetCameraView) {
      // @ts-ignore
      window.resetCameraView();
    }
  };

  return (
    <div className="w-full h-full relative">
      {error && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-3 underline hover:no-underline"
          >
            {t("dismiss")}
          </button>
        </div>
      )}

      {/* Reset View Button */}
      <button
        onClick={handleResetView}
        className="absolute top-4 right-4 z-10 bg-white hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-md shadow-md transition-colors disabled:opacity-50"
        disabled={loading}
      >
        {t("resetView")}
      </button>

      <ModelViewer mesh={mesh} loading={loading} />
    </div>
  );
}
