import type { Preview } from '@storybook/react';
import { create } from '@storybook/theming/create';
import { useEffect } from 'react';
import { useDarkMode } from 'storybook-dark-mode';
import './global.css';

// Branding shared by both manager themes (shown in the sidebar header).
const brand = {
  brandTitle: 'react-flip-cards',
  brandUrl: 'https://github.com/jayf0x/react-flipcards',
  brandTarget: '_blank'
};

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
    // Kept distinct from the cards' default #0f181a so they don't blend in.
    '--demo-bg': '#243240',
    '--demo-fg': '#f1f1f1',
    '--demo-muted': '#a7b2bd',
    '--demo-accent': '#38bdf8',
    '--demo-btn-bg': '#33424f',
    '--demo-btn-border': '#46596a',
    '--demo-btn-hover': '#3e4f5e',
    '--demo-code-bg': '#1b2733'
  }
} as const;

const preview: Preview = {
  // Generate a Docs page (with a "Show code" source block) for every story.
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i }
    },
    a11y: { test: 'todo' },
    // Match Storybook's own canvas background to the active theme.
    darkMode: {
      dark: create({ base: 'dark', appBg: '#243240', appContentBg: '#243240', ...brand }),
      light: create({ base: 'light', appBg: '#ffffff', appContentBg: '#ffffff', ...brand })
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
