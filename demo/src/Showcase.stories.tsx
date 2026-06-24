import { useEffect, useRef } from 'react';
import FlipCardPanel, { type FlipCardRef } from 'react-flip-cards';
import { Stage, toDigits } from './ui';

export default { title: 'Showcase' };

export const StaticValues = () => (
  <Stage title='Static / controlled' hint='Pass initialValue and leave it — a fixed display. Defaults to all zeros.'>
    <FlipCardPanel nrCards={5} initialValue={[1, 2, 3, 4, 5]} blockStyle={{ width: 60, height: 80, fontSize: 48 }} />
  </Stage>
);

export const WithLabels = () => (
  <Stage title='Labels' hint='Give each card a label. Strings or any React node work.'>
    <FlipCardPanel
      nrCards={3}
      initialValue={[1, 3, 0]}
      labels={['Hours', 'Minutes', 'Seconds']}
      blockStyle={{ width: 56, height: 76, fontSize: 44 }}
    />
  </Stage>
);

export const WithSeparators = () => (
  <Stage title='Separators' hint='Colon separators between cards. Style them with separatorStyle.'>
    <FlipCardPanel
      nrCards={4}
      initialValue={[1, 2, 3, 4]}
      showSeparators
      separatorStyle={{ color: '#0f181a', size: 6 }}
      blockStyle={{ width: 56, height: 76, fontSize: 44 }}
    />
  </Stage>
);

export const NoDivider = () => (
  <Stage title='No divider' hint='Hide the horizontal split line across each card with showDivider={false}.'>
    <FlipCardPanel
      nrCards={3}
      initialValue={[7, 8, 9]}
      showDivider={false}
      blockStyle={{ width: 60, height: 80, fontSize: 48 }}
    />
  </Stage>
);

export const CustomTheme = () => (
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
);

export const SlowFlip = () => {
  const ref = useRef<FlipCardRef>(null);
  useEffect(() => {
    let n = 0;
    const id = setInterval(() => ref.current?.set(toDigits((n += 7) % 100, 2)), 1600);
    return () => clearInterval(id);
  }, []);
  return (
    <Stage title='Flip duration' hint='Control animation speed with duration (seconds). This one is a leisurely 1.4s.'>
      <FlipCardPanel ref={ref} nrCards={2} duration={1.4} blockStyle={{ width: 60, height: 80, fontSize: 48 }} />
    </Stage>
  );
};
