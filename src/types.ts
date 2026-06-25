import React from 'react';

/** A single card's displayed value. */
export type Digit = number | string;

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
  /** Spacing between cards / separators. */
  readonly spacing?: number | string;
  /**
   * Called with the new values whenever the displayed cards change (via the
   * ref API). Lets a parent track state without mirroring it by hand.
   */
  readonly onChange?: (values: number[]) => void;
}
