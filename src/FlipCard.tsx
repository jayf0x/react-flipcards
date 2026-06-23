import clsx from 'clsx';
import React from 'react';
import styles from './styles.module.css';
import { Digit } from './types';

export interface FlipCardProps {
  /** Value currently shown on the card. Changing it triggers the flip animation. */
  value: Digit;
  className?: string;
  style?: React.CSSProperties;
}

type FlipCardState = {
  current: Digit;
  next: Digit;
};

/**
 * A single 3D flip card. When `value` changes it flips from the old value
 * (front/below) to the new value (back/above). The flip animation logic is
 * the original flip-clock animation, kept intact.
 */
export default function FlipCard(props: FlipCardProps) {
  const { value, className, style } = props;
  const [card, setCard] = React.useState<FlipCardState>({ current: value, next: value });
  const [flipped, setFlipped] = React.useState(false);
  // The value currently committed to the front face — tracked in a ref so the
  // effect can compare against it without depending on (and re-running for) state.
  const displayed = React.useRef(value);

  React.useEffect(() => {
    if (value === displayed.current) {
      setFlipped(false);
      return;
    }
    // New value arrived: flip the front face away to reveal `next`.
    setCard({ current: displayed.current, next: value });
    setFlipped(true);
  }, [value]);

  const handleTransitionEnd = (): void => {
    displayed.current = value;
    setCard({ current: value, next: value });
    setFlipped(false);
  };

  return (
    <div className={clsx('fcp__card_block', styles.fcp__digit_block, className)} style={style} suppressHydrationWarning>
      <div className={styles.fcp__next_above}>{card.next}</div>
      <div className={styles.fcp__current_below}>{card.current}</div>
      <div className={clsx(styles.fcp__card, { [styles.fcp__flipped]: flipped })} onTransitionEnd={handleTransitionEnd}>
        <div className={clsx(styles.fcp__card_face, styles.fcp__card_face_front)}>{card.current}</div>
        <div className={clsx(styles.fcp__card_face, styles.fcp__card_face_back)}>{card.next}</div>
      </div>
    </div>
  );
}
