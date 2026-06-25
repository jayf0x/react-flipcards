import { addons } from '@storybook/manager-api';

addons.setConfig({
  // Render each top-level title segment ("Use cases", "Playground") as a
  // section root, which is always shown expanded instead of collapsed.
  // (Branding/theme is set per light+dark mode in preview.tsx so the
  // dark-mode toggle keeps control of it.)
  sidebar: { showRoots: true }
});
