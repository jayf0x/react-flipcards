# Improvements

Future work focused on real performance gain, clean code, reliability, and edge-case bugs.

## Candidate improvements

- [ ] **Clarify / robustify `FlipCardPanel` initialValue seeding.**
  - The panel currently derives its initial state from `initialValue` only on mount / when `nrCards` changes.
  - This is implemented via `useMemo(() => ..., [nrCards])`, which is subtly brittle and can make `initialValue` appear to be ignored unexpectedly.
  - Refactor to an explicit mount-only initialization pattern (`useState(() => ...)` + optional `useRef` sentinel) or document the semantics clearly.

- [ ] **Make `OdometerCard` numeric-only behavior explicit and safe.**
  - `OdometerCardProps.value` is typed as `Digit`, but `mode='spin'` only makes sense for numeric digits.
  - `digitOf()` currently coerces non-numeric values to `0`, which is a silent bug if a consumer passes a string.
  - Add a dedicated `NumericDigit` type / narrower prop type and/or runtime guard so the API matches the implementation.

- [ ] **Centralize animation phase string unions.**
  - `FlipCard.tsx` and `OdometerCard.tsx` both define local literal unions like `'idle' | 'armed' | 'flipping'` and `'idle' | 'armed' | 'spinning'`.
  - Move these into a shared type in `src/types.ts` or a small `src/animation.ts` helper for consistency and to avoid drift.

- [ ] **Harden transition-end handling.**
  - `FlipCard.handleTransitionEnd` and `OdometerCard.handleTransitionEnd` do not inspect the transition event.
  - If nested transitions are added later, an unrelated `transitionend` could trigger a state update.
  - Use `event.propertyName === 'transform'` or a dedicated callback filter to make the handlers resilient.

- [ ] **Narrow `FlipCardPanel` mode/renderer contract.**
  - The panel chooses `OdometerCard` whenever `mode === 'spin'`, but the public `Digit` type still permits non-numeric values.
  - This mismatch should be fixed by either narrowing `mode`/`value` compatibility or by making the non-numeric fallback behavior explicit in docs/props.

- [ ] **Review `separator` index normalization and validation.**
  - `separators` is accepted as raw indices and stored in a `Set`, but invalid values (negative, out of range, duplicates) are not normalized or warned.
  - Consider normalizing indices and/or clamping to valid card positions for stronger contract reliability.

- [ ] **Consider minor API cleanup in `FlipCardPanelRef.set`.**
  - The overload currently treats `undefined` array entries as "leave unchanged".
  - That is reasonable, but it may be worth documenting explicitly or switching to a clearer `setAll` + `setOne` split if the API evolves.

## Notes

- There are no glaring performance problems in the current `src/` code: the render path is simple, memoization is used where appropriate, and the animation loop is already optimized around chase-latest semantics.
- The main improvements are reliability/typing hardening and removing subtle mismatches between public types and internal behavior.
