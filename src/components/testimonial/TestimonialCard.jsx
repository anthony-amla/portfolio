import Icon from '../icons/Icon'
import PixelStars from '../icons/PixelStar'
import { useI18n } from '../../i18n/context'

/**
 * Pixel quote card: stars, the testimonial and who wrote it. Shows the
 * translate icon when the text is not in the language it was written in.
 *
 * @param {{ testimonial: import('../../content/testimonials').Testimonial }} props
 */
export default function TestimonialCard({ testimonial }) {
  const { t, l, locale } = useI18n()
  const translated = locale !== testimonial.original
  const translatedLabel = t(`testimonials.translatedFrom.${testimonial.original}`)

  return (
    <figure className="testimonial-card">
      <div className="testimonial-head">
        <PixelStars rating={testimonial.rating} size={18} label={t('testimonials.rating', { n: testimonial.rating })} />
        {translated && (
          <span className="testimonial-translated" title={translatedLabel}>
            <Icon name="translate" size={16} label={translatedLabel} />
          </span>
        )}
      </div>
      <blockquote className="testimonial-quote" lang={translated ? locale : testimonial.original}>
        {l(testimonial.text)}
      </blockquote>
      <figcaption className="testimonial-author">
        <span className="testimonial-avatar" aria-hidden>
          {testimonial.name.replace(/[^A-Za-zÀ-ÿ]/g, '').charAt(0)}
        </span>
        <span>
          <strong className="testimonial-name">{testimonial.name}</strong>
          <span className="testimonial-role">
            {l(testimonial.role)} · {testimonial.company}
          </span>
        </span>
      </figcaption>
    </figure>
  )
}
