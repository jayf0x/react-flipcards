import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import FlipCardPanel from '../src/FlipCardPanel';
import { FlipCardRef } from '../src/types';

test('renders the requested number of cards', () => {
  render(<FlipCardPanel nrCards={3} showLabels={false} />);
  const container = screen.getByTestId('fcp-container');
  expect(container).toBeInTheDocument();
  expect(container.children.length).toBe(3);
});

test('renders initialValue', () => {
  render(<FlipCardPanel nrCards={3} initialValue={[1, 2, 3]} showLabels={false} />);
  const container = screen.getByTestId('fcp-container');
  // front face of each card shows its current value
  expect(container.textContent).toContain('1');
  expect(container.textContent).toContain('2');
  expect(container.textContent).toContain('3');
});

test('renders labels when provided', () => {
  render(<FlipCardPanel nrCards={3} labels={['Hours', 'Minutes', 'Seconds']} />);
  expect(screen.getByText('Hours')).toBeInTheDocument();
  expect(screen.getByText('Minutes')).toBeInTheDocument();
  expect(screen.getByText('Seconds')).toBeInTheDocument();
});

test('hides labels when showLabels is false', () => {
  render(<FlipCardPanel nrCards={3} labels={['Hours', 'Minutes', 'Seconds']} showLabels={false} />);
  expect(() => screen.getByText('Hours')).toThrow();
});

test('renders separators only when enabled', () => {
  const { rerender } = render(<FlipCardPanel nrCards={3} showLabels={false} showSeparators={false} />);
  expect(screen.getByTestId('fcp-container').children.length).toBe(3);
  rerender(<FlipCardPanel nrCards={3} showLabels={false} showSeparators={true} />);
  expect(screen.getByTestId('fcp-container').children.length).toBe(3 + 2);
});

test('applies custom styles as CSS variables', () => {
  render(
    <FlipCardPanel
      nrCards={2}
      showLabels={false}
      blockStyle={{ width: 40, height: '60px', fontSize: 30, color: 'red', borderRadius: '5px' }}
      separatorStyle={{ color: 'red', size: 6 }}
      showSeparators
      duration={0.5}
      spacing='10px'
    />
  );
  const container = screen.getByTestId('fcp-container');
  expect(container).toHaveStyle('--fcp-spacing: 10px');
  expect(container).toHaveStyle('--fcp-flip-duration: 0.5s');
  expect(container).toHaveStyle('--fcp-digit-block-width: 40px');
  expect(container).toHaveStyle('--fcp-digit-block-height: 60px');
  expect(container).toHaveStyle('--fcp-digit-block-radius: 5px');
  expect(container).toHaveStyle('--fcp-digit-font-size: 30px');
  expect(container).toHaveStyle('--fcp-digit-color: red');
  expect(container).toHaveStyle('--fcp-separator-size: 6px');
  expect(container).toHaveStyle('--fcp-separator-color: red');
});

test('showDivider=false zeroes the divider', () => {
  render(<FlipCardPanel nrCards={1} showLabels={false} showDivider={false} />);
  expect(screen.getByTestId('fcp-container')).toHaveStyle('--fcp-divider-color: transparent');
});

describe('imperative ref API', () => {
  test('set / increment / reset / getValue', () => {
    const ref = React.createRef<FlipCardRef>();
    render(<FlipCardPanel ref={ref} nrCards={3} showLabels={false} />);

    expect(ref.current?.getValue()).toEqual([0, 0, 0]);

    act(() => ref.current?.set([1, 2, 3]));
    expect(ref.current?.getValue()).toEqual([1, 2, 3]);

    act(() => ref.current?.increment(0));
    expect(ref.current?.getValue()).toEqual([2, 2, 3]);

    act(() => ref.current?.reset());
    expect(ref.current?.getValue()).toEqual([0, 0, 0]);
  });

  test('increment wraps 9 -> 0', () => {
    const ref = React.createRef<FlipCardRef>();
    render(<FlipCardPanel ref={ref} nrCards={1} initialValue={[9]} showLabels={false} />);
    act(() => ref.current?.increment(0));
    expect(ref.current?.getValue()).toEqual([0]);
  });

  test('set leaves untouched cards alone', () => {
    const ref = React.createRef<FlipCardRef>();
    render(<FlipCardPanel ref={ref} nrCards={3} initialValue={[1, 1, 1]} showLabels={false} />);
    act(() => ref.current?.set([5]));
    expect(ref.current?.getValue()).toEqual([5, 1, 1]);
  });

  test('set(index, value) updates a single card', () => {
    const ref = React.createRef<FlipCardRef>();
    render(<FlipCardPanel ref={ref} nrCards={3} initialValue={[1, 1, 1]} showLabels={false} />);
    act(() => ref.current?.set(1, 7));
    expect(ref.current?.getValue()).toEqual([1, 7, 1]);
  });
});

