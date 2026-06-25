import { cleanup, render } from '@testing-library/react';
import { createElement, type ComponentType } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Auto-discover every story and assert it mounts without throwing.
// Adding a new story automatically adds a test — nothing to wire up.
// Storybook CSF: the default export is the `meta`, each named export is a
// story object ({ render?, args? }). Render = story.render ?? meta.component,
// with args merged from meta + story.
const stories = import.meta.glob('./src/**/*.stories.tsx', { eager: true });

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

type Meta = { component?: ComponentType<any>; args?: Record<string, unknown> };
type StoryObj = { render?: ComponentType<any>; args?: Record<string, unknown> };

describe('stories render', () => {
  const cases = Object.entries(stories).flatMap(([path, mod]) => {
    const { default: meta = {}, ...named } = mod as { default?: Meta } & Record<string, StoryObj>;
    return Object.entries(named)
      .filter(([, story]) => story && (story.render || meta.component))
      .map(([name, story]) => {
        const Comp = (story.render ?? meta.component) as ComponentType<any>;
        const args = { ...meta.args, ...story.args };
        return { id: `${path.replace('./src/', '')} › ${name}`, render: () => createElement(Comp, args) };
      });
  });

  it('discovers stories', () => {
    expect(cases.length).toBeGreaterThan(0);
  });

  for (const { id, render: renderStory } of cases) {
    it(`renders ${id}`, () => {
      expect(() => render(renderStory())).not.toThrow();
    });
  }
});
