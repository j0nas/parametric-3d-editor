# Parametric 3D Editor — Custom Manufacturing Platform

Web-based parametric CAD editor for on-demand 3D printed products. Customer configures product → generates geometry → places order → receive email → print & ship.

## Business Model

**Niche parametric products** customers customize to exact specs:
- Vacuum hose adapters (any diameter/length)
- Sink drain strainers (custom hole patterns)
- Cable glands/grommets (specific wire diameters)
- Furniture leveling feet (thread sizes)
- Pipe reducers/couplings (non-standard sizes)
- Air duct transitions (custom angles)
- Drawer organizers (exact dimensions)

Each product = separate Next.js page (SEO). Customer adjusts parameters → sees live 3D preview → exports/orders.

## Current State: MVP Phase 1 (Export Only)

✅ **Implemented:**
- Two products: vacuum hose adapter & drain strainer
- Product registry architecture (scalable multi-product platform)
- 5-8 adjustable parameters per product (diameters, lengths, wall thickness)
- Real-time 3D preview
- Parameter validation (bounds, domain rules, printability, dynamic constraints)
- Export STL/STEP files
- Internationalization (English + Norwegian)
- Offline-capable (client-side WASM)

🚧 **MVP Phase 2 (Target):**
- Add checkout flow
- Customer pays → email sent with:
  - STL file
  - Parameters used
  - Color choice
  - Custom comments
  - Shipping address
- Manual fulfillment: load in slicer → print → ship

## Tech Stack

### Core
- **Next.js 16** (App Router) — SEO, product pages
- **React 19** + **TypeScript** (strict mode)
- **Tailwind CSS 4** — styling

### CAD/3D
- **Replicad** (v0.20.2) — parametric CAD library
- **OpenCASCADE WASM** — B-rep geometry kernel
- **Three.js** + **React-three-fiber** — WebGL rendering
- **@react-three/drei** — 3D utilities

### UI Components
- **Radix UI Slider** — accessible parameter controls

## Architecture

```
User Input → Parameters (validated)
    ↓
Replicad + OpenCASCADE (WASM)
    ↓
CAD Solid (B-rep geometry)
    ↓
    ├─→ Three.js Mesh (preview)
    └─→ STL/STEP Export (manufacturing)
```

### Data Flow

```
page.tsx (state container)
  ├─→ ParameterPanel (UI controls)
  │     ↓ onChange (300ms debounce)
  │     ↑ validation errors
  ├─→ ModelContainer (geometry generation)
  │     ↓ mesh + shape
  │     └─→ ModelViewer (Three.js renderer)
  └─→ ExportPanel (STL/STEP download)
```

### Key Patterns

1. **Product registry** — Centralized configuration system for scalable multi-product architecture
2. **Schema-driven** — Parameter schemas define validation, UI generation, and translations
3. **Client-only WASM** — dynamic imports with `ssr: false` (WASM requires browser)
4. **Debounced regeneration** — 300ms delay prevents excessive computation
5. **Optimistic UI** — sliders update instantly, model regenerates after validation
6. **Exact preview** — same geometry source for preview and export (no approximation)

## File Organization

```
/src
  /app
    /[locale]
      /[productSlug]
        page.tsx          # Generic product page (all products)
      page.tsx            # Product catalog homepage
    layout.tsx            # Root layout, i18n setup
    globals.css           # Tailwind + custom styles
  /components
    ParameterPanel.tsx    # Parameter list, validation display
    ParameterControl.tsx  # Single parameter slider + input
    ModelContainer.tsx    # Geometry generation, mesh conversion
    ModelViewer.tsx       # Three.js scene, camera, lighting
    ExportPanel.tsx       # Format selector, export button
  /products
    registry.ts           # Product registry (central config)
    index.ts              # Product registration (side-effects)
    /hoseAdapter
      config.ts           # Product registration
      schema.ts           # Parameter schema
      builder.ts          # Geometry generation (re-export)
      validation.ts       # Custom validation (re-export)
      dimensions.ts       # Calculated dimensions display
    /drainStrainer
      config.ts           # Product registration
      schema.ts           # Parameter schema
      builder.ts          # Geometry generation (re-export)
      validation.ts       # Custom validation (re-export)
      dimensions.ts       # Calculated dimensions display
  /lib
    validation.ts         # Parameter bounds/domain validation
    rounding.ts           # Precision/snapping utilities
    replicadInit.ts       # WASM initialization (singleton)
    meshConverter.ts      # Replicad solid → Three.js mesh
    exportModel.ts        # STL/STEP file generation
  /models
    hoseAdapter.ts        # Hose adapter geometry builder
    hoseAdapterValidation.ts  # Hose adapter validation
    drainStrainer.ts      # Drain strainer geometry builder
    drainStrainerValidation.ts # Drain strainer validation
  /types
    parameters.ts         # Generic TypeScript interfaces
/messages
  en.json                 # English translations
  nb.json                 # Norwegian translations
/public
  replicad_single.wasm    # OpenCASCADE binary
```

