# Architecture Documentation

## Overview

This document describes the product registry architecture that powers the parametric 3D editor's multi-product platform. The system was designed to eliminate code duplication, enforce consistency, and enable effortless scaling to unlimited products.

## Core Architecture: Product Registry Pattern

### Design Goals

1. **Zero Duplication** — Single generic page component serves all products
2. **Consistency** — All products follow identical patterns and interfaces
3. **Discoverability** — Products auto-register on app initialization
4. **Scalability** — Add products without architectural changes
5. **Type Safety** — Full TypeScript support throughout

### Registry Structure

The product registry (`/src/products/registry.ts`) is the heart of the system. It stores all product configurations in a centralized record:

```typescript
export const PRODUCT_REGISTRY: Record<string, ProductConfig> = {};
```

Each product configuration includes:

```typescript
export interface ProductConfig {
  // Identity
  id: string;                           // Unique identifier (camelCase)
  slug: string;                         // URL-safe slug (kebab-case)

  // Schema & Parameters
  baseSchema: ParameterSchema;          // Non-translated schema
  schemaFactory: (t: TranslationFunction) => ParameterSchema;

  // Geometry
  modelBuilder: (params: ParameterValues) => any;

  // Validation
  customValidation: CustomValidation;
  constraintsCalculator: CustomConstraintsCalculator;

  // UI (optional)
  dimensionsCalculator?: (values: ParameterValues, t: any) => DimensionReadout[];

  // Metadata
  translationNamespace: string;         // e.g., "Products.hoseAdapter"
}
```

## Data Flow

### 1. Application Initialization

```
App Startup
    ↓
layout.tsx imports '/src/products'
    ↓
Side-effect imports execute
    ↓
/src/products/hoseAdapter/config.ts
/src/products/drainStrainer/config.ts
    ↓
Each calls registerProduct()
    ↓
PRODUCT_REGISTRY populated
```

**Key files:**
- `/src/app/layout.tsx` — Imports product registry for side effects
- `/src/products/index.ts` — Side-effect import orchestrator
- `/src/products/*/config.ts` — Individual product registrations

### 2. Product Page Rendering

```
User navigates to /hose-adapter
    ↓
/src/app/[locale]/[productSlug]/page.tsx
    ↓
getProductBySlug('hose-adapter')
    ↓
Retrieve ProductConfig from registry
    ↓
Pass config to components
    ↓
Generic UI renders product
```

**Key functions:**
```typescript
// Get product by slug
const product = getProductBySlug('hose-adapter');

// Get translated schema
const schema = product.schemaFactory(tParams);

// Build geometry
const shape = product.modelBuilder(parameters);

// Validate parameters
const errors = product.customValidation(parameters, t);
```

### 3. Component Architecture

```
[productSlug]/page.tsx (Product Page)
    │
    ├─→ ParameterPanel
    │     ├─ schema (from product.schemaFactory)
    │     ├─ customValidation (from product)
    │     ├─ constraintsCalculator (from product)
    │     ├─ dimensionsCalculator (from product, optional)
    │     └─ translationNamespace (from product)
    │
    ├─→ ModelContainer
    │     ├─ modelBuilder (from product)
    │     └─ parameters (user input)
    │
    └─→ ExportPanel
          ├─ shape (generated model)
          └─ productSlug (for filename)
```

All components receive product-specific configuration from the registry, making them fully generic.

### 4. Homepage Catalog

```
/src/app/[locale]/page.tsx
    ↓
getAllProducts()
    ↓
Map over products array
    ↓
Generate catalog cards
```

The homepage automatically displays all registered products. Adding a new product to the registry automatically adds it to the catalog.

## Product Organization

Each product is organized in a consistent structure:

```
/src/products/productName/
  config.ts           # Product registration (glue code)
  schema.ts           # Parameter definitions
  builder.ts          # Geometry generation (re-export from /models)
  validation.ts       # Custom validation (re-export from /models)
  dimensions.ts       # Calculated dimensions (optional)
```

### Separation of Concerns

**Product-agnostic logic** (`/src/lib/`, `/src/components/`):
- Generic parameter validation
- UI components
- WASM initialization
- Export functionality

**Product-specific logic** (`/src/products/`, `/src/models/`):
- Parameter schemas
- Geometry builders
- Custom validation rules
- Dimension calculators

**Configuration** (`/src/products/*/config.ts`):
- Glue layer connecting product-specific logic to registry
- Typically 15-20 lines per product

## Type Safety

### Translation Function Types

