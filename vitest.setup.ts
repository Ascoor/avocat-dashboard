
import '@testing-library/jest-dom';

// Add custom matchers to expect
declare module 'vitest' {
  interface JestAssertion<T = unknown> extends jest.Matchers<void, T> {
    toBeInTheDocument(): T;
  }
}
