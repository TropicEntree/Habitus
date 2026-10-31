/**
 * Lightweight event bus for "tab reset" — fired when the user taps the
 * already-active bottom-tab icon again. Pages subscribe for their path
 * and respond by reloading their data + scrolling to top.
 */
const listeners = {};

export function subscribeTabReset(path, cb) {
  listeners[path] = cb;
  return () => {
    if (listeners[path] === cb) delete listeners[path];
  };
}

export function emitTabReset(path) {
  listeners[path]?.();
}