import { useRef, useState } from 'react';
import FlipCardPanel, { type FlipCardRef } from 'react-flip-cards';
import { Button, Stage, toDigits } from './ui';

export default { title: 'Imperative API' };

/**
 * Every ref method on one panel: set / increment / reset / getValue.
 * This is the pattern to copy when a parent owns the value.
 */
export const Playground = () => {
  const ref = useRef<FlipCardRef>(null);
  const [readout, setReadout] = useState('—');

  return (
    <Stage title='Ref playground' hint='Drive the cards imperatively — the parent never re-renders to update them.'>
      <FlipCardPanel ref={ref} nrCards={4} blockStyle={{ width: 56, height: 76, fontSize: 44 }} />
      <div className='demo-controls'>
        <Button primary onClick={() => ref.current?.set([1, 3, 3, 7])}>
          set([1,3,3,7])
        </Button>
        <Button onClick={() => ref.current?.set(toDigits(Math.floor(Math.random() * 10000), 4))}>set(random)</Button>
        <Button onClick={() => ref.current?.increment(0)}>increment(0)</Button>
        <Button onClick={() => ref.current?.increment(3)}>increment(3)</Button>
        <Button onClick={() => ref.current?.reset()}>reset()</Button>
        <Button onClick={() => setReadout(JSON.stringify(ref.current?.getValue()))}>getValue()</Button>
      </div>
      <p>
        <code>getValue()</code> → {readout}
      </p>
    </Stage>
  );
};
