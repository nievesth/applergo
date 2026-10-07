# Applergo Delivery Workflow

## Purpose

This skill defines the approved delivery and engineering workflow for Applergo. It exists to keep the project disciplined, reviewable, and presentable while remaining lightweight enough for a solo developer and portfolio project.

This workflow intentionally follows a lightweight GitHub Flow / trunk-based model rather than classic Git Flow.

## Project delivery model

Applergo uses a lightweight GitHub Flow / trunk-based workflow.

This is intentionally NOT classic Git Flow.

The project is maintained by one developer but should demonstrate professional engineering practices suitable for a real product and technical portfolio.

## Main branch

`main` is the stable product branch.

`main` must:

- remain runnable
- pass tests
- pass lint
- pass production build
- represent a presentable version of Applergo
- never contain knowingly incomplete or broken feature work

A change should not land on `main` unless it is in a demonstrably reviewable, working state.

## Working branches

Use short-lived branches created from `main`.

Allowed conventions:

- `feat/<short-description>`
- `fix/<short-description>`
- `chore/<short-description>`
- `refactor/<short-description>`
- `docs/<short-description>`
- `test/<short-description>`

Examples:

- `feat/splash`
- `feat/onboarding`
- `feat/map`
- `fix/splash-navigation`
- `chore/setup-ci`
- `docs/update-readme`

Do not create milestone branches by default.

Milestones are product/delivery concepts, not a separate branch type.

## Commits

Use lightweight Conventional Commits.

Examples:

- `feat: add Applergo splash screen`
- `fix: correct onboarding navigation`
- `test: cover splash navigation`
- `refactor: extract brand mark`
- `chore: configure CI`
- `docs: document local setup`

Commits should:

- represent coherent changes
- avoid unrelated modifications
- explain meaningful engineering progress

Commits should remain readable and professional, even in a solo project context.

## Pull requests

Feature/fix branches should merge into `main` through a Pull Request once GitHub collaboration is configured.

Before a PR is considered ready:

```bash
npm run test
npm run lint
npm run build
```

must pass.

Review must confirm:

- agreed scope is complete
- no unrelated changes
- tests cover required behavior
- UI follows the Applergo design system when applicable
- legacy reference was not modified
- application remains presentable

One PR per meaningful feature/milestone is the preferred default.

## Environments

Applergo uses three conceptual delivery environments:

### LOCAL

- developer machine
- feature development
- `npm run dev`
- tests/lint/build before PR

### PREVIEW

- temporary deployment associated with a branch or Pull Request
- used for visual and functional review
- should not be treated as production
- implementation/provider will be selected later

### PRODUCTION

- deployed from stable `main`
- public portfolio/demo version
- must remain presentable
- implementation/provider will be selected later

Do not hardcode a deployment provider into the workflow until one has been explicitly selected.

## CI/CD

When CI is introduced, Pull Requests should automatically execute:

```bash
npm run test
npm run lint
npm run build
```

A failing validation should prevent the change from being considered ready for `main`.

Production deployment should eventually originate from `main`.

## Versioning

Use Semantic Versioning during pre-1.0 development.

Guideline:

- `0.x.0` = meaningful product increment
- `0.x.y` = compatible fix/refinement

Examples:

- `v0.1.0`
- `v0.2.0`
- `v0.2.1`

Do not create a new version for every commit or every screen automatically.

A version should represent a meaningful, stable and demonstrable product state.

`v1.0.0` will represent the first version we intentionally consider a complete portfolio/product release.

## Definition of done

A feature/milestone is complete when:

- agreed scope is implemented
- expected behavior is tested
- `npm run test` passes
- `npm run lint` passes
- `npm run build` passes
- relevant UI follows the design-system skill
- no unintended legacy changes exist
- implementation has been reviewed
- documentation is updated when necessary
- the resulting application remains runnable and presentable
- the work has a recoverable Git history once Git is enabled

## AI-assisted workflow

Agents must not autonomously:

- merge to `main`
- push to remote
- create releases
- create tags
- perform destructive Git operations

unless explicitly requested.

Agents may inspect Git state and recommend actions.

Before significant implementation work, agents should identify the intended branch/scope when Git is available.

## Skill coordination

Use this skill for:

- branch strategy
- commit strategy
- PR preparation
- release/version decisions
- CI/CD decisions
- environment strategy
- Definition of Done

Use `applergo-design-system` for UI/UX decisions.

Use `legacy-reference` when analyzing the historical Applergic project.

These skills have separate responsibilities and should be combined when a task requires more than one.

## Summary

This workflow balances engineering discipline with the practical needs of a small, evolving portfolio project.

The default pattern is:

- branch from `main`
- implement one meaningful change set
- validate locally
- open a PR
- merge only after review and successful checks
- keep `main` stable and presentable

This is intentionally lighter than classic Git Flow, but still demonstrates strong engineering habits.
