import Icon from '../icons/Icon'
import { Chip, Cover } from '../ui'
import { useI18n } from '../../i18n/context'
import { projectPath } from '../../lib/router'

/**
 * @param {object} props
 * @param {{ id: string, owned: boolean, flagged?: boolean, tags: string[], images: string[] }} props.project
 */
export default function ProjectCard({ project }) {
  const { t } = useI18n()
  const text = (key) => t(`projects.items.${project.id}.${key}`)
  const title = text('title')

  return (
    <a className="project-card" href={projectPath(project.id)}>
      {project.flagged && (
        <span className="flag-pin">
          <Icon name="flag" size={16} />
          <span className="flag-pin-label">{text('flag')}</span>
        </span>
      )}
      <Cover src={project.images[0]} title={title} className="project-cover" />
      <span className="project-card-body">
        <span className="project-card-header">
          <span className="project-card-title">{title}</span>
          <Chip tone={project.owned ? 'gold' : 'default'}>
            {t(`projects.kinds.${project.owned ? 'owned' : 'closed'}`)}
          </Chip>
        </span>
        <span className="project-card-summary">{text('summary')}</span>
        <span className="tag-list">
          {project.tags.map((tag) => (
            <Chip key={tag} tone="blue">
              {tag}
            </Chip>
          ))}
        </span>
        <span className="project-card-link">
          {t('projects.viewProject')} <Icon name="arrowRight" size={14} />
        </span>
      </span>
    </a>
  )
}
