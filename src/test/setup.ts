import "@testing-library/jest-dom";
import { vi } from "vitest";


vi.stubGlobal("IntersectionObserver", class {
  constructor(cb: any) {}
  observe() {}
  disconnect() {}
});

vi.stubGlobal("scrollTo", () => {});

class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
