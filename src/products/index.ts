/**
 * Product Registry Initialization
 * Imports all product configurations to populate the registry
 */

// Import all product registrations (side-effect imports)
import "./hoseAdapter/config";
import "./drainStrainer/config";
import "./threadAdapter/config";

// Re-export registry utilities for convenience
export { getProduct, getProductBySlug, getAllProducts, PRODUCT_REGISTRY, hasProduct } from "./registry";
export type { ProductConfig, DimensionReadout, TranslationFunction } from "./registry";
