import { useI18n } from '../../i18n/context'

/**
 * Avatar initial, name and who the person is: role and company when given,
 * otherwise the relation ("Colleague", "Client"...).
 *
 * @param {{ testimonial: import('../../content/testimonials').Testimonial }} props
 */
export default function TestimonialAuthor({ testimonial }) {
  const { t, l } = useI18n()
  const parts = [l(testimonial.role), testimonial.company].filter(Boolean)

  return (
    <figcaption className="testimonial-author">
      <span className="testimonial-avatar" aria-hidden>
        {testimonial.name.replace(/[^A-Za-zÀ-ÿ]/g, '').charAt(0)}
      </span>
      <span>
        <strong className="testimonial-name">{testimonial.name}</strong>
        <span className="testimonial-role">
          {parts.length ? parts.join(' · ') : t(`testimonials.relations.${testimonial.relation}`)}
        </span>
      </span>
    </figcaption>
  )
}
