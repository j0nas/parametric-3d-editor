"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  HOSE_ADAPTER_SCHEMA,
  getDefaultValues,
  type ParameterValues,
} from "@/types/parameters";
import { validateParameters } from "@/lib/validation";
import { exportModel, getTimestampedFilename } from "@/lib/exportModel";
import type { ExportFormat } from "@/components/ExportPanel";

// Disable SSR for components that use Replicad
const ModelContainer = dynamic(() => import("@/components/ModelContainer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-950">
      <div className="text-white text-lg">Initializing 3D viewer...</div>
    </div>
  ),
});

const ParameterPanel = dynamic(() => import("@/components/ParameterPanel"), {
  ssr: false,
});

const ExportPanel = dynamic(() => import("@/components/ExportPanel"), {
  ssr: false,
});

export default function Home() {
  // Parameter state
  const [parameters, setParameters] = useState<ParameterValues>(
    getDefaultValues(HOSE_ADAPTER_SCHEMA)
  );

  // Loading state for model regeneration
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Current Replicad shape (for export)
  const [currentShape, setCurrentShape] = useState<any | null>(null);

  // Handle parameter changes from the panel
  const handleParameterChange = (newValues: ParameterValues) => {
    setParameters(newValues);
  };

  // Handle shape updates from ModelContainer
  const handleShapeChange = (shape: any | null) => {
    setCurrentShape(shape);
  };

  // Handle export
  const handleExport = async (format: ExportFormat) => {
    if (!currentShape) {
      throw new Error("No model available to export");
    }

    // Generate filename with timestamp
    const filename = getTimestampedFilename("hose-adapter");

    // Export the model
    await exportModel(currentShape, format, filename);
  };

  // Check if export should be disabled
  const validation = validateParameters(HOSE_ADAPTER_SCHEMA, parameters);
  const isExportDisabled = !validation.isValid || isRegenerating || !currentShape;

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          Parametric 3D Editor
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Vacuum Hose Adapter - Customize and export your design
        </p>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Parameter Panel (Left) */}
        <aside className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Parameters
          </h2>
          <ParameterPanel
            schema={HOSE_ADAPTER_SCHEMA}
            values={parameters}
            onChange={handleParameterChange}
            loading={isRegenerating}
          />
        </aside>

        {/* 3D Viewer (Right) */}
        <main className="flex-1 bg-gray-100 relative">
          <ModelContainer
            parameters={parameters}
            onLoadingChange={setIsRegenerating}
            onShapeChange={handleShapeChange}
          />
        </main>
      </div>

      {/* Export Controls (Bottom) */}
      <footer className="bg-white border-t border-gray-200 px-6 py-4 shadow-sm">
        <ExportPanel disabled={isExportDisabled} onExport={handleExport} />
      </footer>
    </div>
  );
}
