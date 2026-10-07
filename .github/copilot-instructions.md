# Copilot Instructions for Applergo

## Mission

Build the 2026 modernization of the legacy Applergic app incrementally, preserving the original legacy reference as read-only material.

## Constraints

- Never modify the legacy reference repository at `../applergic-front`.
- Keep the modern project focused on the next required migration step.
- Do not invent missing legacy features or infrastructure without evidence.
- Prefer small, tested, feature-driven changes.
- Keep architecture minimal until a feature demonstrates additional need.

## Preferred structure

- `src/app/` — top-level app shell and router wiring
- `src/features/` — feature modules only when they are migrated
- `src/shared/` — shared UI, utilities, and primitives only when required
- `src/test/` — testing setup and helpers
- `src/assets/` — local app assets

## Workflow

1. Understand the legacy behavior.
2. Define the expected modern behavior.
3. Add a minimal, testable implementation.
4. Validate with tests and lint.
5. Move to the next feature only after the requirement is proven.
