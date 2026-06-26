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
 * Restarting a CSS transition needs the element to be committed at 0° before the
 * flip class is added — otherwise rapid updates collapse "settle" and "flip"
 * into one paint, the transition never starts, `transitionEnd` never fires, and
 * the card gets stuck. We use an `armed` step: render the new faces at 0°, force
 * a reflow in a layout effect, then add the flip class. That makes the restart
 * independent of paint timing.
 */
export default function FlipCard(props: FlipCardProps) {
  const { value, mode = 'sync', className, style } = props;
  const [card, setCard] = React.useState<FlipCardState>({ current: value, next: value });
  // 'idle' settled · 'armed' faces set at 0°, about to flip · 'flipping' mid-flip.
  const [phase, setPhase] = React.useState<'idle' | 'armed' | 'flipping'>('idle');
  const cardRef = React.useRef<HTMLDivElement>(null);
  // The value committed to the visible front face. A ref so the start-loop can
  // compare against it without re-running for it.
  const displayed = React.useRef(value);

  // Arm a flip whenever we're settled but behind the latest value. Re-reads
  // `value` on each run (after each step settles to 'idle'), so it always chases
  // the latest target.
  React.useEffect(() => {
    if (phase !== 'idle' || value === displayed.current) return;
    setCard({ current: displayed.current, next: stepToward(displayed.current, value, mode) });
    setPhase('armed');
  }, [value, mode, phase]);

  // Once the new faces are committed at 0°, force a reflow so the browser
  // records that start state, then flip. Layout effect = runs before paint.
  React.useLayoutEffect(() => {
    if (phase !== 'armed') return;
    void cardRef.current?.offsetHeight; // force reflow at 0° so the transition restarts
    setPhase('flipping');
  }, [phase]);

  const handleTransitionEnd = (): void => {
    // The face we just flipped to is now displayed. Settle to it (both faces
    // equal) and go idle; the start-loop decides whether to step again.
    displayed.current = card.next;
    setCard({ current: card.next, next: card.next });
    setPhase('idle');
  };

  return (
    <div className={clsx('fcp__card_block', styles.fcp__digit_block, className)} style={style} suppressHydrationWarning>
      <div className={styles.fcp__next_above}>{card.next}</div>
      <div className={styles.fcp__current_below}>{card.current}</div>
      <div
        ref={cardRef}
        className={clsx(styles.fcp__card, { [styles.fcp__flipped]: phase === 'flipping' })}
        onTransitionEnd={handleTransitionEnd}
      >
        <div className={clsx(styles.fcp__card_face, styles.fcp__card_face_front)}>{card.current}</div>
        <div className={clsx(styles.fcp__card_face, styles.fcp__card_face_back)}>{card.next}</div>
      </div>
    </div>
  );
}
