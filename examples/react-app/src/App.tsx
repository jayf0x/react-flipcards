import React from 'react';
import FlipCardPanel, { FlipCardRef } from 'react-flip-cards';

const App = () => {
  // Score counter — 3 digit scoreboard driven entirely through the ref.
  const scoreRef = React.useRef<FlipCardRef>(null);

  const addPoints = (n: number) => {
    const current = scoreRef.current?.getValue() ?? [0, 0, 0];
    const score = Math.min(999, current.reduce((acc, d) => acc * 10 + d, 0) + n);
    const padded = String(score).padStart(3, '0').split('').map(Number);
    scoreRef.current?.set(padded);
  };

  // Lap counter — increment a single card.
  const lapRef = React.useRef<FlipCardRef>(null);

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 32 }}>
      <h1>react-flip-cards</h1>

      <section style={{ marginBottom: 48 }}>
        <h2>Score counter</h2>
        <FlipCardPanel ref={scoreRef} nrCards={3} blockStyle={{ width: 60, height: 80, fontSize: 48 }} />
        <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
          <button onClick={() => addPoints(1)}>+1</button>
          <button onClick={() => addPoints(3)}>+3</button>
          <button onClick={() => addPoints(7)}>+7</button>
          <button onClick={() => scoreRef.current?.reset()}>Reset</button>
        </div>
      </section>

      <section style={{ marginBottom: 48 }}>
        <h2>Lap counter</h2>
        <FlipCardPanel ref={lapRef} nrCards={1} labels={['Lap']} blockStyle={{ width: 60, height: 80, fontSize: 48 }} />
        <div style={{ marginTop: 24 }}>
          <button onClick={() => lapRef.current?.increment(0)}>Next lap</button>
        </div>
      </section>

      <section>
        <h2>Static scoreboard</h2>
        <FlipCardPanel
          nrCards={5}
          initialValue={[1, 2, 3, 4, 5]}
          showLabels={false}
          showSeparators
          separatorStyle={{ color: '#888' }}
          blockStyle={{ width: 50, height: 70, fontSize: 40 }}
        />
      </section>
    </div>
  );
};

export default App;