## Setup

```bash
npm install
npm run dev  # http://localhost:3000
```

### Requirements
- Node.js 20+
- Modern browser (Chrome, Firefox, Safari, Edge)
- **No plugins** — WASM runs in browser

### WASM Configuration
Next.js configured for WASM + SharedArrayBuffer:
- `next.config.ts`: Cross-origin headers (COEP/COOP)
- Webpack: `asyncWebAssembly: true`
- Server externals: Replicad packages excluded from bundling

## Adding New Products

The product registry system makes adding new products straightforward. Adding a new product requires **~50 lines of code** across **5 files**, with automatic integration into the UI, routing, and catalog.

### Quick Start (5 files, ~30-60 minutes)

1. **Create product directory:** `/src/products/yourProduct/`

2. **Create `config.ts`** (15 lines):
   ```typescript
   import { registerProduct } from '../registry';
   import { buildYourProduct } from './builder';
   import { validateYourProduct, calculateYourProductConstraints } from './validation';
   import { YOUR_PRODUCT_SCHEMA, getTranslatedYourProductSchema } from './schema';
   import { calculateYourProductDimensions } from './dimensions';

   registerProduct({
     id: 'yourProduct',
     slug: 'your-product',
     baseSchema: YOUR_PRODUCT_SCHEMA,
     schemaFactory: getTranslatedYourProductSchema,
     modelBuilder: buildYourProduct,
     customValidation: validateYourProduct,
     constraintsCalculator: calculateYourProductConstraints,
     dimensionsCalculator: calculateYourProductDimensions, // optional
     translationNamespace: 'Products.yourProduct',
   });
   ```

3. **Create `schema.ts`** (40+ lines):
   ```typescript
   import type { ParameterSchema } from "@/types/parameters";

   export const YOUR_PRODUCT_SCHEMA: ParameterSchema = {
     diameter: {
       id: "diameter",
       label: "Diameter",
       help: "Overall diameter",
       min: 10,
       max: 100,
       default: 50,
       step: 1,
       unit: "mm",
       precision: 0,
     },
     // ... other parameters
   };

   export function getTranslatedYourProductSchema<T extends (...args: any[]) => string>(
     t: T
   ): ParameterSchema {
     return {
       diameter: {
         ...YOUR_PRODUCT_SCHEMA.diameter,
         label: t("diameter.label"),
         help: t("diameter.help"),
       },
       // ... other parameters with translations
     };
   }
   ```

4. **Create `builder.ts`** (re-export from `/src/models`):
   ```typescript
   export { buildYourProduct } from "@/models/yourProduct";
   ```

5. **Create `validation.ts`** (re-export from `/src/models`):
   ```typescript
   export {
     validateYourProduct,
     calculateYourProductConstraints
   } from "@/models/yourProductValidation";
   ```

6. **Update `/src/products/index.ts`** (1 line):
   ```typescript
   import './yourProduct/config';
   ```

7. **Add translations to `messages/en.json` and `messages/nb.json`**:
   ```json
   "Products": {
     "yourProduct": {
       "name": "Your Product Name",
       "shortDescription": "Brief description for catalog",
       "parameters": {
         "diameter": {
           "label": "Diameter",
           "help": "Overall diameter of the product"
         }
       }
     }
   }
   ```

8. **Create geometry builder in `/src/models/yourProduct.ts`** (60+ lines):
   ```typescript
   import type { ParameterValues } from "@/types/parameters";

   export function buildYourProduct(params: ParameterValues) {
     const { diameter } = params;
     // ... Replicad geometry construction
   }
   ```

9. **Create validation in `/src/models/yourProductValidation.ts`** (30+ lines):
   ```typescript
   import type { ValidationError, ParameterValues, ParameterSchema } from "@/types/parameters";
   import type { DynamicConstraints } from "@/lib/validation";

   export function validateYourProduct<T extends (...args: any[]) => string>(
     values: ParameterValues,
     t?: T
   ): ValidationError[] {
     const errors: ValidationError[] = [];
     // ... custom validation logic
     return errors;
   }

   export function calculateYourProductConstraints(
     schema: ParameterSchema,
     values: ParameterValues
   ): Record<string, DynamicConstraints> {
     // ... dynamic constraints calculation
     return {};
   }
   ```

