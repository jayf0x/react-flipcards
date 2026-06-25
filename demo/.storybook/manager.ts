import { addons } from '@storybook/manager-api';

addons.setConfig({
  // Render each top-level title segment ("Use cases", "Playground") as a
  // section root, which is always shown expanded instead of collapsed.
  sidebar: { showRoots: true }
});
