"use client";

/**
 * Export Panel Component
 * Handles format selection and file export for 3D models
 */

import { useState } from "react";
import { useTranslations } from "next-intl";

export type ExportFormat = "stl" | "step";

interface ExportPanelProps {
  /** Whether export should be disabled (invalid params or loading) */
  disabled: boolean;
  /** Callback to trigger export with selected format */
  onExport: (format: ExportFormat) => Promise<void>;
}

export default function ExportPanel({ disabled, onExport }: ExportPanelProps) {
  const t = useTranslations("ExportPanel");
  const [format, setFormat] = useState<ExportFormat>("stl");
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);
      await onExport(format);
    } catch (err) {
      console.error("Export failed:", err);
      const errorMessage =
        err instanceof Error ? err.message : t("exportFailed", { error: "Unknown error" });
      alert(errorMessage);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-6">
        <span className="text-sm font-medium text-gray-700">
          {t("exportFormat")}
        </span>

        {/* Format Selector - Radio Buttons */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="exportFormat"
              value="stl"
              checked={format === "stl"}
              onChange={(e) => setFormat(e.target.value as ExportFormat)}
              disabled={disabled || exporting}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
            />
            <span className="text-sm text-gray-700">
              {t("stlLabel")}{" "}
              <span className="text-gray-500">{t("stlDescription")}</span>
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="exportFormat"
              value="step"
              checked={format === "step"}
              onChange={(e) => setFormat(e.target.value as ExportFormat)}
              disabled={disabled || exporting}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
            />
            <span className="text-sm text-gray-700">
              {t("stepLabel")}{" "}
              <span className="text-gray-500">{t("stepDescription")}</span>
            </span>
          </label>
        </div>
      </div>

      {/* Export Button */}
      <button
        onClick={handleExport}
        disabled={disabled || exporting}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
      >
        {exporting
          ? t("exporting")
          : t("exportButton", { format: format.toUpperCase() })}
      </button>
    </div>
  );
}
