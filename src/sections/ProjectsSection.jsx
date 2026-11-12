import Icon from '../components/icons/Icon'
import ProjectCard from '../components/project/ProjectCard'
import { Section } from '../components/ui'
import { SECTION } from '../config/site'
import { projects } from '../content/projects'
import { reveal } from '../hooks/useReveal'
import { useI18n } from '../i18n/context'
import { PROJECTS_PATH } from '../lib/router'

const HOME_LIMIT = 3

export default function ProjectsSection() {
  const { t } = useI18n()
  const latest = projects.slice(0, HOME_LIMIT)

  return (
    <Section
      id={SECTION.projects}
      eyebrow={t('projects.eyebrow')}
      title={t('projects.title')}
      intro={t('projects.intro')}
      action={
        projects.length > HOME_LIMIT && (
          <a href={PROJECTS_PATH} className="px-btn">
            {t('projects.seeAll', { n: projects.length })}
            <Icon name="arrowRight" size={16} />
          </a>
        )
      }
    >
      <ul className="project-grid">
        {latest.map((project, index) => (
          <li key={project.id} {...reveal(index + 1)}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </Section>
  )
}
