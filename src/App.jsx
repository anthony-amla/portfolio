import { useEffect } from 'react'
import { SECTION } from './config/site'
import { useReveal } from './hooks/useReveal'
import { useTheme } from './hooks/useTheme'
import { useI18n } from './i18n/context'
import CornerControls from './layout/CornerControls'
import Navbar from './layout/Navbar'
import { matchRoute, useLinkInterception, usePathname } from './lib/router'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import ProjectPage from './pages/ProjectPage'

const MAIN_ID = 'main-content'

/** Jumps to the URL hash target after a route change, or to the top. */
function useScrollOnRouteChange(pathname) {
  useEffect(() => {
    const target = location.hash && document.getElementById(location.hash.slice(1))
    if (target) target.scrollIntoView({ behavior: 'instant', block: 'start' })
    else window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
}

export default function App() {
  const { t, locale } = useI18n()
  const { theme, toggleTheme } = useTheme()
  const pathname = usePathname()
  const route = matchRoute(pathname)

  useLinkInterception()
  useScrollOnRouteChange(pathname)
  useReveal(`${pathname}:${locale}`)

  return (
    <>
      <a href={`#${MAIN_ID}`} className="skip-link">
        {t('common.skipToContent')}
      </a>
      <Navbar
        key={pathname}
        theme={theme}
        onToggleTheme={toggleTheme}
        activeSection={route.name === 'project' ? SECTION.projects : undefined}
      />
      <main id={MAIN_ID}>
        {route.name === 'home' && <HomePage theme={theme} onToggleTheme={toggleTheme} />}
        {route.name === 'project' && <ProjectPage id={route.id} />}
        {route.name === 'notFound' && <NotFoundPage />}
      </main>
      <CornerControls />
    </>
  )
}