test('onChange fires on change but not on mount', () => {
  const ref = React.createRef<FlipCardRef>();
  const onChange = vi.fn();
  render(<FlipCardPanel ref={ref} nrCards={2} onChange={onChange} showLabels={false} />);
  expect(onChange).not.toHaveBeenCalled();

  act(() => ref.current?.set([3, 4]));
  expect(onChange).toHaveBeenLastCalledWith([3, 4]);

  act(() => ref.current?.increment(0));
  expect(onChange).toHaveBeenLastCalledWith([4, 4]);
});

// The card div carries the onTransitionEnd handler; settle a flip by firing it.
// jsdom never fires transitionEnd on its own, so each call advances one step.
function settleFlip(container: HTMLElement) {
  const card = container.querySelector('.fcp__card_block')?.children[2];
  act(() => {
    fireEvent.transitionEnd(card as Element);
  });
}

test('queue mode rolls through every intermediate digit', () => {
  const ref = React.createRef<FlipCardRef>();
  render(<FlipCardPanel ref={ref} nrCards={1} mode='queue' showLabels={false} />);
  const block = screen.getByTestId('fcp-container').querySelector('.fcp__card_block') as HTMLElement;
  const back = () => block.children[0].textContent; // fcp__next_above shows the face being flipped in

  act(() => ref.current?.set([3]));
  expect(back()).toBe('1'); // 0 -> 1, not straight to 3
  settleFlip(screen.getByTestId('fcp-container'));
  expect(back()).toBe('2');
  settleFlip(screen.getByTestId('fcp-container'));
  expect(back()).toBe('3');
});

test('sync mode jumps straight to the latest value (no-drop)', () => {
  const ref = React.createRef<FlipCardRef>();
  render(<FlipCardPanel ref={ref} nrCards={1} mode='sync' showLabels={false} />);
  const block = screen.getByTestId('fcp-container').querySelector('.fcp__card_block') as HTMLElement;
  const back = () => block.children[0].textContent;

  act(() => ref.current?.set([7]));
  expect(back()).toBe('7'); // straight to target, no intermediate steps
});

test('sync survives rapid updates without getting stuck', () => {
  // Regression: a value arriving before the prior flip settled used to strand
  // the card mid-flip. Now the in-flight flip finishes, then it chases latest.
  const ref = React.createRef<FlipCardRef>();
  render(<FlipCardPanel ref={ref} nrCards={1} mode='sync' showLabels={false} />);
  const fcp = screen.getByTestId('fcp-container');
  const block = fcp.querySelector('.fcp__card_block') as HTMLElement;
  const back = () => block.children[0].textContent;

  act(() => ref.current?.set([3]));
  act(() => ref.current?.set([5])); // arrives before the first flip settled
  expect(back()).toBe('3'); // still flipping toward 3, update not dropped
  settleFlip(fcp);
  expect(back()).toBe('5'); // settles, then chases the latest value
  settleFlip(fcp);
  expect(ref.current?.getValue()).toEqual([5]);
});

// The odometer block's only child is the scrolling strip; read its translateY
// cell from the inline transform. CSS-module classes are hashed, so we reach it
// via the stable global `fcp__card_block` class.
function odometerStrip(): HTMLElement {
  return (screen.getByTestId('fcp-container').querySelector('.fcp__card_block') as HTMLElement)
    .children[0] as HTMLElement;
}
const stripCell = (strip: HTMLElement) => /\* (-?\d+)\)/.exec(strip.style.transform)?.[1];

test('spin mode scrolls the odometer straight to the target in one transition', () => {
  const ref = React.createRef<FlipCardRef>();
  render(<FlipCardPanel ref={ref} nrCards={1} mode='spin' showLabels={false} />);
  const strip = odometerStrip();

  expect(stripCell(strip)).toBe('0');
  act(() => ref.current?.set([7]));
  expect(stripCell(strip)).toBe('-7'); // one transition covers the whole 0 -> 7 distance
  act(() => {
    fireEvent.transitionEnd(strip);
  });
  expect(stripCell(strip)).toBe('-7');
});

test('spin wraps forward through the doubled strip (8 -> 1)', () => {
  const ref = React.createRef<FlipCardRef>();
  render(<FlipCardPanel ref={ref} nrCards={1} initialValue={[8]} mode='spin' showLabels={false} />);
  const strip = odometerStrip();

  act(() => ref.current?.set([1]));
  expect(stripCell(strip)).toBe('-11'); // 8 -> 9 -> 0 -> 1 scrolls forward into the 2nd copy
  act(() => {
    fireEvent.transitionEnd(strip);
  });
  expect(stripCell(strip)).toBe('-1'); // snaps back into the first copy, same digit shown
});

test('separators renders colons only at the given indices', () => {
  // 6 cards with colons after 1 and 3 -> 6 cards + 2 colons.
  render(<FlipCardPanel nrCards={6} separators={[1, 3]} showLabels={false} />);
  expect(screen.getByTestId('fcp-container').children.length).toBe(6 + 2);
});
