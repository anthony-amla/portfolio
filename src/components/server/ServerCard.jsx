import Icon from '../icons/Icon'
import { Chip, Cover } from '../ui'
import { NETWORKS, journey } from '../../content/portfolio'
import { useI18n } from '../../i18n/context'

/** Ids of the journey stages that list a given server. */
const stagesForServer = (serverId) =>
  journey.filter((stage) => stage.servers.includes(serverId)).map((stage) => stage.id)

/**
 * Roleplay server with its logo, the organizations it came through and,
 * when set, a link to its social network. `offline` servers are greyed out.
 *
 * @param {{ server: { id: string, name: string, link: { network: string, href: string } | null, image: string, offline?: boolean } }} props
 */
export default function ServerCard({ server }) {
  const { t } = useI18n()
  const orgs = [...new Set(stagesForServer(server.id).map((id) => t(`journey.items.${id}.org`)))]
  const className = `server-card${server.offline ? ' server-card-offline' : ''}`

  const content = (
    <>
      <Cover src={server.image} title={server.name} className="server-cover" />
      <div className="server-info">
        <p className="server-name">{server.name}</p>
        {orgs.length > 0 && (
          <p className="server-via">{t('servers.via', { orgs: orgs.join(t('servers.orgSeparator')) })}</p>
        )}
        {server.offline && <Chip>{t('servers.offline')}</Chip>}
      </div>
      {server.link && <Icon name={server.link.network} size={18} className="server-link-icon" />}
    </>
  )

  if (!server.link || server.offline) return <div className={className}>{content}</div>

  return (
    <a
      className={className}
      href={server.link.href}
      target="_blank"
      rel="noreferrer"
      aria-label={t('servers.linkLabel', { name: server.name, network: NETWORKS[server.link.network] })}
    >
      {content}
    </a>
  )
}
