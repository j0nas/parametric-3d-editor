"use client";

import { useState, use } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { getProductBySlug } from "@/products";
import { getDefaultValues, type ParameterValues } from "@/types/parameters";
import { validateParameters, adjustToValidConstraints } from "@/lib/validation";
import { exportModel, getTimestampedFilename } from "@/lib/exportModel";
import type { ExportFormat } from "@/components/ExportPanel";

interface ProductPageProps {
  params: Promise<{
    locale: string;
    productSlug: string;
  }>;
}

// Loading component for 3D viewer
function ModelContainerLoading({ translationNamespace }: { translationNamespace: string }) {
  const t = useTranslations(translationNamespace as any) as any;
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-950">
      <div className="text-white text-lg">{t("initializing")}</div>
    </div>
  );
}

// Loading component for parameter panel
function ParameterPanelLoading() {
  return (
    <div className="space-y-4">
      <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
    </div>
  );
}

// Loading component for export panel
function ExportPanelLoading() {
  return (
    <div className="flex items-center gap-4">
      <div className="h-10 w-40 bg-gray-200 rounded animate-pulse"></div>
    </div>
  );
}

// Disable SSR for components that use Replicad
const ModelContainer = dynamic(() => import("@/components/ModelContainer"), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-gray-950">
    <div className="text-white text-lg">Loading 3D viewer...</div>
  </div>,
});

const ParameterPanel = dynamic(() => import("@/components/ParameterPanel"), {
  ssr: false,
  loading: ParameterPanelLoading,
});

const ExportPanel = dynamic(() => import("@/components/ExportPanel"), {
  ssr: false,
  loading: ExportPanelLoading,
});

export default function ProductPage({ params }: ProductPageProps) {
  const { productSlug } = use(params);

  // Get product configuration from registry
  const product = getProductBySlug(productSlug);

  if (!product) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Product Not Found</h1>
          <p className="mt-2 text-gray-600">
            The product "{productSlug}" could not be found.
          </p>
        </div>
      </div>
    );
  }

  // Get translations for this specific product
  const t = useTranslations(product.translationNamespace as any) as any;
  const tParams = useTranslations(`${product.translationNamespace}.parameters` as any) as any;
  const tValidation = useTranslations("Validation");

  // Get translated schema
  const schema = product.schemaFactory(tParams);

  // Parameter state - adjust defaults to be valid on initial load
  const [parameters, setParameters] = useState<ParameterValues>(() => {
    const defaults = getDefaultValues(product.baseSchema);
    return adjustToValidConstraints(
      product.baseSchema,
      defaults,
      product.constraintsCalculator
    );
  });

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

    // Generate filename with timestamp using product slug
    const filename = getTimestampedFilename(product.slug);

    // Export the model
    await exportModel(currentShape, format, filename);
  };

  // Check if export should be disabled
  const validation = validateParameters(
    schema,
    parameters,
    tValidation,
    product.customValidation
  );
  const isExportDisabled = !validation.isValid || isRegenerating || !currentShape;

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">{t("name")}</h1>
        <p className="text-sm text-gray-500 mt-1">{t("description")}</p>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Parameter Panel (Left) */}
        <aside className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t("parametersHeading")}
          </h2>
          <ParameterPanel
            schema={schema}
            values={parameters}
            onChange={handleParameterChange}
            loading={isRegenerating}
            customValidation={product.customValidation}
            customConstraintsCalculator={product.constraintsCalculator}
            translationNamespace={product.translationNamespace}
            dimensionsCalculator={product.dimensionsCalculator}
          />
        </aside>

        {/* 3D Viewer (Right) */}
        <main className="flex-1 bg-gray-100 relative">
          <ModelContainer
            parameters={parameters}
            modelBuilder={product.modelBuilder}
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
