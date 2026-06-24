/** @type {import('@ladle/react').UserConfig} */
export default {
  stories: 'src/**/*.stories.{ts,tsx}',
  appName: 'react-flip-cards',
  viteConfig: new URL('../vite.config.ts', import.meta.url).pathname
};
