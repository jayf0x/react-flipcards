# react-flip-cards

> Flip cards for React — a little toy for when you need digits that flip, roll, or spin.

[![npm version](https://img.shields.io/npm/v/react-flip-cards.svg?color=0a7d33)](https://www.npmjs.com/package/react-flip-cards)
[![npm downloads](https://img.shields.io/npm/dm/react-flip-cards.svg)](https://www.npmjs.com/package/react-flip-cards)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/react-flip-cards.svg)](https://bundlephobia.com/package/react-flip-cards)
[![types included](https://img.shields.io/npm/types/react-flip-cards.svg)](https://www.npmjs.com/package/react-flip-cards)
[![license](https://img.shields.io/npm/l/react-flip-cards.svg?color=blue)](./LICENSE)

![Preview](./assets/preview.gif)

> ⭐ **Star [this repository](https://github.com/jayf0x/react-flipcards) if you’d like to support its growth**

### **[▶ Live demo & copy-paste examples →](https://jayf0x.github.io/react-flipcards/)**

## The story

I wanted flip cards and found [`@leenguyen/react-flip-clock-countdown`](https://github.com/sLeeNguyen/react-flip-clock-countdown) — a great component, but I needed something more flexible.

This is the light unopinionated version, perfect for any type of digit animation.

## Install

```bash
npm install react-flip-cards
# or: bun add / pnpm add / yarn add react-flip-cards
```

## Usage

You own the values. Render a panel and push numbers into it — declaratively via props, or imperatively through a `ref`:

```tsx
import { useEffect, useRef } from 'react';
import FlipCardPanel, { FlipCardRef } from 'react-flip-cards';
import 'react-flip-cards/styles.css';

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

  // separators={[1, 3]} → colons after the 2nd and 4th card → HH:MM:SS
  return <FlipCardPanel ref={ref} nrCards={6} separators={[1, 3]} />;
}
```

Scoreboards, countdowns, odometers, combination locks — they're all the same component with different values. See the **[live demo](https://jayf0x.github.io/react-flipcards/)** for those, each with copyable source.

## Ref API

`FlipCardPanel` forwards a `ref` exposing:

| Method                     | Description                                 |
| -------------------------- | ------------------------------------------- |
| `set(values: number[])`    | Set every card at once; changed cards flip. |
| `set(index, value)`        | Set a single card, e.g. `set(1, 7)`.        |
| `increment(index: number)` | Increment one card (wraps `9 → 0`).         |
| `reset()`                  | Reset all cards to `0`.                     |
| `getValue(): number[]`     | Read the currently displayed values.        |

## Props

`FlipCardPanel` accepts all `div` props plus:

| Name             | Type                          | Default | Description                                                                                                                                                                                                                                                                                                  |
| ---------------- | ----------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **nrCards**      | `number`                      | —       | **Required.** Number of flip cards to render.                                                                                                                                                                                                                                                                |
| `initialValue`   | `number[]`                    | all `0` | Initial value (0–9) per card; read once at mount.                                                                                                                                                                                                                                                            |
| `onChange`       | `(values: number[]) => void`  | —       | Fires whenever displayed values change — track state without mirroring it.                                                                                                                                                                                                                                   |
| `labels`         | `(string \| ReactElement)[]`  | —       | Label under each card.                                                                                                                                                                                                                                                                                       |
| `showLabels`     | `boolean`                     | `true`  | Toggle label visibility.                                                                                                                                                                                                                                                                                     |
| `separators`     | `number[]`                    | —       | Show colons after these card indices, e.g. `[1, 3]` → `HH:MM:SS`.                                                                                                                                                                                                                                            |
| `showSeparators` | `boolean`                     | `false` | Show a colon between **every** card.                                                                                                                                                                                                                                                                         |
| `separatorStyle` | `{ color?, size? }`           | —       | Separator styling.                                                                                                                                                                                                                                                                                           |
| `blockStyle`     | `CSSProperties`               | —       | Card styles: `width`, `height`, `fontSize`, `color`, `background`, `borderRadius`, `boxShadow`.                                                                                                                                                                                                              |
| `labelStyle`     | `CSSProperties`               | —       | Label styles (`fontSize`, `color`, …).                                                                                                                                                                                                                                                                       |
| `showDivider`    | `boolean`                     | `true`  | Show the horizontal divider across each card.                                                                                                                                                                                                                                                                |
| `dividerStyle`   | `{ color?, height? }`         | —       | Divider styling.                                                                                                                                                                                                                                                                                             |
| `duration`       | `number`                      | `0.7`   | Flip animation duration (seconds).                                                                                                                                                                                                                                                                           |
| `mode`           | `'sync' \| 'queue' \| 'spin'` | `sync`  | How cards animate to new values. `sync` flips straight to the latest (never drops an update); `queue` rolls through every intermediate digit at flip speed (can lag a far target); `spin` scrolls an odometer to the latest value in one `duration` (always lands on time). `queue`/`spin` are numeric-only. |
| `spacing`        | `number \| string`            | —       | Gap between cards / separators.                                                                                                                                                                                                                                                                              |

## Theming

Everything is a CSS custom property (prefixed `--fcp-`). Override globally in your CSS, or per-instance via `blockStyle` / `labelStyle` / `separatorStyle` / `dividerStyle`.

```css
.fcp__container {
  --fcp-background: #0f181a;
  --fcp-digit-color: #fff;
  --fcp-digit-block-radius: 4px;
  --fcp-flip-duration: 0.7s;
}
```

## Extending

It's a small, value-driven primitive, so most "features" are just how you drive it:

- **Animation feel** — pick a `mode` (`sync` / `queue` / `spin`) and `duration`. `FlipCard` (3D flip) and `OdometerCard` (vertical scroll) are both exported if you want to use a single card directly.
- **Looks** — it's all `--fcp-*` CSS variables; restyle without touching the component.
- **Behaviour** — there are no internal timers or data fetching by design. You hold the values and `set()` them, so a clock, a counter, or a live feed are all the same three lines.

## License

[MIT](./LICENSE) © [jayf0x](https://github.com/jayf0x)
