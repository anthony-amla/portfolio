import { useEffect, useState } from 'react'
import Icon from '../components/icons/Icon'
import { NAV_ITEMS, SECTION } from '../config/site'
import { useI18n } from '../i18n/context'
import { sectionHref } from '../lib/router'

/**
 * Fixed top navigation. Highlights the section in view on the home page;
 * on other pages `activeSection` sets the highlighted item.
 *
 * @param {object} props
 * @param {'day' | 'night'} props.theme
 * @param {() => void} props.onToggleTheme
 * @param {string} [props.activeSection]
 */
export default function Navbar({ theme, onToggleTheme, activeSection }) {
  const { t } = useI18n()
  const [active, setActive] = useState(activeSection ?? SECTION.home)

  useEffect(() => {
    if (activeSection) return
    const sections = NAV_ITEMS.map(({ id }) => document.getElementById(id)).filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [activeSection])

  const isDay = theme === 'day'

  return (
    <nav className="navbar" aria-label={t('nav.label')}>
      <ul>
        {NAV_ITEMS.map(({ id, icon }) => {
          const label = t(`nav.items.${id}`)
          return (
            <li key={id}>
              <a
                href={sectionHref(id)}
                className="nav-item"
                aria-current={active === id ? 'true' : undefined}
                title={label}
              >
                <Icon name={icon} size={22} />
                <span className="nav-label">{label}</span>
              </a>
            </li>
          )
        })}
        <li className="nav-separator" aria-hidden />
        <li>
          <button
            type="button"
            className="nav-item"
            onClick={onToggleTheme}
            aria-label={t(isDay ? 'nav.switchToNight' : 'nav.switchToDay')}
            title={t(isDay ? 'nav.night' : 'nav.day')}
          >
            <Icon name={isDay ? 'moon' : 'sun'} size={22} />
            <span className="nav-label">{t(isDay ? 'nav.night' : 'nav.day')}</span>
          </button>
        </li>
      </ul>
    </nav>
  )
}
