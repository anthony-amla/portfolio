import { useState } from 'react'
import Icon from '../components/icons/Icon'
import ProjectCard from '../components/project/ProjectCard'
import { Chip, Cover, StatusFlag, Window } from '../components/ui'
import { SECTION } from '../config/site'
import { projects } from '../content/portfolio'
import { reveal } from '../hooks/useReveal'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useI18n } from '../i18n/context'
import Footer from '../layout/Footer'
import { sectionHref } from '../lib/router'
import { NotFound } from './NotFoundPage'

/** @param {{ images: string[], title: string }} props */
function Gallery({ images, title }) {
  const { t } = useI18n()
  const [index, setIndex] = useState(0)
  const step = (delta) => setIndex((current) => (current + delta + images.length) % images.length)

  return (
    <div className="gallery">
      <Cover src={images[index]} title={title} className="gallery-image" />
      {images.length > 1 && (
        <div className="gallery-controls">
          <button type="button" className="px-icon-btn" onClick={() => step(-1)} aria-label={t('common.previousImage')}>
            <Icon name="chevronLeft" size={18} />
          </button>
          <span className="gallery-counter">
            {index + 1}/{images.length}
          </span>
          <button type="button" className="px-icon-btn" onClick={() => step(1)} aria-label={t('common.nextImage')}>
            <Icon name="chevronRight" size={18} />
          </button>
        </div>
      )}
    </div>
  )
}

/** @param {{ project: (typeof projects)[number] }} props */
function ProjectDetails({ project }) {
  const { t } = useI18n()
  const text = (key) => t(`projects.items.${project.id}.${key}`)
  const title = text('title')
  const others = projects.filter((other) => other.id !== project.id)

  useDocumentTitle(t('meta.projectTitle', { title }))

  return (
    <>
      <article className="section project-page" aria-labelledby="project-title">
        <div className="container">
          <a href={sectionHref(SECTION.projects)} className="back-link" {...reveal()}>
            <Icon name="chevronLeft" size={16} /> {t('projectPage.back')}
          </a>

          <header className="project-header" {...reveal(1)}>
            <p className="tag-list">
              <Chip tone={project.owned ? 'gold' : 'default'}>
                {t(`projects.kinds.${project.owned ? 'owned' : 'closed'}`)}
              </Chip>
              {project.flagged && <StatusFlag>{text('flag')}</StatusFlag>}
            </p>
            <h1 id="project-title" className="section-title">
              {title}
            </h1>
            <p className="project-summary">{text('summary')}</p>
          </header>

          <div className="project-layout">
            <div {...reveal(2)}>
              <Gallery images={project.images} title={title} />
            </div>

            <aside {...reveal(3)}>
              <Window title={t('projectPage.features')} icon="star">
                <ul className="feature-list">
                  {text('features').map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <h2 className="loot-label project-stack-title">{t('projectPage.stack')}</h2>
                <p className="tag-list">
                  {project.tags.map((tag) => (
                    <Chip key={tag} tone="blue">
                      {tag}
                    </Chip>
                  ))}
                </p>
                {project.link && !project.flagged && (
                  <a className="px-btn project-link" href={project.link} target="_blank" rel="noreferrer">
                    {text('linkLabel')} <Icon name="externalLink" size={16} />
                  </a>
                )}
              </Window>
            </aside>
          </div>

          {others.length > 0 && (
            <section className="related-projects" aria-labelledby="related-title">
              <h2 id="related-title" className="related-title" {...reveal()}>
                {t('projectPage.others')}
              </h2>
              <ul className="project-grid">
                {others.map((other, index) => (
                  <li key={other.id} {...reveal(index + 1)}>
                    <ProjectCard project={other} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </article>
      <div className="container">
        <Footer />
      </div>
    </>
  )
}

/** @param {{ id: string }} props */
export default function ProjectPage({ id }) {
  const { t } = useI18n()
  const project = projects.find((item) => item.id === id)

  if (!project) {
    return (
      <NotFound
        title={t('projectPage.notFound.title')}
        text={t('projectPage.notFound.text')}
        ctaLabel={t('projectPage.notFound.cta')}
        ctaHref={sectionHref(SECTION.projects)}
      />
    )
  }

  return <ProjectDetails key={project.id} project={project} />
}
