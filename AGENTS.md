# AGENTS.md

Guidance for AI coding agents working in this repo. Humans: see [CONTRIBUTING.md](./CONTRIBUTING.md).

## What this is

`react-flip-cards` — a tiny, ref-driven 3D flip-card primitive for React. The
consumer owns the values; the component just animates them. Ships ~2 kB gzipped
with zero runtime config.

## Layout

| Path                          | What                                                                                                                                                                                                                              |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/FlipCardPanel.tsx`       | The exported component. Owns the values, the imperative ref API, and maps style props → CSS variables.                                                                                                                            |
| `src/FlipCard.tsx`            | A single 3D card. Chase-latest loop: stores only the displayed face and flips toward the latest `value`, re-reading it on every `transitionEnd` (`mode`: `sync` jumps, `queue` steps +1 mod 10). The animation lives here.        |
| `src/types.ts`                | `FlipCardPanelProps` and the `FlipCardRef` imperative API. **Edit here when changing the public API.**                                                                                                                            |
| `src/styles.module.css`       | All visuals, driven by `--fcp-*` CSS variables.                                                                                                                                                                                   |
| `src/utils.ts`                | Small helpers (`convertToPx`).                                                                                                                                                                                                    |
| `test/FlipCardPanel.spec.tsx` | The test suite.                                                                                                                                                                                                                   |
| `demo/`                       | Storybook demo — a **separate package** with its own `package.json`. It aliases `react-flip-cards` → `../src` (see `demo/vite.config.ts`), so it always runs against live source. Never install the library as a demo dependency. |
| `backlog.md`                  | Proposed future work, not yet committed.                                                                                                                                                                                          |

## Setup & commands

Package manager is **bun** (`packageManager: bun@1.3.13`). Run from the repo root for the library, from `demo/` for the demo.

```bash
bun install                 # root: install library dev deps
bun run test                # vitest
bun run typecheck           # tsc --noEmit
bun run lint                # eslint
bun run build               # vite build + emit .d.ts
bun run format              # prettier write on src

cd demo && bun install      # demo has its own deps
cd demo && bun run dev      # Storybook on :6006
cd demo && bun run test     # demo smoke test (renders every story)
```

## Conventions

- **TypeScript strict.** Full types are shipped — keep `FlipCardRef` and `FlipCardPanelProps` accurate and JSDoc'd; they're the public contract.
- **Match the surrounding style.** Comments explain _why_, not _what_. Prettier + ESLint are enforced (pre-commit via husky + lint-staged); run `bun run format` before finishing.
- **Styling goes through `--fcp-*` CSS variables**, not inline styles. New visual knobs = a new variable in `styles.module.css` + a prop that feeds it.
- **The component is consumer-driven.** Don't add internal timers, data fetching, or opinions about what the digits mean. Values come from the caller via props or the ref API.
- **Stay tiny.** No new runtime dependencies without a strong reason — bundle size is a feature.
- React peer range is **16.13 → 19**; don't use APIs outside that range.

## Definition of done

Before declaring a change finished, run and pass — this mirrors CI (`.github/workflows/main.yml`):

```bash
bun run lint && bun run typecheck && bun run test && bun run build
```

- Non-trivial logic gets a test in `test/FlipCardPanel.spec.tsx`.
- A public API change updates `src/types.ts`, the `README.md` API section, and the relevant `demo/` story.
- Don't bump `version` or publish — release is a separate flow (`scripts/deploy-npm.sh`, `publish.yml`). Add a `CHANGELOG.md` entry instead.

## Gotchas

- Editing `src/` is reflected live in the demo (alias). No build/copy step.
- `onChange` fires only on real changes, never on mount (by design — see the reference-compare in `FlipCardPanel.tsx`).
- `set()` is overloaded: `set(values[])` and `set(index, value)`. Keep both working.