```typescript
export type TranslationFunction = (
  key: string,
  values?: Record<string, any>
) => string;
```

Generic translation functions accept any translation function from next-intl while preserving type safety:

```typescript
export function validateProduct<T extends (...args: any[]) => string>(
  values: ParameterValues,
  t?: T
): ValidationError[] {
  // T can be any next-intl translation function
  // while maintaining type safety
}
```

### Parameter Types

```typescript
export interface ParameterDefinition {
  id: string;
  label: string;
  help: string;
  min: number;
  max: number;
  default: number;
  step: number;
  unit: string;
  precision?: number;
}

export type ParameterSchema = {
  [key: string]: ParameterDefinition;
};

export type ParameterValues = {
  [key: string]: number;
};
```

### Validation Types

```typescript
export interface ValidationError {
  parameterId: string;
  message: string;
}

export type CustomValidation<T = TranslationFunction> = (
  values: ParameterValues,
  t?: T
) => ValidationError[];
```

## Extension Points

### 1. Adding a New Product

**Minimal required code:** ~50 lines across 5 files

1. Create `/src/products/yourProduct/config.ts`
2. Create `/src/products/yourProduct/schema.ts`
3. Create `/src/products/yourProduct/builder.ts` (re-export)
4. Create `/src/products/yourProduct/validation.ts` (re-export)
5. Add translations to `messages/en.json` and `messages/nb.json`
6. Update `/src/products/index.ts` (add one import line)

**Automatic integration:**
- Page generation
- Routing
- Catalog entry
- Parameter UI
- Export functionality

### 2. Adding Optional Features

**Calculated dimensions:**
```typescript
export function calculateProductDimensions(
  values: ParameterValues,
  t: TranslationFunction
): DimensionReadout[] {
  return [
    { label: t("calculatedDimensions.width"), value: values.width * 2 },
    { label: t("calculatedDimensions.height"), value: values.height + 10 },
  ];
}
```

Add to config:
```typescript
registerProduct({
  // ...
  dimensionsCalculator: calculateProductDimensions,
});
```

**Dynamic constraints:**
```typescript
export function calculateProductConstraints(
  schema: ParameterSchema,
  values: ParameterValues
): Record<string, DynamicConstraints> {
  return {
    maxHeight: {
      max: values.width * 2, // Height can't exceed 2x width
    },
  };
}
```

### 3. Future Extensions

The registry pattern enables easy addition of:

**Product categories:**
```typescript
interface ProductConfig {
  // ...
  category?: 'plumbing' | 'electrical' | 'furniture';
}
```

**Featured products:**
```typescript
interface ProductConfig {
  // ...
  featured?: boolean;
}
```

**Product variants:**
```typescript
// Register same geometry with different presets
registerProduct({
  id: 'hoseAdapter-metric',
  // ...
  baseSchema: HOSE_ADAPTER_METRIC_SCHEMA,
});

registerProduct({
  id: 'hoseAdapter-imperial',
  // ...
  baseSchema: HOSE_ADAPTER_IMPERIAL_SCHEMA,
});
```

**Search indexing:**
```typescript
interface ProductConfig {
  // ...
  searchKeywords?: string[];
  tags?: string[];
}
```

## Performance Considerations

### Lazy Loading

Products are registered eagerly on app initialization (via side-effect imports), but geometry builders and large dependencies are loaded only when needed:

```typescript
// builder.ts uses re-exports to enable tree-shaking
export { buildHoseAdapter } from "@/models/hoseAdapter";
```

### Registry Access

Registry lookups are O(1) hash table operations:

```typescript
// Fast lookup by ID
const product = PRODUCT_REGISTRY[productId];

// Fast lookup by slug (requires linear scan)
const product = getAllProducts().find(p => p.slug === slug);
```

Consider adding a slug index if product count exceeds 50+:

```typescript
const SLUG_INDEX: Record<string, ProductConfig> = {};
```

### Component Memoization

Generic components receive stable references from the registry, enabling effective memoization:

```typescript
const memoizedBuilder = useMemo(
  () => product.modelBuilder,
  [product.id] // Stable product ID
);
```

## Translation Architecture

### Namespace Structure

```json
{
  "Products": {
    "hoseAdapter": {
      "name": "...",
      "shortDescription": "...",
      "parameters": { ... },
      "calculatedDimensions": { ... }
    }
  },
  "Validation": {
    "common": { ... },
    "hoseAdapter": { ... },
    "drainStrainer": { ... }
  }
}
```

