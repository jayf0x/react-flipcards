import type { ReactNode } from 'react';

/** A titled container for a single demo, with an optional explanation. */
export function Stage({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className='demo-stage'>
      <h3>{title}</h3>
      {hint && <p>{hint}</p>}
      {children}
    </section>
  );
}

export function Button({
  children,
  onClick,
  primary
}: {
  children: ReactNode;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button className={primary ? 'demo-btn demo-btn--primary' : 'demo-btn'} onClick={onClick}>
      {children}
    </button>
  );
}

/** Split a number into a zero-padded array of digits, e.g. (7, 3) -> [0, 0, 7]. */
export function toDigits(n: number, width: number): number[] {
  return String(Math.max(0, n)).padStart(width, '0').slice(-width).split('').map(Number);
}
