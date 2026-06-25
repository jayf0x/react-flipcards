# Backlog

Future ideas, not yet committed. Read `src/FlipCard.tsx` and `src/FlipCardPanel.tsx` before picking one up.

## Flip modes: `sync` (default) + `queue`

Today a card animates straight from its displayed value to the latest one. If
`set()` arrives mid-flip, the new value overrides the running animation — rapid
updates get collapsed, and out-of-pace updates can glitch.

Add a `mode` prop on `FlipCardPanel` (passed down to each `FlipCard`):

- **`sync`** — _default, current behavior._ Always animate toward the latest
  value; skip anything in between. Right for clocks, countdowns, dashboards —
  the display tracks reality and never falls behind.

- **`queue`** — buffer each `set()` value in a small per-card FIFO and play them
  in order, one flip at a time. Right for odometers / scoreboards / slot-machine
  rolls where every step should be visible. Opt-in, never the default (a clock
  in `queue` would drift behind real time).

The per-card queue is the real work here: it also fixes the existing "value
changes mid-animation" glitch for everyone, independent of mode.

### Notes / decisions

- Default stays `sync`. Don't change it — clocks depend on it.
- **Not doing** a `smart` mode (auto-collapse when the queue grows). It's
  complexity invented to fix a problem `queue` creates. If backlog ever bites,
  add a numeric `maxQueue?: number` (drop to latest past the cap) instead — a
  knob the caller tunes beats a black-box heuristic.
- "Animate every change" only means _buffer the values the caller passed_.
  Synthesizing intermediates (caller jumps `5 → 8`, card shows `6, 7`) is a
  separate, numeric-only feature — cards can hold strings, where "in between"
  is undefined. Keep it out of this work.
