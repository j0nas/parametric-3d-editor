Parametric 3D Editor — MVP Functional Requirements
1) Purpose

Allow a visitor to load a single parametric product, adjust parameters in a visual editor, see an accurate 3D preview, and export a print-ready file (STL or STEP).

2) In-Scope User Flow

Load Editor: User opens the product’s editor page.

Configure: User adjusts exposed parameters via UI controls.

Preview: 3D view updates to reflect parameter changes.

Validate: System blocks invalid parameter combinations and explains why.

Export: User downloads the resulting geometry as STL or STEP.

No checkout, accounts, or storage required in MVP.

3) Roles

Visitor (Customer): Uses the editor to configure and export a file.

4) Product Coverage (Single SKU)

One product (e.g., vacuum hose adapter).

Editor exposes 5–8 parameters meaningful to that product (e.g., diameters, wall thickness, length, tolerance).

5) Parameters & Validation (Functional)

Parameters must have:

Name, unit, min, max, step (units in millimeters).

Display label and optional help text.

The system must:

Enforce bounds and steps.

Enforce domain rules (e.g., minimum wall thickness, no self-intersections).

Apply rounding/snapping rules (e.g., 0.1 mm resolution; wall thickness to nozzle multiples).

Provide inline, human-readable error messages when invalid.

Disable export while invalid.

6) 3D Preview (Functional)

Interactive 3D view supports orbit, pan, zoom.

Preview must reflect exact geometry that will be exported (same source geometry, not an approximation).

Display read-only dimension readouts for key results (e.g., inner/outer diameters, wall thickness).

Provide Reset View action.

Optional: simple section/measure tool if available, but not required.

7) Export (Functional)

User can choose STL and/or STEP via a format selector.

Exported file must correspond exactly to the current preview and parameters.

Export must include default tessellation/tolerance suitable for 3D printing (for STL) and precise B-rep for STEP (if offered).

Export must succeed without requiring network connectivity (if the app is offline-capable) or provide a clear error if not.

8) Performance & UX (Non-Functional)

Parameter change to updated preview: ≤ 2 seconds for typical values.

Initial editor load with default model: ≤ 5 seconds on a normal desktop.

UI must remain responsive during regeneration (e.g., show a busy state).

All numeric inputs accept keyboard entry and increment/decrement controls.

Accessible labels and descriptions for all controls.

9) Reliability (Non-Functional)

Invalid parameter sets do not crash the editor; they show errors and prevent export.

If geometry generation fails, show a clear message and offer to reset parameters.

10) Internationalization (MVP)

English only. Units: millimeters everywhere.

11) Telemetry (Optional in MVP)

Count of exports and anonymized parameter ranges (no PII).

12) Security & Privacy

No personal data collected in MVP.

No server-side storage of models or parameters in MVP.

13) Out of Scope (MVP)

Payments, order creation, accounts, admin, multi-SKU catalog.

Server-side slicing, price/time estimates, shipping, emails.

14) Acceptance Criteria

User can load the editor and see a default valid model.

Changing any parameter within bounds updates the 3D preview accordingly.

Invalid inputs produce clear messages and disable export.

Exporting STL produces a file that, when measured in a slicer/CAD, matches the displayed dimensions within ±0.1 mm for prismatic features.

If STEP is offered, file opens in standard CAD and matches previewed dimensions.

Editor functions in a modern desktop browser without plugins.

15) Open Questions (to finalize before build)

Exact parameter list, bounds, and snapping rules for the chosen SKU.

Required export formats for MVP (STL only vs STL + STEP).

Target tessellation tolerance for STL (e.g., chord dev / angular dev).

Minimum guaranteed printability rules (e.g., overhang/draft requirements) to enforce or warn about in the editor.