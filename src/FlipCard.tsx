import clsx from 'clsx';
import React from 'react';
import styles from './styles.module.css';
import { Digit, FlipMode } from './types';

export interface FlipCardProps {
  /** Value currently shown on the card. Changing it triggers the flip animation. */
  value: Digit;
  /**
   * How the card animates toward `value`.
   * @default 'sync'
   */
  mode?: FlipMode;
  className?: string;
  style?: React.CSSProperties;
}

type FlipCardState = {
  current: Digit;
  next: Digit;
};

/**
 * One step from `from` toward `target`.
 * - `sync`, or non-numeric values: jump straight to the target.
 * - `queue`: a single +1 (mod 10) toward the target, so a stream rolls through
 *   every intermediate digit. Non-numeric can't "step", so it jumps too.
 */
function stepToward(from: Digit, target: Digit, mode: FlipMode): Digit {
  if (mode === 'sync' || from === target) return target;
  if (typeof from !== 'number' || typeof target !== 'number') return target;
  return (from + 1) % 10;
}

/**
 * A single 3D flip card driven by a chase-latest loop: it stores only the
 * displayed face and flips toward the latest `value`. On every `transitionEnd`
 * it re-reads `value`, so updates are never dropped (`sync`) and a changing
 * target keeps rolling without any queued state (`queue`).
 *
 * Removing the `fcp__flipped` class drops the CSS transition entirely, so the
 * card snaps back to 0° with no animation and no extra `transitionEnd` — that
 * snap is what lets us start the next step cleanly.
 */
export default function FlipCard(props: FlipCardProps) {
  const { value, mode = 'sync', className, style } = props;
  const [card, setCard] = React.useState<FlipCardState>({ current: value, next: value });
  const [flipping, setFlipping] = React.useState(false);
  // The value committed to the visible front face. A ref so the start-loop can
  // compare against it without re-running for it.
  const displayed = React.useRef(value);

  // Start a flip whenever we're settled but behind the latest value. Re-reads
  // `value` on every run (after each step settles flipping→false), so it always
  // chases the latest target. Skips while a flip is in flight — don't disturb it.
  React.useEffect(() => {
    if (flipping || value === displayed.current) return;
    const next = stepToward(displayed.current, value, mode);
    setCard({ current: displayed.current, next });
    setFlipping(true);
  }, [value, mode, flipping]);

  const handleTransitionEnd = (): void => {
    // The face we just flipped to is now displayed. Settle to it (both faces
    // equal) and drop the flip; the start-loop decides whether to step again.
    displayed.current = card.next;
    setCard({ current: card.next, next: card.next });
    setFlipping(false);
  };

  return (
    <div className={clsx('fcp__card_block', styles.fcp__digit_block, className)} style={style} suppressHydrationWarning>
      <div className={styles.fcp__next_above}>{card.next}</div>
      <div className={styles.fcp__current_below}>{card.current}</div>
      <div
        className={clsx(styles.fcp__card, { [styles.fcp__flipped]: flipping })}
        onTransitionEnd={handleTransitionEnd}
      >
        <div className={clsx(styles.fcp__card_face, styles.fcp__card_face_front)}>{card.current}</div>
        <div className={clsx(styles.fcp__card_face, styles.fcp__card_face_back)}>{card.next}</div>
      </div>
    </div>
  );
}
