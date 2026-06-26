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

## ~~1. `spin` flip mode — odometer roll, fixed total time~~ ✅ Done

> **Shipped.** `mode='spin'` renders via `src/OdometerCard.tsx` — a vertical 0–9
> strip (doubled for forward wrap) scrolled by one `translateY`/`ease-out`
> transition, chase-latest like the flip engine. The whole feature (`sync` +
> `queue` + `spin`) is now complete. Design notes kept below for reference.

### Where `spin` fits

Two orthogonal axes describe a roll: _what plays_ (latest value only vs. every
step in between) and _how time is budgeted_ (fixed **per step** → constant
speed, total grows with distance; or fixed **total** → speed grows with
distance, always lands in ~N).

|                 | fixed per-step | fixed total            |
| --------------- | -------------- | ---------------------- |
| **latest only** | `sync` ✅      | — (1 step, moot)       |
| **every step**  | `queue` ✅     | **`spin`** ← this item |

`queue` is fixed-per-step, so it inherently **falls behind** when the target is
far or moving fast — that lag is by design, not a bug. `spin` is the answer: it
compresses the whole roll into ~one duration, so it always lands on time.

### Why it can't reuse the flip renderer

`spin` (e.g. 0.1s for a 10-digit roll) does **not** work as N tiny 3D flips —
jank, and `transitionEnd` is unreliable that fast. The chase-latest loop that
drives `sync`/`queue` assumes one settle per step; `spin` has no per-step
settle.

It wants a **different renderer**: an **odometer strip** — the digits `0–9`
stacked vertically, moved with a single `translateY` transition and an
`ease-out` curve. One transition covers any distance in any duration (the "pure
CSS with a curve" effect), but it _scrolls_ instead of _flips_. Treat `spin` as
its own visual primitive, not a flag bolted onto the flip.

### Sketch

- A separate component (e.g. `OdometerCard`) selected when `mode === 'spin'`;
  the flip renderer stays untouched for `sync`/`queue`.
- Strip of `0–9` (likely doubled to `0–9 0–9` so wrap-around 9→0 scrolls forward
  instead of snapping back). `translateY(-value * digitHeight)` with
  `transition: transform var(--fcp-flip-duration) ease-out`.
- Still **chase-latest**: store `displayed` + `target`, set `translateY` to the
  latest target; a changing target just retargets the same transition. No FIFO.
- Numeric-only, like `queue` (no "step" for non-numeric content — see feature 2).

### Decisions to keep

- **Default stays `sync`.** Clocks depend on it.
- **No `smart` mode.** It existed to stop `queue` falling behind via a discard
  heuristic; `spin` solves that properly (whole roll compressed to ~N). If
  constant-speed `queue` ever needs a cap, add a numeric `maxQueue?: number`, not
  a black-box mode.

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
