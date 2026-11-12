import { useEffect } from 'react'

const HIDDEN_CLASS = 'hero-scrollbar-hidden'

/**
 * Hides the page scrollbar (visually only, scrolling still works) while the
 * hero takes most of the screen; it comes back once the visitor moves on.
 *
 * @param {import('react').RefObject<HTMLElement>} heroRef
 */
export function useHeroScrollbar(heroRef) {
  useEffect(() => {
    const root = document.documentElement
    const update = () => {
      const hero = heroRef.current
      const hide = Boolean(hero) && window.scrollY < hero.offsetHeight / 2
      root.classList.toggle(HIDDEN_CLASS, hide)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      root.classList.remove(HIDDEN_CLASS)
    }
  }, [heroRef])
}
