import { useMemo, useState } from 'react'
import Icon from '../components/icons/Icon'
import TechLogo from '../components/icons/TechLogo'
import ProjectCard from '../components/project/ProjectCard'
import { SECTION } from '../config/site'
import { kindLabel, projects } from '../content/projects'
import { reveal } from '../hooks/useReveal'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useI18n } from '../i18n/context'
import Footer from '../layout/Footer'
import { sectionHref } from '../lib/router'

/** "Ação" -> "acao", for accent and case insensitive search. */
const normalize = (text) =>
  String(text ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

const ALL_TAGS = [...new Set(projects.flatMap((project) => project.tags))].sort((a, b) => a.localeCompare(b))

/** Every project, newest first, with a text search and a technology filter. */
export default function ProjectsPage() {
  const i18n = useI18n()
  const { t, l } = i18n
  const [query, setQuery] = useState('')
  const [tag, setTag] = useState(null)

  useDocumentTitle(t('meta.projectTitle', { title: t('projectsPage.title') }))

  const shown = useMemo(() => {
    const terms = normalize(query).split(/\s+/).filter(Boolean)
    return projects.filter((project) => {
      if (tag && !project.tags.includes(tag)) return false
      if (terms.length === 0) return true
      const haystack = normalize(
        [
          l(project.title),
          l(project.summary),
          kindLabel(project, i18n),
          ...project.tags,
          ...(l(project.features) ?? []),
        ].join(' '),
      )
      return terms.every((term) => haystack.includes(term))
    })
  }, [query, tag, l, i18n])

  const filtered = query.trim() !== '' || tag !== null

  return (
    <>
      <section className="section projects-page" aria-labelledby="projects-page-title">
        <div className="container">
          <a href={sectionHref(SECTION.projects)} className="back-link" {...reveal()}>
            <Icon name="chevronLeft" size={16} /> {t('projectsPage.back')}
          </a>

          <header className="section-header" {...reveal(1)}>
            <p className="eyebrow">{t('projects.eyebrow')}</p>
            <h1 id="projects-page-title" className="section-title">
              {t('projectsPage.title')}
            </h1>
            <p className="section-intro">{t('projects.intro')}</p>
          </header>

          <div className="projects-toolbar" {...reveal(2)}>
            <label className="field projects-search">
              <span className="sr-only">{t('projectsPage.searchLabel')}</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t('projectsPage.searchPlaceholder')}
                autoComplete="off"
              />
            </label>

            <div className="tag-filter" role="group" aria-label={t('projectsPage.filterLabel')}>
              <button type="button" className="tag-filter-btn" aria-pressed={tag === null} onClick={() => setTag(null)}>
                {t('projectsPage.allTags')}
              </button>
              {ALL_TAGS.map((name) => (
                <button
                  key={name}
                  type="button"
                  className="tag-filter-btn"
                  aria-pressed={tag === name}
                  onClick={() => setTag(tag === name ? null : name)}
                >
                  <TechLogo name={name} />
                  {name}
                </button>
              ))}
            </div>
          </div>

          <p className="projects-count" role="status">
            {t('projectsPage.count', { n: shown.length })}
            {filtered && (
              <button
                type="button"
                className="link-btn"
                onClick={() => {
                  setQuery('')
                  setTag(null)
                }}
              >
                {t('projectsPage.clear')}
              </button>
            )}
          </p>

          {shown.length > 0 ? (
            <ul className="project-grid">
              {shown.map((project) => (
                <li key={project.id}>
                  <ProjectCard project={project} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="projects-empty">{t('projectsPage.empty')}</p>
          )}
        </div>
      </section>
      <div className="container">
        <Footer />
      </div>
    </>
  )
}
