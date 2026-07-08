import clsx from 'clsx';
import { CSSProperties, Fragment, forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import FlipCard from './FlipCard';
import OdometerCard from './OdometerCard';
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
const FlipCardPanel = forwardRef<FlipCardRef, FlipCardPanelProps>(function FlipCardPanel(props, ref) {
  const {
    nrCards,
    initialValue,
    labels,
    showLabels = true,
    blockStyle,
    labelStyle,
    showSeparators = false,
    separators,
    separatorStyle,
    showDivider = true,
    dividerStyle,
    duration = 0.7,
    mode = 'sync',
    faces,
    spacing,
    onChange,
    className,
    style,
    ...other
  } = props;

  // Internal source of truth. Seeded from initialValue on mount; the ref API mutates it.
  // Only re-seed when the card count changes.
  const [values, setValues] = useState<number[]>(() =>
    Array.from({ length: nrCards }, (_, i) => initialValue?.[i] ?? 0)
  );
  const prevNrCards = useRef(nrCards);
  const initialValueRef = useRef(initialValue);
  initialValueRef.current = initialValue;

  useEffect(() => {
    if (prevNrCards.current === nrCards) return;
    prevNrCards.current = nrCards;
    setValues(Array.from({ length: nrCards }, (_, i) => initialValueRef.current?.[i] ?? 0));
  }, [nrCards]);

  // Notify the parent when values change — never on the initial mount. Compare
  // by reference (state always produces a new array on change) so a re-run of
  // this effect with unchanged values (e.g. StrictMode) stays silent.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const notified = useRef(values);
  useEffect(() => {
    if (values === notified.current) return;
    notified.current = values;
    onChangeRef.current?.(values);
  }, [values]);

  // Imperative API — lets consumers update cards without re-rendering the parent.
  // valuesRef keeps getValue() reading the latest values without rebuilding the handle.
  const valuesRef = useRef(values);
  valuesRef.current = values;
  useImperativeHandle(
    ref,
    () => ({
      // set(values[]) sets every card; set(index, value) sets a single card.
      set: (a: number[] | number, b?: number) =>
        setValues((prev) =>
          Array.isArray(a)
            ? prev.map((v, i) => (a[i] !== undefined ? a[i] : v))
            : prev.map((v, i) => (i === a ? (b as number) : v))
        ),
      increment: (index) =>
        setValues((prev) => prev.map((v, i) => (i === index ? (v + 1) % (faces?.length ?? 10) : v))),
      reset: () => setValues((prev) => prev.map(() => 0)),
      getValue: () => valuesRef.current
    }),
    [faces]
  );

  // Card indices that get a trailing colon. Explicit `separators` wins;
  // otherwise `showSeparators` puts one between every pair.
  const sepIndices = useMemo(() => {
    if (separators) return new Set(separators);
    if (showSeparators) return new Set(Array.from({ length: nrCards - 1 }, (_, i) => i));
    return new Set<number>();
  }, [separators, showSeparators, nrCards]);
  const hasSeparators = sepIndices.size > 0;

  const containerStyles = useMemo<CSSProperties>(
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
      '--fcp-separator-color': hasSeparators ? separatorStyle?.color : 'transparent',
      ...style
    }),
    [style, blockStyle, labelStyle, duration, dividerStyle, separatorStyle, hasSeparators, showDivider, spacing]
  );

  // Style props that map to CSS variables are stripped so they don't double-apply inline.
  const cardStyle = useMemo(() => {
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
        <Fragment key={i}>
          <div className={clsx('fcp__card_container', styles.fcp__digit_block_container)}>
            {showLabels && labels?.[i] != null && (
              <div className={clsx('fcp__label', styles.fcp__digit_block_label)} style={labelStyle}>
                {labels[i]}
              </div>
            )}
            {mode === 'spin' ? (
              <OdometerCard value={value} style={cardStyle} />
            ) : (
              <FlipCard value={faces ? (faces[value] ?? value) : value} mode={mode} style={cardStyle} />
            )}
          </div>
          {sepIndices.has(i) && <div className={clsx('fcp__separator', styles.fcp__colon)}></div>}
        </Fragment>
      ))}
    </div>
  );
});

export default FlipCardPanel;
