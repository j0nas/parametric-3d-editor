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
- Single product: vacuum hose adapter
- 5-8 adjustable parameters (diameters, lengths, wall thickness)
- Real-time 3D preview
- Parameter validation (bounds, domain rules, printability)
- Export STL/STEP files
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

1. **Schema-driven** — `HOSE_ADAPTER_SCHEMA` defines parameters, validation, UI generation
2. **Client-only WASM** — dynamic imports with `ssr: false` (WASM requires browser)
3. **Debounced regeneration** — 300ms delay prevents excessive computation
4. **Optimistic UI** — sliders update instantly, model regenerates after validation
5. **Exact preview** — same geometry source for preview and export (no approximation)

## File Organization

```
/src
  /app
    layout.tsx          # Root layout, fonts
    page.tsx            # Main editor (state orchestrator)
    globals.css         # Tailwind + custom styles
  /components
    ParameterPanel.tsx  # Parameter list, validation display
    ParameterControl.tsx # Single parameter slider + input
    ModelContainer.tsx  # Geometry generation, mesh conversion
    ModelViewer.tsx     # Three.js scene, camera, lighting
    ExportPanel.tsx     # Format selector, export button
  /lib
    validation.ts       # Parameter bounds/domain validation
    rounding.ts         # Precision/snapping utilities
    replicadInit.ts     # WASM initialization (singleton)
    meshConverter.ts    # Replicad solid → Three.js mesh
    exportModel.ts      # STL/STEP file generation
  /models
    hoseAdapter.ts      # Parametric geometry definition
  /types
    parameters.ts       # TypeScript schemas, interfaces
/public
  replicad_single.wasm  # OpenCASCADE binary
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

1. **Create parameter schema** in `src/types/`
   ```typescript
   export const DRAIN_STRAINER_SCHEMA: ParameterSchema = {
     holeDiameter: { min: 2, max: 10, default: 5, ... },
     holeSpacing: { min: 8, max: 20, default: 12, ... },
     // ...
   };
   ```

2. **Define geometry** in `src/models/`
   ```typescript
   export async function generateDrainStrainer(params: ParameterValues) {
     // Use Replicad API to construct solid
   }
   ```

3. **Create product page** at `src/app/drain-strainer/page.tsx`
   - Copy `src/app/page.tsx` structure
   - Swap in new schema + generator

4. **Add validation rules** in `src/lib/validation.ts`
   - Domain-specific constraints
   - Printability checks

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

- `SPEC.md` — Detailed MVP requirements
- `src/types/parameters.ts` — Parameter schema reference
- `src/models/hoseAdapter.ts` — Geometry construction example

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
