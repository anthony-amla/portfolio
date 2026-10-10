import { useEffect, useRef, useState } from 'react'
import Icon from '../icons/Icon'
import PixelStars from '../icons/PixelStar'
import { useI18n } from '../../i18n/context'
import TestimonialAuthor from './TestimonialAuthor'
import TestimonialDialog from './TestimonialDialog'

/**
 * Pixel quote card: stars, the testimonial and who wrote it. Shows the
 * translate icon when the text is not in the language it was written in.
 * Long texts are clamped and get a "read in full" button that opens a modal.
 *
 * @param {{ testimonial: import('../../content/testimonials').Testimonial }} props
 */
export default function TestimonialCard({ testimonial }) {
  const { t, l, locale } = useI18n()
  const quoteRef = useRef(null)
  const [clamped, setClamped] = useState(false)
  const [open, setOpen] = useState(false)
  const translated = locale !== testimonial.original
  const translatedLabel = t(`testimonials.translatedFrom.${testimonial.original}`)
  const text = l(testimonial.text)

  useEffect(() => {
    const quote = quoteRef.current
    if (!quote) return
    const check = () => setClamped(quote.scrollHeight > quote.clientHeight + 1)
    check()
    const observer = new ResizeObserver(check)
    observer.observe(quote)
    return () => observer.disconnect()
  }, [text])

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
      <div className="testimonial-body">
        <blockquote
          ref={quoteRef}
          className="testimonial-quote testimonial-quote-clamp"
          lang={translated ? locale : testimonial.original}
        >
          {text}
        </blockquote>
        {clamped && (
          <button type="button" className="testimonial-more" onClick={() => setOpen(true)} aria-haspopup="dialog">
            {t('testimonials.readMore')}
            <Icon name="arrowRight" size={14} />
          </button>
        )}
      </div>
      <TestimonialAuthor testimonial={testimonial} />
      {open && <TestimonialDialog testimonial={testimonial} onClose={() => setOpen(false)} />}
    </figure>
  )
}
