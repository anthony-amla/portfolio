import { Chip, Section, StatusFlag } from '../components/ui'
import { SECTION } from '../config/site'
import { journey, profile, servers } from '../content/portfolio'
import { reveal } from '../hooks/useReveal'
import { useI18n } from '../i18n/context'
import { currentYear, yearProgress, yearsSince } from '../lib/date'

const serverName = (id) => servers.find((server) => server.id === id)?.name ?? id

function ExperienceBar() {
  const { t } = useI18n()
  const level = yearsSince(profile.startYear)
  const progress = yearProgress()

  return (
    <div className="xp" aria-label={t('journey.levelLabel', { level, progress })} {...reveal(1)}>
      <span className="xp-level">{t('journey.levelShort', { level })}</span>
      <div className="xp-bar" aria-hidden>
        <span style={{ width: `${progress}%` }} />
      </div>
      <span className="xp-range">
        {profile.startYear} → {currentYear()}
      </span>
    </div>
  )
}

/** @param {{ stage: { id: string, level: number, current?: boolean, flagged?: boolean, servers: string[] } }} props */
function Quest({ stage }) {
  const { t } = useI18n()
  const text = (key) => t(`journey.items.${stage.id}.${key}`)
  const period = text('period')
  const classes = ['quest', stage.current && 'quest-current', stage.flagged && 'quest-flagged'].filter(Boolean)

  return (
    <li className={classes.join(' ')} {...reveal(1)}>
      <span className="quest-level" aria-hidden>
        <small>{t('journey.levelBadge')}</small>
        {stage.level}
      </span>

      <article className="quest-card">
        <p className="quest-meta">
          {stage.current && <Chip tone="gold">{t('journey.currentQuest')}</Chip>}
          {stage.flagged && <StatusFlag>{text('flag')}</StatusFlag>}
          {period && <span>{period}</span>}
        </p>
        <h3 className="quest-title">{text('title')}</h3>
        <p className="quest-org">
          <strong>{text('org')}</strong> · {text('role')}
        </p>
        <p className="quest-text">{text('text')}</p>

        <div className="quest-loot">
          <span className="loot-label">{t('journey.loot')}</span>
          {text('loot').map((item) => (
            <Chip key={item}>{item}</Chip>
          ))}
        </div>

        {stage.servers.length > 0 && (
          <div className="quest-loot">
            <span className="loot-label">{t('journey.servers')}</span>
            {stage.servers.map((id) => (
              <Chip key={id} tone="blue">
                {serverName(id)}
              </Chip>
            ))}
          </div>
        )}
      </article>
    </li>
  )
}

export default function JourneySection() {
  const { t } = useI18n()

  return (
    <Section id={SECTION.journey} eyebrow={t('journey.eyebrow')} title={t('journey.title')} intro={t('journey.intro')}>
      <ExperienceBar />
      <ol className="quest-log">
        {journey.map((stage) => (
          <Quest key={stage.id} stage={stage} />
        ))}
      </ol>
    </Section>
  )
}