### Translation Key Resolution

```typescript
// Product-specific translations
const t = useTranslations(product.translationNamespace);
// → "Products.hoseAdapter"

// Parameter translations
const tParams = useTranslations(`${product.translationNamespace}.parameters`);
// → "Products.hoseAdapter.parameters"

// Validation translations use full path
const message = t("Validation.hoseAdapter.outerTooSmall");
```

## Testing Strategy

### Unit Tests

**Registry functions:**
```typescript
describe('Product Registry', () => {
  test('getProduct returns registered product', () => {
    const product = getProduct('hoseAdapter');
    expect(product.id).toBe('hoseAdapter');
  });

  test('getProduct throws for unknown product', () => {
    expect(() => getProduct('unknown')).toThrow();
  });
});
```

**Product validation:**
```typescript
describe('Hose Adapter Validation', () => {
  test('validates diameter relationship', () => {
    const errors = validateHoseAdapter({
      innerDiameter: 50,
      outerDiameter: 30, // Invalid: smaller than inner
    });
    expect(errors).toHaveLength(1);
  });
});
```

### Integration Tests

**Product registration:**
```typescript
test('all products register successfully', () => {
  const products = getAllProducts();
  expect(products.length).toBeGreaterThan(0);

  products.forEach(product => {
    expect(product.id).toBeDefined();
    expect(product.slug).toBeDefined();
    expect(product.modelBuilder).toBeInstanceOf(Function);
  });
});
```

**End-to-end flow:**
```typescript
test('product page renders with valid defaults', () => {
  const product = getProduct('hoseAdapter');
  const schema = product.schemaFactory(mockTranslation);
  const defaults = getDefaultValues(schema);
  const shape = product.modelBuilder(defaults);

  expect(shape).toBeDefined();
});
```

## Troubleshooting

### Product not appearing in catalog

1. Check registration side-effect import in `/src/products/index.ts`
2. Verify `registerProduct()` is called in product's `config.ts`
3. Check for errors in browser console during app initialization
4. Verify product has valid `id`, `slug`, and `translationNamespace`

### Translation keys not found

1. Check `translationNamespace` matches structure in `messages/*.json`
2. Verify all required translation keys exist for the product
3. Check browser console for missing key warnings from next-intl

### Validation not working

1. Verify `customValidation` function is exported from validation file
2. Check validation function is passed to `registerProduct()`
3. Ensure translation function parameter (`t`) is properly typed
4. Test validation logic in isolation with unit tests

## Architecture Decisions

### Why Side-Effect Imports?

**Pros:**
- Automatic registration (no manual registry calls)
- Clear initialization order
- Works with Next.js app router
- Tree-shakeable (unused products don't bundle)

**Cons:**
- Less explicit than manual registration
- Can be confusing for new developers

**Alternative considered:** Manual registration in layout.tsx
```typescript
// Rejected approach
registerProduct(hoseAdapterConfig);
registerProduct(drainStrainerConfig);
```
Rejected because it requires updating multiple files when adding products.

### Why Re-exports for Builders?

**Pros:**
- Enables tree-shaking
- Keeps geometry code in `/src/models/` (appropriate location)
- Allows gradual refactoring

**Cons:**
- Extra indirection layer

**Alternative considered:** Direct imports from `/src/models/` in config.ts
Rejected to maintain consistent product structure.

### Why Generic Page Component?

**Pros:**
- Eliminates 150+ lines of duplication per product
- Enforces consistency
- Single source of truth for product rendering

**Cons:**
- More abstract (harder for beginners to understand)
- Debugging requires understanding registry

**Alternative considered:** Template-based code generation
Rejected because it still requires maintaining duplicate files.

## Future Considerations

### Multi-tenant Support

For white-label versions, extend registry to support:
```typescript
interface TenantConfig {
  products: string[]; // Product IDs available to tenant
  branding: BrandingConfig;
}
```

### Product Versioning

For breaking changes to product schemas:
```typescript
interface ProductConfig {
  // ...
  version: string; // Semantic version
  migrations?: Record<string, MigrationFunction>;
}
```

### A/B Testing

For experimenting with product variations:
```typescript
interface ProductConfig {
  // ...
  variants?: Record<string, Partial<ProductConfig>>;
  defaultVariant?: string;
}
```

## References

- `REFACTORING_ROADMAP.md` — History of architecture evolution
- `README.md` — User-facing documentation
- `/src/products/registry.ts` — Registry implementation
- `/src/products/hoseAdapter/` — Reference implementation
