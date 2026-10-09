import Icon from '../components/icons/Icon'
import { Cover, Section } from '../components/ui'
import { SECTION } from '../config/site'
import { NETWORKS, journey, servers } from '../content/portfolio'
import { reveal } from '../hooks/useReveal'
import { useI18n } from '../i18n/context'

/** Ids of the journey stages that list a given server. */
const stagesForServer = (serverId) =>
  journey.filter((stage) => stage.servers.includes(serverId)).map((stage) => stage.id)

/** @param {{ server: { id: string, name: string, link: { network: string, href: string } | null, image: string } }} props */
function ServerCard({ server }) {
  const { t } = useI18n()
  const orgs = [...new Set(stagesForServer(server.id).map((id) => t(`journey.items.${id}.org`)))]

  const content = (
    <>
      <Cover src={server.image} title={server.name} className="server-cover" />
      <div className="server-info">
        <p className="server-name">{server.name}</p>
        <p className="server-via">{t('servers.via', { orgs: orgs.join(t('servers.orgSeparator')) })}</p>
      </div>
      {server.link && <Icon name={server.link.network} size={18} className="server-link-icon" />}
    </>
  )

  if (!server.link) return <div className="server-card">{content}</div>

  return (
    <a
      className="server-card"
      href={server.link.href}
      target="_blank"
      rel="noreferrer"
      aria-label={t('servers.linkLabel', { name: server.name, network: NETWORKS[server.link.network] })}
    >
      {content}
    </a>
  )
}

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
