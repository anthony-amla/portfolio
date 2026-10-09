import ServerCard from '../components/server/ServerCard'
import { Section } from '../components/ui'
import { SECTION } from '../config/site'
import { servers } from '../content/portfolio'
import { reveal } from '../hooks/useReveal'
import { useI18n } from '../i18n/context'

export default function ServersSection() {
  const { t } = useI18n()

  return (
    <Section id={SECTION.servers} eyebrow={t('servers.eyebrow')} title={t('servers.title')} intro={t('servers.intro')}>
      <ul className="server-grid">
        {servers.map((server, index) => (
          <li key={server.id} {...reveal(index + 1)}>
            <ServerCard server={server} />
          </li>
        ))}
      </ul>
    </Section>
  )
}
