# Changelog

## Unreleased

## v1.0.7

- Add: `faces` prop on `FlipCardPanel` — custom per-card content indexed by value (e.g. weekday labels). `increment` wraps at `faces.length`. `queue`/`spin` stay numeric-only and ignore `faces`.

## v1.0.6

- Fix: enforce numeric-only behavior for OdometerCard component

## v1.0.5

- Fix: harden transition-end event handling

## v1.0.4

- Fix: initialValue resets only on mount, not on rerenders

## v1.0.3

- Internal/infrastructure changes only

## v1.0.2

- Add tenser

## v1.0.1

- Internal/infrastructure changes only

## v1.0.0

- Internal/infrastructure changes only

## v0.1.2

- Add `mode='spin'`: an odometer renderer (`src/OdometerCard.tsx`) that scrolls a
  vertical digit strip straight to the latest value in one `duration`, so a far
  jump still lands on time (unlike `queue`). Numeric cards only. Exposed as
  `OdometerCard` too.
- Add `mode` prop with `sync` (default) and `queue`. `sync` is now a chase-latest
  loop: each flip completes and re-checks the latest value, so rapid updates are
  never dropped. `queue` rolls through every intermediate digit toward the latest
  value (numeric cards only).
- Fix cards getting stuck mid-flip under rapid updates: the transition is now
  restarted via a forced reflow at 0°, so it no longer depends on a paint
  landing between settle and flip. (Also fixes panels that looked frozen, e.g.
  many cards updating on the same tick.)

## v0.1.1

- Add clsx dependency

## v1.0.0

- Initial release: `FlipCardPanel` with static and ref-driven (`set` / `increment` / `reset` / `getValue`) usage, labels, separators, dividers, and CSS-variable theming.