**That's it!** The following are automatically handled:
- ✅ Product page at `/your-product`
- ✅ Routing and navigation
- ✅ Catalog entry on homepage
- ✅ Parameter UI and validation
- ✅ Export functionality (STL/STEP)
- ✅ Internationalization support
- ✅ Type safety throughout

### Product Registry Architecture

The product registry (`/src/products/registry.ts`) provides a centralized configuration system that:
- **Eliminates code duplication** — Single generic page component serves all products
- **Enforces consistency** — All products follow identical patterns
- **Enables discoverability** — Products auto-register on app initialization
- **Scales effortlessly** — Add unlimited products without architectural changes

### Type Safety
Translation function parameters use generic type constraints (`T extends (...args: any[]) => string`) to preserve type safety while accepting translation functions from any next-intl namespace. This ensures the parameter is a function returning `string` while allowing next-intl's strict key typing at call sites. Message key validation is enforced by `src/global.d.ts` type augmentation.

## Key Constraints

### Validation
- Bounds: `min ≤ value ≤ max`
- Steps: `value % step === 0`
- Domain rules: `outerDiameter > innerDiameter + 1mm` (wall thickness)
- Precision: 0.1mm resolution (FDM printer tolerance)

### Performance Targets
- Initial load: ≤ 5s (includes WASM init)
- Parameter change → preview: ≤ 2s
- Export generation: ~1s

### Export Formats
- **STL**: Tessellated mesh, 3D printing (tolerance: 0.01mm)
- **STEP**: Exact B-rep, CAD interop (ISO 10303-21)

## State Management

All state in `page.tsx`:
```typescript
const [parameters, setParameters] = useState<ParameterValues>(defaults);
const [shape, setShape] = useState<ReplicadShape | null>(null);
const [mesh, setMesh] = useState<THREE.Mesh | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

No global state, Redux, or context (yet). Add when multi-product catalog needed.

## Development Notes

### TypeScript
- Strict mode enabled
- `any` used for Replicad types (complex library, incomplete typings)
- Path alias: `@/` → `src/`

### React Patterns
- Server components where possible
- Client components: `"use client"` for WASM/WebGL
- No SSR for geometry code (WASM incompatible)

### CSS
- Tailwind utility-first
- Custom properties for theming
- Radix UI base styles in `globals.css`

### Known Issues
- `window.resetCameraView` global (TODO: refactor to context/ref)
- React 19 adoption (some libraries may lag)
- `@ts-ignore` for window globals (temporary)

## Testing

⚠️ **No tests yet** — high priority TODO.

Planned:
- Unit: validation logic, rounding, geometry calculations
- Integration: parameter → geometry → export pipeline
- E2E: user flow (Playwright)

## Deployment

Static export possible (no server required):
```bash
npm run build
npm run start  # or deploy /out to CDN
```

WASM requires proper MIME types + CORS headers in production.

## Future Roadmap

### Phase 2: Checkout (MVP completion)
- Stripe integration
- Order form (color, comments, shipping)
- Email webhook → send file + details
- Manual fulfillment workflow

### Phase 3: Multi-product
- Product catalog page
- Shared component library
- Unified checkout
- Admin panel for order management

### Phase 4: Automation
- Slicing API integration (e.g., Kiri:Moto, PrusaSlicer headless)
- Automated quoting (material, time, cost)
- Print farm integration

### Phase 5: Scale
- Database (orders, customers)
- Auth (saved configs, reorders)
- Batch printing optimization
- Shipping API integration

## Related Docs

- `REFACTORING_ROADMAP.md` — Multi-product refactoring history and architecture decisions
- `src/types/parameters.ts` — Generic parameter type definitions
- `src/products/registry.ts` — Product registry implementation
- `src/models/hoseAdapter.ts` — Geometry construction example
- `src/models/drainStrainer.ts` — Drain strainer geometry example

## Key Decisions

1. **Client-side CAD** — No server, all geometry in browser (privacy, speed, offline)
2. **Schema-driven UI** — Parameters define everything (validation, UI, types)
3. **Exact preview** — Same geometry for preview/export (trust, accuracy)
4. **Manual fulfillment** — Email-based workflow until volume justifies automation
5. **Product-per-page** — SEO for niche products ("35mm to 50mm hose adapter")

## Contributing

See well-documented files as examples:
- `src/lib/validation.ts` — JSDoc, examples
- `src/lib/rounding.ts` — Clear comments, test cases
- `src/types/parameters.ts` — Interface documentation

Code style:
- TypeScript strict
- Functional where possible
- Comments explain "why" not "what"
- Constants for magic numbers
- JSDoc for exported functions

## License

[Add license]

## Contact

[Add contact info]
