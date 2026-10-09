import ProjectCard from '../components/project/ProjectCard'
import { Section } from '../components/ui'
import { SECTION } from '../config/site'
import { projects } from '../content/portfolio'
import { reveal } from '../hooks/useReveal'
import { useI18n } from '../i18n/context'

export default function ProjectsSection() {
  const { t } = useI18n()

  return (
    <Section
      id={SECTION.projects}
      eyebrow={t('projects.eyebrow')}
      title={t('projects.title')}
      intro={t('projects.intro')}
    >
      <ul className="project-grid">
        {projects.map((project, index) => (
          <li key={project.id} {...reveal(index + 1)}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </Section>
  )
}
