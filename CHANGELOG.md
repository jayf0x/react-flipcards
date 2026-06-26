# Changelog

## Unreleased

- Add `mode` prop with `sync` (default) and `queue`. `sync` is now a chase-latest
  loop: each flip completes and re-checks the latest value, so rapid updates are
  never dropped. `queue` rolls through every intermediate digit toward the latest
  value (numeric cards only).

## v0.1.1

- Add clsx dependency

## v1.0.0

- Initial release: `FlipCardPanel` with static and ref-driven (`set` / `increment` / `reset` / `getValue`) usage, labels, separators, dividers, and CSS-variable theming.
