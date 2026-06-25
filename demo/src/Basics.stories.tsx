import type { Meta, StoryObj } from '@storybook/react';
import FlipCardPanel from 'react-flip-cards';
import { Stage } from './ui';

const meta: Meta = { title: 'Basics' };
export default meta;
type Story = StoryObj;

export const StaticValues: Story = {
  render: () => (
    <Stage title='Static / controlled' hint='Pass initialValue and leave it — a fixed display. Defaults to zeros.'>
      <FlipCardPanel nrCards={5} initialValue={[1, 2, 3, 4, 5]} blockStyle={{ width: 60, height: 80, fontSize: 48 }} />
    </Stage>
  )
};

export const WithLabels: Story = {
  render: () => (
    <Stage title='Labels' hint='Give each card a label. Strings or any React node work.'>
      <FlipCardPanel
        nrCards={3}
        initialValue={[4, 1, 2]}
        labels={['Wins', 'Draws', 'Losses']}
        blockStyle={{ width: 56, height: 76, fontSize: 44 }}
      />
    </Stage>
  )
};

export const WithSeparators: Story = {
  render: () => (
    <Stage title='Separators' hint='Colon separators between cards. Style them with separatorStyle.'>
      <FlipCardPanel
        nrCards={4}
        initialValue={[1, 2, 3, 4]}
        showSeparators
        separatorStyle={{ color: '#0f181a', size: 6 }}
        blockStyle={{ width: 56, height: 76, fontSize: 44 }}
      />
    </Stage>
  )
};

export const NoDivider: Story = {
  render: () => (
    <Stage title='No divider' hint='Hide the horizontal split line with showDivider={false}.'>
      <FlipCardPanel
        nrCards={3}
        initialValue={[7, 8, 9]}
        showDivider={false}
        blockStyle={{ width: 60, height: 80, fontSize: 48 }}
      />
    </Stage>
  )
};

export const CustomTheme: Story = {
  render: () => (
    <Stage title='Custom theme' hint='Everything is themeable through blockStyle (background, color, radius, shadow).'>
      <FlipCardPanel
        nrCards={4}
        initialValue={[2, 0, 2, 6]}
        blockStyle={{
          width: 64,
          height: 88,
          fontSize: 52,
          background: 'linear-gradient(160deg, #6d28d9, #db2777)',
          color: '#fff',
          borderRadius: 12,
          boxShadow: '0 8px 20px rgba(109, 40, 217, 0.35)'
        }}
        dividerStyle={{ color: '#ffffff44' }}
      />
    </Stage>
  )
};
