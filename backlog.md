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

(No open items.)
