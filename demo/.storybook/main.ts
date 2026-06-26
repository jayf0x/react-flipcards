import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  // Storybook 10 folds controls/actions/viewport/backgrounds into core.
  // Only the still-separate addons remain (docs powers the "Show code" panel).
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: { name: '@storybook/react-vite', options: {} },
  // GH Pages serves the demo under a subpath; build:gh sets STORYBOOK_BASE.
  async viteFinal(config) {
    if (process.env.STORYBOOK_BASE) config.base = process.env.STORYBOOK_BASE;
    return config;
  }
};

export default config;
