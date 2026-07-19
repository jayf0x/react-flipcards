import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef } from 'react';
import { FlipCardPanel, type FlipCardRef } from 'react-flip-cards';
import { Button, Stage } from './ui';

/**
 * The everything-knob story. Tweak every prop live from the Controls panel —
 * card count, sizes, colors, animation speed, separators, labels — and watch
 * the panel react. Hit "Roll" to push random values through and see the flip.
 */
type Args = {
  nrCards: number;
  duration: number;
  spacing: number;
  showDivider: boolean;
  showSeparators: boolean;
  showLabels: boolean;
  autoplay: boolean;
  width: number;
  height: number;
  fontSize: number;
  digitColor: string;
  background: string;
  separatorColor: string;
  borderRadius: number;
};

const meta: Meta<Args> = {
  title: 'Playground',
  argTypes: {
    nrCards: { control: { type: 'range', min: 1, max: 8, step: 1 }, description: 'Number of cards' },
    duration: { control: { type: 'range', min: 0.1, max: 2, step: 0.1 }, description: 'Flip duration (s)' },
    spacing: { control: { type: 'range', min: 0, max: 40, step: 1 }, description: 'Gap between cards (px)' },
    showDivider: { control: 'boolean' },
    showSeparators: { control: 'boolean' },
    showLabels: { control: 'boolean' },
    autoplay: { control: 'boolean', description: 'Tick random values every second' },
    width: { control: { type: 'range', min: 30, max: 120, step: 2 } },
    height: { control: { type: 'range', min: 40, max: 160, step: 2 } },
    fontSize: { control: { type: 'range', min: 20, max: 100, step: 2 } },
    digitColor: { control: 'color' },
    background: { control: 'color' },
    separatorColor: { control: 'color', description: 'Colon color (when separators shown)' },
    borderRadius: { control: { type: 'range', min: 0, max: 40, step: 1 } }
  },
  args: {
    nrCards: 4,
    duration: 0.7,
    spacing: 8,
    showDivider: true,
    showSeparators: false,
    showLabels: true,
    autoplay: false,
    width: 64,
    height: 88,
    fontSize: 52,
    digitColor: '#ffffff',
    background: '#0f181a',
    separatorColor: '#0f181a',
    borderRadius: 10
  }
};
export default meta;

type Story = StoryObj<Args>;

export const Configurable: Story = {
  // The Playground always uses the default `sync` mode; queue/spin have their
  // own dedicated Use-case stories. Not exposed as a control on purpose.
  render: (args) => {
    const ref = useRef<FlipCardRef>(null);
    const roll = () => ref.current?.set(Array.from({ length: args.nrCards }, () => Math.floor(Math.random() * 10)));

    useEffect(() => {
      if (!args.autoplay) return;
      // Never roll again until the current flip has finished, otherwise a card
      // gets a new value mid-animation. Leave a small gap after the flip.
      const period = args.duration * 1000 + 300;
      const id = setInterval(roll, period);
      return () => clearInterval(id);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [args.autoplay, args.nrCards, args.duration]);

    return (
      <Stage title='Live playground' hint='Edit any prop in the Controls panel. Roll to see the cards flip.'>
        <FlipCardPanel
          // Remount when structural props change so initialValue/labels re-seed cleanly.
          key={`${args.nrCards}-${args.showLabels}`}
          ref={ref}
          nrCards={args.nrCards}
          duration={args.duration}
          spacing={args.spacing}
          showDivider={args.showDivider}
          showSeparators={args.showSeparators}
          showLabels={args.showLabels}
          separatorStyle={{ color: args.separatorColor }}
          labels={args.showLabels ? Array.from({ length: args.nrCards }, (_, i) => `#${i + 1}`) : undefined}
          blockStyle={{
            width: args.width,
            height: args.height,
            fontSize: args.fontSize,
            color: args.digitColor,
            background: args.background,
            borderRadius: args.borderRadius
          }}
          dividerStyle={{ color: '#ffffff33' }}
        />
        <div className='demo-controls'>
          <Button primary onClick={roll}>
            Roll
          </Button>
          <Button onClick={() => ref.current?.reset()}>Reset</Button>
        </div>
      </Stage>
    );
  }
};
