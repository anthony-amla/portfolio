import Icon from '../components/icons/Icon'
import { Section, Window } from '../components/ui'
import { SECTION } from '../config/site'
import { profile, servers } from '../content/portfolio'
import Portrait from '../features/room/Portrait'
import { reveal } from '../hooks/useReveal'
import { useI18n } from '../i18n/context'
import { yearsSince } from '../lib/date'

function useStats() {
  const { t } = useI18n()
  return [
    { id: 'level', value: yearsSince(profile.startYear) },
    { id: 'servers', value: servers.length },
    { id: 'class', value: t('about.stats.class.value') },
    { id: 'education', value: t('about.stats.education.value') },
  ].map((stat) => ({
    ...stat,
    label: t(`about.stats.${stat.id}.label`),
    note: t(`about.stats.${stat.id}.note`),
  }))
}

export default function AboutSection() {
  const { t } = useI18n()
  const stats = useStats()

  return (
    <Section id={SECTION.about} eyebrow={t('about.eyebrow')} title={t('about.title')}>
      <div {...reveal(1)}>
        <Window title={t('about.windowTitle', { nick: profile.nick })} icon="user">
          <div className="profile-grid">
            <aside className="profile-card">
              <div className="portrait">
                <Portrait scale={5} />
              </div>
              <p className="profile-name">{profile.name}</p>
              <p className="profile-nick">{t('hero.aka', { nick: profile.nick })}</p>
              <div className="missions">
                <h3 className="missions-title">{t('about.missionsTitle')}</h3>
                <ol>
                  {t('about.missions').map((mission) => (
                    <li key={mission}>{mission}</li>
                  ))}
                </ol>
              </div>
            </aside>

            <div className="profile-details">
              <dl className="stats">
                {stats.map((stat) => (
                  <div key={stat.id} className="stat">
                    <dt>{stat.label}</dt>
                    <dd>
                      <span className="stat-value">{stat.value}</span>
                      <span className="stat-note">{stat.note}</span>
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="prose">
                {t('about.paragraphs', { startYear: profile.startYear }).map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <div className="education">
                <Icon name="book" size={24} />
                <div>
                  <p className="education-title">{t('about.education.title')}</p>
                  <p className="education-text">{t('about.education.text')}</p>
                </div>
              </div>

              <h3 className="subheading">{t('about.badgesTitle')}</h3>
              <ul className="badges">
                {profile.badges.map((badge) => (
                  <li key={badge.id} className="badge">
                    <span className="badge-icon">
                      <Icon name={badge.icon} size={20} />
                    </span>
                    {t(`about.badges.${badge.id}`, { startYear: profile.startYear })}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Window>
      </div>
    </Section>
  )
}
