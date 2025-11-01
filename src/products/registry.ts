/**
 * Product Registry System
 * Central registry for all products in the parametric 3D editor
 */

import type { ParameterSchema, ParameterValues } from "@/types/parameters";
import type { CustomValidation, CustomConstraintsCalculator } from "@/lib/validation";

/**
 * Dimension readout for displaying calculated dimensions
 */
export interface DimensionReadout {
  label: string;
  value: number;
  /** Unit of measurement (e.g., "mm", "deg", "" for dimensionless). Defaults to "mm" if not specified */
  unit?: string;
  /** Number of decimal places for display. Defaults to 1 if not specified */
  precision?: number;
}

/**
 * Translation function type
 */
export type TranslationFunction = (...args: any[]) => string;

/**
 * Product configuration defining all aspects of a product
 */
export interface ProductConfig {
  /** Unique identifier for the product */
  id: string;

  /** URL-safe slug for routing (e.g., "hose-adapter") */
  slug: string;

  // Schema & Parameters
  /** Base parameter schema without translations */
  baseSchema: ParameterSchema;

  /** Factory function to create translated schema */
  schemaFactory: (t: TranslationFunction) => ParameterSchema;

  // Geometry
  /** Function to build the 3D model from parameters */
  modelBuilder: (params: ParameterValues) => any;

  // Validation
  /** Custom validation function for product-specific rules */
  customValidation: CustomValidation;

  /** Function to calculate dynamic parameter constraints */
  constraintsCalculator: CustomConstraintsCalculator;

  // UI (optional)
  /** Optional function to calculate dimension readouts */
  dimensionsCalculator?: (values: ParameterValues, t: TranslationFunction) => DimensionReadout[];

  // Metadata
  /** Translation namespace (e.g., "Products.hoseAdapter") */
  translationNamespace: string;
}

/**
 * Global product registry
 */
export const PRODUCT_REGISTRY: Record<string, ProductConfig> = {};

/**
 * Register a product in the global registry
 * @param config - Product configuration to register
 */
export function registerProduct(config: ProductConfig): void {
  if (PRODUCT_REGISTRY[config.id]) {
    console.warn(`Product "${config.id}" is already registered. Overwriting.`);
  }

  PRODUCT_REGISTRY[config.id] = config;
}

/**
 * Get a product by ID
 * @param id - Product ID
 * @returns Product configuration
 * @throws Error if product not found
 */
export function getProduct(id: string): ProductConfig {
  const product = PRODUCT_REGISTRY[id];
  if (!product) {
    throw new Error(`Product not found: ${id}`);
  }
  return product;
}

/**
 * Get all registered products
 * @returns Array of all product configurations
 */
export function getAllProducts(): ProductConfig[] {
  return Object.values(PRODUCT_REGISTRY);
}

/**
 * Check if a product exists in the registry
 * @param id - Product ID to check
 * @returns True if product exists
 */
export function hasProduct(id: string): boolean {
  return id in PRODUCT_REGISTRY;
}

/**
 * Get product by slug (for routing)
 * @param slug - Product slug
 * @returns Product configuration or undefined if not found
 */
export function getProductBySlug(slug: string): ProductConfig | undefined {
  return Object.values(PRODUCT_REGISTRY).find(product => product.slug === slug);
}
