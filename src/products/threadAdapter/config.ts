/**
 * Thread Adapter Product Configuration
 * Registers the thread adapter product in the global registry
 */

import { registerProduct } from "../registry";
import { buildThreadAdapter } from "./builder";
import {
  validateThreadAdapter,
  calculateThreadAdapterConstraints,
} from "./validation";
import {
  THREAD_ADAPTER_SCHEMA,
  getTranslatedThreadAdapterSchema,
} from "./schema";
import { calculateThreadAdapterDimensions } from "./dimensions";

registerProduct({
  id: "threadAdapter",
  slug: "thread-adapter",
  baseSchema: THREAD_ADAPTER_SCHEMA,
  schemaFactory: getTranslatedThreadAdapterSchema,
  modelBuilder: buildThreadAdapter,
  customValidation: validateThreadAdapter,
  constraintsCalculator: calculateThreadAdapterConstraints,
  dimensionsCalculator: calculateThreadAdapterDimensions,
  translationNamespace: "Products.threadAdapter",
});
