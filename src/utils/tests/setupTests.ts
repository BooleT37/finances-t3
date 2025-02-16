import setupDayJs from "../setupDayJs";

import "@testing-library/jest-dom/vitest";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vitest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vitest.fn(), // Deprecated
    removeListener: vitest.fn(), // Deprecated
    addEventListener: vitest.fn(),
    removeEventListener: vitest.fn(),
    dispatchEvent: vitest.fn(),
  })),
});

// to mute console warnings
const originalGetComputedStyle = window.getComputedStyle;
// Setup dayjs configuration
Object.defineProperty(window, "getComputedStyle", {
  value: (elt: Element, _pseudoElt: string | undefined) =>
    originalGetComputedStyle(elt),
});

setupDayJs();
