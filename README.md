# react-flip-cards

> **The flip-clock primitive for React.** One tiny, ref-driven component — build clocks, countdowns, counters, tickers and scoreboards from the exact same building block.

[![npm version](https://img.shields.io/npm/v/react-flip-cards.svg?color=0a7d33)](https://www.npmjs.com/package/react-flip-cards)
[![npm downloads](https://img.shields.io/npm/dm/react-flip-cards.svg)](https://www.npmjs.com/package/react-flip-cards)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/react-flip-cards.svg)](https://bundlephobia.com/package/react-flip-cards)
[![types included](https://img.shields.io/npm/types/react-flip-cards.svg)](https://www.npmjs.com/package/react-flip-cards)
[![license](https://img.shields.io/npm/l/react-flip-cards.svg?color=blue)](./LICENSE)

![Preview](./assets/preview.gif)

**Ultra-lightweight (~2&nbsp;kB gzipped). Hyper-flexible. Zero config. It just works.**

react-flip-cards renders a row of buttery-smooth 3D flip cards and gets out of your way. It doesn't decide _what_ the numbers mean — **you** own the values and push them from a clock, a timer, a score, a websocket, anything. Drive them declaratively with props or imperatively through a `ref`.

### **[▶ Live demo & copy-paste examples →](https://jayf0x.github.io/react-flipcards/)**

---

## Why react-flip-cards?

- ⚡ **Tiny** — ~2&nbsp;kB gzipped, one small dependency. No moment.js, no bloat.
- 🧩 **One primitive, infinite use cases** — clock, countdown, scoreboard, odometer, split-flap board… all the same component.
- 🎛️ **You own the data** — no opinionated "countdown" lock-in. Push any numbers, any time.
- 🪄 **Imperative `ref` API** — update cards without re-rendering the parent.
- 🎨 **Themeable to the pixel** — every token is a CSS variable; style per-instance or globally.
- 🟦 **TypeScript-first** — full types shipped, no `@types` package needed.
- ⚛️ **React 16.13 → 19** — works everywhere, SSR-friendly.

## Install

```bash
npm install react-flip-cards
# or: bun add react-flip-cards / pnpm add react-flip-cards / yarn add react-flip-cards
```

```tsx
import FlipCardPanel, { FlipCardRef } from 'react-flip-cards';
import 'react-flip-cards/styles.css';
```

## Quick start — a live clock in 12 lines

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

## Recipes

<details open>
<summary><b>Scoreboard</b> — multi-digit score, set a single card with <code>set(index, value)</code></summary>

```tsx
const ref = useRef<FlipCardRef>(null);
<FlipCardPanel ref={ref} nrCards={2} labels={['Cap']} />;
ref.current?.set(0, 1); // tens place
ref.current?.set(1, 7); // ones place  → "17"
```

</details>

<details>
<summary><b>Countdown</b> — drive an <code>MM:SS</code> display yourself</summary>

```tsx
const ref = useRef<FlipCardRef>(null);
<FlipCardPanel ref={ref} nrCards={4} separators={[1]} />;
ref.current?.set([0, 5, 0, 0]); // 05:00
```

</details>

<details>
<summary><b>Static display</b> — set it and forget it</summary>

```tsx
<FlipCardPanel nrCards={5} initialValue={[1, 2, 3, 4, 5]} />
```

</details>

> 💡 Every recipe — ping-pong scoreboard, wall clock, countdown, combination lock — is live with copyable source in the **[interactive demo](https://jayf0x.github.io/react-flipcards/)**.

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

## Origin story

I was looking for flip cards and found [`@leenguyen/react-flip-clock-countdown`](https://github.com/sLeeNguyen/react-flip-clock-countdown) — great component, but I needed something more customizable that I could drive with arbitrary values. A couple of prompts later, this is the result, and I figured I'd share it.

## License

[MIT](./LICENSE) © [jayf0x](https://github.com/jayf0x)
