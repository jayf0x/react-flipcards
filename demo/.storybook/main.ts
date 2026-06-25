import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@chromatic-com/storybook',
    'storybook-dark-mode'
  ],
  framework: { name: '@storybook/react-vite', options: {} },
  // GH Pages serves the demo under a subpath; build:gh sets STORYBOOK_BASE.
  async viteFinal(config) {
    if (process.env.STORYBOOK_BASE) config.base = process.env.STORYBOOK_BASE;
    return config;
  }
};

export default config;
