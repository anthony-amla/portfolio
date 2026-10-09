import { reveal } from '../../hooks/useReveal'

/**
 * Full-height home page section with a standard header.
 *
 * @param {object} props
 * @param {string} props.id Anchor id (see SECTION in config/site.js).
 * @param {string} props.eyebrow
 * @param {string} props.title
 * @param {string} [props.intro]
 * @param {import('react').ReactNode} props.children
 * @param {import('react').ReactNode} [props.footer] Rendered after the container (used by the last section).
 */
export default function Section({ id, eyebrow, title, intro, children, footer }) {
  const titleId = `${id}-title`

  return (
    <section id={id} className="section" aria-labelledby={titleId}>
      <div className="container">
        <header className="section-header" {...reveal()}>
          <p className="eyebrow">{eyebrow}</p>
          <h2 id={titleId} className="section-title">
            {title}
          </h2>
          {intro && <p className="section-intro">{intro}</p>}
        </header>
        {children}
      </div>
      {footer}
    </section>
  )
}
