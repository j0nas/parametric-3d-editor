"use client";

/**
 * Replicad OpenCASCADE Initialization
 * Handles loading and initializing the OpenCASCADE WASM module
 */

import { setOC } from "replicad";
import opencascade from "replicad-opencascadejs";

let loaded = false;
let initPromise: Promise<boolean> | null = null;

/**
 * Initialize the OpenCASCADE WASM module
 * This must be called before using any Replicad functions
 *
 * @returns Promise that resolves to true when initialization is complete
 */
export async function initReplicad(): Promise<boolean> {
  // Return existing promise if initialization is in progress
  if (initPromise) return initPromise;

  // Return immediately if already loaded
  if (loaded) return Promise.resolve(true);

  // Start initialization
  initPromise = (async () => {
    try {
      console.log("[Replicad] Initializing OpenCASCADE WASM...");

      // Load the OpenCASCADE WASM module
      const OC = await (opencascade as any)({
        locateFile: (fileName: string) => {
          // Return the path to the WASM file
          // The bundler will handle copying it to the correct location
          return `/replicad_single.wasm`;
        },
      });

      // Set the OpenCASCADE instance in Replicad
      setOC(OC);

      loaded = true;
      console.log("[Replicad] OpenCASCADE WASM initialized successfully");

      return true;
    } catch (error) {
      console.error("[Replicad] Failed to initialize OpenCASCADE:", error);
      initPromise = null; // Reset to allow retry
      throw error;
    }
  })();

  return initPromise;
}

/**
 * Check if Replicad has been initialized
 */
export function isReplicadInitialized(): boolean {
  return loaded;
}
