// src/utils/raf.ts
export function createScheduler() {
  let scheduled = false;

  return (fn: () => void) => {
    if (scheduled) return;

    scheduled = true;

    requestAnimationFrame(() => {
      fn();
      scheduled = false;
    });
  };
}