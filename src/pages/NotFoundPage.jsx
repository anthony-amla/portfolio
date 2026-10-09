import Icon from '../components/icons/Icon'
import { reveal } from '../hooks/useReveal'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useI18n } from '../i18n/context'
import Footer from '../layout/Footer'

/**
 * Generic 404 screen.
 *
 * @param {object} props
 * @param {string} props.title
 * @param {string} props.text
 * @param {string} props.ctaLabel
 * @param {string} props.ctaHref
 */
export function NotFound({ title, text, ctaLabel, ctaHref }) {
  const { t } = useI18n()
  useDocumentTitle(t('meta.notFoundTitle'))

  return (
    <>
      <section className="section">
        <div className="container not-found" {...reveal()}>
          <p className="eyebrow">{t('notFound.eyebrow')}</p>
          <h1 className="section-title">{title}</h1>
          <p className="section-intro">{text}</p>
          <a href={ctaHref} className="px-btn">
            <Icon name="chevronLeft" size={16} /> {ctaLabel}
          </a>
        </div>
      </section>
      <div className="container">
        <Footer />
      </div>
    </>
  )
}

export default function NotFoundPage() {
  const { t } = useI18n()
  return <NotFound title={t('notFound.title')} text={t('notFound.text')} ctaLabel={t('notFound.cta')} ctaHref="/" />
}
