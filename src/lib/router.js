import { useEffect, useState } from 'react'

/**
 * Minimal History API router.
 *
 * Routes:
 *   /               home
 *   /projects/:id   project details
 *   anything else   not found
 *
 * Cloudflare Pages serves index.html for unknown paths when the build has no
 * 404.html, so deep links work without extra configuration.
 */

const listeners = new Set()

const PROJECT_ROUTE = /^\/projects\/([\w-]+)\/?$/

export const projectPath = (id) => `/projects/${id}`

export const sectionHref = (sectionId) => `/#${sectionId}`

/**
 * @param {string} path
 * @returns {{ name: 'home' } | { name: 'project', id: string } | { name: 'notFound' }}
 */
export function matchRoute(path) {
  if (path === '/' || path === '') return { name: 'home' }
  const project = path.match(PROJECT_ROUTE)
  if (project) return { name: 'project', id: project[1] }
  return { name: 'notFound' }
}

export function navigate(href) {
  history.pushState(null, '', href)
  listeners.forEach((notify) => notify())
}

/** Current pathname; re-renders on navigate() and on browser back/forward. */
export function usePathname() {
  const [pathname, setPathname] = useState(() => location.pathname)

  useEffect(() => {
    const update = () => setPathname(location.pathname)
    listeners.add(update)
    window.addEventListener('popstate', update)
    return () => {
      listeners.delete(update)
      window.removeEventListener('popstate', update)
    }
  }, [])

  return pathname
}

function isPlainLeftClick(event) {
  return (
    !event.defaultPrevented &&
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  )
}

/**
 * Turns clicks on internal links (href starting with "/") into client-side
 * navigation. Same-page anchors and external links keep the browser default.
 */
export function useLinkInterception() {
  useEffect(() => {
    function handleClick(event) {
      if (!isPlainLeftClick(event)) return

      const anchor = event.target.closest?.('a[href]')
      if (!anchor || anchor.target || anchor.hasAttribute('download')) return

      const href = anchor.getAttribute('href')
      if (!href.startsWith('/')) return

      const url = new URL(href, location.href)
      if (url.pathname === location.pathname) return

      event.preventDefault()
      navigate(url.pathname + url.search + url.hash)
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])
}
