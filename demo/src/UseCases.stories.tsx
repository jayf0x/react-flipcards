import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useRef, useState } from 'react';
import FlipCardPanel, { type FlipCardRef } from 'react-flip-cards';
import { Button, Stage, toDigits } from './ui';

const meta: Meta = { title: 'Use cases' };
export default meta;
type Story = StoryObj;

const cell = { width: 56, height: 76, fontSize: 44 } as const;

/* ------------------------------------------------------------------ */
/* Live wall clock — one 6-card panel, colons after positions 1 and 3. */
/* ------------------------------------------------------------------ */
export const LiveClock: Story = {
  render: () => {
    const ref = useRef<FlipCardRef>(null);

    useEffect(() => {
      const tick = () => {
        const d = new Date();
        ref.current?.set([
          ...toDigits(d.getHours(), 2),
          ...toDigits(d.getMinutes(), 2),
          ...toDigits(d.getSeconds(), 2)
        ]);
      };
      tick();
      const id = setInterval(tick, 1000);
      return () => clearInterval(id);
    }, []);

    return (
      <Stage title='Live clock' hint='One panel, HH:MM:SS via separators={[1, 3]}. Full source below ↓'>
        <FlipCardPanel
          ref={ref}
          nrCards={6}
          separators={[1, 3]}
          separatorStyle={{ color: '#0f181a' }}
          blockStyle={cell}
        />
      </Stage>
    );
  },
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        // Self-contained, copy-paste-ready version of this story.
        code: `import { useEffect, useRef } from 'react';
import FlipCardPanel, { type FlipCardRef } from 'react-flip-cards';

const pad = (n: number) => String(n).padStart(2, '0').split('').map(Number);

export function Clock() {
  const ref = useRef<FlipCardRef>(null);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      ref.current?.set([...pad(d.getHours()), ...pad(d.getMinutes()), ...pad(d.getSeconds())]);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // separators={[1, 3]} draws colons after the 2nd and 4th cards → HH:MM:SS.
  return <FlipCardPanel ref={ref} nrCards={6} separators={[1, 3]} blockStyle={{ width: 56, height: 76, fontSize: 44 }} />;
}`
      }
    }
  }
};

/* ------------------------------------------------------------------ */
/* Ping-pong scoreboard — first to 11, win by 2.                       */
/* The panels own the score: onChange reports it back, set(i, value)   */
/* bumps the two digits of whichever player scored.                    */
/* ------------------------------------------------------------------ */
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
    const win = winner(score);
    const names = ['Cap', 'Cook'] as const;

    const point = (i: 0 | 1) => {
      if (win !== null) return;
      const [tens, ones] = toDigits(Math.min(99, score[i] + 1), 2);
      const ref = i === 0 ? left : right;
      ref.current?.set(0, tens);
      ref.current?.set(1, ones);
    };
    const reset = () => {
      left.current?.reset();
      right.current?.reset();
    };

    return (
      <Stage title='Ping-pong scoreboard' hint='First to 11, win by 2. Click a player to award a point.'>
        <div className='demo-row'>
          <FlipCardPanel
            ref={left}
            nrCards={2}
            labels={[names[0]]}
            blockStyle={cell}
            onChange={(v) => setScore((s) => [v[0] * 10 + v[1], s[1]])}
          />
          {/* Anchor the colon to the digit block; the labels add height below it. */}
          <span className='demo-colon' style={{ alignSelf: 'flex-start', lineHeight: `${cell.height}px` }}>
            :
          </span>
          <FlipCardPanel
            ref={right}
            nrCards={2}
            labels={[names[1]]}
            blockStyle={cell}
            onChange={(v) => setScore((s) => [s[0], v[0] * 10 + v[1]])}
          />
        </div>
        <div className='demo-banner'>{win !== null ? `🏆 ${names[win]} wins!` : ''}</div>
        <div className='demo-controls'>
          <Button primary onClick={() => point(0)}>
            + {names[0]}
          </Button>
          <Button primary onClick={() => point(1)}>
            + {names[1]}
          </Button>
          <Button onClick={reset}>Reset</Button>
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
      <Stage title='Countdown timer' hint='Add time, hit Start, and it counts down MM:SS to liftoff. Stop pauses.'>
        <FlipCardPanel
          ref={ref}
          nrCards={4}
          separators={[1]}
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
/* Combination lock — spin wheels up/down, unlock on the secret code.  */
/* onChange keeps `vals` in sync; ▼ uses set(i, value) to spin down.   */
/* ------------------------------------------------------------------ */
const CODE = [0, 4, 2] as const;

export const CombinationLock: Story = {
  render: () => {
    const ref = useRef<FlipCardRef>(null);
    const [vals, setVals] = useState<number[]>([0, 0, 0]);
    const open = CODE.every((d, i) => d === vals[i]);

    return (
      <Stage title='Combination lock' hint={`Spin the wheels up or down. Unlocks on ${CODE.join('-')}.`}>
        <FlipCardPanel
          ref={ref}
          nrCards={3}
          spacing={20}
          onChange={setVals}
          blockStyle={{ ...cell, background: open ? '#0a7d33' : '#0f181a', color: '#fff', borderRadius: 8 }}
          dividerStyle={{ color: '#ffffff33' }}
        />
        <div className='demo-banner'>{open ? '🔓 Unlocked' : '🔒 Locked'}</div>
        <div className='demo-controls'>
          {vals.map((_, i) => (
            <span key={i} style={{ display: 'inline-flex', gap: 4 }}>
              <Button onClick={() => ref.current?.increment(i)}>▲ {i + 1}</Button>
              <Button onClick={() => ref.current?.set(i, (vals[i] + 9) % 10)}>▼ {i + 1}</Button>
            </span>
          ))}
          <Button onClick={() => ref.current?.reset()}>Reset</Button>
        </div>
      </Stage>
    );
  }
};
