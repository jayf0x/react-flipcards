import { cleanup, render } from '@testing-library/react';
import type { ComponentType } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Auto-discover every story and assert it mounts without throwing.
// Adding a new story automatically adds a test — nothing to wire up.
const stories = import.meta.glob('./src/**/*.stories.tsx', { eager: true });

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('stories render', () => {
  const cases = Object.entries(stories).flatMap(([path, mod]) =>
    Object.entries(mod as Record<string, unknown>)
      .filter(([name, value]) => name !== 'default' && typeof value === 'function')
      .map(([name, value]) => ({ id: `${path.replace('./src/', '')} › ${name}`, Story: value as ComponentType }))
  );

  it('discovers stories', () => {
    expect(cases.length).toBeGreaterThan(0);
  });

  for (const { id, Story } of cases) {
    it(`renders ${id}`, () => {
      expect(() => render(<Story />)).not.toThrow();
    });
  }
});
