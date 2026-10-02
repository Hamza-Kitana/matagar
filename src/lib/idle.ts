// Runs `task` once the page has finished loading and the main thread is idle. Returns a cancel function.
export function whenIdle(task: () => void, timeout = 1500): () => void {
  let cancelled = false;
  let idleId: number | undefined;
  let timerId: number | undefined;

  const schedule = () => {
    if (cancelled) return;
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(() => { if (!cancelled) task(); }, { timeout });
    } else {
      timerId = setTimeout(() => { if (!cancelled) task(); }, 200) as unknown as number;
    }
  };

  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });

  return () => {
    cancelled = true;
    window.removeEventListener("load", schedule);
    if (idleId !== undefined) window.cancelIdleCallback(idleId);
    if (timerId !== undefined) clearTimeout(timerId);
  };
}
