import { useEffect } from 'react'

const REVEAL_ATTR = 'data-reveal'
const SHOWN_ATTR = 'data-shown'

/**
 * Props for an element that fades in when it enters the viewport.
 * @param {number} [delay=0] Stagger step for list items (see `--reveal-delay` in CSS).
 */
export const reveal = (delay = 0) => ({ [REVEAL_ATTR]: '', style: { '--reveal-delay': delay } })

/**
 * Observes every `[data-reveal]` element and marks it as shown once it is
 * visible. Pass a key that changes with the page so new elements get observed.
 */
export function useReveal(key) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute(SHOWN_ATTR, '')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    )

    document.querySelectorAll(`[${REVEAL_ATTR}]:not([${SHOWN_ATTR}])`).forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [key])
}
