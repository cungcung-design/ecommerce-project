import { useLayoutEffect } from "react";

const INSTANT_SCROLL = { top: 0, left: 0, behavior: "instant" };

export function disableBrowserScrollRestoration() {
  if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }
}

export function focusPageTop() {
  const target = document.getElementById("page-top");
  if (target instanceof HTMLElement) {
    target.focus({ preventScroll: true });
  }
}

export function resetPageScroll() {
  window.scrollTo(INSTANT_SCROLL);
  window.scrollTo(0, 0);

  const scrollingElement = document.scrollingElement;
  if (scrollingElement) {
    scrollingElement.scrollTop = 0;
    scrollingElement.scrollLeft = 0;
    if (typeof scrollingElement.scrollTo === "function") {
      scrollingElement.scrollTo(INSTANT_SCROLL);
    }
  }

  document.documentElement.scrollTop = 0;
  document.documentElement.scrollLeft = 0;
  document.body.scrollTop = 0;
  document.body.scrollLeft = 0;
}

export function useInstantScrollToTop(deps, options = {}) {
  const skip = Boolean(options.skip);

  useLayoutEffect(() => {
    if (skip) return undefined;

    disableBrowserScrollRestoration();
    focusPageTop();
    resetPageScroll();

    let frameTwo = 0;
    const frameOne = requestAnimationFrame(() => {
      resetPageScroll();
      frameTwo = requestAnimationFrame(resetPageScroll);
    });

    return () => {
      cancelAnimationFrame(frameOne);
      cancelAnimationFrame(frameTwo);
    };
    // Caller supplies the render-lifecycle deps that must complete first.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, ...deps]);
}
