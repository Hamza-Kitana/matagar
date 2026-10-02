import { useEffect, type DependencyList } from "react";

export function useReveal(deps: DependencyList = []) {
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal:not(.is-visible)").forEach(element => observer.observe(element));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title;
    return () => { document.title = "VYBE — إكسسوارات تغيّر اللعبة"; };
  }, [title]);
}
