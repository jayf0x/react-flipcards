import { act, render, screen } from '@testing-library/react';
import React from 'react';
import FlipCardPanel from './FlipCardPanel';
import { FlipCardRef } from './types';

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

test('separators renders colons only at the given indices', () => {
  // 6 cards with colons after 1 and 3 -> 6 cards + 2 colons.
  render(<FlipCardPanel nrCards={6} separators={[1, 3]} showLabels={false} />);
  expect(screen.getByTestId('fcp-container').children.length).toBe(6 + 2);
});
