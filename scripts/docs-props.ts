import { tttWrite } from 'type-to-table';

// Excludes inherited DOM attributes (from React's own lib.dom typings) so the
// generated table only lists FlipCardPanel's own props, matching what was
// hand-maintained here before.
const propFilter = (prop: { declarations?: { fileName: string }[] }) => {
  if (prop.declarations && prop.declarations.length > 0) {
    return prop.declarations.some((d) => !d.fileName.includes('node_modules'));
  }
  return true;
};

const changed = tttWrite('src/FlipCardPanel.tsx', 'README.md', {
  componentName: 'FlipCardPanel',
  parserOptions: { propFilter },
});
console.log(changed ? 'README.md updated.' : 'README.md already up to date.');
