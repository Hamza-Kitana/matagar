import { useSyncExternalStore } from "react";

const listeners = new Set<() => void>();
let lastNavigationWasPop = false;

function emit() {
  listeners.forEach(listener => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

if (typeof window !== "undefined") {
  window.history.scrollRestoration = "manual";
  window.addEventListener("popstate", () => {
    lastNavigationWasPop = true;
    emit();
  });
}

const getHref = () => window.location.pathname + window.location.hash;

export function useLocation() {
  const href = useSyncExternalStore(subscribe, getHref, () => "/");
  const hashIndex = href.indexOf("#");
  return {
    path: hashIndex === -1 ? href : href.slice(0, hashIndex),
    hash: hashIndex === -1 ? "" : href.slice(hashIndex + 1),
  };
}

export function scrollToHash(hash: string, smooth = true) {
  document.getElementById(hash)?.scrollIntoView({ behavior: smooth ? "smooth" : "instant" });
}

export function navigate(to: string) {
  lastNavigationWasPop = false;
  if (to === getHref()) {
    const hashIndex = to.indexOf("#");
    if (hashIndex !== -1) scrollToHash(to.slice(hashIndex + 1));
    return;
  }
  window.history.pushState({ depth: historyDepth() + 1 }, "", to);
  emit();
}

const historyDepth = (): number => (window.history.state as { depth?: number } | null)?.depth ?? 0;

export function goBack(fallback: string) {
  if (historyDepth() > 0) window.history.back();
  else navigate(fallback);
}

export function wasPopNavigation() {
  return lastNavigationWasPop;
}
