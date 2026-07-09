import React from 'react';

/** A single card's displayed value. */
export type Digit = number | string;

/**
 * How a card animates toward a new value.
 * - `sync` (default): flip straight to the latest value. Never drops an update —
 *   if a newer value arrives mid-flip, it flips again once the current flip ends.
 * - `queue`: roll through every intermediate digit at flip speed (5 → 6 → 7 → 8),
 *   always chasing the latest value. Fixed time *per step*, so it can lag behind
 *   a far/fast target. Numeric cards only; non-numeric falls back to `sync`.
 * - `spin`: scroll an odometer strip straight to the latest value in a single
 *   `duration`, however far it has to travel — speed scales with distance, so it
 *   always lands on time. Renders as a vertical scroll, not a 3D flip. Numeric
 *   cards only.
 */
export type FlipMode = 'sync' | 'queue' | 'spin';

/** Animation phase for a flip card. */
export type FlipPhase = 'idle' | 'armed' | 'flipping';

/** Animation phase for an odometer card. */
export type SpinPhase = 'idle' | 'armed' | 'spinning';

/** A card label — plain text or any React node (icon, markup, etc.). */
export type FlipCardLabel = string | React.ReactElement;

/**
 * Imperative handle exposed via `ref`. Lets consumers drive the cards
 * without re-rendering the parent on every value change.
 */
export interface FlipCardRef {
  /** Set every card's value at once, animating any that changed. */
  set(values: number[]): void;
  /** Set a single card at `index` to `value`, e.g. `set(1, 7)`. */
  set(index: number, value: number): void;
  /** Functional update, e.g. `set((prev) => prev.map((v) => v + 1))`. */
  set(updater: (prev: number[]) => number[]): void;
  /** Increment a single card at `index` (wraps 9 → 0). */
  increment(index: number): void;
  /** Reset all cards back to 0. */
  reset(): void;
  /** Read the currently displayed values. */
  getValue(): number[];
}

export interface FlipCardPanelProps extends Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  'children' | 'onChange'
> {
  /** Number of flip cards to render. */
  readonly nrCards: number;
  /**
   * Initial value (0..9) for each card. Missing entries default to 0.
   * Only read on mount — use the ref API to update afterwards.
   */
  readonly initialValue?: number[];
  /** Optional label under each card, e.g. ['Hours', 'Minutes', 'Seconds']. */
  readonly labels?: FlipCardLabel[];
  /**
   * Toggle label visibility.
   * @default true
   */
  readonly showLabels?: boolean;
  /** Styles for the digit blocks (width, height, fontSize, color, background, ...). */
  readonly blockStyle?: React.CSSProperties;
  /** Styles applied to the labels (font-size, color, ...). */
  readonly labelStyle?: React.CSSProperties;
  /**
   * Show colon separators between every card.
   * @default false
   */
  readonly showSeparators?: boolean;
  /**
   * Show colons only after the given card indices — e.g. `[1, 3]` renders
   * `HH:MM:SS` from a single 6-card panel. Takes precedence over
   * `showSeparators` when set.
   */
  readonly separators?: readonly number[];
  /** Separator (colon) styling. */
  readonly separatorStyle?: {
    color?: React.CSSProperties['color'];
    size?: number | string;
  };
  /**
   * Show the horizontal divider across each flip card.
   * @default true
   */
  readonly showDivider?: boolean;
  /** Divider styling. */
  readonly dividerStyle?: {
    color?: React.CSSProperties['color'];
    height?: React.CSSProperties['borderBottomWidth'];
  };
  /**
   * Flip animation duration in seconds.
   * @default 0.7
   */
  readonly duration?: number;
  /**
   * How cards animate toward new values.
   * @default 'sync'
   */
  readonly mode?: FlipMode;
  /**
   * Custom face content, indexed by value: `faces[value]` is displayed instead
   * of the raw number, e.g. `['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']` for a
   * weekday card. The `set`/`increment` ref API still works with numeric
   * indices; `increment` wraps at `faces.length` instead of 10.
   *
   * `queue`/`spin` modes stay numeric-only (see `mode`) — with `faces` set they
   * fall back to jumping straight to the target instead of rolling through
   * intermediate faces.
   *
   * Face content can vary in width; set `blockStyle.width` to fix a width
   * rather than relying on the component to guess.
   *
   * Omit for the numeric 0–9 default.
   */
  readonly faces?: Digit[];
  /** Spacing between cards / separators. */
  readonly spacing?: number | string;
  /**
   * Called with the new values whenever the displayed cards change (via the
   * ref API). Lets a parent track state without mirroring it by hand.
   */
  readonly onChange?: (values: number[]) => void;
}
