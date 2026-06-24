import { useEffect, useRef, useState } from 'react';
import FlipCardPanel, { type FlipCardRef } from 'react-flip-cards';
import { Button, Stage, toDigits } from './ui';

export default { title: 'Use cases' };

/* ------------------------------------------------------------------ */
/* Ping-pong scoreboard — first to 11, win by 2.                       */
/* ------------------------------------------------------------------ */
export const PingPongScoreboard = () => {
  const left = useRef<FlipCardRef>(null);
  const right = useRef<FlipCardRef>(null);
  const [score, setScore] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    left.current?.set(toDigits(score[0], 2));
    right.current?.set(toDigits(score[1], 2));
  }, [score]);

  const point = (i: 0 | 1) => setScore((s) => (winner(s) === null ? bump(s, i) : s));
  const reset = () => setScore([0, 0]);
  const win = winner(score);

  return (
    <Stage title='Ping-pong scoreboard' hint='Two players, first to 11, win by 2. Click a side to award a point.'>
      <div className='demo-row'>
        <FlipCardPanel ref={left} nrCards={2} labels={['You']} blockStyle={cell} />
        <span className='demo-colon'>:</span>
        <FlipCardPanel ref={right} nrCards={2} labels={['Rival']} blockStyle={cell} />
      </div>
      <div className='demo-banner'>{win !== null ? `🏆 ${win === 0 ? 'You' : 'Rival'} win!` : ''}</div>
      <div className='demo-controls'>
        <Button primary onClick={() => point(0)}>
          + You
        </Button>
        <Button primary onClick={() => point(1)}>
          + Rival
        </Button>
        <Button onClick={reset}>Reset</Button>
      </div>
    </Stage>
  );
};

const bump = (s: [number, number], i: 0 | 1): [number, number] => {
  const next: [number, number] = [s[0], s[1]];
  next[i] = Math.min(99, next[i] + 1);
  return next;
};
const winner = (s: [number, number]): 0 | 1 | null => {
  const [a, b] = s;
  if (a >= 11 && a - b >= 2) return 0;
  if (b >= 11 && b - a >= 2) return 1;
  return null;
};

/* ------------------------------------------------------------------ */
/* Live clock — HH:MM:SS, three groups with real colons.              */
/* ------------------------------------------------------------------ */
export const LiveClock = () => {
  const h = useRef<FlipCardRef>(null);
  const m = useRef<FlipCardRef>(null);
  const s = useRef<FlipCardRef>(null);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      h.current?.set(toDigits(d.getHours(), 2));
      m.current?.set(toDigits(d.getMinutes(), 2));
      s.current?.set(toDigits(d.getSeconds(), 2));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <Stage title='Live clock' hint='A wall clock — push the current time every second via set().'>
      <div className='demo-row'>
        <FlipCardPanel ref={h} nrCards={2} blockStyle={cell} />
        <span className='demo-colon'>:</span>
        <FlipCardPanel ref={m} nrCards={2} blockStyle={cell} />
        <span className='demo-colon'>:</span>
        <FlipCardPanel ref={s} nrCards={2} blockStyle={cell} />
      </div>
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* Stopwatch — MM:SS, you drive it. Start / stop / reset.             */
/* ------------------------------------------------------------------ */
export const Stopwatch = () => {
  const ref = useRef<FlipCardRef>(null);
  const [running, setRunning] = useState(false);
  const elapsed = useRef(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      elapsed.current += 1;
      const mm = Math.floor(elapsed.current / 60) % 100;
      const ss = elapsed.current % 60;
      ref.current?.set([...toDigits(mm, 2), ...toDigits(ss, 2)]);
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const reset = () => {
    elapsed.current = 0;
    setRunning(false);
    ref.current?.reset();
  };

  return (
    <Stage title='Stopwatch' hint='A manual MM:SS timer. The component just renders — your code owns the ticking.'>
      <FlipCardPanel ref={ref} nrCards={4} showSeparators separatorStyle={{ color: '#0f181a' }} blockStyle={cell} />
      <div className='demo-controls'>
        <Button primary onClick={() => setRunning((r) => !r)}>
          {running ? 'Stop' : 'Start'}
        </Button>
        <Button onClick={reset}>Reset</Button>
      </div>
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* Lap counter — single card, increment only.                         */
/* ------------------------------------------------------------------ */
export const LapCounter = () => {
  const ref = useRef<FlipCardRef>(null);
  return (
    <Stage title='Lap counter' hint='One card, increment(0) on each lap. Wraps 9 → 0.'>
      <FlipCardPanel ref={ref} nrCards={1} labels={['Lap']} blockStyle={{ width: 72, height: 96, fontSize: 60 }} />
      <div className='demo-controls'>
        <Button primary onClick={() => ref.current?.increment(0)}>
          Next lap
        </Button>
        <Button onClick={() => ref.current?.reset()}>Reset</Button>
      </div>
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* Data ticker — a live metric (e.g. a stock price) that drifts.      */
/* ------------------------------------------------------------------ */
export const DataTicker = () => {
  const ref = useRef<FlipCardRef>(null);
  const price = useRef(1280);

  useEffect(() => {
    const update = () => {
      price.current = Math.min(9999, Math.max(0, price.current + Math.round((Math.random() - 0.5) * 60)));
      ref.current?.set(toDigits(price.current, 4));
    };
    update();
    const id = setInterval(update, 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <Stage
      title='Data ticker'
      hint='Pipe any live number — a stock price, a metric, a vote count — straight into set().'
    >
      <FlipCardPanel
        ref={ref}
        nrCards={4}
        blockStyle={{ width: 56, height: 76, fontSize: 44, background: '#0a7d33', borderRadius: 8 }}
        dividerStyle={{ color: '#ffffff33' }}
      />
    </Stage>
  );
};

const cell = { width: 56, height: 76, fontSize: 44 } as const;
