---
name: working-with-typescript-react
description: >-
  TypeScript and React coding standards for this project. Use whenever writing,
  editing, reviewing, or refactoring .ts/.tsx files, React components, hooks,
  props/types, effects, state, or Vite React code.
paths:
  - "**/*.{ts,tsx}"
---

# Working with TypeScript + React

Follow these rules for all TypeScript and React work in this repo. Prefer
matching existing project patterns over inventing new ones.

## TypeScript

- Prefer `type` for object shapes and unions unless declaration merging is needed.
- Import types with `import type { ... }` when the import is type-only.
- Avoid `any`. Prefer `unknown` and narrow; use a specific type or generics instead.
- Do not use non-null assertions (`!`) unless the invariant is proven and local.
- Prefer explicit return types on exported functions and shared utilities.
- Keep props interfaces/types next to the component that uses them unless shared.
- Prefer discriminated unions over optional boolean flags for variant state.
- Prefer `as const` / literal unions over magic strings for fixed option sets.
- Do not widen types unnecessarily (`string` when a union of literals is known).

## React components

- Use function components only. No class components.
- Default to named exports for pages/components (`export function Foo`).
- Keep components focused: one clear UI responsibility per file when practical.
- Colocate small helpers used by one component in the same file; extract shared
  logic to `src/hooks/` or `src/utils/` when reused.
- Prefer composition over prop drilling through many layers.
- Do not add comments that restate what the code already says.

## State and effects

- Prefer deriving values during render over storing them in state.
- Do not sync props into state unless intentionally allowing local divergence.
- Keep `useEffect` rare: use it for external system sync (DOM, subscriptions,
  network that must live outside render), not for cascading state updates.
- List complete effect dependencies. Do not silence the lint rule without cause.
- Prefer modern React APIs when they fit: `useEffectEvent`, `startTransition`,
  `useDeferredValue`.
- Clean up subscriptions, timers, and listeners in effect teardown.

## Memoization

- Do **not** add `useMemo`, `useCallback`, or `React.memo` by default.
- Only memoize when there is a measured or obvious need (stable identity for a
  child that depends on it, expensive pure computation, or matching an existing
  local pattern).
- Prefer fixing unstable dependencies or restructuring over blanket memoization.

## Events, forms, and accessibility

- Type event handlers with React event types (`React.ChangeEvent`, etc.) or
  inferred handler types from props.
- Interactive elements must be keyboard-accessible and have accessible names.
- Prefer semantic HTML (`button`, `a`, `label`) over clickable `div`s.

## Styling and project layout

- Follow existing Tailwind utility patterns and shared components
  (`Button`, `Card`, `SectionHeading`, `ScrollReveal`, `cn`).
- Put route pages in `src/pages/`, reusable UI in `src/components/`, static
  content in `src/data/`, shared types in `src/types/`.
- Wire new routes through `src/App.tsx` with React Router.

## Quality bar before finishing

- Preserve existing naming, file structure, and visual language.
- Avoid drive-by refactors unrelated to the task.
- After edits, ensure types are coherent and unused imports/vars are removed.
- Run or respect project lint/typecheck (`pnpm lint`, `pnpm build`) when changes
  are non-trivial.
