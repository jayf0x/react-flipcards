import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useRef, useState } from 'react';
import FlipCardPanel, { type FlipCardRef } from 'react-flip-cards';
import { Button, Stage, toDigits } from './ui';

const meta: Meta = { title: 'Use cases' };
export default meta;
type Story = StoryObj;

const cell = { width: 56, height: 76, fontSize: 44 } as const;

/* ------------------------------------------------------------------ */
/* Live wall clock — HH:MM:SS, ticks every second.                     */
/* ------------------------------------------------------------------ */
export const LiveClock: Story = {
  render: () => {
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
  }
};

/* ------------------------------------------------------------------ */
/* Ping-pong scoreboard — first to 11, win by 2.                       */
/* ------------------------------------------------------------------ */
const bump = (s: [number, number], i: 0 | 1): [number, number] => {
  const next: [number, number] = [s[0], s[1]];
  next[i] = Math.min(99, next[i] + 1);
  return next;
};
const winner = ([a, b]: [number, number]): 0 | 1 | null => {
  if (a >= 11 && a - b >= 2) return 0;
  if (b >= 11 && b - a >= 2) return 1;
  return null;
};

export const PingPongScoreboard: Story = {
  render: () => {
    const left = useRef<FlipCardRef>(null);
    const right = useRef<FlipCardRef>(null);
    const [score, setScore] = useState<[number, number]>([0, 0]);

    useEffect(() => {
      left.current?.set(toDigits(score[0], 2));
      right.current?.set(toDigits(score[1], 2));
    }, [score]);

    const point = (i: 0 | 1) => setScore((s) => (winner(s) === null ? bump(s, i) : s));
    const win = winner(score);
    const names = ['Cap', 'Cook'] as const;

    return (
      <Stage title='Ping-pong scoreboard' hint='First to 11, win by 2. Click a player to award a point.'>
        <div className='demo-row'>
          <FlipCardPanel ref={left} nrCards={2} labels={[names[0]]} blockStyle={cell} />
          <span className='demo-colon'>:</span>
          <FlipCardPanel ref={right} nrCards={2} labels={[names[1]]} blockStyle={cell} />
        </div>
        <div className='demo-banner'>{win !== null ? `🏆 ${names[win]} wins!` : ''}</div>
        <div className='demo-controls'>
          <Button primary onClick={() => point(0)}>
            + {names[0]}
          </Button>
          <Button primary onClick={() => point(1)}>
            + {names[1]}
          </Button>
          <Button onClick={() => setScore([0, 0])}>Reset</Button>
        </div>
      </Stage>
    );
  }
};

/* ------------------------------------------------------------------ */
/* Countdown — add time, Start/Stop, count down MM:SS to "Liftoff".    */
/* ------------------------------------------------------------------ */
export const Countdown: Story = {
  render: () => {
    const ref = useRef<FlipCardRef>(null);
    const [left, setLeft] = useState(30); // seconds remaining
    const [running, setRunning] = useState(false);

    useEffect(() => {
      ref.current?.set([...toDigits(Math.floor(left / 60), 2), ...toDigits(left % 60, 2)]);
    }, [left]);

    // Tick once a second while running; stop automatically at zero.
    useEffect(() => {
      if (!running) return;
      const id = setInterval(() => {
        setLeft((s) => {
          if (s <= 1) {
            setRunning(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
      return () => clearInterval(id);
    }, [running]);

    const add = (secs: number) => {
      setRunning(false);
      setLeft((s) => Math.min(99 * 60 + 59, s + secs));
    };
    const reset = () => {
      setRunning(false);
      setLeft(0);
    };

    return (
      <Stage title='Countdown timer' hint='Add time, hit Start, and it counts down to liftoff. Stop pauses.'>
        <FlipCardPanel
          ref={ref}
          nrCards={4}
          showSeparators
          separatorStyle={{ color: '#db2777' }}
          blockStyle={{
            ...cell,
            background: 'linear-gradient(160deg,#db2777,#6d28d9)',
            color: '#fff',
            borderRadius: 10
          }}
          dividerStyle={{ color: '#ffffff33' }}
        />
        <div className='demo-banner' style={{ color: '#db2777' }}>
          {!running && left === 0 ? '🚀 Liftoff!' : ''}
        </div>
        <div className='demo-controls'>
          <Button primary onClick={() => setRunning((r) => !r)}>
            {running ? 'Stop' : 'Start'}
          </Button>
          <Button onClick={() => add(10)}>+10s</Button>
          <Button onClick={() => add(60)}>+1m</Button>
          <Button onClick={reset}>Reset</Button>
        </div>
      </Stage>
    );
  }
};

/* ------------------------------------------------------------------ */
/* Live data ticker — a metric that drifts each tick (e.g. a price).   */
/* ------------------------------------------------------------------ */
export const DataTicker: Story = {
  render: () => {
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
      <Stage title='Data ticker' hint='Pipe any live number — a price, a metric, a vote count — straight into set().'>
        <FlipCardPanel
          ref={ref}
          nrCards={4}
          labels={['$', '', '', '']}
          blockStyle={{ ...cell, background: '#0a7d33', color: '#fff', borderRadius: 8 }}
          dividerStyle={{ color: '#ffffff33' }}
        />
      </Stage>
    );
  }
};

/* ------------------------------------------------------------------ */
/* Combination lock — increment each wheel, unlock on the secret code. */
/* ------------------------------------------------------------------ */
const CODE = [4, 2, 0] as const;

export const CombinationLock: Story = {
  render: () => {
    const ref = useRef<FlipCardRef>(null);
    const [vals, setVals] = useState<number[]>([0, 0, 0]);
    const open = CODE.every((d, i) => d === vals[i]);

    const turn = (i: number) => {
      ref.current?.increment(i);
      setVals((v) => v.map((d, j) => (j === i ? (d + 1) % 10 : d)));
    };

    return (
      <Stage title='Combination lock' hint={`Spin each wheel with increment(i). Unlocks on ${CODE.join('-')}.`}>
        <FlipCardPanel
          ref={ref}
          nrCards={3}
          blockStyle={{ ...cell, background: open ? '#0a7d33' : '#0f181a', color: '#fff', borderRadius: 8 }}
          dividerStyle={{ color: '#ffffff33' }}
        />
        <div className='demo-banner'>{open ? '🔓 Unlocked' : '🔒 Locked'}</div>
        <div className='demo-controls'>
          {vals.map((_, i) => (
            <Button key={i} onClick={() => turn(i)}>
              Wheel {i + 1} ▲
            </Button>
          ))}
          <Button
            onClick={() => {
              ref.current?.reset();
              setVals([0, 0, 0]);
            }}
          >
            Reset
          </Button>
        </div>
      </Stage>
    );
  }
};
