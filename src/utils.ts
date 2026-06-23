/** Coerce a number to a px string; pass strings through untouched. */
export function convertToPx(n?: string | number): string | undefined {
  if (n === undefined) return undefined;
  if (typeof n === 'string') return n;
  return `${n}px`;
}
