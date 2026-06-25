# Contributing

Thanks for helping out! This is a small, focused library — a flip-card
primitive that animates values the consumer owns. Contributions that keep it
tiny and unopinionated are the easiest to merge.

> Using an AI agent? See [AGENTS.md](./AGENTS.md) for a machine-oriented map of the repo.

## Prerequisites

- [Bun](https://bun.sh) (the repo pins `bun@1.3.13`)
- Node-compatible environment for React 16.13–19

## Getting started

```bash
git clone https://github.com/jayf0x/react-flipcards
cd react-flipcards
bun install

bun run test           # run the suite
cd demo && bun install && bun run dev   # Storybook playground on :6006
```

The `demo/` Storybook is the fastest way to see changes: it aliases
`react-flip-cards` to the live `src/`, so edits show up immediately.

## Project layout

See the table in [AGENTS.md](./AGENTS.md#layout). In short: the library is
`src/`, the demo is the self-contained `demo/` package, and `backlog.md` lists
proposed future work.

## Making a change

1. Branch off `main`.
2. Make the change. Keep the public API (`src/types.ts`) accurate and documented.
3. Add or update a test in `test/FlipCardPanel.spec.tsx` for non-trivial logic.
4. Update the `README.md` API section and a `demo/` story if you changed behavior.
5. Run the full check (this is what CI runs):

   ```bash
   bun run lint && bun run typecheck && bun run test && bun run build
   ```

6. Add a `CHANGELOG.md` entry. **Don't** bump `version` or publish — that's a maintainer release step.
7. Open a PR against `main` with a clear description of the what and why.

## Style

- TypeScript strict; full types are shipped.
- ESLint + Prettier are enforced via a pre-commit hook (husky + lint-staged). Run `bun run format` if needed.
- Comments explain _why_, not _what_.
- All styling flows through `--fcp-*` CSS variables in `src/styles.module.css`.

## Design principles (please respect these)

- **The consumer owns the data.** No internal timers, fetching, or assumptions about what the digits mean.
- **Stay tiny.** Avoid new runtime dependencies; bundle size is a feature.
- **One primitive, many use cases** — clocks, counters, scoreboards, odometers all come from the same component. Add flexibility through props/CSS variables, not special-case modes.

## Reporting bugs / ideas

Open an issue with a minimal repro (a CodeSandbox or a `demo/` story is ideal).
Larger feature ideas: check `backlog.md` first — it may already be scoped there.
