import 'csstype';

// Allow CSS custom properties (e.g. `--fcp-*`) in style objects.
// Ref: https://github.com/frenic/csstype#what-should-i-do-when-i-get-type-errors
declare module 'csstype' {
  interface Properties {
    [customCssName: `--${string}`]: string | number | undefined;
  }
}
