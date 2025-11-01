# Code Quality & Scalability Roadmap

Actionable backlog derived from the latest repository review. Each item is a prerequisite for confidently adding more parametric products.

## Internationalization & Validation
- [x] Remove redundant `Validation.` prefixing when translator instances are already scoped to that namespace (`src/lib/validation.ts`, `src/models/hoseAdapterValidation.ts`, `src/models/drainStrainerValidation.ts`).
- [x] Ensure every product's message bundle defines `dimensionsHeading`, `calculatedDimensionsHeading`, and other strings expected by shared components (`messages/en.json`, `messages/nb.json`).
- [x] Add lint or build-time guardrails that surface missing translation keys during development (e.g., `next-intl` strict usage or custom script).

## Parameter Schema Maintainability
- [ ] De-duplicate base vs. translated schemas by storing numeric metadata once and injecting translated labels/help text at runtime.
- [ ] Extend `ParameterSchema` to carry type metadata (enum, boolean, color) and update `ParameterPanel`/`ParameterControl` to render appropriate controls.
- [ ] Integrate unit/precision metadata directly into parameter definitions to avoid per-product duplication when displaying derived values.

## UI & UX Improvements
- [ ] Expand `DimensionReadout` to include units and display precision so count-based readouts no longer render misleading `mm` suffixes.
- [x] Wire `ModelContainerLoading` into the dynamic import fallbacks for `ModelContainer`, `ParameterPanel`, and `ExportPanel` to improve perceived responsiveness.
- [x] Remove unused imports (e.g., `getAllProducts` on product pages) and add lint rules to keep product entrypoints minimal.

## Performance & Stability
- [x] Track generation requests in `ModelContainer` and ignore late responses to avoid displaying stale geometry after rapid parameter changes.
- [x] Dispose of previous Three.js geometries/materials when regenerating meshes to prevent GPU memory leaks during long sessions.
- [ ] Investigate off-main-thread or worker-based mesh generation for heavier future products; prototype with the existing builders.

## Testing & Tooling
- [ ] Add unit tests for shared validation helpers (`src/lib/validation.ts`) and dynamic constraint calculators to lock in behavior across products.
- [ ] Introduce smoke tests for model builders (e.g., build with representative parameter sets and assert mesh creation succeeds).
- [x] Automate translation key coverage checks as part of CI to catch regressions before release.
