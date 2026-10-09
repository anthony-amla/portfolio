import Icon from '../components/icons/Icon'
import { SECTION } from '../config/site'
import { profile } from '../content/portfolio'
import Room from '../features/room/Room'
import { reveal } from '../hooks/useReveal'
import { useI18n } from '../i18n/context'
import { yearsSince } from '../lib/date'

/**
 * @param {object} props
 * @param {'day' | 'night'} props.theme
 * @param {() => void} props.onToggleTheme
 */
export default function HeroSection({ theme, onToggleTheme }) {
  const { t } = useI18n()

  return (
    <section id={SECTION.home} className="hero" aria-labelledby="hero-title">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="status" {...reveal(0)}>
            <span className="status-dot" aria-hidden /> {t('hero.status', { year: profile.startYear })}
          </p>
          <h1 id="hero-title" className="hero-title" {...reveal(1)}>
            {profile.name}
            <span className="hero-nick">{t('hero.aka', { nick: profile.nick })}</span>
          </h1>
          <p className="hero-role" {...reveal(2)}>
            {t('hero.role')}
          </p>
          <p className="hero-lead" {...reveal(3)}>
            {t('hero.lead', { years: yearsSince(profile.startYear) })}
          </p>
          <div className="hero-actions" {...reveal(4)}>
            <a href={`#${SECTION.journey}`} className="px-btn">
              {t('hero.primaryCta')} <Icon name="arrowRight" size={16} />
            </a>
            <a href={`#${SECTION.contact}`} className="px-btn px-btn-ghost">
              <Icon name="message" size={16} /> {t('hero.secondaryCta')}
            </a>
          </div>
        </div>

        <div className="hero-room" {...reveal(2)}>
          <Room theme={theme} onToggleTheme={onToggleTheme} />
          <p className="room-hint">{t('hero.roomHint')}</p>
        </div>
      </div>

      <a href={`#${SECTION.about}`} className="scroll-hint" aria-label={t('hero.scrollHintLabel')} {...reveal(6)}>
        <span>{t('hero.scrollHint')}</span>
        <Icon name="chevronDown" size={22} />
      </a>
    </section>
  )
}
