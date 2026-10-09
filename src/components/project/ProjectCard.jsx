import Icon from '../icons/Icon'
import { Chip, Cover, TechTag } from '../ui'
import { KIND_TONE, kindLabel } from '../../content/projects'
import { useI18n } from '../../i18n/context'
import { projectPath } from '../../lib/router'

/** @param {{ project: import('../../content/projects').Project }} props */
export default function ProjectCard({ project }) {
  const i18n = useI18n()
  const { t, l } = i18n
  const title = l(project.title)

  return (
    <a className="project-card" href={projectPath(project.id)}>
      {project.flag && (
        <span className="flag-pin">
          <Icon name="flag" size={16} />
          <span className="flag-pin-label">{l(project.flag)}</span>
        </span>
      )}
      <Cover src={project.cover} title={title} className="project-cover" />
      <span className="project-card-body">
        <span className="project-card-header">
          <span className="project-card-title">{title}</span>
          <Chip tone={KIND_TONE[project.kind]}>{kindLabel(project, i18n)}</Chip>
        </span>
        <span className="project-card-summary">{l(project.summary)}</span>
        <span className="tag-list">
          {project.tags.map((tag) => (
            <TechTag key={tag} name={tag} />
          ))}
        </span>
        <span className="project-card-link">
          {t('projects.viewProject')} <Icon name="arrowRight" size={14} />
        </span>
      </span>
    </a>
  )
}
