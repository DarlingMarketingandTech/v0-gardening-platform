---
name: frontend-ui-engineering
description: "Builds production-quality user interfaces that are accessible, performant, visually polished, and consistent with the project's design system. Use when building or modifying user-facing UI, including components/pages, layouts, responsive behavior, interaction/state management, accessibility fixes, empty/loading/error states, and visual/UX polish."
---

# Frontend UI Engineering

## Goal
Ship UI that feels design-aware and production-built (not template/AI-generated): clear hierarchy, consistent spacing, semantic structure, accessible interactions, and realistic content behavior.

## Workflow (use smallest safe change)
1. Inspect existing patterns (components, tokens, spacing, typography, colors).
2. Choose the simplest state model that works (local -> lifted -> context -> URL -> server -> global).
3. Implement with composition, semantic HTML, and predictable layout constraints.
4. Add/verify loading, empty, and error states.
5. Validate responsiveness and keyboard/screen-reader basics.

## Component architecture
- Colocate component implementation + tests/stories/hooks/types when useful.
- Prefer composition over over-configuration.
- Keep components focused; split if a component grows past ~200 lines.
- Separate data-fetching/container logic from presentation.

### Suggested structure
- src/components/<ComponentName>/<ComponentName>.tsx
- src/components/<ComponentName>/<ComponentName>.test.tsx (when repo has tests)
- src/components/<ComponentName>/<ComponentName>.stories.tsx (when Storybook exists)

## State management (pick the simplest)
- useState: component-local UI state
- Lifted state: shared between a couple siblings
- Context: read-heavy, write-rare cross-tree state (theme/locale/auth)
- URL state: filters, pagination, shareable UI state
- Server state: SWR/React Query patterns where already present
- Global store: only when complexity truly demands it

Avoid prop drilling deeper than ~3 layers; restructure or introduce context.

## Design system adherence (avoid the AI aesthetic)
- Use the project's real palette/tokens; avoid default indigo/purple themes.
- Avoid heavy gradients, oversized rounding, shadow-stacks, and generic hero/card templates.
- Use the spacing scale; do not invent odd pixel/rem values.
- Use semantic color tokens (example: text-muted, bg-surface, border-default) over raw hex.
- Use realistic placeholder content so wrapping/overflow is honest.

## Accessibility (baseline)
- Prefer native elements (button, a, input) over div click-handlers.
- Ensure everything interactive is reachable by keyboard and has a visible focus state.
- Provide accessible names (label, aria-label) for controls without visible text.
- Don’t rely on color alone to communicate state.
- Don’t skip heading levels; keep a sensible document outline.

See: references/accessibility-checklist.md

## UI quality checklist
- No blank screens: loading/empty/error states are explicit.
- Forms have labels, helpful errors, and sensible input types.
- Layout works at: 320px, 768px, 1024px, 1440px.
- Content wraps/clamps intentionally; long strings don’t break the layout.
- No console errors/warnings introduced.

## Verification (after changes)
- Run the repo's lint/typecheck/build commands (if present).
- Tab through the page: all controls reachable and usable.
- Quick screen-reader sanity: headings/landmarks make sense.
- Check at least one narrow mobile viewport (320-390px).
