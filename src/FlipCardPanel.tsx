import clsx from 'clsx';
import React from 'react';
import FlipCard from './FlipCard';
import styles from './styles.module.css';
import { FlipCardPanelProps, FlipCardRef } from './types';
import { convertToPx } from './utils';

/**
 * A generic 3D animated flip-card panel.
 *
 * Consumers own the values. Use it in two ways:
 *  - Static: pass `initialValue` and leave it alone.
 *  - Driven: attach a `ref` and call `set` / `increment` / `reset` / `getValue`.
 *
 * @example
 * const ref = useRef<FlipCardRef>(null);
 * <FlipCardPanel ref={ref} nrCards={3} />
 * ref.current?.set([1, 2, 3]);
 */
const FlipCardPanel = React.forwardRef<FlipCardRef, FlipCardPanelProps>(function FlipCardPanel(props, ref) {
  const {
    nrCards,
    initialValue,
    labels,
    showLabels = true,
    blockStyle,
    labelStyle,
    showSeparators = false,
    separatorStyle,
    showDivider = true,
    dividerStyle,
    duration = 0.7,
    spacing,
    className,
    style,
    ...other
  } = props;

  // Internal source of truth. Seeded from initialValue; the ref API mutates it.
  // Only re-seed when the card count changes; initialValue is read once at mount.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const seed = React.useMemo(() => Array.from({ length: nrCards }, (_, i) => initialValue?.[i] ?? 0), [nrCards]);
  const [values, setValues] = React.useState<number[]>(seed);

  // Re-seed if the number of cards changes.
  React.useEffect(() => setValues(seed), [seed]);

  // Imperative API — lets consumers update cards without re-rendering the parent.
  // valuesRef keeps getValue() reading the latest values without rebuilding the handle.
  const valuesRef = React.useRef(values);
  valuesRef.current = values;
  React.useImperativeHandle(
    ref,
    () => ({
      set: (vals) => setValues((prev) => prev.map((v, i) => (vals[i] !== undefined ? vals[i] : v))),
      increment: (index) => setValues((prev) => prev.map((v, i) => (i === index ? (v + 1) % 10 : v))),
      reset: () => setValues((prev) => prev.map(() => 0)),
      getValue: () => valuesRef.current
    }),
    []
  );

  const containerStyles = React.useMemo<React.CSSProperties>(
    () => ({
      '--fcp-flip-duration': `${duration}s`,
      '--fcp-spacing': convertToPx(spacing),
      '--fcp-digit-block-width': convertToPx(blockStyle?.width),
      '--fcp-digit-block-height': convertToPx(blockStyle?.height),
      '--fcp-digit-block-radius': convertToPx(blockStyle?.borderRadius),
      '--fcp-shadow': blockStyle?.boxShadow,
      '--fcp-digit-font-size': convertToPx(blockStyle?.fontSize),
      '--fcp-digit-color': blockStyle?.color,
      '--fcp-background': blockStyle?.background || blockStyle?.backgroundColor,
      '--fcp-label-font-size': convertToPx(labelStyle?.fontSize),
      '--fcp-label-color': labelStyle?.color,
      '--fcp-divider-color': showDivider ? dividerStyle?.color : 'transparent',
      '--fcp-divider-height': showDivider ? convertToPx(dividerStyle?.height) : '0px',
      '--fcp-separator-size': convertToPx(separatorStyle?.size),
      '--fcp-separator-color': showSeparators ? separatorStyle?.color : 'transparent',
      ...style
    }),
    [style, blockStyle, labelStyle, duration, dividerStyle, separatorStyle, showSeparators, showDivider, spacing]
  );

  // Style props that map to CSS variables are stripped so they don't double-apply inline.
  const cardStyle = React.useMemo(() => {
    if (!blockStyle) return undefined;
    return {
      ...blockStyle,
      background: undefined,
      backgroundColor: undefined,
      width: undefined,
      height: undefined,
      boxShadow: undefined,
      fontSize: undefined,
      color: undefined,
      borderRadius: undefined
    };
  }, [blockStyle]);

  return (
    <div
      {...other}
      className={clsx('fcp', styles.fcp__container, { [styles.fcp__label_show]: showLabels }, className)}
      style={containerStyles}
      data-testid='fcp-container'
    >
      {values.map((value, i) => (
        <React.Fragment key={i}>
          <div className={clsx('fcp__card_container', styles.fcp__digit_block_container)}>
            {showLabels && labels?.[i] != null && (
              <div className={clsx('fcp__label', styles.fcp__digit_block_label)} style={labelStyle}>
                {labels[i]}
              </div>
            )}
            <FlipCard value={value} style={cardStyle} />
          </div>
          {showSeparators && i < values.length - 1 && <div className={clsx('fcp__separator', styles.fcp__colon)}></div>}
        </React.Fragment>
      ))}
    </div>
  );
});

export default FlipCardPanel;
