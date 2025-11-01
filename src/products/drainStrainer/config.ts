/**
 * Drain Strainer Product Configuration
 * Registers the drain strainer product in the global registry
 */

import { registerProduct } from "../registry";
import { buildDrainStrainer } from "./builder";
import { validateDrainStrainer, calculateDrainStrainerConstraints } from "./validation";
import { DRAIN_STRAINER_SCHEMA, getTranslatedDrainStrainerSchema } from "./schema";
import { calculateDrainStrainerDimensions } from "./dimensions";

registerProduct({
  id: "drainStrainer",
  slug: "drain-strainer",
  baseSchema: DRAIN_STRAINER_SCHEMA,
  schemaFactory: getTranslatedDrainStrainerSchema,
  modelBuilder: buildDrainStrainer,
  customValidation: validateDrainStrainer,
  constraintsCalculator: calculateDrainStrainerConstraints,
  dimensionsCalculator: calculateDrainStrainerDimensions,
  translationNamespace: "Products.drainStrainer",
});
