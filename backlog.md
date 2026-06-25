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

## 1. Flip modes: `sync` (default) + `queue` + `spin`

### The key fact

`FlipCard` today is a **two-face flip**: one 180° rotation from the old value to
the new one. `5 → 8` is a _single_ flip showing "5" then "8" — it does **not**
roll through 6, 7. The card only ever has two faces. So "roll through the
intermediate digits" is not a timing tweak on the current animation; it's a
different primitive. Keep that front of mind.

### Two orthogonal axes

1. **What plays** — only the latest value, or every step in between.
2. **How time is budgeted** — fixed _per step_ (constant speed, total grows with
   distance) or fixed _total_ (compress to fit, speed grows with distance).

|                 | fixed per-step                                  | fixed total                                           |
| --------------- | ----------------------------------------------- | ----------------------------------------------------- |
| **latest only** | `sync` (today's default)                        | — (1 step, moot)                                      |
| **every step**  | `queue` — rolls at human speed, can fall behind | `spin` — rolls but lands in ~N, needs an easing curve |

### The engine: chase the latest, don't snapshot

Do **not** freeze a snapshot/FIFO of pending values — that's the path that gets
messy when the target changes mid-roll. Store almost nothing per card:

- `displayed` (current face) + `target` (latest value passed in).
- On every `transitionEnd`, re-read `target`:
  - `sync` → flip straight to `target`.
  - `queue` / `spin` → step one toward `target` (`+1 mod 10`), flip, repeat
    until `displayed === target`.

Because each settle re-reads the **latest** target, "if the target changes it
keeps rolling / flips the other way" is free — there's nothing to reconcile. For
normal monotonic streams (5,6,7,8) stepping toward the latest passes through
every value, so you get "animate every change" **without storing them**.

Consequence: rolling is inherently a **numeric digit** feature. A card holding
`"Mon"` (see feature 2) has no "step toward", so roll modes only apply to 0–9.

### Rendering split (don't fight CSS)

- `sync` and `queue` (human speed, ~0.3–0.7s/step) look right as real 3D flips —
  reuse the current renderer, just drive it from the chase-latest loop.
- `spin` (e.g. 0.1s for a 10-digit roll) does **not** work as N tiny 3D flips —
  jank, and `transitionEnd` is unreliable that fast. It wants a different
  renderer: an **odometer strip** (digits stacked vertically, one `translateY`
  transition with an `ease-out` curve). One transition covers any distance in
  any duration — the "pure CSS with a curve" effect — but it _scrolls_ instead
  of _flips_. Treat `spin` as its own visual primitive / experiment, not a flag
  bolted onto the flip.

### Notes / decisions

- **Default stays `sync`.** Clocks depend on it.
- **Fix the default first (no-drop):** even before adding modes, make each flip
  complete and, on `transitionEnd`, flip again if a newer value arrived. That's
  the chase-latest loop with step = "jump". It kills the existing "fast updates
  break the magic" glitch with **zero new API or visuals** — and it's the engine
  the roll modes build on. Highest value, do it first.
- **No `smart` mode.** It was invented to stop `queue` falling behind via a
  discard heuristic. `spin` already self-corrects (whole roll compressed to ~N),
  so it solves that problem properly. If a constant-speed `queue` ever needs a
  cap, add a numeric `maxQueue?: number`, not a black-box mode.

---

## 2. Custom card content (non-numeric)

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
