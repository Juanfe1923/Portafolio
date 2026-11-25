/**
 * Smoothly scrolls to a section, centering its content between the fixed top
 * header and bottom navigation dock when it fits in the viewport, or aligning
 * its heading cleanly below the top header when taller than the viewport.
 */
export function scrollToSectionById(id: string): void {
  if (id === "inicio") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const element = document.getElementById(id);
  if (!element) return;

  const topHeaderOffset = 76;
  const bottomDockOffset = 88;
  const viewportHeight = window.innerHeight;
  const usableHeight = Math.max(320, viewportHeight - topHeaderOffset - bottomDockOffset);

  const style = window.getComputedStyle(element);
  const paddingTop = parseFloat(style.paddingTop) || 0;
  const paddingBottom = parseFloat(style.paddingBottom) || 0;

  const rect = element.getBoundingClientRect();
  const contentTop = rect.top + window.scrollY + paddingTop;
  const contentHeight = Math.max(0, rect.height - paddingTop - paddingBottom);

  let targetY: number;
  if (contentHeight <= usableHeight) {
    const usableCenter = topHeaderOffset + usableHeight / 2;
    targetY = contentTop + contentHeight / 2 - usableCenter;
  } else {
    targetY = contentTop - topHeaderOffset - 16;
  }

  const maxScroll = Math.max(
    0,
    document.documentElement.scrollHeight - viewportHeight
  );
  const clampedY = Math.max(0, Math.min(maxScroll, targetY));

  window.scrollTo({
    top: clampedY,
    behavior: "smooth",
  });
}
