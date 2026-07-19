# Backlog

Future ideas, not yet committed. Read `src/FlipCard.tsx` and `src/FlipCardPanel.tsx` before picking one up.

## Definition of done

Every feature below isn't finished when the code works — it's finished when it's
discoverable and won't rot. Before closing one, walk this list (skip what
genuinely doesn't apply, and say why):

- [ ] **Code + types** — `src/types.ts` updated, public API JSDoc'd.
- [ ] **Tests** — a case in `test/FlipCardPanel.spec.tsx` for the new behavior.
- [ ] **Demo** — a Storybook story in `demo/` that exercises it interactively.
- [ ] **README** — the API table / examples reflect the new prop.
- [ ] **AGENTS.md** — update if the architecture or conventions changed.
- [ ] **CHANGELOG.md** — entry added (don't bump `version` / publish).
- [ ] **Green gate** — `bun run lint && bun run typecheck && bun run test && bun run build`.

---

## ITEM: Export `toDigits` as a real helper

`demo/src/ui.tsx` already has `toDigits(n, width): number[]` (zero-padded digit
split). Promote it into `src/utils.ts` and export it from the package so
`initialValue`/`set` can be fed straight from a number:
`ref.current?.set(toDigits(seconds, 3))`.

This replaces the earlier "value + max" component-prop idea — decomposition
stays outside the component instead of `FlipCardPanel` gaining opinions about
radix/padding (conflicts with the "consumer-driven" rule in AGENTS.md). Ship
as a plain named export in the main entry point; a `react-flip-cards/helpers`
subpath is premature for a single function (see export-shape discussion
below) — revisit if the helpers surface grows.

## ITEM: `direction` prop (digit order)

Reverse the rendered order of `values` (RTL locales, or panels that want
seconds-first). Likely just reverses the array before `.map()` in
`FlipCardPanel`, or a CSS `flex-direction` flip on the container — no
animation-logic changes expected.

## ITEM: Controlled `value` prop

Right now the panel is uncontrolled-only (`initialValue` + ref). Add a fully
controlled mode: `value: number[]` + `onChange`, no ref required. Likely the
most common ergonomics gap before someone reaches for `ref` at all.

## ITEM: `disabled` / static mode

Skip the animation entirely and just render the target value — useful for
SSR/no-JS fallback or freezing a final result without importing the
transition machinery.

## ITEM: Accessibility pass

Cards currently expose nothing meaningful to a screen reader (no
`aria-label`/`role` on the value). Needs a pass on `FlipCard`/`OdometerCard`
markup — likely an `aria-live` region or per-card `aria-label` reflecting the
current value, not just the mid-flip DOM nodes.

## ITEM (deferred to next major): Rename `FlipCardPanel`

Agreed the name is clumsy (`FlipCards`? `FlipCardStack`?), but it's a
breaking rename post-1.0 public release — only worth doing bundled into an
actual major version bump, with the old name re-exported + deprecated for one
cycle. Not a drive-by fix.

Note: instead of breaking change. Simply export both new and old name, but deprecate the old.

## ITEM (deferred to next major): Unify `FlipCard` / `OdometerCard` public shape

`FlipCardPanel` already switches between them internally by `mode`
(`FlipCardPanel.tsx`) — the awkwardness is that both are separately _exported_
with separate, non-interchangeable prop shapes for standalone use. Fix is to
give both a shared `CardProps` shape (not necessarily merge the files —
the animations are genuinely different), so swapping one for the other
standalone doesn't mean relearning a prop surface. Pair with the rename item
above since both touch the public export list at the same time.
