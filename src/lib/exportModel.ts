/**
 * Model Export Utilities
 * Handles exporting Replicad shapes to STL and STEP formats
 */

import type { ExportFormat } from "@/components/ExportPanel";

// Replicad shape type (any for now since we're dynamically importing)
type ReplicadShape = any;

/**
 * Export a Replicad shape to the specified format and trigger download
 *
 * @param shape - The Replicad shape to export
 * @param format - Export format ('stl' or 'step')
 * @param filename - Base filename (extension will be added automatically)
 */
export async function exportModel(
  shape: ReplicadShape,
  format: ExportFormat,
  filename: string = "hose-adapter"
): Promise<void> {
  if (!shape) {
    throw new Error("No model available to export");
  }

  try {
    let blob: Blob;
    let fileExtension: string;

    if (format === "stl") {
      // Export as STL using Replicad's blobSTL() method
      // Default tolerance is fine for most 3D printing applications
      blob = await shape.blobSTL();
      fileExtension = "stl";
    } else if (format === "step") {
      // Export as STEP using Replicad's blobSTEP() method
      blob = await shape.blobSTEP();
      fileExtension = "step";
    } else {
      throw new Error(`Unsupported export format: ${format}`);
    }

    // Create download link and trigger download
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.${fileExtension}`;

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

  } catch (err) {
    console.error(`Failed to export ${format.toUpperCase()}:`, err);
    throw new Error(
      `Export failed: ${err instanceof Error ? err.message : "Unknown error"}`
    );
  }
}

/**
 * Get a human-readable timestamp for filename generation
 */
export function getTimestampedFilename(base: string): string {
  const now = new Date();
  const timestamp = now.toISOString()
    .replace(/:/g, "-")
    .replace(/\..+/, "")
    .replace("T", "_");
  return `${base}_${timestamp}`;
}
