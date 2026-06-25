# react-flip-cards

> A generic, ref-driven 3D animated flip-card panel for React.

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

<!--
<div align="center">
  <img src="./assets/preview.gif" alt="react flip cards demo" width="500" />
</div> -->

This is **not** a countdown component. It renders a row of flip cards and lets
**you** own the values — drive them from a score, a timer, a data feed, anything.
Update them statically (props) or imperatively through a `ref`.

**[▶ Live demo & interactive examples](https://jayf0x.github.io/react-flipcards/)**

## Install

```bash
bun add react-flip-cards
# or
npm install react-flip-cards
```

Import the component and its stylesheet:

```tsx
import FlipCardPanel, { FlipCardRef } from 'react-flip-cards';
import 'react-flip-cards/dist/index.css';
```

## Usage

### 1. Static / controlled

Pass `initialValue` and leave it alone — a fixed scoreboard.

```tsx
<FlipCardPanel nrCards={5} blockStyle={{ width: 60, height: 80, fontSize: 48 }} initialValue={[0, 0, 0, 0, 0]} />
```

### 2. Ref-driven / imperative

Attach a `ref` and drive the cards without re-rendering the parent.

```tsx
function ScoreBoard() {
  const cardRef = useRef<FlipCardRef>(null);

  return (
    <>
      <FlipCardPanel ref={cardRef} nrCards={3} blockStyle={{ width: 60, height: 80, fontSize: 48 }} />
      <button onClick={() => cardRef.current?.set([1, 2, 3])}>Set 123</button>
      <button onClick={() => cardRef.current?.increment(2)}>+1 last digit</button>
      <button onClick={() => cardRef.current?.reset()}>Reset</button>
    </>
  );
}
```

### 3. With labels and separators

```tsx
<FlipCardPanel
  nrCards={3}
  labels={['Hours', 'Minutes', 'Seconds']}
  showLabels
  showSeparators
  blockStyle={{ width: 50, height: 70, fontSize: 40 }}
/>
```

## Ref API

`FlipCardPanel` forwards a `ref` exposing:

| Method                     | Description                                 |
| -------------------------- | ------------------------------------------- |
| `set(values: number[])`    | Set every card at once; changed cards flip. |
| `increment(index: number)` | Increment one card (wraps `9 → 0`).         |
| `reset()`                  | Reset all cards to `0`.                     |
| `getValue(): number[]`     | Read the currently displayed values.        |

## Props

`FlipCardPanel` accepts all `div` props plus:

| Name             | Type                         | Default | Description                                                                                     |
| ---------------- | ---------------------------- | ------- | ----------------------------------------------------------------------------------------------- |
| **nrCards**      | `number`                     | —       | **Required.** Number of flip cards to render.                                                   |
| `initialValue`   | `number[]`                   | all `0` | Initial value (0–9) per card; read once at mount.                                               |
| `labels`         | `(string \| ReactElement)[]` | —       | Label under each card.                                                                          |
| `showLabels`     | `boolean`                    | `true`  | Toggle label visibility.                                                                        |
| `blockStyle`     | `CSSProperties`              | —       | Card styles: `width`, `height`, `fontSize`, `color`, `background`, `borderRadius`, `boxShadow`. |
| `labelStyle`     | `CSSProperties`              | —       | Label styles (`fontSize`, `color`, …).                                                          |
| `showSeparators` | `boolean`                    | `false` | Show colon separators between cards.                                                            |
| `separatorStyle` | `{ color?, size? }`          | —       | Separator styling.                                                                              |
| `showDivider`    | `boolean`                    | `true`  | Show the horizontal divider across each card.                                                   |
| `dividerStyle`   | `{ color?, height? }`        | —       | Divider styling.                                                                                |
| `duration`       | `number`                     | `0.7`   | Flip animation duration (seconds).                                                              |
| `spacing`        | `number \| string`           | —       | Gap between cards / separators.                                                                 |
| `className`      | `string`                     | —       | Extra class on the container.                                                                   |

## Styling

All visual tokens are CSS custom properties (prefixed `--fcp-`) you can override
in your own CSS — or set per-instance via `blockStyle` / `labelStyle` etc.:

```css
.fcp__container {
  --fcp-background: #0f181a;
  --fcp-digit-color: #fff;
  --fcp-digit-block-radius: 4px;
  --fcp-flip-duration: 0.7s;
}
```

## Use cases

- **Score counter** — increment cards on button clicks.
- **Game timer** — tick an `MM:SS` display yourself via `set()`.
- **Data ticker** — push live numbers (stocks, metrics) from a data source.
- **Lap counter** — `increment(0)` a single card.
- **Scoreboard** — multi-digit score, e.g. `[1, 2, 3]` = "123".

All of these are live (with copyable source) in the [demo](https://jayf0x.github.io/react-flipcards/):
ping-pong scoreboard, wall clock, stopwatch, lap counter and a data ticker.

## Development

This repo uses [Bun](https://bun.sh) and [Vite](https://vite.dev). The demo is a
[Ladle](https://ladle.dev) story book under [`demo/`](./demo).

```bash
bun install        # library deps
bun run build      # build dist/ (ESM + CJS + types + css)
bun run test       # vitest
bun run lint       # eslint
bun run typecheck  # tsc

cd demo
bun install
bun run dev        # Ladle dev server with all stories
bun run build:gh   # static site for GitHub Pages
bun run test       # smoke-renders every story
```

The demo deploys to GitHub Pages automatically on every `v*` tag, or manually via
`./scripts/release-demo.sh`. Enable it once under **Settings → Pages → Source: GitHub Actions**.

## License

MIT
