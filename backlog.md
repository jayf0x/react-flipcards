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

## ITEM: Custom card content (non-numeric)

Let a card display arbitrary content instead of `0–9`, e.g. weekdays
`["Mo", "Tue", …, "Su"]`, months, or `["▲", "▼"]`. The component stays
value-driven; the caller supplies the vocabulary.

Rough shape (decide details when building):

- A per-panel prop for the set of faces, e.g. `faces?: ReactNode[]`, with the
  card `value` indexing into it (number → `faces[value]`), or accept the content
  directly. Numeric `0–9` remains the default when `faces` is omitted.
- The flip animation is content-agnostic already (it animates two faces) — this
  is mostly a content/typing change, not an animation one.
- **Width:** non-numeric content varies in width. Expose it through a `--fcp-*`
  CSS variable (consistent with the rest of the styling) so the caller can fix a
  width / padding rather than the component guessing. Document the knob.

Interaction with feature 1: roll modes (`queue`/`spin`) step `±1 mod faces.length`
once content is index-based, so a weekday board _could_ roll Mon→Sun — but that's
a follow-up, not part of the initial content support.
