/*
* - Global utility functions go here
*/

// Simple pub/sub for global error notifications
type ErrorListener = (message: string) => void;

const errorListeners = new Set<ErrorListener>();

export function onGlobalError(listener: ErrorListener): () => void {
  errorListeners.add(listener);
  // Return a cleanup function that returns void (not boolean)
  return () => {
    errorListeners.delete(listener);
  };
}

export function emitGlobalError(message: string) {
  for (const listener of errorListeners) {
    try {
      listener(message);
    } catch (err) {
      // no-op
    }
  }
}