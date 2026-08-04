---
name: working-with-typescript-react
description: >-
  TypeScript and React coding standards for this project, including matching
  the site's existing visual style. Use whenever writing, editing, reviewing,
  or refactoring .ts/.tsx files, React components, hooks, props/types, effects,
  state, Vite React code, or UI/styling on pages.
paths:
  - "**/*.{ts,tsx}"
  - "**/*.css"
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

## Visual style (match the current page)

Before writing or changing UI, open nearby pages/components and **match their
look, copy tone, spacing, and Tailwind patterns**. Do not introduce a new
visual system. Prefer extending what already exists on that page.

### Site language

- Dark shell: page background `#0a0a0a`, white text, teal accent via
  `text-accent` / `border-accent` / `bg-accent` (`--color-accent: #36b5a0` in
  `src/index.css`). Prefer theme tokens over hard-coded hex unless the
  surrounding code already uses a local palette (e.g. letter envelopes).
- Typography: `font-mono` (JetBrains Mono) for labels, nav, CTAs, and small
  meta; body/headings otherwise follow Inter via the global sans stack.
- Copy: lowercase, concise, often with a trailing period (`blog.`,
  `page not found.`). Keep that voice unless the page already differs.
- Opacity hierarchy for secondary text: `text-white/60`, `/50`, `/40`.
  Borders/dividers: `border-white/10`–`/30`, not heavy cards by default.

### Layout and components

- Page width: `mx-auto max-w-6xl px-4 sm:px-6 lg:px-8`, often with `py-16`.
- Page titles: `SectionHeading` (`title` + optional `subtitle`).
- Entrance motion: wrap blocks in `ScrollReveal` when siblings on the page do.
- Reuse `Button`, `Card`, `Badge`, `cn` instead of one-off primitives.
- Links/CTAs: accent mono text with underline or color hover
  (`hover:text-accent/80`), matching Navbar/Footer/NotFound patterns.
- Motion: subtle transitions (`duration-200`–`300`); avoid new glow stacks,
  pill clusters, or dashboard-style chrome unless the page already has them.

### Page-local exceptions

- Some routes have a distinct composition (e.g. Landing hero canvas,
  PrishaLetters envelopes). When editing those, match **that page's** local
  style and keep the global shell (Navbar/Footer/Layout) unchanged.
- New public pages should follow the main portfolio look (About/Blog/Projects/
  Contact/NotFound), not a special-case page, unless the user asks otherwise.

## Project layout

- Put route pages in `src/pages/`, reusable UI in `src/components/`, static
  content in `src/data/`, shared types in `src/types/`.
- Wire new routes through `src/App.tsx` with React Router.
- Theme tokens and global CSS live in `src/index.css`.

## Quality bar before finishing

- Preserve existing naming, file structure, and visual language.
- Avoid drive-by refactors unrelated to the task.
- After edits, ensure types are coherent and unused imports/vars are removed.
- Run or respect project lint/typecheck (`pnpm lint`, `pnpm build`) when changes
  are non-trivial.
