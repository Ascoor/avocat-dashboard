const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

type ScrollOptions = {
  duration?: number;
};

type ScrollToElementOptions = ScrollOptions & {
  offset?: number;
};

export const smoothScrollTo = (targetY: number, options?: ScrollOptions) => {
  if (typeof window === "undefined") return;

  const startY = window.scrollY || window.pageYOffset;
  const distance = targetY - startY;
  const duration = options?.duration ?? 800;
  const startTime = performance.now();

  const step = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);
    window.scrollTo(0, startY + distance * easedProgress);

    if (elapsed < duration) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};

export const smoothScrollToElement = (
  element: Element,
  options?: ScrollToElementOptions,
) => {
  const rect = element.getBoundingClientRect();
  const offset = options?.offset ?? 0;
  const targetY = rect.top + (window.scrollY || window.pageYOffset) - offset;
  smoothScrollTo(targetY, { duration: options?.duration });
};
