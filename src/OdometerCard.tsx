import clsx from 'clsx';
import { CSSProperties, useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './styles.module.css';
import { SpinPhase } from './types';

export interface OdometerCardProps {
  /** Value currently shown on the card. Changing it scrolls the strip. */
  value: number;
  className?: string;
  style?: CSSProperties;
}

// 0–9 twice. A roll that wraps (e.g. 8 → 1) scrolls forward through the second
// copy (…8,9,0,1) instead of snapping backwards, then settles into the first.
const STRIP = [...Array(10).keys(), ...Array(10).keys()];

const digitOf = (v: number): number => ((v % 10) + 10) % 10;

/**
 * The `spin` renderer: an odometer strip (digits stacked vertically) moved by a
 * single `translateY` transition with an `ease-out` curve. One transition covers
 * any distance in one `duration`, so the card always lands on time however far
 * it has to travel — the opposite of `queue`'s constant per-step speed.
 *
 * Chase-latest like the flip engine: it stores only the current cell and scrolls
 * toward the latest `value`, always forward (`(target - current) mod 10`). The
 * `armed` step forces a reflow before adding the transition so a rapid retarget
 * can't strand it (same reasoning as `FlipCard`).
 */
export default function OdometerCard(props: OdometerCardProps) {
  const { value, className, style } = props;
  // `cell` is the strip index the transform points at: 0–9 when settled, up to
  // 18 mid-spin (current digit + a forward delta of ≤ 9).
  const [cell, setCell] = useState(() => digitOf(value));
  const [delta, setDelta] = useState(0);
  // 'idle' settled · 'armed' about to spin (reflow pending) · 'spinning'.
  const [phase, setPhase] = useState<SpinPhase>('idle');
  const stripRef = useRef<HTMLDivElement>(null);

  // Arm a spin whenever settled but behind the latest value (re-reads `value`
  // each idle pass, so it chases the latest target).
  useEffect(() => {
    if (phase !== 'idle') return;
    const cur = cell % 10;
    const target = digitOf(value);
    if (target === cur) return;
    setDelta((target - cur + 10) % 10); // always scroll forward
    setPhase('armed');
  }, [value, phase, cell]);

  // Force a reflow at the current cell so the transition restarts, then scroll.
  useLayoutEffect(() => {
    if (phase !== 'armed') return;
    void stripRef.current?.offsetHeight;
    setCell((c) => (c % 10) + delta);
    setPhase('spinning');
  }, [phase, delta]);

  const handleTransitionEnd = (e: { target: EventTarget | null; currentTarget: EventTarget | null }): void => {
    if (e.target !== e.currentTarget) return;
    // Snap from the (possibly doubled) cell back into the first 0–9 copy with no
    // transition, then go idle; the chase loop decides whether to spin again.
    setCell((c) => c % 10);
    setPhase('idle');
  };

  return (
    <div
      className={clsx('fcp__card_block', styles.fcp__digit_block, styles.fcp__odometer, className)}
      style={style}
      suppressHydrationWarning
    >
      <div
        ref={stripRef}
        className={clsx(styles.fcp__odometer_strip, { [styles.fcp__spinning]: phase === 'spinning' })}
        style={{ transform: `translateY(calc(var(--fcp-digit-block-height) * ${-cell}))` }}
        onTransitionEnd={handleTransitionEnd}
      >
        {STRIP.map((d, i) => (
          <div key={i} className={styles.fcp__odometer_digit}>
            {d}
          </div>
        ))}
      </div>
    </div>
  );
}
