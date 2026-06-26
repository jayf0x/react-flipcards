import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

addons.setConfig({
  // Sidebar branding (previously set via the now-removed dark-mode addon).
  theme: create({
    base: 'light',
    brandTitle: 'react-flip-cards',
    brandUrl: 'https://github.com/jayf0x/react-flipcards',
    brandTarget: '_blank'
  }),
  // Render each top-level title segment ("Use cases", "Playground") as a
  // section root, always shown expanded instead of collapsed.
  sidebar: { showRoots: true }
});
