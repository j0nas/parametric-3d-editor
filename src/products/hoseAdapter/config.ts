/**
 * Hose Adapter Product Configuration
 * Registers the hose adapter product in the global registry
 */

import { registerProduct } from "../registry";
import { buildHoseAdapter } from "./builder";
import { validateHoseAdapter, calculateHoseAdapterConstraints } from "./validation";
import { HOSE_ADAPTER_SCHEMA, getTranslatedHoseAdapterSchema } from "./schema";
import { calculateHoseAdapterDimensions } from "./dimensions";

registerProduct({
  id: "hoseAdapter",
  slug: "hose-adapter",
  baseSchema: HOSE_ADAPTER_SCHEMA,
  schemaFactory: getTranslatedHoseAdapterSchema,
  modelBuilder: buildHoseAdapter,
  customValidation: validateHoseAdapter,
  constraintsCalculator: calculateHoseAdapterConstraints,
  dimensionsCalculator: calculateHoseAdapterDimensions,
  translationNamespace: "Products.hoseAdapter",
});
