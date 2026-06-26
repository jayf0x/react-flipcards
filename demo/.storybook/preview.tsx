import type { Preview } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import './global.css';

// Demo palette pushed onto the .demo-root wrapper via CSS vars so every story
// (and its buttons/labels) is themed. Dark-mode toggle was dropped with the
// storybook-dark-mode addon (incompatible with Storybook 10); light only.
const theme = {
  '--demo-bg': '#ffffff',
  '--demo-fg': '#1a1a1a',
  '--demo-muted': '#555',
  '--demo-accent': '#0f181a',
  '--demo-btn-bg': '#fff',
  '--demo-btn-border': '#d0d0d0',
  '--demo-btn-hover': '#f3f3f3',
  '--demo-code-bg': '#f0f0f0'
} as const;

const preview: Preview = {
  // Generate a Docs page (with a "Show code" source block) for every story.
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i }
    },
    a11y: { test: 'todo' }
  },
  decorators: [
    (Story) => (
      <div className='demo-root' style={theme as CSSProperties}>
        <Story />
      </div>
    )
  ]
};

export default preview;
