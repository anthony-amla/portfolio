import { useState } from 'react'
import Icon from '../components/icons/Icon'
import TechLogo from '../components/icons/TechLogo'
import ProjectCard from '../components/project/ProjectCard'
import ServerCard from '../components/server/ServerCard'
import { Chip, Cover, StatusFlag, TechTag, Window } from '../components/ui'
import { SECTION } from '../config/site'
import { servers } from '../content/portfolio'
import { KIND_TONE, kindLabel, projects } from '../content/projects'
import { reveal } from '../hooks/useReveal'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useI18n } from '../i18n/context'
import Footer from '../layout/Footer'
import { sectionHref } from '../lib/router'
import { NotFound } from './NotFoundPage'

/** Video first (when there is one), then the images. */
const mediaOf = (project) => [
  ...(project.video ? [{ type: 'video', ...project.video }] : []),
  ...(project.gallery ?? []).map((item) => ({ type: 'image', ...item })),
]

/** @param {{ items: ReturnType<typeof mediaOf>, title: string }} props */
function Gallery({ items, title }) {
  const { t, l } = useI18n()
  const [index, setIndex] = useState(0)
  const step = (delta) => setIndex((current) => (current + delta + items.length) % items.length)
  const current = items[index]
  const caption = current && l(current.caption)

  if (!current) return <Cover title={title} className="gallery-image" />

  return (
    <figure className="gallery">
      {current.type === 'video' ? (
        <video
          key={current.src}
          className="gallery-image gallery-video"
          src={current.src}
          poster={current.poster}
          controls
          playsInline
          preload="metadata"
          aria-label={caption || t('projectPage.video')}
        />
      ) : (
        <Cover key={current.src} src={current.src} title={caption || title} className="gallery-image" />
      )}
      {caption && <figcaption className="gallery-caption">{caption}</figcaption>}

      {items.length > 1 && (
        <>
          <div className="gallery-controls">
            <button
              type="button"
              className="px-icon-btn"
              onClick={() => step(-1)}
              aria-label={t('common.previousImage')}
            >
              <Icon name="chevronLeft" size={18} />
            </button>
            <span className="gallery-counter">
              {index + 1}/{items.length}
            </span>
            <button type="button" className="px-icon-btn" onClick={() => step(1)} aria-label={t('common.nextImage')}>
              <Icon name="chevronRight" size={18} />
            </button>
          </div>
          <ul className="gallery-thumbs">
            {items.map((item, i) => (
              <li key={item.src}>
                <button
                  type="button"
                  className="gallery-thumb"
                  aria-current={i === index}
                  aria-label={t('projectPage.goTo', { n: i + 1 })}
                  onClick={() => setIndex(i)}
                >
                  <img src={item.type === 'video' ? item.poster : item.src} alt="" loading="lazy" />
                  {item.type === 'video' && (
                    <span className="gallery-thumb-play">
                      <Icon name="play" size={16} />
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </figure>
  )
}

/** @param {{ title: string, icon: string, children: import('react').ReactNode }} props */
function DetailSection({ title, icon, children }) {
  return (
    <section className="project-section" {...reveal()}>
      <h2 className="project-section-title">
        <Icon name={icon} size={20} /> {title}
      </h2>
      {children}
    </section>
  )
}

/** @param {{ project: import('../content/projects').Project }} props */
function ProjectDetails({ project }) {
  const i18n = useI18n()
  const { t, l } = i18n
  const title = l(project.title)
  const others = projects.filter((other) => other.id !== project.id)
  const features = l(project.features) ?? []
  const about = l(project.about) ?? []
  const usedOn = (project.servers ?? []).map((id) => servers.find((server) => server.id === id)).filter(Boolean)

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
              <Chip tone={KIND_TONE[project.kind]}>{kindLabel(project, i18n)}</Chip>
              {project.flag && <StatusFlag>{l(project.flag)}</StatusFlag>}
            </p>
            <h1 id="project-title" className="section-title">
              {title}
            </h1>
            <p className="project-summary">{l(project.summary)}</p>
          </header>

          <div className="project-layout">
            <div {...reveal(2)}>
              <Gallery items={mediaOf(project)} title={title} />
            </div>

            <aside {...reveal(3)}>
              <Window title={t('projectPage.features')} icon="star">
                <ul className="feature-list">
                  {features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <h2 className="loot-label project-stack-title">{t('projectPage.stack')}</h2>
                <p className="tag-list">
                  {project.tags.map((tag) => (
                    <TechTag key={tag} name={tag} />
                  ))}
                </p>
                {project.link && !project.flag && (
                  <a className="px-btn project-link" href={project.link.href} target="_blank" rel="noreferrer">
                    {l(project.link.label)} <Icon name="externalLink" size={16} />
                  </a>
                )}
              </Window>
            </aside>
          </div>

          {project.impact?.length > 0 && (
            <DetailSection title={t('projectPage.impact')} icon="chart">
              <ul className="impact-grid">
                {project.impact.map((item) => (
                  <li key={l(item.label)} className="impact-card">
                    <span className="impact-value">{l(item.value)}</span>
                    <span className="impact-label">{l(item.label)}</span>
                  </li>
                ))}
              </ul>
            </DetailSection>
          )}

          {usedOn.length > 0 && (
            <DetailSection title={t('projectPage.servers')} icon="server">
              <ul className="server-grid">
                {usedOn.map((server) => (
                  <li key={server.id}>
                    <ServerCard server={server} />
                  </li>
                ))}
              </ul>
            </DetailSection>
          )}

          {about.length > 0 && (
            <DetailSection title={t('projectPage.about')} icon="info">
              <div className="project-prose">
                {about.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </DetailSection>
          )}

          {project.flow?.length > 0 && (
            <DetailSection title={t('projectPage.flow')} icon="gitBranch">
              <ol className="flow-list">
                {project.flow.map((step, index) => (
                  <li key={l(step.name)} className="flow-step">
                    <span className="flow-index">{index + 1}</span>
                    <span className="flow-body">
                      <span className="flow-head">
                        <strong>{l(step.name)}</strong>
                        {step.tech && <span className="flow-tech">{step.tech}</span>}
                      </span>
                      <span className="flow-text">{l(step.text)}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </DetailSection>
          )}

          {project.stack?.length > 0 && (
            <DetailSection title={t('projectPage.technologies')} icon="code">
              <ul className="tech-grid">
                {project.stack.map((tech) => (
                  <li key={tech.name} className="tech-card">
                    <span className="tech-logo">
                      <TechLogo icon={tech.icon} name={tech.name} size={34} />
                    </span>
                    <span>
                      <strong className="tech-name">{tech.name}</strong>
                      <span className="tech-role">{l(tech.role)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </DetailSection>
          )}

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
