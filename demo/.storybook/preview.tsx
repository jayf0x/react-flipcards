import type { Preview } from '@storybook/react';
import { useEffect } from 'react';
import { useDarkMode } from 'storybook-dark-mode';
import './global.css';

// Light/dark palettes pushed onto the .demo-root wrapper via CSS vars so every
// story (and its buttons/labels) follows the dark-mode toggle in the toolbar.
const themes = {
  light: {
    '--demo-bg': '#ffffff',
    '--demo-fg': '#1a1a1a',
    '--demo-muted': '#555',
    '--demo-accent': '#0f181a',
    '--demo-btn-bg': '#fff',
    '--demo-btn-border': '#d0d0d0',
    '--demo-btn-hover': '#f3f3f3',
    '--demo-code-bg': '#f0f0f0'
  },
  dark: {
    '--demo-bg': '#0f181a',
    '--demo-fg': '#f1f1f1',
    '--demo-muted': '#9aa4a7',
    '--demo-accent': '#38bdf8',
    '--demo-btn-bg': '#1d2c30',
    '--demo-btn-border': '#33474d',
    '--demo-btn-hover': '#26393f',
    '--demo-code-bg': '#1d2c30'
  }
} as const;

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i }
    },
    a11y: { test: 'todo' },
    // Match Storybook's own canvas background to the active theme.
    darkMode: {
      dark: { appBg: '#0f181a', appContentBg: '#0f181a' },
      light: { appBg: '#ffffff', appContentBg: '#ffffff' }
    }
  },
  decorators: [
    (Story) => {
      const isDark = useDarkMode();
      useEffect(() => {
        const vars = isDark ? themes.dark : themes.light;
        const root = document.querySelector<HTMLElement>('.demo-root');
        if (root) Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
      }, [isDark]);
      return (
        <div className='demo-root'>
          <Story />
        </div>
      );
    }
  ]
};

export default preview;
